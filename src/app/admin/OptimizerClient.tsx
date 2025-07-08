"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { handleOptimizeContent, getPageContentForAI } from "./actions";
import type { OptimizeWebsiteContentOutput } from "@/ai/flows/optimize-website-content";
import { pageContentsForAI } from "@/lib/content";
import { Wand2, BrainCircuit, Loader2 } from "lucide-react";
import ProductManager from "./ProductManager";

const optimizerSchema = z.object({
  pageName: z.string({ required_error: "Por favor, selecione uma página." }),
  currentTitle: z.string().min(1, "O título atual é obrigatório."),
  currentDescription: z.string().min(1, "A descrição atual é obrigatória."),
  trafficData: z.string().min(1, "Os dados de tráfego são obrigatórios."),
  engagementData: z.string().min(1, "Os dados de engajamento são obrigatórios."),
});

type PageName = keyof typeof pageContentsForAI;

export default function OptimizerClient() {
  const [optimizationResult, setOptimizationResult] = useState<OptimizeWebsiteContentOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingContent, setIsFetchingContent] = useState(false);
  const [uploadType, setUploadType] = useState<'url' | 'local'>('url');
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaForUpload, setMediaForUpload] = useState<string | null>(null);

  const form = useForm<z.infer<typeof optimizerSchema>>({
    resolver: zodResolver(optimizerSchema),
    defaultValues: {
      currentTitle: "",
      currentDescription: "",
      trafficData: '{"pageViews": 1500, "bounceRate": "65%"}',
      engagementData: '{"timeOnPage": "1m 15s", "scrollDepth": "70%"}',
    },
  });

  const selectedPage = form.watch("pageName");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUri = reader.result as string;
        setMediaPreview(dataUri);
        setMediaForUpload(dataUri);
      };
      reader.readAsDataURL(file);
    } else {
      setMediaPreview(null);
      setMediaForUpload(null);
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
      setMediaPreview(url);
    } else {
      setMediaPreview(null);
    }
    setMediaForUpload(url);
  };

  const handlePageChange = async (page: PageName) => {
    setIsFetchingContent(true);
    form.setValue("pageName", page);
    form.setValue("currentTitle", "Carregando...");
    form.setValue("currentDescription", "Carregando...");

    const content = await getPageContentForAI(page);
    if (content) {
      form.setValue("currentTitle", content.title);
      form.setValue("currentDescription", content.description);
    } else {
      form.setValue("currentTitle", "Não foi possível carregar o título");
      form.setValue("currentDescription", "Não foi possível carregar a descrição");
    }
    setIsFetchingContent(false);
  };

  async function onSubmit(values: z.infer<typeof optimizerSchema>) {
    setIsLoading(true);
    setError(null);
    setOptimizationResult(null);

    const payload = {
      ...values,
      imageDataUri: mediaForUpload || undefined,
    };

    const result = await handleOptimizeContent(payload);

    if (result.success && result.data) {
      setOptimizationResult(result.data);
    } else {
      setError(result.error || "Ocorreu um erro desconhecido.");
    }
    setIsLoading(false);
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Otimizador de Conteúdo com IA</CardTitle>
            <CardDescription>
              Selecione uma página, forneça os dados e opcionalmente uma mídia para otimizar o conteúdo usando IA.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="pageName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Página para Otimizar</FormLabel>
                      <Select onValueChange={(value: PageName) => handlePageChange(value)} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma página" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.keys(pageContentsForAI).map(page => (
                              <SelectItem key={page} value={page}>{page.charAt(0).toUpperCase() + page.slice(1)}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título Atual</FormLabel>
                      <FormControl>
                        <Input {...field} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="currentDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição Atual</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={5} readOnly />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-2">
                  <FormLabel>Mídia (Opcional)</FormLabel>
                  <RadioGroup value={uploadType} onValueChange={(v: 'url' | 'local') => { setUploadType(v); setMediaPreview(null); setMediaForUpload(null); }} className="flex space-x-4 pb-2">
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="url" id="r1"/>
                      </FormControl>
                      <Label htmlFor="r1">Via URL</Label>
                    </FormItem>
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <RadioGroupItem value="local" id="r2"/>
                      </FormControl>
                      <Label htmlFor="r2">Upload Local</Label>
                    </FormItem>
                  </RadioGroup>
                  
                  {uploadType === 'url' ? (
                    <Input placeholder="https://exemplo.com/imagem.png" onChange={handleUrlChange} />
                  ) : (
                    <Input type="file" accept="image/*,video/*" onChange={handleFileChange} className="file:text-primary file:font-semibold" />
                  )}

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
                  name="trafficData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dados de Tráfego (JSON)</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="engagementData"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dados de Engajamento (JSON)</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={3} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading || isFetchingContent}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  {isLoading ? "Otimizando..." : "Otimizar com IA"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="space-y-8">
          {isLoading && (
              <Card className="flex flex-col items-center justify-center p-12 text-center shadow-lg animate-pulse">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                  <p className="mt-4 text-lg font-medium text-muted-foreground">A IA está trabalhando... Gerando sugestões...</p>
              </Card>
          )}
          {error && (
            <Card className="bg-destructive/10 border-destructive shadow-lg">
              <CardHeader>
                <CardTitle className="text-destructive">Erro na Otimização</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{error}</p>
              </CardContent>
            </Card>
          )}
          {optimizationResult && (
            <Card className="shadow-lg border-primary bg-primary/5 animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Wand2 /> Sugestões da IA
                </CardTitle>
                <CardDescription>Abaixo estão as otimizações recomendadas pela IA.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Título Otimizado</h3>
                  <p className="p-4 bg-background rounded-md border">{optimizationResult.optimizedTitle}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Descrição Otimizada</h3>
                  <p className="p-4 bg-background rounded-md border">{optimizationResult.optimizedDescription}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><BrainCircuit /> Racional da IA</h3>
                  <p className="p-4 bg-background rounded-md border text-muted-foreground">{optimizationResult.optimizationRationale}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      {selectedPage === 'products' && (
        <div className="mt-12">
          <ProductManager />
        </div>
      )}
    </>
  );
}
