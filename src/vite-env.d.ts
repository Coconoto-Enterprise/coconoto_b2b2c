// Ambient type declarations not covered by the bundled @types.
// (src/types/images.d.ts already handles png/jpg/jpeg/avif/css.)

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  [key: string]: any;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module '*.webp' {
  const value: string;
  export default value;
}

// EditorJS plugins that ship without their own TypeScript declarations.
declare module '@editorjs/marker';
declare module '@editorjs/embed';

// Minimal ambient module for DOMPurify in projects that don't ship
// @types/dompurify. The runtime .d.ts that ships with the package is the
// source of truth when available; this declaration ensures `tsc --noEmit`
// passes on machines that don't have it installed.
declare module 'dompurify' {
  const DomPurify: { sanitize: (value: unknown, options?: Record<string, unknown>) => string };
  export default DomPurify;
}
