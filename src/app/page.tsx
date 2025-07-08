"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { getContent } from '@/lib/contentStore';
import type { HomeContent } from '@/lib/contentStore';
import { Skeleton } from '@/components/ui/skeleton';

function HomePageSkeleton() {
  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-center bg-muted">
        <div className="relative z-10 p-4 space-y-4">
          <Skeleton className="h-12 w-3/4 mx-auto" />
          <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
          <div className="flex justify-center gap-4 pt-4">
            <Skeleton className="h-12 w-48" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </section>
      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="text-center p-6">
                <Skeleton className="h-12 w-12 rounded-full mx-auto mb-4" />
                <Skeleton className="h-7 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3 mt-2" />
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const [homePageContent, setHomePageContent] = useState<HomeContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      const content = await getContent('home') as HomeContent;
      setHomePageContent(content);
      setIsLoading(false);
    }
    fetchContent();
  }, []);

  if (isLoading || !homePageContent) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-center text-white">
        <Image
          src={homePageContent.heroMedia}
          alt="Cortes de frango"
          layout="fill"
          objectFit="cover"
          className="absolute z-0 brightness-50"
          data-ai-hint={homePageContent.heroMediaHint}
          priority
        />
        <div className="relative z-10 p-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight [text-shadow:0_0_12px_rgba(0,0,0,0.8)]">
            {homePageContent.title}
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl [text-shadow:0_0_8px_rgba(0,0,0,0.8)]">
            {homePageContent.description}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Link href="/produtos">{homePageContent.cta.products}</Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="shadow-lg transform hover:scale-105 transition-transform duration-300">
              <Link href="/contato">{homePageContent.cta.contact}</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homePageContent.features.map((feature) => (
              <Card key={feature.title} className="text-center border-2 border-transparent hover:border-primary hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary rounded-full p-3 w-fit">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <CardTitle className="mt-4 text-2xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
