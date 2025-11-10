#!/usr/bin/env node

/**
 * OAuth config verification script
 *
 * Purpose: Quickly check if OAuth environment variables are correctly configured
 * Run: node scripts/verify-oauth-config.cjs
 */

const fs = require('node:fs');
const path = require('node:path');

const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), '.env.example');

// ANSI colors for console output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

const c = {
  red: (text) => `${colors.red}${text}${colors.reset}`,
  green: (text) => `${colors.green}${text}${colors.reset}`,
  yellow: (text) => `${colors.yellow}${text}${colors.reset}`,
  blue: (text) => `${colors.blue}${text}${colors.reset}`,
  cyan: (text) => `${colors.cyan}${text}${colors.reset}`,
  gray: (text) => `${colors.gray}${text}${colors.reset}`,
  bold: (text) => `${colors.bold}${text}${colors.reset}`
};

console.log(c.bold(c.blue('\n🔍 OAuth config verification\n')));

// Simple env loader (alternative to dotenv)
function loadEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let value = match[2].trim();

      // remove quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  }
}

// Load environment variables
loadEnv(envPath);

const requiredVars = {
  'NEXTAUTH_SECRET': {
    description: 'NextAuth secret (at least 32 characters)',
    validator: (val) => val && val.length >= 32,
    errorMsg: 'length should be at least 32 characters'
  },
  'NEXTAUTH_URL': {
    description: 'NextAuth URL',
    validator: (val) => val && (val.startsWith('http://') || val.startsWith('https://')),
    errorMsg: 'must be a valid HTTP/HTTPS URL'
  }
};

const oauthVars = {
  google: {
    'GOOGLE_CLIENT_ID': {
      description: 'Google OAuth client ID',
      validator: (val) => val && val.includes('.apps.googleusercontent.com'),
      errorMsg: 'format should be: xxx.apps.googleusercontent.com'
    },
    'GOOGLE_CLIENT_SECRET': {
      description: 'Google OAuth client secret',
      validator: (val) => val && val.length > 20,
      errorMsg: 'length should be at least 20 characters'
    }
  },
  github: {
    'GITHUB_CLIENT_ID': {
      description: 'GitHub OAuth client ID',
      validator: (val) => val && val.length > 10,
      errorMsg: 'format should be: xxx.apps.githubusercontent.com'
    },
    'GITHUB_CLIENT_SECRET': {
      description: 'GitHub OAuth client secret',
      validator: (val) => val && val.length > 20,
      errorMsg: 'length should be at least 20 characters'
    }
  }
};

let hasErrors = false;
let enabledProviders = [];

// Check required variables
console.log(c.bold('📋 Required Configuration:\n'));
for (const [key, config] of Object.entries(requiredVars)) {
  const value = process.env[key];
  if (!value) {
    console.log(c.red(`  ✗ ${key}: Not Set`));
    console.log(c.gray(`    Description: ${config.description}\n`));
    hasErrors = true;
  } else if (config.validator && !config.validator(value)) {
    console.log(c.yellow(`  ⚠ ${key}: Set but may have issues`));
    console.log(c.gray(`    ${config.errorMsg}\n`));
    hasErrors = true;
  } else {
    console.log(c.green(`  ✓ ${key}: Configured`));
  }
}

// Check OAuth providers
console.log(c.bold('\n🔐 OAuth Providers:\n'));
for (const [provider, vars] of Object.entries(oauthVars)) {
  let providerConfigured = true;
  let providerPartial = false;
  
  console.log(c.bold(`  ${provider.toUpperCase()}:`));
  
  for (const [key, config] of Object.entries(vars)) {
    const value = process.env[key];
    if (!value) {
      console.log(c.gray(`    ○ ${key}: not set`));
      providerConfigured = false;
    } else if (config.validator && !config.validator(value)) {
      console.log(c.yellow(`    ⚠ ${key}: ${config.errorMsg}`));
      providerPartial = true;
    } else {
      console.log(c.green(`    ✓ ${key}: Configured`));
    }
  }
  
  if (providerConfigured && !providerPartial) {
    console.log(c.green(`  → ${provider.toUpperCase()} login enabled\n`));
    enabledProviders.push(provider);
  } else if (providerPartial) {
    console.log(c.yellow(`  → ${provider.toUpperCase()} configuration incomplete\n`));
  } else {
    console.log(c.gray(`  → ${provider.toUpperCase()} not configured (optional)\n`));
  }
}

// Summary
console.log(c.bold('📊 Configuration Summary:\n'));
if (hasErrors) {
  console.log(c.red('  ✗ Found configuration issues, please check required variables\n'));
} else {
  console.log(c.green('  ✓ Required configuration complete\n'));
}

if (enabledProviders.length > 0) {
  console.log(c.green(`  ✓ Enabled OAuth Providers: ${enabledProviders.join(', ')}\n`));
} else {
  console.log(c.yellow('  ⚠ No OAuth Providers enabled (email login only)\n'));
}

// Suggestions
if (hasErrors || enabledProviders.length === 0) {
  console.log(c.bold(c.cyan('💡 下一步：\n')));
  
  if (!fs.existsSync(envPath)) {
    console.log(c.cyan(`  1. Copy environment variable template file:`));
    console.log(c.gray(`     cp .env.example .env.local\n`));
  }
  
  if (hasErrors) {
    console.log(c.cyan(`  2. Edit .env.local file to configure required variables`));
    console.log(c.gray(`     - NEXTAUTH_SECRET: Run 'openssl rand -base64 32' to generate`));
    console.log(c.gray(`     - NEXTAUTH_URL: http://localhost:3000 (development)\n`));
  }
  
  if (enabledProviders.length === 0) {
    console.log(c.cyan(`  3. Configure OAuth providers (optional):`));
    console.log(c.gray(`     - Google: https://console.cloud.google.com/`));
    console.log(c.gray(`     - GitHub: https://github.com/settings/developers`));
    console.log(c.gray(`     For detailed steps, please refer to: docs/OAUTH_SETUP.md\n`));
  }

  console.log(c.cyan(`  4. Restart the development server to apply changes\n`));
}

// Show callback URLs (for configuring OAuth apps)
if (enabledProviders.length > 0) {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  console.log(c.bold(c.cyan('🔗 OAuth Callback URLs (configure in OAuth apps):\n')));

  for (const provider of enabledProviders) {
    console.log(c.cyan(`  ${provider.toUpperCase()}:`));
    console.log(c.gray(`    ${baseUrl}/api/auth/callback/${provider}\n`));
  }
}

// Exit code
process.exit(hasErrors ? 1 : 0);
