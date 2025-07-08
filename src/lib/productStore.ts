'use server';

import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, writeBatch } from "firebase/firestore";
import { defaultProductsPageContent } from "./content";

const productSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres.' }),
  image: z.string().url({ message: 'Por favor, insira uma URL de imagem válida.' }).min(1, { message: 'A imagem é obrigatória.' }),
  hint: z.string().min(2, { message: 'A dica de IA é necessária.' }),
});

export type Product = z.infer<typeof productSchema> & { id: string };
export type ProductInput = Omit<z.infer<typeof productSchema>, 'id'>;

const productsCol = collection(db, "products");

const seedDatabase = async (): Promise<Product[]> => {
    console.log("Product collection empty. Seeding database with initial products...");
    const batch = writeBatch(db);
    const initialProducts = defaultProductsPageContent.products.map(p => {
        const docRef = doc(productsCol);
        batch.set(docRef, p);
        return { ...p, id: docRef.id };
    });
    await batch.commit();
    console.log("Database seeded successfully.");
    return initialProducts;
}

export async function getProducts(): Promise<Product[]> {
  const productSnapshot = await getDocs(query(productsCol));
  
  if (productSnapshot.empty) {
      return await seedDatabase();
  }
  
  const productList = productSnapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<Product, 'id'>)
  }));
  
  return productList;
}

export const addProduct = async (product: ProductInput): Promise<{ success: boolean, error?: string, id?: string }> => {
    const parsed = productSchema.omit({ id: true }).safeParse(product);
    if(!parsed.success) {
        return { success: false, error: 'Dados do produto inválidos.'}
    }
    
    try {
        const docRef = await addDoc(productsCol, parsed.data);
        return { success: true, id: docRef.id };
    } catch(error) {
        console.error("Error adding product:", error);
        return { success: false, error: "Falha ao adicionar produto." };
    }
};

export const updateProduct = async (id: string, product: ProductInput): Promise<{ success: boolean, error?: string }> => {
    const parsed = productSchema.omit({ id: true }).safeParse(product);
    if(!parsed.success) {
        return { success: false, error: 'Dados do produto inválidos.'}
    }

    try {
        const productDoc = doc(db, "products", id);
        await updateDoc(productDoc, parsed.data);
        return { success: true };
    } catch(error) {
        console.error("Error updating product:", error);
        return { success: false, error: "Falha ao atualizar produto." };
    }
};

export const deleteProduct = async (id: string): Promise<{ success: boolean, error?: string }> => {
    if(!id) {
        return { success: false, error: 'ID do produto é obrigatório.'}
    }
    try {
        const productDoc = doc(db, "products", id);
        await deleteDoc(productDoc);
        return { success: true };
    } catch(error) {
        console.error("Error deleting product:", error);
        return { success: false, error: "Falha ao apagar produto." };
    }
};
