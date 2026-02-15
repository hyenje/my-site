# hyenje29.click

원페이지 포트폴리오 + MDX 블로그를 Next.js 정적 export로 배포하는 프로젝트입니다.

## Routes

- `/`: portfolio one-page
- `/blog`: blog list
- `/blog/[slug]`: blog detail

## Local development

```bash
npm install
npm run dev
```

## Content

- 포트폴리오 데이터: `data/portfolio.ts`
- 블로그 글: `content/blog/*.mdx`

MDX 파일 예시:

```mdx
---
title: "글 제목"
date: "2026-02-15"
summary: "한 줄 요약"
tags: ["tag1", "tag2"]
---

본문...
```

## Static build

`next.config.ts`에 `output: "export"`가 설정되어 있고, 빌드 결과는 `out/`에 생성됩니다.

```bash
npm run build
```

## AWS Deploy (S3 + CloudFront + Route53)

1. ACM 인증서 발급 (CloudFront는 `us-east-1`에서 발급)
2. S3 버킷 생성 후 `out/` 업로드
3. CloudFront 배포 생성 + OAC 연결
4. Route53 Alias 레코드로 도메인 연결

수동 업로드:

```bash
aws s3 sync out s3://<your-bucket> --delete
aws cloudfront create-invalidation --distribution-id <your-distribution-id> --paths "/*"
```

자동 배포는 `.github/workflows/deploy.yml`을 사용합니다.
필요한 GitHub Secrets:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_S3_BUCKET`
- `AWS_CLOUDFRONT_DISTRIBUTION_ID`
