"use client";

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { aboutPageContent } from '@/lib/content';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Trash2, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

const valueSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres.' }),
  description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres.' }),
});

const aboutSchema = z.object({
  title: z.string().min(10, { message: 'O título principal deve ter pelo menos 10 caracteres.' }),
  history1: z.string().min(20, { message: 'O primeiro parágrafo da história deve ter pelo menos 20 caracteres.' }),
  history2: z.string().min(20, { message: 'O segundo parágrafo da história deve ter pelo menos 20 caracteres.' }),
  values: z.array(valueSchema),
});

export default function AboutManager() {
  const { toast } = useToast();
  const [aboutData, setAboutData] = useState(aboutPageContent);

  const form = useForm<z.infer<typeof aboutSchema>>({
    resolver: zodResolver(aboutSchema),
    defaultValues: aboutData,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "values",
  });

  const onSubmit = (values: z.infer<typeof aboutSchema>) => {
    setAboutData(values);
    toast({
      title: "Página 'Sobre' Atualizada!",
      description: "O conteúdo da página 'Sobre Nós' foi salvo com sucesso.",
    });
    // Em uma aplicação real, você enviaria esses dados para um servidor/banco de dados.
    // Para este protótipo, as alterações são salvas apenas localmente.
  };

  return (
    <Card className="shadow-lg animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Gerenciador da Página "Sobre Nós"</CardTitle>
        <CardDescription>Edite o conteúdo que aparece na página "Sobre Nós" do seu site.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Título Principal</FormLabel>
                  <FormControl>
                    <Input placeholder="Título da página" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="history1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">História (Parágrafo 1)</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="Primeiro parágrafo da história da empresa..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="history2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">História (Parágrafo 2)</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="Segundo parágrafo da história da empresa..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Nossos Valores</h3>
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
                            <span className="sr-only">Remover Valor</span>
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name={`values.${index}.title`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Título do Valor</FormLabel>
                                <FormControl>
                                <Input placeholder="Ex: Qualidade Inquestionável" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`values.${index}.description`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descrição do Valor</FormLabel>
                                <FormControl>
                                <Textarea placeholder="Descreva o valor..." {...field} />
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
                onClick={() => append({ title: '', description: '' })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Novo Valor
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
