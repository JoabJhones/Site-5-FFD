"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { contactPageContent } from '@/lib/content';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

const contactSchema = z.object({
  title: z.string().min(10, { message: 'O título principal deve ter pelo menos 10 caracteres.' }),
  intro: z.string().min(20, { message: 'A introdução deve ter pelo menos 20 caracteres.' }),
  formTitle: z.string().min(5, { message: 'O título do formulário deve ter pelo menos 5 caracteres.' }),
  detailsTitle: z.string().min(5, { message: 'O título dos detalhes deve ter pelo menos 5 caracteres.' }),
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  phone: z.string().min(10, { message: 'O telefone deve ter pelo menos 10 caracteres.' }),
  address: z.string().min(10, { message: 'O endereço deve ter pelo menos 10 caracteres.' }),
  hours: z.string().min(5, { message: 'O horário de funcionamento deve ter pelo menos 5 caracteres.' }),
});

export default function ContactManager() {
  const { toast } = useToast();
  const [contactData, setContactData] = useState(contactPageContent);

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactPageContent,
  });

  const onSubmit = (values: z.infer<typeof contactSchema>) => {
    setContactData(values);
    // Note: In a real app, this would update the content source.
    toast({
      title: "Página 'Contato' Atualizada!",
      description: "O conteúdo da página 'Contato' foi salvo com sucesso.",
    });
  };

  return (
    <Card className="shadow-lg animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Gerenciador da Página "Contato"</CardTitle>
        <CardDescription>Edite as informações de contato que aparecem no seu site.</CardDescription>
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
              name="intro"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Introdução</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Introdução da página de contato..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />
            
            <FormField
              control={form.control}
              name="formTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Título do Formulário</FormLabel>
                  <FormControl>
                    <Input placeholder="Título da seção do formulário" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="detailsTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Título dos Detalhes</FormLabel>
                  <FormControl>
                    <Input placeholder="Título da seção de detalhes de contato" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="seu@email.com.br" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(XX) XXXX-XXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu endereço completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Horário de Funcionamento</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Seg-Sex, 8h-18h" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
