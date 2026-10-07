import type { Metadata } from "next";
import { PostEditor } from "@/components/studio/PostEditor";
import { StudioPageHeader } from "@/components/studio/StudioPageHeader";

export const metadata: Metadata = { title: "Write a post" };

export default function NewPostPage() {
  return (
    <>
      <StudioPageHeader eyebrow="Journal" title="Write a post" lead="Write on the left; the right side shows it the way readers will see it." />
      <PostEditor />
    </>
  );
}
