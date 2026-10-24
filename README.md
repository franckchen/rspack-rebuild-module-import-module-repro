# Rspack `rebuildModule` + CSS extraction reproduction

This is a minimal reproduction for [Rspack issue #9058](https://github.com/web-infra-dev/rspack/issues/9058), related to [issue #9778](https://github.com/web-infra-dev/rspack/issues/9778).

The build uses `CssExtractRspackPlugin` and calls `compilation.rebuildModule` from `finishModules`. The CSS loader is executed again during the rebuild.

## Reproduce

```bash
npm install --legacy-peer-deps
npm run build
```

With the published `@rspack/core@2.2.9`, the build can terminate with:

```text
Panic occurred at runtime
should have event sender
```

The failure occurs when the CSS extraction loader uses the module executor after the make phase has closed its `importModule` task loop.

The fix is being developed in [`franckchen/rspack`](https://github.com/franckchen/rspack), branch `fix/rebuild-module-import-module`.
