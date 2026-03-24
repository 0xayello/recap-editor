'use client';

export default function StoriesPage() {
  return (
    <iframe
      src="/stories-editor.html"
      style={{
        width: '100%',
        height: 'calc(100vh - 40px)',
        border: 'none',
        display: 'block',
      }}
      title="Bom Digma Stories Editor"
    />
  );
}
