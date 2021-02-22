require("esbuild").build({
    entryPoints: [
        "./src/index.ts"
    ],
    bundle: true,
    loader: {
        ".png": "file",
        ".glsl": "text",
    },
    watch: true,
    sourcemap: true,
    outdir: "./dist",
    publicPath: "dist"
})