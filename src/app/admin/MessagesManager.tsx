"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ReceivedMessage } from '@/lib/messagesStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { handleReplySubmit, getMessages, handleDeleteMessage } from './actions';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Send, Loader2, RefreshCw, Trash2 } from 'lucide-react';

const replySchema = z.object({
  reply: z.string().min(10, { message: 'A resposta deve ter pelo menos 10 caracteres.' }),
});

export default function MessagesManager() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ReceivedMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ReceivedMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof replySchema>>({
    resolver: zodResolver(replySchema),
    defaultValues: { reply: '' },
  });

  const loadMessages = async () => {
    setIsLoading(true);
    try {
        const serverMessages = await getMessages();
        setMessages(serverMessages);
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Erro ao Carregar Mensagens",
            description: "Não foi possível buscar as mensagens do servidor."
        })
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const openReplyDialog = (message: ReceivedMessage) => {
    setSelectedMessage(message);
    form.reset({ reply: '' });
    setIsDialogOpen(true);
  };

  const onSubmit = async (values: z.infer<typeof replySchema>) => {
    if (!selectedMessage) return;

    const result = await handleReplySubmit({
      name: selectedMessage.name,
      to: selectedMessage.email,
      subject: selectedMessage.subject,
      html: values.reply.replace(/\n/g, '<br>'),
      messageId: selectedMessage.id,
    });

    if (result.success) {
      setIsDialogOpen(false);
      toast({
        title: 'Resposta Enviada!',
        description: `Sua resposta para ${selectedMessage.name} foi enviada com sucesso.`,
      });
      await loadMessages(); // Refresh the list from server
    } else {
      toast({
        variant: 'destructive',
        title: 'Falha no Envio',
        description: result.error || 'Não foi possível enviar a resposta.',
      });
    }
  };

  const handleDelete = async (messageId: string, messageName: string) => {
    const result = await handleDeleteMessage({ messageId });
    if(result.success) {
        toast({
            title: 'Mensagem Apagada!',
            description: `A mensagem de ${messageName} foi removida com sucesso.`,
        });
        await loadMessages();
    } else {
        toast({
            variant: 'destructive',
            title: 'Falha ao Apagar',
            description: result.error || 'Não foi possível apagar a mensagem.',
        })
    }
  }

  return (
    <Card className="shadow-lg animate-fade-in-up">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
                <CardTitle className="text-2xl font-semibold">Caixa de Entrada</CardTitle>
                <CardDescription>Visualize, responda e apague as mensagens enviadas através do site.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={loadMessages} disabled={isLoading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? "Atualizando..." : "Atualizar"}
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>De</TableHead>
                <TableHead>Assunto</TableHead>
                <TableHead className="hidden md:table-cell">Recebido em</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-muted-foreground" />
                    </TableCell>
                </TableRow>
              ) : messages.length > 0 ? (
                messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell className="font-medium">{message.name}</TableCell>
                    <TableCell>{message.subject}</TableCell>
                    <TableCell className="hidden md:table-cell">{format(new Date(message.receivedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}</TableCell>
                    <TableCell>
                      {message.replied ? <Badge>Respondido</Badge> : <Badge variant="secondary">Pendente</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => openReplyDialog(message)}>
                            Ver e Responder
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
                                    Essa ação não pode ser desfeita. Isso irá apagar permanentemente a mensagem de "{message.name}".
                                </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(message.id, message.name)} className="bg-destructive hover:bg-destructive/90">Apagar</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                        Nenhuma mensagem recebida ainda.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Revisar e Responder Mensagem</DialogTitle>
            <DialogDescription>
              Enviando resposta para <span className="font-medium text-primary">{selectedMessage?.name} ({selectedMessage?.email})</span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <Card className="bg-muted/50 border">
              <CardHeader>
                <CardTitle className="text-xl">Mensagem Original</CardTitle>
                <CardDescription>
                  {selectedMessage ? `Recebida em: ${format(new Date(selectedMessage.receivedAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}` : ''}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                 <p><span className="font-semibold text-foreground/80 w-20 inline-block">De:</span> {selectedMessage?.name}</p>
                 <p><span className="font-semibold text-foreground/80 w-20 inline-block">Email:</span> {selectedMessage?.email}</p>
                 <p><span className="font-semibold text-foreground/80 w-20 inline-block">Assunto:</span> {selectedMessage?.subject}</p>
                <div className="pt-2">
                  <p className="font-semibold text-foreground/80 mb-2">Mensagem:</p>
                  <div className="pl-3 border-l-2 border-muted-foreground/30 text-muted-foreground">
                    <p>{selectedMessage?.message}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="reply"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Sua Resposta</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Digite sua resposta aqui..."
                          rows={8}
                          {...field}
                          disabled={form.formState.isSubmitting}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={form.formState.isSubmitting}>
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                        {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        {form.formState.isSubmitting ? 'Enviando...' : 'Enviar Resposta'}
                    </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
