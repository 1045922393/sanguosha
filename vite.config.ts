/** @type {import('vite').UserConfig} */
// config for https://vercel.com/1045922393/villiam/CWv6Tcou7sYSoZFoi9Smnkk3Rfn2?filter=all
// @ts-nocheck
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import alias from '@rollup/plugin-alias';
const path = require('path');
import commonConfig from './vite.common.config.ts';

export default ({ command, mode }) => {
  return defineConfig({
    ...commonConfig,
  });
};
