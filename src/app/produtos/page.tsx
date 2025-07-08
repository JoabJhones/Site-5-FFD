import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { productsPageContent } from '@/lib/content';

export default function ProdutosPage() {
  return (
    <div className="container mx-auto px-4 py-16 lg:py-24">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
          {productsPageContent.title}
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-foreground/80">
          {productsPageContent.description}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {productsPageContent.products.map((product) => (
          <Card key={product.name} className="overflow-hidden flex flex-col group transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
            <div className="relative h-56 w-full">
              <Image
                src={product.image}
                alt={product.name}
                layout="fill"
                objectFit="cover"
                className="group-hover:scale-110 transition-transform duration-500"
                data-ai-hint={product.hint}
              />
            </div>
            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-foreground">{product.name}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground">{product.description}</p>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full" variant="secondary">
                  <Link href={`/contato?produto=${encodeURIComponent(product.name)}`}>Saiba Mais</Link>
                </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
