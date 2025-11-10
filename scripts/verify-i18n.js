#!/usr/bin/env node

/**
 * i18n check script
 * checks if all translation files for each feature are present
 * and valid JSON format for zh, en, ja locales.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCALES = ['zh', 'en', 'ja'];
const FEATURES = [
  'auth',
  'home',
  'about',
  'pricing',
  'blog',
  'help',
  'articles',
  'console',
  'user',
  'admin',
  'mail',
];

const srcDir = path.join(__dirname, '../src');
const featuresDir = path.join(srcDir, 'features');

console.log('🔍 checking i18n translation files...\n');

let allValid = true;

for (const feature of FEATURES) {
  const featureLocaleDir = path.join(featuresDir, feature, 'locale');

  if (!fs.existsSync(featureLocaleDir)) {
    console.log(`❌ ${feature}: locale directory does not exist`);
    continue;
  }

  const missingFiles = [];
  for (const locale of LOCALES) {
    const filePath = path.join(featureLocaleDir, `${locale}.json`);
    if (fs.existsSync(filePath)) {
      // check if valid JSON
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        JSON.parse(content);
      } catch (e) {
        console.log(`❌ ${feature}/${locale}.json: JSON format error - ${e.message}`);
        continue;
      }
    } else {
      missingFiles.push(locale);
      allValid = false;
    }
  }

  if (missingFiles.length === 0) {
    console.log(`✅ ${feature}: All language files are complete (zh, en, ja)`);
    results.push({ feature, status: '✅', message: 'All language files are complete' });
  } else {
    console.log(`❌ ${feature}: Missing ${missingFiles.join(', ')} translation files`);
    results.push({ feature, status: '❌', message: `Missing ${missingFiles.join(', ')} translation files` });
  }
}

console.log('\n' + '='.repeat(50));
if (allValid) {
  console.log('✅ All translation files are valid!');
  process.exit(0);
} else {
  console.log('❌ Missing translation files found, please check!');
  process.exit(1);
}
