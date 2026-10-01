declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module '*.css' {
    const value: any;
    export default value;
}

declare module '*.jpeg' {
    const value: string;
    export default value;
}

declare module '*.avif' {
    const value: string;
    export default value;
}

// The three ecosystem card glyphs are SVGs. Vite returns the asset URL for a
// plain `import x from './x.svg'` (same as png/jpg), so declare it the same way
// — without this, `tsc --noEmit` fails with TS2307 even though the build works.
declare module '*.svg' {
    const value: string;
    export default value;
}
