import Link from "next/link";
import { getAllPostsMeta } from "@/lib/blog";

export const metadata = {
  title: "Blog",
  description: "MDX posts",
};

export default function BlogListPage() {
  const posts = getAllPostsMeta();

  return (
    <main className="container blogContainer">
      <header className="blogHeader">
        <h1>Blog</h1>
        <Link href="/">Back to portfolio</Link>
      </header>

      <section className="blogList">
        {posts.map((post) => (
          <article key={post.slug} className="blogItem">
            <time dateTime={post.date}>{post.date}</time>
            <h2>
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h2>
            <p>{post.summary}</p>
            {post.tags?.length ? (
              <ul className="chipList">
                {post.tags.map((tag) => (
                  <li key={tag}>{tag}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </section>
    </main>
  );
}
