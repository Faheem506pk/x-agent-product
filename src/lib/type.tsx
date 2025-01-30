export type PdfContent = {
  fileName: string;
  extractionDate: string;
  pageCount: number;
  content: string;
  metadata: {
    title: string | undefined;
    size: number | undefined;
    type: string | undefined;
  };
};

export type ThreadIdea = {
  suggested_title: string;
  description: string;
};

export type IdeationOutput = {
  analysis: string;
  thread_ideas: ThreadIdea[];
};

export type generateOutput = {
  hook: string; // A catchy hook to grab attention
  story: string; // The main story or body content of the post
  cta: string; // Call-to-action encouraging engagement
};
