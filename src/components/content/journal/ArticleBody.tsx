/**
 * Renders Post.body blocks: "## " → h2, "> " → blockquote, anything else → paragraph.
 * Rendered as text (never as HTML), so stored content cannot inject markup.
 */
export function ArticleBody({ blocks, className = "" }: { blocks: string[]; className?: string }) {
  return (
    <div className={`prose-kc max-w-[65ch] text-[1.125rem] leading-[1.75] ${className}`}>
      {blocks.map((block, i) => {
        const key = `${i}-${block.slice(0, 24)}`;
        if (block.startsWith("## ")) return <h2 key={key}>{block.slice(3)}</h2>;
        if (block.startsWith("> ")) {
          return (
            <blockquote key={key}>
              <p>{block.slice(2)}</p>
            </blockquote>
          );
        }
        return <p key={key}>{block}</p>;
      })}
    </div>
  );
}
