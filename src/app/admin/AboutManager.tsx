"use client";

import { useState, useEffect } from 'react';
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
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const valueSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres.' }),
  description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres.' }),
});

const aboutSchema = z.object({
  title: z.string().min(10, { message: 'O título principal deve ter pelo menos 10 caracteres.' }),
  history1: z.string().min(20, { message: 'O primeiro parágrafo da história deve ter pelo menos 20 caracteres.' }),
  history2: z.string().min(20, { message: 'O segundo parágrafo da história deve ter pelo menos 20 caracteres.' }),
  image: z.string().url({ message: 'Por favor, insira uma URL de mídia válida.' }).min(1, { message: 'A mídia é obrigatória.' }),
  imageHint: z.string().min(2, { message: 'A dica de IA é necessária.' }),
  values: z.array(valueSchema),
});

export default function AboutManager() {
  const { toast } = useToast();
  const [aboutData, setAboutData] = useState(aboutPageContent);
  const [uploadType, setUploadType] = useState<'url' | 'local'>('url');
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<z.infer<typeof aboutSchema>>({
    resolver: zodResolver(aboutSchema),
    defaultValues: aboutPageContent,
  });
  
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "values",
  });
  
  const imageValue = form.watch('image');
  
  useEffect(() => {
    if (imageValue && (imageValue.startsWith('http') || imageValue.startsWith('data:'))) {
      setImagePreview(imageValue);
    } else {
      setImagePreview(null);
    }
  }, [imageValue]);

  const handleImageFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        form.setValue('image', dataUri, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else {
      form.setValue('image', '', { shouldValidate: true });
    }
  };

  const onSubmit = (values: z.infer<typeof aboutSchema>) => {
    setAboutData(values);
    // Note: In a real app, you would need to update the content source.
    // Here we are just updating the local state which will not persist.
    // For the prototype, we can manually update lib/content.ts if needed.
    toast({
      title: "Página 'Sobre Nós' Atualizada!",
      description: "O conteúdo da página 'Sobre Nós' foi salvo com sucesso.",
    });
  };

  return (
    <Card className="shadow-lg animate-fade-in-up">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Gerenciador da Página "Sobre Nós"</CardTitle>
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

            <div className="space-y-2">
                <FormLabel className="text-lg font-semibold">Mídia da Página</FormLabel>
                <RadioGroup
                    value={uploadType}
                    onValueChange={(v: 'url' | 'local') => {
                        setUploadType(v);
                        form.setValue('image', '', { shouldValidate: true });
                    }}
                    className="flex space-x-4"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="url" id="img-url" />
                        <Label htmlFor="img-url">Via URL</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="local" id="img-local" />
                        <Label htmlFor="img-local">Upload Local</Label>
                    </div>
                </RadioGroup>
                
                <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                {uploadType === 'url' ? (
                                    <Input placeholder="https://exemplo.com/midia.png" {...field} />
                                ) : (
                                    <Input
                                        type="file"
                                        accept="image/*,video/*"
                                        onChange={handleImageFileChange}
                                        className="file:text-primary file:font-semibold"
                                    />
                                )}
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {imagePreview && (
                  <div className="mt-4 p-4 border rounded-lg flex flex-col items-center justify-center bg-muted/50">
                    <h4 className="font-semibold mb-2 self-start">Pré-visualização da Mídia:</h4>
                    {imagePreview.startsWith('data:video') || imagePreview.endsWith('.mp4') ? (
                        <video src={imagePreview} controls className="rounded-md border max-h-60" />
                    ) : (
                        <img src={imagePreview} alt="Pré-visualização da mídia" className="rounded-md border object-contain max-h-60" />
                    )}
                  </div>
                )}
              </div>

            <FormField
              control={form.control}
              name="imageHint"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dica de IA (para mídia)</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: company history" {...field} />
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
