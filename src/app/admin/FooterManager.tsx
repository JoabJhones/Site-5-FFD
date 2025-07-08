
"use client";

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Trash2, Save, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { getPageContent, updatePageContent } from './actions';
import { Skeleton } from '@/components/ui/skeleton';

const socialLinkSchema = z.object({
  name: z.string().min(1, { message: 'O nome da rede social é obrigatório (Ex: Facebook).' }),
  url: z.string().url({ message: 'Por favor, insira uma URL válida.' }),
});

const footerSchema = z.object({
  copyright: z.string().min(5, { message: 'O texto de copyright é obrigatório.' }),
  address: z.string().min(10, { message: 'O endereço é obrigatório.' }),
  contact: z.string().min(10, { message: 'O texto de contato é obrigatório.' }),
  socialLinks: z.array(socialLinkSchema),
});

export default function FooterManager() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<z.infer<typeof footerSchema>>({
    resolver: zodResolver(footerSchema),
    defaultValues: {
        copyright: '',
        address: '',
        contact: '',
        socialLinks: [],
    },
  });

  useEffect(() => {
    const fetchContent = async () => {
        setIsLoading(true);
        const content = await getPageContent('footer');
        if (content) {
            form.reset(content);
        }
        setIsLoading(false);
    }
    fetchContent();
  }, [form]);
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  const onSubmit = async (values: z.infer<typeof footerSchema>) => {
    const result = await updatePageContent('footer', values);
    if(result.success) {
        toast({
            title: "Rodapé Atualizado!",
            description: "O conteúdo do rodapé do site foi salvo com sucesso.",
        });
    } else {
        toast({
            variant: "destructive",
            title: "Erro ao Salvar",
            description: result.error || "Não foi possível salvar o conteúdo."
        });
    }
  };

  if (isLoading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-3/5" />
                <Skeleton className="h-4 w-4/5" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="shadow-lg animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Gerenciador do Rodapé</CardTitle>
        <CardDescription>Edite as informações e os links de redes sociais do rodapé do site.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="copyright"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Texto de Copyright</FormLabel>
                  <FormControl>
                    <Input placeholder="© 2024 Sua Empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Endereço</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu endereço completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Informações de Contato</FormLabel>
                  <FormControl>
                    <Input placeholder="Telefone | Email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Redes Sociais</h3>
              <div className="space-y-6">
                {fields.map((field, index) => (
                  <Card key={field.id} className="p-4 bg-muted/50">
                    <div className="flex justify-end mb-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => remove(index)}
                        >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remover Link</span>
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name={`socialLinks.${index}.name`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome da Rede Social</FormLabel>
                                <FormControl>
                                <Input placeholder="Ex: Facebook" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`socialLinks.${index}.url`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL do Perfil</FormLabel>
                                <FormControl>
                                <Input placeholder="https://facebook.com/seu-perfil" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                  </Card>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-6"
                onClick={() => append({ name: '', url: '' })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Rede Social
              </Button>
            </div>
            
            <Separator />

            <Button type="submit" className="w-full" size="lg" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {form.formState.isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
