import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { getContent } from '@/lib/contentStore';
import type { QualityContent } from '@/lib/contentStore';

export default async function QualidadePage() {
  const qualityPageContent = await getContent('quality') as QualityContent;

  return (
    <div className="container mx-auto px-4 py-16 lg:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          {qualityPageContent.title}
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-foreground/80">
          {qualityPageContent.intro}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div className="space-y-8">
          <div>
            <h2 className="text-3xl font-semibold mb-3">{qualityPageContent.section1Title}</h2>
            <p className="text-lg text-foreground/80 leading-relaxed">
              {qualityPageContent.section1Content}
            </p>
          </div>
          <div>
            <h2 className="text-3xl font-semibold mb-3">{qualityPageContent.section2Title}</h2>
            <p className="text-lg text-foreground/80 leading-relaxed">
              {qualityPageContent.section2Content}
            </p>
          </div>
        </div>
        <div className="flex justify-center">
          <Image
            src={qualityPageContent.media}
            alt="Controle de Qualidade"
            width={500}
            height={400}
            className="rounded-lg shadow-2xl object-cover transform hover:scale-105 transition-transform duration-500"
            data-ai-hint={qualityPageContent.mediaHint}
          />
        </div>
      </div>

      <div className="text-center bg-card p-8 md:p-12 rounded-lg shadow-xl">
        <h2 className="text-3xl md:text-4xl font-semibold mb-8">Nosso Processo de Qualidade</h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
          {qualityPageContent.processSteps.map((step, index) => (
            <li key={index} className="flex items-start space-x-3 text-lg">
              <ShieldCheck className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <span className="text-foreground/80">{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
