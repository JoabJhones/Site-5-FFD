import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from "@/components/ui/toaster"
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { getContent } from '@/lib/contentStore';
import type { FooterContent } from '@/lib/contentStore';

export const metadata: Metadata = {
  title: 'Frango Dourado Ltda',
  description: 'Qualidade e frescor do campo para a sua mesa.',
  keywords: ['frango', 'frigorífico', 'alimentos', 'carnes', 'qualidade'],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const footerContent = await getContent('footer') as FooterContent;

  return (
    <html lang="pt-BR" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;800&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("min-h-screen bg-background font-body antialiased")}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-grow">
            {children}
          </main>
          <Footer footerContent={footerContent} />
        </div>
        <Toaster />
      </body>
    </html>
  );
}
