"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { productsPageContent } from '@/lib/content';

type Product = typeof productsPageContent.products[0];

export default function ProdutosPage() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
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
                <p className="text-muted-foreground line-clamp-3">{product.description}</p>
              </CardContent>
              <CardFooter>
                  <Button onClick={() => setSelectedProduct(product)} className="w-full" variant="secondary">
                    Saiba Mais
                  </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedProduct} onOpenChange={(isOpen) => !isOpen && setSelectedProduct(null)}>
        <DialogContent className="sm:max-w-2xl">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-3xl font-bold text-primary">{selectedProduct.name}</DialogTitle>
                <DialogDescription>Detalhes do produto</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                <div className="relative h-64 w-full rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src={selectedProduct.image}
                        alt={selectedProduct.name}
                        layout="fill"
                        objectFit="cover"
                        data-ai-hint={selectedProduct.hint}
                    />
                </div>
                <div className="flex flex-col justify-center">
                    <p className="text-base text-foreground/80 leading-relaxed">
                        {selectedProduct.description}
                    </p>
                </div>
              </div>
              <DialogFooter className="gap-2 sm:justify-end">
                <Button type="button" variant="outline" onClick={() => setSelectedProduct(null)}>
                    Fechar
                </Button>
                <Button asChild>
                  <Link href={`/contato?produto=${encodeURIComponent(selectedProduct.name)}`}>Tenho Interesse</Link>
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
