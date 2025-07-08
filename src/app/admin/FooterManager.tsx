
"use client";

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { footerContent } from '@/lib/content';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Trash2, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

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
  const [footerData, setFooterData] = useState(footerContent);

  const form = useForm<z.infer<typeof footerSchema>>({
    resolver: zodResolver(footerSchema),
    defaultValues: footerContent,
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "socialLinks",
  });

  const onSubmit = (values: z.infer<typeof footerSchema>) => {
    setFooterData(values);
    // Note: In a real app, this would update the content source.
    toast({
      title: "Rodapé Atualizado!",
      description: "O conteúdo do rodapé do site foi salvo com sucesso.",
    });
  };

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

            <Button type="submit" className="w-full" size="lg">
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
