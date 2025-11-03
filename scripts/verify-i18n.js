#!/usr/bin/env node

/**
 * 多语言翻译验证脚本
 * 检查所有features的翻译文件是否完整创建
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

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

console.log('🔍 检查多语言翻译文件完整性...\n');

let allValid = true;
const results = [];

FEATURES.forEach((feature) => {
  const featureLocaleDir = path.join(featuresDir, feature, 'locale');

  if (!fs.existsSync(featureLocaleDir)) {
    console.log(`❌ ${feature}: locale 目录不存在`);
    results.push({ feature, status: '❌', message: 'locale 目录不存在' });
    allValid = false;
    return;
  }

  const missingFiles = [];
  LOCALES.forEach((locale) => {
    const filePath = path.join(featureLocaleDir, `${locale}.json`);
    if (!fs.existsSync(filePath)) {
      missingFiles.push(locale);
      allValid = false;
    } else {
      // 验证JSON格式
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        JSON.parse(content);
      } catch (e) {
        console.log(`❌ ${feature}/${locale}.json: JSON格式错误 - ${e.message}`);
        results.push({ feature, locale, status: '❌', message: 'JSON格式错误' });
        allValid = false;
        return;
      }
    }
  });

  if (missingFiles.length === 0) {
    console.log(`✅ ${feature}: 所有语言文件齐全 (zh, en, ja)`);
    results.push({ feature, status: '✅', message: '所有语言文件齐全' });
  } else {
    console.log(`❌ ${feature}: 缺少 ${missingFiles.join(', ')} 翻译文件`);
    results.push({ feature, status: '❌', message: `缺少 ${missingFiles.join(', ')} 翻译文件` });
    allValid = false;
  }
});

console.log('\n' + '='.repeat(50));
if (allValid) {
  console.log('✅ 所有翻译文件验证通过！');
  process.exit(0);
} else {
  console.log('❌ 存在缺失的翻译文件，请检查！');
  process.exit(1);
}
