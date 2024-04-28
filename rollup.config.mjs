import typescript from '@rollup/plugin-typescript';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import copyFile from './copy-file.mjs';
import dotenv from '@dotenvx/dotenvx';

dotenv.config();
const isProd = process.env.BUILD === 'production';
let obsidianExportPath = process.env.OBSIDIAN_EXPORT_PATH;
if (!obsidianExportPath) {
  obsidianExportPath = "dist/";
}

const banner = `/*
THIS IS A GENERATED/BUNDLED FILE BY ROLLUP
if you want to view the source visit the plugins github repository
*/
`;

const cmModules = [
  '@codemirror/autocomplete',
  '@codemirror/closebrackets',
  '@codemirror/collab',
  '@codemirror/comment',
  '@codemirror/commands',
  '@codemirror/fold',
  '@codemirror/highlight',
  '@codemirror/gutter',
  '@codemirror/history',
  '@codemirror/language',
  '@codemirror/lint',
  '@codemirror/matchbrackets',
  '@codemirror/search',
  '@codemirror/state',
  '@codemirror/stream-parser',
  '@codemirror/rangeset',
  '@codemirror/panel',
  '@codemirror/matchbrackets',
  '@codemirror/text',
  '@codemirror/tooltip',
  '@codemirror/view',
];

export default {
  input: './src/main.ts',
  output: {
    dir: '.',
    sourcemap: 'inline',
    sourcemapExcludeSources: isProd,
    format: 'cjs',
    exports: 'default',
    banner,
  },
  external: ['obsidian', ...cmModules],
  plugins: [
    alias({
      entries: {
        '@app': 'src',
        '@lib': 'src/lib',
      },
    }),
    typescript(),
    nodeResolve({ browser: true }),
    commonjs(),
    copyFile({
      targets: [
        { src: './main.js', dest: obsidianExportPath },
        { src: './manifest.json', dest: obsidianExportPath },
        { src: './src/styles.css', dest: obsidianExportPath },
      ],
    }),
  ],
  onwarn: (warning) => {
    if (warning.code === 'THIS_IS_UNDEFINED') return;

    console.warn(warning.message);
  },
};
