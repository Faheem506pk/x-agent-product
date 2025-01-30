// src/store/apiStore.ts
import { atom } from 'jotai';
import { PdfContent } from '@/lib/type';

export const loadingAtom = atom(false);
export const loadingMessageAtom = atom<string | null>(null);
export const isPostPdfContentLoadingAtom = atom(false);
export const isAnalyzeDataLoadingAtom = atom(false);
export const isResearchDataLoadingAtom = atom(false);

export const activeStepAtom = atom(0);
export const isStepValidAtom = atom(false);
export const pdfContentAtom = atom<PdfContent | null>(null);
export const analyzeAtom = atom();

// Atom for storing all fetched data
export const apiDataAtom = atom<any[]>([]);

// Atom for storing the selected user data

export const apiResponseAtom = atom<any | null>(null);

export const researchapiResponseAtom = atom<any | null>(null);

export const parsedDataAtom = atom((get) => get(analyzeAtom));

export const selectedTrendAtom = atom<string | null>(null);

export const selectedThreadAtom = atom<string | null>(null);

export const selectedContentAtom = atom({
  hook: 'No hook available.',
  story: 'No story available.',
  cta: 'No call-to-action available.',
});
