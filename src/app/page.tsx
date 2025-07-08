import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { homePageContent } from '@/lib/content';
import { CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] md:h-[70vh] w-full flex items-center justify-center text-center text-white">
        <Image
          src={homePageContent.heroMedia}
          alt="Cortes de frango"
          layout="fill"
          objectFit="cover"
          className="absolute z-0 brightness-60"
          data-ai-hint={homePageContent.heroMediaHint}
        />
        <div className="relative z-10 p-4 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
            {homePageContent.title}
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl drop-shadow-md">
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
                  <CardTitle className="mt-4 text-2xl font-bold">{feature.title}</CardTitle>
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
