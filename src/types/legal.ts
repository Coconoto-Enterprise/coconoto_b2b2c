/**
 * Shape of the data exported by `api/_legal-content.js`.
 *
 * That file is plain JavaScript because `api/seo.js` (the Vercel Node runtime)
 * cannot import TypeScript. This mirrors its structure so the React pages get
 * real types without duplicating the copy.
 */

export type LegalBlock = {
  p?: string;
  h3?: string;
  ul?: string[];
  note?: string;
  dl?: [string, string][];
};

export type LegalSection = {
  heading: string;
  blocks: LegalBlock[];
};

export type LegalPage = {
  heading: string;
  description: string;
  intro?: string;
  sections: LegalSection[];
};
