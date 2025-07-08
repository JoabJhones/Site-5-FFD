"use server";

import { optimizeWebsiteContent, type OptimizeWebsiteContentInput, type OptimizeWebsiteContentOutput } from "@/ai/flows/optimize-website-content";

export async function handleOptimizeContent(
  input: OptimizeWebsiteContentInput
): Promise<{ success: boolean; data?: OptimizeWebsiteContentOutput, error?: string }> {
  try {
    const result = await optimizeWebsiteContent(input);
    return { success: true, data: result };
  } catch (e: any) {
    console.error("Error optimizing content:", e);
    return { success: false, error: e.message || "An unexpected error occurred." };
  }
}
