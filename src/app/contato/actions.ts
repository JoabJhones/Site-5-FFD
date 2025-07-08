"use server";

import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10),
});

export async function handleContactSubmit(values: z.infer<typeof formSchema>) {
  const parsed = formSchema.safeParse(values);

  if (!parsed.success) {
    return { success: false, error: "Dados inválidos." };
  }

  try {
    // Here you would typically send an email, save to a database, etc.
    // For this example, we'll just log it to the server console.
    console.log("Nova mensagem de contato recebida:");
    console.log(parsed.data);

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return { success: true };
  } catch (error) {
    console.error("Erro ao processar formulário de contato:", error);
    return { success: false, error: "Ocorreu um erro no servidor." };
  }
}
