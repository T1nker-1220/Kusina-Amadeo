import { register } from 'tsconfig-paths';
import { resolve } from 'path';
import { config } from 'dotenv';

const baseUrl = resolve(__dirname, '../');
const { absoluteBaseUrl, paths } = require('./tsconfig.json').compilerOptions;

// Load environment variables from .env file
config({
  path: resolve(__dirname, '../.env'),
});

register({
  baseUrl,
  paths: {
    '@/*': ['src/*'],
  },
});
