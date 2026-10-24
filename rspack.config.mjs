import path from 'node:path';
import { defineConfig } from '@rspack/cli';
import { CssExtractRspackPlugin, NormalModule } from '@rspack/core';

export default defineConfig({
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        type: 'javascript/auto',
        use: [
          CssExtractRspackPlugin.loader,
          'css-loader',
          './src/rebuild-loader.mjs',
        ],
      },
    ],
  },
  plugins: [
    new CssExtractRspackPlugin({ filename: 'bundle.css' }),
    {
      apply(compiler) {
        compiler.hooks.compilation.tap('RebuildModuleImportModuleRepro', (compilation) => {
          compilation.hooks.finishModules.tapAsync(
            'RebuildModuleImportModuleRepro',
            (modules, callback) => {
              const module = [...modules].find(
                (item) =>
                  item instanceof NormalModule &&
                  item.resource.endsWith('/src/style.css'),
              );
              if (!module) {
                callback(new Error('style.css module not found'));
                return;
              }
              compilation.rebuildModule(module, callback);
            },
          );
        });
      },
    },
  ],
});
