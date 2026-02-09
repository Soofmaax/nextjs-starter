interface ProseProps {
  html: string;
}

export function Prose({ html }: ProseProps) {
  if (!html) {
    return null;
  }

  return (
    <div
      className="prose max-w-none text-[var(--text-main)] leading-relaxed sm:leading-loose"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
