import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostEditor } from "@/components/studio/PostEditor";
import { StudioPageHeader } from "@/components/studio/StudioPageHeader";
import { getAllPostsForStudio, getPost } from "@/lib/data/posts";

export async function generateStaticParams() {
  const posts = await getAllPostsForStudio();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/studio/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return { title: post ? `Edit · ${post.title}` : "Edit post" };
}

export default async function EditPostPage({ params }: PageProps<"/studio/journal/[slug]">) {
  const { slug } = await params;
  // BACKEND: GET /api/admin/posts/{slug}
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <>
      <StudioPageHeader eyebrow="Journal · Edit" title={post.title} lead="Changes in the demo studio are not saved." />
      <PostEditor initial={post} />
    </>
  );
}
