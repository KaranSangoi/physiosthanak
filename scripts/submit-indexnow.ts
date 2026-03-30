/**
 * IndexNow Bulk URL Submission Script
 *
 * Submits all sitemap URLs to Bing, Yandex, and other IndexNow-compatible
 * search engines for faster indexing. Free, no API key from Google needed.
 *
 * Usage: npx ts-node scripts/submit-indexnow.ts
 * Or:    npx tsx scripts/submit-indexnow.ts
 */

const INDEXNOW_KEY = '68176f477911441489c5b483050d6cf7';
const SITE_HOST = 'physiosthanak.com';
const KEY_LOCATION = `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`;

// All 142 URLs from the sitemap — high-priority pages first
// This list should match what sitemap.ts generates
async function getAllUrls(): Promise<string[]> {
  // Fetch the actual sitemap to get all URLs
  const response = await fetch(`https://${SITE_HOST}/sitemap.xml`);
  const xml = await response.text();

  // Extract URLs from sitemap XML
  const urls: string[] = [];
  const urlRegex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = urlRegex.exec(xml)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

async function submitToIndexNow(urls: string[]) {
  const endpoint = 'https://api.indexnow.org/indexnow';

  const payload = {
    host: SITE_HOST,
    key: INDEXNOW_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  };

  console.log(`\nSubmitting ${urls.length} URLs to IndexNow...`);
  console.log(`Key: ${INDEXNOW_KEY}`);
  console.log(`Key location: ${KEY_LOCATION}\n`);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    console.log(`Response status: ${response.status}`);

    if (response.status === 200) {
      console.log('SUCCESS: All URLs submitted successfully!');
      console.log('Bing, Yandex, Seznam, and Naver will now crawl these URLs faster.');
    } else if (response.status === 202) {
      console.log('ACCEPTED: URLs accepted for processing.');
    } else {
      const body = await response.text();
      console.log(`Response body: ${body}`);

      if (response.status === 422) {
        console.log('ERROR: Key validation failed. Make sure the key file is deployed at:');
        console.log(`  ${KEY_LOCATION}`);
      } else if (response.status === 429) {
        console.log('RATE LIMITED: Too many requests. Wait and try again later.');
      }
    }
  } catch (error) {
    console.error('Failed to submit:', error);
  }
}

async function main() {
  console.log('=== IndexNow URL Submission for PhysioSthanak ===\n');

  const urls = await getAllUrls();
  console.log(`Found ${urls.length} URLs in sitemap`);

  // IndexNow accepts up to 10,000 URLs per submission
  // But let's batch in groups of 100 to be safe
  const batchSize = 100;

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    console.log(`\n--- Batch ${Math.floor(i / batchSize) + 1} (${batch.length} URLs) ---`);

    // Log first 5 URLs of each batch
    batch.slice(0, 5).forEach(url => console.log(`  ${url}`));
    if (batch.length > 5) console.log(`  ... and ${batch.length - 5} more`);

    await submitToIndexNow(batch);

    // Small delay between batches
    if (i + batchSize < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  console.log('\n=== Done! ===');
  console.log('Note: IndexNow covers Bing, Yandex, Seznam, and Naver.');
  console.log('For Google, you still need to use Google Search Console or Google Indexing API.');
}

main().catch(console.error);
