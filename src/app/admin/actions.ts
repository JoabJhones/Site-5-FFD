"use server";

import { Resend } from 'resend';
import { z } from 'zod';
import { getMessages as getMessagesFromDB, markAsReplied } from '@/lib/messagesStore';
import type { ReceivedMessage } from '@/lib/messagesStore';

const replySchema = z.object({
    to: z.string().email(),
    subject: z.string(),
    html: z.string(),
    messageId: z.string(),
});

export async function handleReplySubmit(values: z.infer<typeof replySchema>) {
    const parsed = replySchema.safeParse(values);
    if(!parsed.success) {
        return { success: false, error: 'Dados de resposta inválidos.'}
    }

    if (!process.env.RESEND_API_KEY) {
        console.error("A chave da API Resend não está configurada.");
        return { success: false, error: "O serviço de e-mail não está configurado." };
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        await resend.emails.send({
            from: 'Frango Dourado <onboarding@resend.dev>', // Este e-mail deve ser de um domínio verificado no Resend
            to: parsed.data.to,
            subject: `Re: ${parsed.data.subject}`,
            html: `
              <p>Olá,</p>
              <p>Em resposta à sua mensagem sobre "${parsed.data.subject}":</p>
              <blockquote style="border-left: 2px solid #eee; padding-left: 1em; margin-left: 1em;">
                ${parsed.data.html}
              </blockquote>
              <p>Atenciosamente,</p>
              <p>Equipe Frango Dourado</p>
            `,
        });

        // Marca a mensagem como respondida no Firestore
        await markAsReplied(parsed.data.messageId, parsed.data.html);

        return { success: true };
    } catch(error) {
        console.error("Erro ao enviar email ou atualizar DB:", error);
        return { success: false, error: 'Ocorreu um erro ao enviar o e-mail ou ao atualizar o banco de dados.' };
    }
}

export async function getMessages(): Promise<ReceivedMessage[]> {
  // Busca os dados do Firestore através da nossa store
  return await getMessagesFromDB();
}
