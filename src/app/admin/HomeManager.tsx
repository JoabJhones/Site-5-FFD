"use client";

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { homePageContent } from '@/lib/content';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Trash2, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const featureSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres.' }),
  description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres.' }),
});

const homeSchema = z.object({
  title: z.string().min(10, { message: 'O título principal deve ter pelo menos 10 caracteres.' }),
  description: z.string().min(20, { message: 'A descrição deve ter pelo menos 20 caracteres.' }),
  cta: z.object({
      products: z.string().min(5, {message: "O texto do botão deve ter pelo menos 5 caracteres."}),
      contact: z.string().min(5, {message: "O texto do botão deve ter pelo menos 5 caracteres."})
  }),
  heroMedia: z.string().url({ message: 'Por favor, insira uma URL de mídia válida.' }).min(1, { message: 'A mídia é obrigatória.' }),
  heroMediaHint: z.string().min(2, { message: 'A dica de IA é necessária.' }),
  features: z.array(featureSchema),
});

export default function HomeManager() {
  const { toast } = useToast();
  const [homeData, setHomeData] = useState(homePageContent);
  const [uploadType, setUploadType] = useState<'url' | 'local'>('url');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof homeSchema>>({
    resolver: zodResolver(homeSchema),
    defaultValues: homePageContent,
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "features",
  });
  
  const mediaValue = form.watch('heroMedia');
  
  useEffect(() => {
    if (mediaValue && (mediaValue.startsWith('http') || mediaValue.startsWith('data:'))) {
      setMediaPreview(mediaValue);
    } else {
      setMediaPreview(null);
    }
  }, [mediaValue]);

  const handleMediaFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        form.setValue('heroMedia', dataUri, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue('heroMedia', '', { shouldValidate: true });
    }
  };

  const onSubmit = (values: z.infer<typeof homeSchema>) => {
    setHomeData(values);
    // Note: In a real app, this would update the content source.
    toast({
      title: "Página 'Início' Atualizada!",
      description: "O conteúdo da página 'Início' foi salvo com sucesso.",
    });
  };

  return (
    <Card className="shadow-lg animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Gerenciador da Página "Início"</CardTitle>
        <CardDescription>Edite o conteúdo que aparece na página inicial do seu site.</CardDescription>
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
                    <Input placeholder="Título da página inicial" {...field} />
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
                  <FormLabel className="text-lg font-semibold">Descrição Principal</FormLabel>
                  <FormControl>
                    <Textarea rows={5} placeholder="Descrição da página inicial..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
                <FormLabel className="text-lg font-semibold">Mídia da Página</FormLabel>
                <RadioGroup
                    value={uploadType}
                    onValueChange={(v: 'url' | 'local') => {
                        setUploadType(v);
                        form.setValue('heroMedia', '', { shouldValidate: true });
                    }}
                    className="flex space-x-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="url" id="media-url" />
                        <Label htmlFor="media-url">Via URL</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="local" id="media-local" />
                        <Label htmlFor="media-local">Upload Local</Label>
                    </div>
                </RadioGroup>
                
                <FormField
                    control={form.control}
                    name="heroMedia"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                {uploadType === 'url' ? (
                                    <Input placeholder="https://exemplo.com/midia.png" {...field} />
                                ) : (
                                    <Input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={handleMediaFileChange}
                                        className="file:text-primary file:font-semibold"
                                    />
                                )}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {mediaPreview && (
                  <div className="mt-4 p-4 border rounded-lg flex flex-col items-center justify-center bg-muted/50">
                    <h4 className="font-semibold mb-2 self-start">Pré-visualização da Mídia:</h4>
                    {mediaPreview.startsWith('data:video') || mediaPreview.endsWith('.mp4') ? (
                        <video src={mediaPreview} controls className="rounded-md border max-h-60" />
                    ) : (
                        <img src={mediaPreview} alt="Pré-visualização da mídia" className="rounded-md border object-contain max-h-60" />
                    )}
                  </div>
                )}
              </div>

            <FormField
              control={form.control}
              name="heroMediaHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dica de IA (para mídia)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: chicken cuts" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Separator />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="cta.products"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Texto Botão (Produtos)</FormLabel>
                      <FormControl>
                        <Input placeholder="Conheça Nossos Produtos" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="cta.contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg font-semibold">Texto Botão (Contato)</FormLabel>
                      <FormControl>
                        <Input placeholder="Fale Conosco" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>

            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Diferenciais (Features)</h3>
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
                            <span className="sr-only">Remover Diferencial</span>
                        </Button>
                    </div>
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name={`features.${index}.title`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Título do Diferencial</FormLabel>
                                <FormControl>
                                <Input placeholder="Ex: Frescor Garantido" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`features.${index}.description`}
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Descrição do Diferencial</FormLabel>
                                <FormControl>
                                <Textarea placeholder="Descreva o diferencial..." {...field} />
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
                Adicionar Novo Diferencial
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
