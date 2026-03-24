'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function EditorNav() {
  const path = usePathname();
  const isRecap = path === '/' || path === '';
  const isStories = path === '/stories';

  return (
    <nav style={{
      height: 40,
      background: '#111',
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      padding: '0 12px',
      fontFamily: "'Inter', 'Space Grotesk', sans-serif",
      fontSize: 12,
      borderBottom: '1px solid #2a2a2a',
      flexShrink: 0,
      zIndex: 9999,
    }}>
      <span style={{ color: '#666', marginRight: 8, fontWeight: 600, letterSpacing: 1 }}>
        PARADIGMA
      </span>
      <Link href="/" style={{
        padding: '4px 12px',
        borderRadius: 6,
        background: isRecap ? '#F7941D' : 'rgba(255,255,255,0.06)',
        color: isRecap ? '#000' : '#aaa',
        fontWeight: isRecap ? 700 : 400,
        textDecoration: 'none',
        transition: '0.15s',
      }}>
        Recap Semanal
      </Link>
      <Link href="/stories" style={{
        padding: '4px 12px',
        borderRadius: 6,
        background: isStories ? '#F7941D' : 'rgba(255,255,255,0.06)',
        color: isStories ? '#000' : '#aaa',
        fontWeight: isStories ? 700 : 400,
        textDecoration: 'none',
        transition: '0.15s',
      }}>
        Stories Editor
      </Link>
    </nav>
  );
}
