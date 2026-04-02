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
import { formatDate } from "@/lib/date";

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

  const allPosts = getAllPostsMeta();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;
  const nextPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;

  return (
    <main className="container postContainer">
      <header className="blogHeader">
        <Link href="/blog">Back to blog</Link>
        <h1>{frontmatter.title}</h1>
        <time dateTime={frontmatter.date}>{formatDate(frontmatter.date)}</time>
        {frontmatter.tags?.length ? (
          <ul className="postTags">
            {frontmatter.tags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
      </header>

      <article className="mdxContent">{content}</article>

      {(prevPost || nextPost) && (
        <nav className="postNav">
          {prevPost ? (
            <Link href={`/blog/${prevPost.slug}`} className="postNavItem">
              <small>Previous</small>
              <span>{prevPost.title}</span>
            </Link>
          ) : <div />}
          {nextPost ? (
            <Link href={`/blog/${nextPost.slug}`} className="postNavItem postNavNext">
              <small>Next</small>
              <span>{nextPost.title}</span>
            </Link>
          ) : null}
        </nav>
      )}
    </main>
  );
}
