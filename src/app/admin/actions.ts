"use server";

import { Resend } from 'resend';
import { z } from 'zod';
import { getMessages as getMessagesFromDB, markAsReplied, deleteMessage as deleteMessageFromDB } from '@/lib/messagesStore';
import type { ReceivedMessage } from '@/lib/messagesStore';

const replySchema = z.object({
    name: z.string(),
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
    
    const emailHtml = `
    <body style="font-family: Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
        <div style="background-color: #ff8652; padding: 20px; text-align: center;">
          <img src="https://media.licdn.com/dms/image/v2/D4E0BAQG308qmO_jpZQ/company-logo_200_200/company-logo_200_200/0/1680554352386/frango_dourado_alimentos_logo?e=2147483647&v=beta&t=0rmtOkXVEFxisvele33NIShETEfYctlbAnQjNVQMNW0" alt="Logo Frango Dourado" style="width: 80px; height: 80px; border-radius: 50%;">
          <h1 style="color: #ffffff; margin-top: 10px; font-size: 24px; font-weight: bold;">Frango Dourado</h1>
        </div>
        <div style="padding: 30px; line-height: 1.6; color: #374151;">
          <h2 style="font-size: 20px; color: #ff8652;">Olá, ${parsed.data.name},</h2>
          <p>Agradecemos o seu contato sobre o assunto: "<strong>${parsed.data.subject}</strong>".</p>
          <p>Segue abaixo a nossa resposta:</p>
          <div style="background-color: #f3f4f6; border-left: 4px solid #ff8652; padding: 15px; margin: 20px 0; color: #1f2937;">
            ${parsed.data.html}
          </div>
          <p>Caso tenha mais alguma dúvida, estamos à sua disposição.</p>
          <p style="margin-top: 30px;">Atenciosamente,</p>
          <p><strong>Equipe Frango Dourado</strong></p>
        </div>
        <div style="background-color: #f3f4f6; text-align: center; padding: 15px; font-size: 12px; color: #6b7280; border-top: 1px solid #e5e7eb;">
          <p>&copy; ${new Date().getFullYear()} Frigorífico Frango Dourado Ltda. Todos os direitos reservados.</p>
        </div>
      </div>
    </body>
    `;

    try {
        await resend.emails.send({
            from: 'Frango Dourado <onboarding@resend.dev>', // Este e-mail deve ser de um domínio verificado no Resend
            to: parsed.data.to,
            subject: `Re: ${parsed.data.subject}`,
            html: emailHtml,
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

const deleteSchema = z.object({
  messageId: z.string().min(1, 'ID da mensagem é obrigatório.'),
});

export async function handleDeleteMessage(values: z.infer<typeof deleteSchema>) {
  const parsed = deleteSchema.safeParse(values);
  if (!parsed.success) {
    return { success: false, error: 'ID da mensagem inválido.' };
  }

  try {
    await deleteMessageFromDB(parsed.data.messageId);
    return { success: true };
  } catch (error) {
    console.error("Erro ao apagar mensagem:", error);
    return { success: false, error: 'Ocorreu um erro ao apagar a mensagem no servidor.' };
  }
}
