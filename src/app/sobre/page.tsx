import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { aboutPageContent } from '@/lib/content';
import { Goal, Handshake, Lightbulb } from 'lucide-react';

const valueIcons = {
  "Qualidade Inquestionável": Goal,
  "Respeito e Ética": Handshake,
  "Inovação Contínua": Lightbulb,
};

type ValueTitle = keyof typeof valueIcons;

export default function SobreNosPage() {
  return (
    <div className="container mx-auto px-4 py-16 lg:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          {aboutPageContent.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div className="space-y-4 text-lg text-foreground/80 leading-relaxed">
          <p>{aboutPageContent.history1}</p>
          <p>{aboutPageContent.history2}</p>
        </div>
        <div className="flex justify-center">
          <Image
            src={aboutPageContent.image}
            alt="Nossa História"
            width={500}
            height={400}
            className="rounded-lg shadow-2xl object-cover transform hover:scale-105 transition-transform duration-500"
            data-ai-hint={aboutPageContent.imageHint}
          />
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-10">Nossos Valores</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {aboutPageContent.values.map((value) => {
            const Icon = valueIcons[value.title as ValueTitle];
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
