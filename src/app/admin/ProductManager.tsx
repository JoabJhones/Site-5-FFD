"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { productsPageContent } from '@/lib/content';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Edit, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from "@/hooks/use-toast";

type Product = typeof productsPageContent.products[0];

const productSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres.' }),
  image: z.string().url({ message: 'Por favor, insira uma URL de imagem válida.' }),
  hint: z.string().min(2, { message: 'A dica de IA é necessária.' }),
});

export default function ProductManager() {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>(productsPageContent.products);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const form = useForm<z.infer<typeof productSchema>>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      image: '',
      hint: '',
    },
  });

  const handleAddNew = () => {
    setEditingProduct(null);
    form.reset({ name: '', description: '', image: '', hint: ''});
    setIsDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.reset(product);
    setIsDialogOpen(true);
  };

  const handleDelete = (productName: string) => {
    setProducts(products.filter(p => p.name !== productName));
    toast({
        title: "Produto Apagado!",
        description: `O produto "${productName}" foi removido com sucesso.`,
    });
  };

  const onSubmit = (values: z.infer<typeof productSchema>) => {
    if (editingProduct) {
      // Edit
      setProducts(products.map(p => (p.name === editingProduct.name ? { ...p, ...values } : p)));
      toast({
        title: "Produto Atualizado!",
        description: `O produto "${values.name}" foi atualizado com sucesso.`,
      });
    } else {
      // Add
      setProducts([...products, values]);
      toast({
        title: "Produto Adicionado!",
        description: `O produto "${values.name}" foi adicionado com sucesso.`,
      });
    }
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <div>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Produtos Cadastrados</h2>
            <Button onClick={handleAddNew}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Produto
            </Button>
        </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Imagem</TableHead>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden md:table-cell">Descrição</TableHead>
              <TableHead className="text-right w-[160px]">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map(product => (
              <TableRow key={product.name}>
                <TableCell>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                    data-ai-hint={product.hint}
                  />
                </TableCell>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell className="text-muted-foreground hidden md:table-cell">{product.description}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(product)}>
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Editar</span>
                  </Button>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Apagar</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Essa ação não pode ser desfeita. Isso irá apagar permanentemente o produto
                             "{product.name}".
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(product.name)} className="bg-destructive hover:bg-destructive/90">Apagar</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Editar Produto' : 'Adicionar Novo Produto'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Modifique os detalhes do produto abaixo.' : 'Preencha os detalhes do novo produto abaixo.'}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Produto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Peito de Frango" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descreva o produto..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem</FormLabel>
                    <FormControl>
                      <Input placeholder="https://exemplo.com/imagem.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dica de IA (para imagem)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: chicken breast" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                <Button type="submit">{editingProduct ? 'Salvar Alterações' : 'Adicionar Produto'}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
