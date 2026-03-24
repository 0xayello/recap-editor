'use client';

export default function StoriesPage() {
  return (
    <iframe
      src="/stories-editor.html"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        border: 'none',
        margin: 0,
        padding: 0,
      }}
      title="Bom Digma Stories Editor"
    />
  );
}
