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
