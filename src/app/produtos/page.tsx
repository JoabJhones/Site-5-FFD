"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getProducts, type Product } from '@/lib/productStore';
import { Skeleton } from '@/components/ui/skeleton';
import { getContent } from '@/lib/contentStore';
import type { ProductsPageContentInfo } from '@/lib/contentStore';

export default function ProdutosPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pageContent, setPageContent] = useState<ProductsPageContentInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchPageData = async () => {
      setIsLoading(true);
      try {
        const serverProducts = await getProducts();
        const serverPageContent = await getContent('products') as ProductsPageContentInfo;
        setProducts(serverProducts);
        setPageContent(serverPageContent);
      } catch (error) {
        console.error("Failed to fetch page data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPageData();
  }, []);

  const renderSkeleton = () => (
    <div className="container mx-auto px-4 py-16 lg:py-24">
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-3/4 mx-auto" />
        <Skeleton className="h-6 w-full max-w-3xl mx-auto mt-4" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden flex flex-col">
            <Skeleton className="h-56 w-full" />
            <CardHeader>
              <Skeleton className="h-7 w-3/4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );

  if (isLoading || !pageContent) {
    return renderSkeleton();
  }

  return (
    <>
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight">
            {pageContent.title}
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-foreground/80">
            {pageContent.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col group transform hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl">
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
