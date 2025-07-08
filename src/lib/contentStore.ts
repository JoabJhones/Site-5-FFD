
'use server';

import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { defaultContent } from "./content";

// Define types for each content page based on defaultContent
export type HomeContent = typeof defaultContent.home;
export type AboutContent = typeof defaultContent.sobre;
export type ProductsPageContentInfo = typeof defaultContent.products;
export type QualityContent = typeof defaultContent.quality;
export type ContactContent = typeof defaultContent.contact;
export type FooterContent = typeof defaultContent.footer;

export type PageName = keyof typeof defaultContent;
export type PageContent = HomeContent | AboutContent | ProductsPageContentInfo | QualityContent | ContactContent | FooterContent;

/**
 * Retrieves content for a specific page from Firestore.
 * If the content doesn't exist, it seeds the database with default content.
 * @param page The name of the page to get content for.
 * @returns The content for the specified page.
 */
export async function getContent(page: PageName): Promise<PageContent> {
    const docRef = doc(db, "siteContent", page);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as PageContent;
    } else {
        console.log(`No content for page "${page}" found. Seeding with default content.`);
        const contentToSeed = defaultContent[page];
        await setDoc(docRef, contentToSeed);
        return contentToSeed;
    }
}

/**
 * Updates the content for a specific page in Firestore.
 * @param page The name of the page to update.
 * @param data The new data to save. The data is cast to `any` to allow partial updates.
 */
export async function updateContent(page: PageName, data: any): Promise<void> {
    const docRef = doc(db, "siteContent", page);
    await updateDoc(docRef, data);
}
