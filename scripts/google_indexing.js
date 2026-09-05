/**
 * Google Indexing API & Search Console Integration Script
 * Mahalakshmi College of Nursing
 *
 * Automatically notifies Google to crawl, index, and update all pages instantly.
 * Authenticates using the Google Cloud Service Account with RS256 JWT tokens.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SERVICE_ACCOUNT_PATH = path.resolve(__dirname, '../google_service_account.json');
const BASE_DOMAIN = 'https://mahalakshmicollegeofnursing.com';

const URLS_TO_INDEX = [
  `${BASE_DOMAIN}/`,
  `${BASE_DOMAIN}/best-nursing-colleges-in-tamilnadu`,
  `${BASE_DOMAIN}/admission`,
  `${BASE_DOMAIN}/courses`,
  `${BASE_DOMAIN}/courses/bsc-nursing`,
  `${BASE_DOMAIN}/about`,
  `${BASE_DOMAIN}/fees`,
  `${BASE_DOMAIN}/contact`,
  `${BASE_DOMAIN}/blog`,
  `${BASE_DOMAIN}/events`
];

function base64UrlEncode(str) {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

/**
 * Creates a signed JWT for Google OAuth2
 */
function createJwt(serviceAccount, scope) {
  const now = Math.floor(Date.now() / 1000);
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  };

  const payload = {
    iss: serviceAccount.client_email,
    scope: scope,
    aud: serviceAccount.token_uri || 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signatureInput = `${encodedHeader}.${encodedPayload}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signatureInput);
  const signature = signer.sign(serviceAccount.private_key, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');

  return `${signatureInput}.${signature}`;
}

/**
 * Exchanges signed JWT for Google OAuth Access Token
 */
async function getAccessToken(serviceAccount, scope = 'https://www.googleapis.com/auth/indexing') {
  const jwt = createJwt(serviceAccount, scope);
  const tokenUri = serviceAccount.token_uri || 'https://oauth2.googleapis.com/token';

  const body = new URLSearchParams({
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: jwt
  });

  const response = await fetch(tokenUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: body.toString()
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(`Failed to get OAuth token: ${data.error_description || data.error || response.statusText}`);
  }

  return data.access_token;
}

/**
 * Submits a URL to Google Indexing API
 */
async function publishUrl(accessToken, url, actionType = 'URL_UPDATED') {
  const endpoint = 'https://indexing.googleapis.com/v3/urlNotifications:publish';

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      url: url,
      type: actionType
    })
  });

  const result = await response.json();
  return {
    status: response.status,
    ok: response.ok,
    result
  };
}

/**
 * Checks the Google Indexing status for a URL
 */
async function getUrlStatus(accessToken, url) {
  const endpoint = `https://indexing.googleapis.com/v3/urlNotifications/metadata?url=${encodeURIComponent(url)}`;

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const result = await response.json();
  return {
    status: response.status,
    ok: response.ok,
    result
  };
}

async function main() {
  console.log('\n======================================================');
  console.log('🚀 Mahalakshmi College of Nursing - Google Indexing Engine');
  console.log('======================================================\n');

  if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error(`❌ Service account key file not found at: ${SERVICE_ACCOUNT_PATH}`);
    console.error('👉 Please make sure google_service_account.json exists with valid credentials.');
    process.exit(1);
  }

  let serviceAccount;
  try {
    serviceAccount = JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf-8'));
  } catch (err) {
    console.error('❌ Error parsing google_service_account.json:', err.message);
    process.exit(1);
  }

  console.log(`🔑 Authenticating Service Account: ${serviceAccount.client_email}`);
  console.log(`📁 Project ID: ${serviceAccount.project_id}`);

  let accessToken;
  try {
    accessToken = await getAccessToken(serviceAccount);
    console.log('✅ Google OAuth2 Token acquired successfully!\n');
  } catch (err) {
    console.error('❌ Authentication failed:', err.message);
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const checkOnly = args.includes('--check');
  const customUrlArg = args.find(a => a.startsWith('--url='));
  const targetUrls = customUrlArg ? [customUrlArg.split('=')[1]] : URLS_TO_INDEX;

  if (checkOnly) {
    console.log(`🔍 Checking Google Indexing Metadata for ${targetUrls.length} URLs...\n`);
    for (const url of targetUrls) {
      try {
        const status = await getUrlStatus(accessToken, url);
        if (status.ok) {
          console.log(`✅ [${url}] Metadata:`, JSON.stringify(status.result, null, 2));
        } else {
          console.log(`⚠️ [${url}] (${status.status}):`, status.result.error?.message || status.result);
        }
      } catch (err) {
        console.error(`❌ Error checking ${url}:`, err.message);
      }
    }
    return;
  }

  console.log(`📡 Submitting ${targetUrls.length} URLs to Google Indexing API (URL_UPDATED)...\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const url of targetUrls) {
    try {
      const res = await publishUrl(accessToken, url, 'URL_UPDATED');
      if (res.ok) {
        successCount++;
        const notifyTime = res.result?.urlNotificationMetadata?.latestUpdate?.notifyTime || 'Just now';
        console.log(`✅ [200 OK] Indexed: ${url}`);
        console.log(`   └─ Notify Time: ${notifyTime}`);
      } else {
        errorCount++;
        console.error(`⚠️ [${res.status}] Failed for ${url}:`);
        console.error(`   └─ Message: ${res.result?.error?.message || JSON.stringify(res.result)}`);
        
        if (res.status === 403) {
          console.warn('\n💡 NOTE: Google Indexing API returned 403 Forbidden.');
          console.warn('👉 Verify that you have:');
          console.warn(`   1. Added '${serviceAccount.client_email}' as an OWNER in Google Search Console for '${BASE_DOMAIN}/'.`);
          console.warn('   2. Enabled the "Web Search Indexing API" in Google Cloud Console for project: ' + serviceAccount.project_id + '\n');
        }
      }
    } catch (err) {
      errorCount++;
      console.error(`❌ Error notifying for ${url}:`, err.message);
    }
  }

  console.log('\n------------------------------------------------------');
  console.log(`📊 Indexing Summary: ${successCount} Successful, ${errorCount} Errors/Pending Permissions`);
  console.log('------------------------------------------------------\n');
}

main().catch(err => {
  console.error('Fatal Error:', err);
  process.exit(1);
});
