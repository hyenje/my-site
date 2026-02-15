import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type BlogFrontmatter = {
  title: string;
  date: string;
  summary: string;
  tags?: string[];
};

export type BlogPostMeta = BlogFrontmatter & {
  slug: string;
};

const postsDirectory = path.join(process.cwd(), "content", "blog");

function ensurePostsDirectory() {
  if (!fs.existsSync(postsDirectory)) {
    return [] as string[];
  }

  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".mdx"));
}

export function getAllPostsMeta(): BlogPostMeta[] {
  const files = ensurePostsDirectory();

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx$/, "");
      const fullPath = path.join(postsDirectory, file);
      const source = fs.readFileSync(fullPath, "utf8");
      const { data } = matter(source);

      return {
        slug,
        title: String(data.title ?? slug),
        date: String(data.date ?? "1970-01-01"),
        summary: String(data.summary ?? ""),
        tags: Array.isArray(data.tags)
          ? data.tags.map((tag) => String(tag))
          : undefined,
      };
    })
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getPostBySlug(slug: string): string | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  return fs.readFileSync(fullPath, "utf8");
}

export function getAllSlugs(): string[] {
  return ensurePostsDirectory().map((file) => file.replace(/\.mdx$/, ""));
}
