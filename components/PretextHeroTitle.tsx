"use client";

import { layoutWithLines, prepareWithSegments, walkLineRanges } from "@chenglou/pretext";
import { useEffect, useMemo, useRef, useState } from "react";

type PretextHeroTitleProps = {
  text: string;
  className?: string;
};

type LineLayout = {
  lines: string[];
  width: number;
};

const MIN_WIDTH_RATIO = 0.58;
const WIDTH_STEP = 8;
const MAX_LINES = 4;

function measureBalancedLayout(text: string, width: number, font: string, lineHeight: number): LineLayout {
  const prepared = prepareWithSegments(text, font);
  const natural = layoutWithLines(prepared, width, lineHeight);

  let bestWidth = width;
  let bestScore = Number.POSITIVE_INFINITY;
  const lowerBound = Math.max(220, Math.floor(width * MIN_WIDTH_RATIO));

  for (let candidate = width; candidate >= lowerBound; candidate -= WIDTH_STEP) {
    const lineWidths: number[] = [];
    walkLineRanges(prepared, candidate, (line) => {
      lineWidths.push(line.width);
    });

    if (lineWidths.length === 0 || lineWidths.length > MAX_LINES) {
      continue;
    }

    const raggedness = lineWidths.reduce((sum, lineWidth) => sum + Math.pow(candidate - lineWidth, 2), 0);
    const lastLinePenalty = Math.pow(candidate - lineWidths[lineWidths.length - 1], 2) * 1.35;
    const linePenalty = Math.abs(lineWidths.length - Math.min(natural.lineCount, 3)) * 180;
    const score = raggedness + lastLinePenalty + linePenalty;

    if (score < bestScore) {
      bestScore = score;
      bestWidth = candidate;
    }
  }

  const balanced = layoutWithLines(prepared, bestWidth, lineHeight);
  return {
    width: bestWidth,
    lines: balanced.lines.map((line) => line.text),
  };
}

export default function PretextHeroTitle({ text, className }: PretextHeroTitleProps) {
  const shellRef = useRef<HTMLHeadingElement | null>(null);
  const [layout, setLayout] = useState<LineLayout | null>(null);

  const fallbackLines = useMemo(() => text.split("\n"), [text]);

  useEffect(() => {
    const element = shellRef.current;
    if (!element) {
      return;
    }

    const update = () => {
      const computed = window.getComputedStyle(element);
      const width = element.parentElement?.clientWidth ?? element.clientWidth;
      if (!width) {
        return;
      }

      const font = `${computed.fontWeight} ${computed.fontSize} \"Space Grotesk\"`;
      const lineHeightValue = Number.parseFloat(computed.lineHeight);
      const fontSizeValue = Number.parseFloat(computed.fontSize);
      const lineHeight = Number.isFinite(lineHeightValue) ? lineHeightValue : fontSizeValue * 0.98;

      setLayout(measureBalancedLayout(text, width, font, lineHeight));
    };

    const observer = new ResizeObserver(() => {
      update();
    });

    observer.observe(element);
    if (element.parentElement) {
      observer.observe(element.parentElement);
    }
    update();

    return () => observer.disconnect();
  }, [text]);

  return (
    <h1
      ref={shellRef}
      className={className}
      style={layout ? { maxWidth: `${layout.width}px` } : undefined}
    >
      {(layout?.lines ?? fallbackLines).map((line) => (
        <span key={line} className="heroTitleLine">
          {line}
        </span>
      ))}
    </h1>
  );
}
