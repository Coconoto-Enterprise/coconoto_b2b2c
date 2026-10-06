// vite.config.ts
import { defineConfig } from "file:///C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/node_modules/@vitejs/plugin-react/dist/index.js";
import { fileURLToPath, URL } from "node:url";
var __vite_injected_original_import_meta_url = "file:///C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/vite.config.ts";
var vite_config_default = defineConfig({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  build: {
    outDir: "dist",
    // Vite normally wipes outDir before writing. In this environment a bulk
    // delete of >50 files is blocked by the tooling guard, which aborts the
    // build. Filenames are content-hashed, so leaving old chunks behind is
    // harmless — index.html always points at the fresh ones.
    emptyOutDir: false
  },
  server: {
    host: true,
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://localhost:3001",
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    host: true,
    allowedHosts: true
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxFTk9DSFxcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXGNvY29ub3RvX2IyYjJjXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxFTk9DSFxcXFxEb2N1bWVudHNcXFxcR2l0SHViXFxcXGNvY29ub3RvX2IyYjJjXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9FTk9DSC9Eb2N1bWVudHMvR2l0SHViL2NvY29ub3RvX2IyYjJjL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcclxuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xyXG5pbXBvcnQgeyBmaWxlVVJMVG9QYXRoLCBVUkwgfSBmcm9tICdub2RlOnVybCdcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgcGx1Z2luczogW3JlYWN0KCldLFxyXG4gIGJhc2U6ICcvJyxcclxuICByZXNvbHZlOiB7XHJcbiAgICBhbGlhczoge1xyXG4gICAgICAnQCc6IGZpbGVVUkxUb1BhdGgobmV3IFVSTCgnLi9zcmMnLCBpbXBvcnQubWV0YS51cmwpKSxcclxuICAgIH0sXHJcbiAgfSxcclxuICBidWlsZDoge1xyXG4gICAgb3V0RGlyOiAnZGlzdCcsXHJcbiAgICAvLyBWaXRlIG5vcm1hbGx5IHdpcGVzIG91dERpciBiZWZvcmUgd3JpdGluZy4gSW4gdGhpcyBlbnZpcm9ubWVudCBhIGJ1bGtcclxuICAgIC8vIGRlbGV0ZSBvZiA+NTAgZmlsZXMgaXMgYmxvY2tlZCBieSB0aGUgdG9vbGluZyBndWFyZCwgd2hpY2ggYWJvcnRzIHRoZVxyXG4gICAgLy8gYnVpbGQuIEZpbGVuYW1lcyBhcmUgY29udGVudC1oYXNoZWQsIHNvIGxlYXZpbmcgb2xkIGNodW5rcyBiZWhpbmQgaXNcclxuICAgIC8vIGhhcm1sZXNzIFx1MjAxNCBpbmRleC5odG1sIGFsd2F5cyBwb2ludHMgYXQgdGhlIGZyZXNoIG9uZXMuXHJcbiAgICBlbXB0eU91dERpcjogZmFsc2VcclxuICB9LFxyXG4gIHNlcnZlcjoge1xyXG4gICAgaG9zdDogdHJ1ZSxcclxuICAgIGFsbG93ZWRIb3N0czogdHJ1ZSxcclxuICAgIHByb3h5OiB7XHJcbiAgICAgICcvYXBpJzoge1xyXG4gICAgICAgIHRhcmdldDogJ2h0dHA6Ly9sb2NhbGhvc3Q6MzAwMScsXHJcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxyXG4gICAgICAgIHNlY3VyZTogZmFsc2VcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgcHJldmlldzoge1xyXG4gICAgaG9zdDogdHJ1ZSxcclxuICAgIGFsbG93ZWRIb3N0czogdHJ1ZVxyXG4gIH1cclxufSlcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF3VSxTQUFTLG9CQUFvQjtBQUNyVyxPQUFPLFdBQVc7QUFDbEIsU0FBUyxlQUFlLFdBQVc7QUFGNEssSUFBTSwyQ0FBMkM7QUFJaFEsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLE1BQU07QUFBQSxFQUNOLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUtSLGFBQWE7QUFBQSxFQUNmO0FBQUEsRUFDQSxRQUFRO0FBQUEsSUFDTixNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsSUFDZCxPQUFPO0FBQUEsTUFDTCxRQUFRO0FBQUEsUUFDTixRQUFRO0FBQUEsUUFDUixjQUFjO0FBQUEsUUFDZCxRQUFRO0FBQUEsTUFDVjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixjQUFjO0FBQUEsRUFDaEI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
