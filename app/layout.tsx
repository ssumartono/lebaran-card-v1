import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Eid Card Studio',
  description: 'Create premium Idul Fitri greeting cards with Gemini AI'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
