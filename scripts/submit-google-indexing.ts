/**
 * Google Indexing API - Bulk URL Submission Script
 *
 * Submits URLs to Google for faster crawling/indexing.
 * Free tier: 200 URLs/day.
 *
 * SETUP REQUIRED (one-time, ~10 minutes):
 * 1. Go to https://console.cloud.google.com
 * 2. Create a new project (or use existing)
 * 3. Enable "Web Search Indexing API" (search for it in APIs & Services → Library)
 * 4. Create a Service Account:
 *    - Go to APIs & Services → Credentials → Create Credentials → Service Account
 *    - Give it a name like "indexing-bot"
 *    - Download the JSON key file
 *    - Save it as: scripts/google-service-account.json
 * 5. Add the service account email to GSC:
 *    - Go to Search Console → Settings → Users and permissions
 *    - Add the service account email (from the JSON file) as "Owner"
 *
 * Usage: npx tsx scripts/submit-google-indexing.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const SERVICE_ACCOUNT_PATH = path.join(__dirname, 'google-service-account.json');
const SITE_HOST = 'https://physiosthanak.com';
const DAILY_LIMIT = 200;

interface ServiceAccount {
  client_email: string;
  private_key: string;
  token_uri: string;
}

// Create JWT for Google API auth
async function getAccessToken(sa: ServiceAccount): Promise<string> {
  // We need jsonwebtoken for this — install with: npm install jsonwebtoken @types/jsonwebtoken
  // For simplicity, using the google-auth-library instead
  try {
    const { GoogleAuth } = await import('google-auth-library');
    const auth = new GoogleAuth({
      keyFile: SERVICE_ACCOUNT_PATH,
      scopes: ['https://www.googleapis.com/auth/indexing'],
    });
    const client = await auth.getClient();
    const token = await client.getAccessToken();
    return token.token || '';
  } catch {
    console.error('Failed to get access token. Make sure google-auth-library is installed:');
    console.error('  npm install google-auth-library');
    process.exit(1);
  }
}

async function submitUrl(url: string, accessToken: string, type: 'URL_UPDATED' | 'URL_DELETED' = 'URL_UPDATED'): Promise<boolean> {
  const endpoint = 'https://indexing.googleapis.com/v3/urlNotifications:publish';

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        url,
        type,
      }),
    });

    if (response.ok) {
      return true;
    } else {
      const error = await response.json();
      console.error(`  FAILED (${response.status}): ${JSON.stringify(error)}`);
      return false;
    }
  } catch (error) {
    console.error(`  ERROR: ${error}`);
    return false;
  }
}

async function getAllUrls(): Promise<string[]> {
  const response = await fetch(`${SITE_HOST}/sitemap.xml`);
  const xml = await response.text();

  const urls: string[] = [];
  const urlRegex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = urlRegex.exec(xml)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

async function main() {
  console.log('=== Google Indexing API - URL Submission for PhysioSthanak ===\n');

  // Check if service account file exists
  if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
    console.error('ERROR: Service account key file not found!');
    console.error(`Expected at: ${SERVICE_ACCOUNT_PATH}`);
    console.error('\nFollow the setup instructions at the top of this file to create one.');
    process.exit(1);
  }

  const urls = await getAllUrls();
  console.log(`Found ${urls.length} URLs in sitemap`);

  // Prioritize: homepage, service categories, service areas, then individual pages
  const prioritized = urls.sort((a, b) => {
    const priority = (url: string) => {
      if (url === SITE_HOST || url === `${SITE_HOST}/`) return 0;
      if (url === `${SITE_HOST}/pilates`) return 1;
      if (url === `${SITE_HOST}/services`) return 2;
      if (url === `${SITE_HOST}/service-areas`) return 3;
      if (url.match(/\/services\/[^/]+$/)) return 4;     // service categories
      if (url.match(/\/service-areas\/[^/]+$/)) return 5; // area pages
      if (url === `${SITE_HOST}/contact`) return 6;
      return 10; // everything else
    };
    return priority(a) - priority(b);
  });

  // Respect daily limit
  const toSubmit = prioritized.slice(0, DAILY_LIMIT);
  console.log(`Submitting ${toSubmit.length} URLs (daily limit: ${DAILY_LIMIT})\n`);

  // Get access token
  console.log('Authenticating with Google...');
  const accessToken = await getAccessToken(JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_PATH, 'utf-8')));
  console.log('Authenticated!\n');

  let success = 0;
  let failed = 0;

  for (const url of toSubmit) {
    process.stdout.write(`Submitting: ${url} ... `);
    const ok = await submitUrl(url, accessToken);
    if (ok) {
      console.log('OK');
      success++;
    } else {
      failed++;
    }

    // Small delay to be respectful
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`\n=== Done! ===`);
  console.log(`Submitted: ${success} | Failed: ${failed}`);

  if (prioritized.length > DAILY_LIMIT) {
    console.log(`\nNote: ${prioritized.length - DAILY_LIMIT} URLs remaining. Run again tomorrow.`);
  }
}

main().catch(console.error);
