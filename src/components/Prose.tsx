interface ProseProps {
  html: string;
}

export function Prose({ html }: ProseProps) {
  if (!html) {
    return null;
  }

  return (
    <div
      className="prose max-w-none text-slate-800"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
