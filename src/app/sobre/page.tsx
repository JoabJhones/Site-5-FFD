"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Goal, Handshake, Lightbulb } from 'lucide-react';
import { getContent } from '@/lib/contentStore';
import type { AboutContent } from '@/lib/contentStore';
import { Skeleton } from '@/components/ui/skeleton';

const valueIcons = {
  "Qualidade Inquestionável": Goal,
  "Respeito e Ética": Handshake,
  "Inovação Contínua": Lightbulb,
};

type ValueTitle = keyof typeof valueIcons;

function getYouTubeEmbedUrl(url: string): string | null {
    if (!url) return null;
    let videoId = null;
    if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1].split('?')[0];
    } else if (url.includes('youtube.com/watch?v=')) {
        videoId = new URLSearchParams(url.split('?')[1]).get('v');
    } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('embed/')[1].split('?')[0];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

function renderMedia(content: AboutContent) {
    const youtubeEmbedUrl = getYouTubeEmbedUrl(content.image);

    if (youtubeEmbedUrl) {
        return (
            <div className="aspect-video w-full">
                <iframe
                    src={youtubeEmbedUrl}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="rounded-lg shadow-2xl w-full h-full"
                ></iframe>
            </div>
        );
    }

    if (content.image.startsWith('data:video') || content.image.endsWith('.mp4')) {
        return (
            <video 
                src={content.image} 
                controls 
                className="rounded-lg shadow-2xl object-cover w-full"
                data-ai-hint={content.imageHint}
            />
        );
    }
    
    return (
        <Image
            src={content.image}
            alt="Nossa História"
            width={500}
            height={400}
            className="rounded-lg shadow-2xl object-cover transform hover:scale-105 transition-transform duration-500 w-full h-auto"
            data-ai-hint={content.imageHint}
        />
    );
}

function SobrePageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-16 lg:py-24">
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-3/4 mx-auto" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-5/6" />
          <Skeleton className="h-6 w-full mt-4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
        <div className="flex justify-center">
          <Skeleton className="h-80 w-full rounded-lg" />
        </div>
      </div>

      <div className="text-center">
        <Skeleton className="h-10 w-1/2 mx-auto mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="text-center p-6">
              <Skeleton className="h-16 w-16 rounded-full mx-auto mb-4" />
              <Skeleton className="h-7 w-3/4 mx-auto mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3 mt-2" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SobreNosPage() {
  const [aboutPageContent, setAboutPageContent] = useState<AboutContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      const content = await getContent('sobre') as AboutContent;
      setAboutPageContent(content);
      setIsLoading(false);
    }
    fetchContent();
  }, []);

  if (isLoading || !aboutPageContent) {
    return <SobrePageSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-16 lg:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          {aboutPageContent.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-8 items-center mb-16">
        <div className="lg:col-span-1">
          {renderMedia(aboutPageContent)}
        </div>
        <div className="lg:col-span-1 space-y-4 text-lg text-foreground/80 leading-relaxed">
          <p>{aboutPageContent.history1}</p>
          <p>{aboutPageContent.history2}</p>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-10">Nossos Valores</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {aboutPageContent.values.map((value) => {
            const Icon = valueIcons[value.title as ValueTitle] || Lightbulb;
            return (
              <Card key={value.title} className="text-center border-2 border-transparent hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto bg-primary/10 text-primary rounded-full p-4 w-fit mb-4">
                    {Icon && <Icon className="h-8 w-8" />}
                  </div>
                  <CardTitle className="text-2xl font-semibold">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
