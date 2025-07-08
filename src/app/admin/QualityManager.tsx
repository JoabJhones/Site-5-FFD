"use client";

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { qualityPageContent } from '@/lib/content';
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

const qualitySchema = z.object({
  title: z.string().min(10, { message: 'O título principal deve ter pelo menos 10 caracteres.' }),
  intro: z.string().min(20, { message: 'A introdução deve ter pelo menos 20 caracteres.' }),
  media: z.string().url({ message: 'Por favor, insira uma URL de mídia válida.' }).min(1, { message: 'A mídia é obrigatória.' }),
  mediaHint: z.string().min(2, { message: 'A dica de IA é necessária.' }),
  section1Title: z.string().min(5, { message: 'O título da seção 1 deve ter pelo menos 5 caracteres.' }),
  section1Content: z.string().min(20, { message: 'O conteúdo da seção 1 deve ter pelo menos 20 caracteres.' }),
  section2Title: z.string().min(5, { message: 'O título da seção 2 deve ter pelo menos 5 caracteres.' }),
  section2Content: z.string().min(20, { message: 'O conteúdo da seção 2 deve ter pelo menos 20 caracteres.' }),
  processSteps: z.array(z.string().min(10, { message: 'Cada passo deve ter pelo menos 10 caracteres.' })),
});

export default function QualityManager() {
  const { toast } = useToast();
  const [qualityData, setQualityData] = useState(qualityPageContent);
  const [uploadType, setUploadType] = useState<'url' | 'local'>('url');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof qualitySchema>>({
    resolver: zodResolver(qualitySchema),
    defaultValues: qualityPageContent,
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "processSteps",
  });
  
  const mediaValue = form.watch('media');
  
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
        form.setValue('media', dataUri, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue('media', '', { shouldValidate: true });
    }
  };

  const onSubmit = (values: z.infer<typeof qualitySchema>) => {
    setQualityData(values);
    // Note: In a real app, this would update the content source.
    toast({
      title: "Página 'Qualidade' Atualizada!",
      description: "O conteúdo da página 'Qualidade' foi salvo com sucesso.",
    });
  };

  return (
    <Card className="shadow-lg animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Gerenciador da Página "Qualidade"</CardTitle>
        <CardDescription>Edite o conteúdo que aparece na página "Qualidade" do seu site.</CardDescription>
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
                    <Textarea rows={5} placeholder="Introdução da página de qualidade..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="section1Title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Título da Seção 1</FormLabel>
                  <FormControl>
                    <Input placeholder="Título da primeira seção" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="section1Content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo da Seção 1</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Conteúdo da primeira seção..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="section2Title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-semibold">Título da Seção 2</FormLabel>
                  <FormControl>
                    <Input placeholder="Título da segunda seção" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="section2Content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Conteúdo da Seção 2</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Conteúdo da segunda seção..." {...field} />
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
                        form.setValue('media', '', { shouldValidate: true });
                    }}
                    className="flex space-x-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="url" id="media-url-quality" />
                        <Label htmlFor="media-url-quality">Via URL</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="local" id="media-local-quality" />
                        <Label htmlFor="media-local-quality">Upload Local</Label>
                    </div>
                </RadioGroup>
                
                <FormField
                    control={form.control}
                    name="media"
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
              name="mediaHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dica de IA (para mídia)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: quality control" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Separator />
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Passos do Processo de Qualidade</h3>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-2">
                    <FormField
                      control={form.control}
                      name={`processSteps.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-grow">
                          <FormControl>
                            <Input placeholder={`Passo ${index + 1}`} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remover Passo</span>
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-6"
                onClick={() => append('')}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Adicionar Novo Passo
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
