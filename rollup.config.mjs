import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import dts from 'rollup-plugin-dts';
import { dirname } from 'path';
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import packageJson from './package.json' assert { type: 'json' };

const plugins = [
  peerDepsExternal(),
  resolve(),
  commonjs(),
]

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
    ],
    plugins: [
      ...plugins,
      typescript({
        tsconfig: './tsconfig.build.json',
        outDir: dirname(packageJson.main),
      }),
    ],
    external: ['react', 'react-dom'],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      ...plugins,
      typescript({
        tsconfig: './tsconfig.build.json',
        outDir: dirname(packageJson.module),
      }),
    ],
    external: ['react', 'react-dom'],
  },
  {
    input: 'src/index.ts',
    output: [{ file: packageJson.types, format: 'esm' }],
    plugins: [dts({ tsconfig: './tsconfig.build.json' })],
  },
];
