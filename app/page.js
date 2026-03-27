'use client';

import { Suspense } from 'react';
import RecapEditor from './editor';

export default function Home() {
  return (
    <Suspense fallback={<div style={{ background: '#111', height: '100vh' }} />}>
      <RecapEditor />
    </Suspense>
  );
}
