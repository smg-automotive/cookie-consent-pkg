import preserveDirectives from 'rollup-plugin-preserve-directives';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';
import { dirname, join } from 'node:path';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import packageJson from './package.json' with { type: 'json' };

const plugins = [
  peerDepsExternal(),
  resolve(),
  commonjs(),
  preserveDirectives(),
];
const tsConfigPath = join(import.meta.dirname, 'tsconfig.build.json');

// Utility function to get output directory from package.json fields
const outputDir = (format) =>
  format === 'cjs' ? dirname(packageJson.main) : dirname(packageJson.module);

// Common TypeScript plugin configuration
const tsPlugin = (outDir) => {
  return typescript({
    tsconfig: tsConfigPath,
    compilerOptions: {
      outDir,
      declaration: true,
    },
  });
};

// Base configuration for JS (CJS & ESM)
const createJsConfig = (format) => ({
  input: 'src/index.ts',
  output: [
    {
      format,
      dir: outputDir(format),
      sourcemap: true,
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
  ],
  plugins: [...plugins, tsPlugin(outputDir(format))],
  external: ['react', 'react-dom'],
});

export default [
  createJsConfig('cjs'),
  createJsConfig('esm'),
  {
    input: 'src/index.ts',
    output: [{ file: packageJson.types, format: 'esm' }],
    plugins: [dts({ tsconfig: tsConfigPath })],
  },
];
