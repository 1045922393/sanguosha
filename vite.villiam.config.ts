/** @type {import('vite').UserConfig} */
// config for https://github.com/1045922393/1045922393.github.io
// @ts-nocheck
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import alias from '@rollup/plugin-alias';
const path = require('path');
import commonConfig from './vite.common.config.ts';

export default ({ command, mode }) => {
  return defineConfig({
    base: '/sanguosha/',
    build: {
      outDir: 'sanguosha',
    },
    ...commonConfig,
  });
};
