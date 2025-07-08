"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { handleOptimizeContent } from "./actions";
import type { OptimizeWebsiteContentOutput } from "@/ai/flows/optimize-website-content";
import { pageContentsForAI } from "@/lib/content";
import { Wand2, BrainCircuit, Loader2 } from "lucide-react";

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

  const form = useForm<z.infer<typeof optimizerSchema>>({
    resolver: zodResolver(optimizerSchema),
    defaultValues: {
      trafficData: '{"pageViews": 1500, "bounceRate": "65%"}',
      engagementData: '{"timeOnPage": "1m 15s", "scrollDepth": "70%"}',
    },
  });

  const handlePageChange = (page: PageName) => {
    const content = pageContentsForAI[page];
    if (content) {
      form.setValue("pageName", page);
      form.setValue("currentTitle", content.title);
      form.setValue("currentDescription", content.description);
    }
  };

  async function onSubmit(values: z.infer<typeof optimizerSchema>) {
    setIsLoading(true);
    setError(null);
    setOptimizationResult(null);

    const result = await handleOptimizeContent(values);

    if (result.success && result.data) {
      setOptimizationResult(result.data);
    } else {
      setError(result.error || "Ocorreu um erro desconhecido.");
    }
    setIsLoading(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Otimizador de Conteúdo com IA</CardTitle>
          <CardDescription>
            Selecione uma página para otimizar o título e a descrição usando IA para melhorar o SEO e o engajamento.
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
              <Button type="submit" className="w-full" disabled={isLoading}>
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
  );
}
