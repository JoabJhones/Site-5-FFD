'use server';

import { z } from "zod";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, doc, updateDoc, query, orderBy, serverTimestamp, Timestamp, deleteDoc } from "firebase/firestore";

const formSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  subject: z.string(),
  message: z.string(),
});

export type ReceivedMessage = z.infer<typeof formSchema> & {
  id: string;
  receivedAt: Date;
  replied: boolean;
  replyContent?: string;
};

// This is the shape of the data coming from Firestore, with a Timestamp
type FirestoreMessageDoc = Omit<ReceivedMessage, 'id' | 'receivedAt'> & {
    receivedAt: Timestamp;
};

export async function getMessages(): Promise<ReceivedMessage[]> {
  const messagesCol = collection(db, "messages");
  const q = query(messagesCol, orderBy("receivedAt", "desc"));
  const messageSnapshot = await getDocs(q);
  
  const messagesList = messageSnapshot.docs.map(doc => {
    const data = doc.data() as FirestoreMessageDoc;
    return {
      id: doc.id,
      name: data.name,
      email: data.email,
      subject: data.subject,
      message: data.message,
      receivedAt: data.receivedAt.toDate(), // Convert Firestore Timestamp to JS Date
      replied: data.replied,
      replyContent: data.replyContent,
    };
  });
  
  return messagesList;
}

export const addMessage = async (message: z.infer<typeof formSchema>): Promise<void> => {
    const messagesCol = collection(db, "messages");
    await addDoc(messagesCol, {
        ...message,
        receivedAt: serverTimestamp(),
        replied: false,
    });
};

export const markAsReplied = async (id: string, replyContent: string): Promise<void> => {
    const messageDoc = doc(db, "messages", id);
    await updateDoc(messageDoc, {
        replied: true,
        replyContent: replyContent,
    });
};

export const deleteMessage = async (id: string): Promise<void> => {
    const messageDoc = doc(db, "messages", id);
    await deleteDoc(messageDoc);
};
