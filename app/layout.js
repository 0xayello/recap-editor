import './globals.css';
import EditorNav from './nav';

export const metadata = {
  title: 'Paradigma — Editores de Stories',
  description: 'Recap semanal e Stories editor',
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&family=Space+Grotesk:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
        <EditorNav />
        <div style={{ flex: 1, overflow: 'auto' }}>
          {children}
        </div>
      </body>
    </html>
  );
}
