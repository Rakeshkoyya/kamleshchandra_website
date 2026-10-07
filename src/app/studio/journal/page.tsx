import type { Metadata } from "next";
import Link from "next/link";
import { cellClass, DataTable } from "@/components/studio/DataTable";
import { PublishBadge } from "@/components/studio/StatusBadge";
import { StudioPageHeader } from "@/components/studio/StudioPageHeader";
import { ButtonLink } from "@/components/ui/Button";
import { getAllPostsForStudio } from "@/lib/data/posts";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Journal" };

export default async function StudioJournalPage() {
  // BACKEND: GET /api/admin/posts
  const posts = await getAllPostsForStudio();

  return (
    <>
      <StudioPageHeader
        eyebrow="Writing"
        title="Journal"
        lead="Essays for parents, teachers and learners. Schedule them to go out on a morning rhythm."
        actions={<ButtonLink href="/studio/journal/new">+ Write a post</ButtonLink>}
      />
      <DataTable caption="Journal posts" head={["Title", "Category", "Status", "Date", <span key="a" className="sr-only">Actions</span>]}>
        {posts.map((p) => (
          <tr key={p.slug} className="hover:bg-bg-alt/40">
            <td className={cellClass}>
              <p className="font-display text-base font-semibold">{p.title}</p>
              <p className="line-clamp-1 max-w-[50ch] text-xs text-muted">{p.excerpt}</p>
            </td>
            <td className={`${cellClass} text-muted`}>{p.category}</td>
            <td className={cellClass}>
              <PublishBadge status={p.status} />
            </td>
            <td className={`${cellClass} whitespace-nowrap text-muted`}>{formatDate(p.publishedAt)}</td>
            <td className={`${cellClass} text-right`}>
              <Link href={`/studio/journal/${p.slug}`} className="font-semibold text-brand hover:underline">
                Edit<span className="sr-only"> {p.title}</span>
              </Link>
            </td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
