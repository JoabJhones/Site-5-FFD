"use server";

import { z } from "zod";
import { addMessage } from "@/lib/messagesStore";

const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  subject: z.string().min(5, { message: "O assunto deve ter pelo menos 5 caracteres." }),
  message: z.string().min(10, { message: "A mensagem deve ter pelo menos 10 caracteres." }),
});

export async function handleContactSubmit(values: z.infer<typeof formSchema>) {
  const parsed = formSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: "Dados inválidos." };
  }

  try {
    // Adiciona a mensagem ao banco de dados Firestore
    await addMessage(parsed.data);
    return { success: true };
  } catch (error) {
    console.error("Erro ao processar formulário de contato:", error);
    return { success: false, error: "Ocorreu um erro no servidor." };
  }
}
