import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllPostsMeta,
  getAllSlugs,
  getPostBySlug,
  type BlogFrontmatter,
} from "@/lib/blog";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getAllPostsMeta().find((item) => item.slug === slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const source = getPostBySlug(slug);

  if (!source) {
    notFound();
  }

  const { content, frontmatter } = await compileMDX<BlogFrontmatter>({
    source,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });

  return (
    <main className="container postContainer">
      <header className="blogHeader">
        <Link href="/blog">Back to blog</Link>
        <h1>{frontmatter.title}</h1>
        <time dateTime={frontmatter.date}>{frontmatter.date}</time>
      </header>

      <article className="mdxContent">{content}</article>
    </main>
  );
}
