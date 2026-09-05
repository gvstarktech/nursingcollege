/**
 * Claude 3.5 Sonnet SEO Optimizer CLI Tool
 * Mahalakshmi College of Nursing
 *
 * Runs Anthropic Claude API to generate and validate optimal SEO/AEO tags for all pages.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env
const envPath = path.resolve(__dirname, '../.env');
let apiKey = process.env.ANTHROPIC_API_KEY || process.env.VITE_ANTHROPIC_API_KEY;

if (!apiKey && fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const match = envContent.match(/ANTHROPIC_API_KEY=(.+)/);
  if (match) apiKey = match[1].trim();
}

if (!apiKey) {
  console.error('❌ Error: ANTHROPIC_API_KEY not found in environment or .env file.');
  process.exit(1);
}

const PAGES_TO_ANALYZE = [
  { path: '/', label: 'Home Page', query: 'best nursing college in tamilnadu' },
  { path: '/best-nursing-colleges-in-tamilnadu', label: 'Top 10 Nursing Colleges TN', query: 'best nursing colleges in tamil nadu - courses, fees' },
  { path: '/courses/bsc-nursing', label: 'B.Sc. Nursing Course', query: 'bsc nursing admission 2026 tamil nadu' },
  { path: '/admission', label: 'Admissions 2026-27', query: 'nursing admission 2026 tamil nadu' }
];

async function runClaudeSeo() {
  console.log('\n======================================================');
  console.log('🤖 Anthropic Claude 3.5 Sonnet - SEO & AEO Generator');
  console.log('======================================================\n');
  console.log('🔑 Authenticated with Claude API Key: ' + apiKey.substring(0, 16) + '...');

  for (const page of PAGES_TO_ANALYZE) {
    console.log(`\n⏳ Analyzing Page: [${page.label}] (${page.path}) for query: "${page.query}"...`);

    const prompt = `You are a premier Technical SEO and AEO consultant for higher education in India.
Website: Mahalakshmi College of Nursing, Trichy, Tamil Nadu (INC Code: 986, TNNMC, MGR Medical University, 10+ Bed Hospital Postings, 9 Simulation Labs, 100% Placement).
Page Path: ${page.path}
Target Query: "${page.query}"

Return a JSON object only (no markdown, no backticks):
{
  "title": "Exact 50-60 character title starting with target query",
  "description": "Exact 145-158 character meta description with CTA and USPs",
  "keywords": ["8-10 high value keywords"],
  "aeoSnippet": "40-word direct featured snippet definition for Google/ChatGPT/Gemini"
}`;

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-5',
          max_tokens: 4096,
          messages: [{ role: 'user', content: prompt }]
        })
      });

      if (!res.ok) {
        console.error(`❌ HTTP ${res.status}:`, await res.text());
        continue;
      }

      const data = await res.json();
      let rawText = '';
      if (Array.isArray(data.content)) {
        for (const block of data.content) {
          if (block.type === 'text') {
            rawText += block.text;
          }
        }
      }
      const match = rawText.match(/\{[\s\S]*\}/);
      if (!match) {
        console.error('Raw content received:', JSON.stringify(data.content));
        throw new Error('No JSON object found in response');
      }
      const result = JSON.parse(match[0]);

      console.log(`✅ [${page.label}] Optimized Successfully:`);
      console.log(`   📌 Title (${result.title.length} chars): ${result.title}`);
      console.log(`   📝 Description (${result.description.length} chars): ${result.description}`);
      console.log(`   🎯 Keywords: ${result.keywords.slice(0, 5).join(', ')}...`);
      console.log(`   💡 AEO Answer Snippet: "${result.aeoSnippet}"`);
    } catch (e) {
      console.error(`❌ Failed to process ${page.path}:`, e.message);
    }
  }

  console.log('\n======================================================');
  console.log('✨ Claude SEO Analysis Completed Successfully!');
  console.log('======================================================\n');
}

runClaudeSeo();
