import type { Metadata } from 'next';
import { IBM_Plex_Sans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ClerkProvider } from '@clerk/nextjs';

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans'
});

export const metadata: Metadata = {
  title: 'AImage',
  description: 'AI powered image generation'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={{ variables: { colorPrimary: '#4d4444' } }}>
      <html lang="en">
        <body
          className={cn('font-ibm-plex-sans antialiased', ibmPlexSans.variable)}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
