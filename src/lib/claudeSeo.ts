/**
 * Claude AI SEO & AEO Optimizer Service
 * Mahalakshmi College of Nursing
 *
 * Utilizes Anthropic Claude API to generate search-optimized, high-CTR
 * metadata and structured answer snippets for Google & AI Answer Engines.
 */

export interface ClaudeSeoSuggestion {
  title: string;
  description: string;
  keywords: string[];
  aeoSnippet: string;
  rationale: string;
}

export async function generateSeoWithClaude(
  pagePath: string,
  pageContext: string = '',
  targetKeyword: string = 'best nursing college in tamilnadu',
  customApiKey?: string
): Promise<ClaudeSeoSuggestion> {
  const apiKey = customApiKey || (typeof window !== 'undefined' ? localStorage.getItem('mahs_claude_api_key') || sessionStorage.getItem('mahs_claude_api_key') : '') || '';

  if (!apiKey) {
    throw new Error('Claude API key is not configured. Please provide an API key in the SEO Admin panel or run the Node.js CLI script: npm run index:google');
  }

  const prompt = `You are a world-class Technical SEO and Answer Engine Optimization (AEO) expert specializing in higher education and healthcare college rankings in India.

Context:
- College Name: Mahalakshmi College of Nursing, Tiruchirappalli (Trichy), Tamil Nadu
- Council Approvals: Indian Nursing Council (INC Code: 986), Tamil Nadu Nurses and Midwives Council (TNNMC)
- University: The Tamil Nadu Dr. M.G.R. Medical University, Chennai
- Clinical Rotations: 10+ Bed Multi-Specialty Teaching Hospital Rotations (Rathna Hospital & NABH Partners)
- Laboratories: 9 Advanced Simulation Labs (OSCE, Foundation, Anatomy, OBG, Paediatric, Community)
- Placement Track Record: 100% Campus Placements (Apollo, Kauvery, Fortis, Manipal, NHS UK, NCLEX)
- Programs Offered: B.Sc. Nursing (4 Yrs), GNM (3 Yrs), Post Basic B.Sc. (2 Yrs)
- Target Page Path: ${pagePath}
- Additional Page Context: ${pageContext || 'Higher education nursing admissions and rankings'}
- Primary Target Search Query: "${targetKeyword}"

Requirements:
1. TITLE: Exactly 50 to 60 characters. Must start with or contain the primary query "${targetKeyword}". Must include the brand (e.g. Mahalakshmi College or MCN) without exceeding 60 chars.
2. META DESCRIPTION: Exactly 145 to 158 characters. Clear call to action (Admissions 2026-27), USPs (10+ beds, 9 labs, 100% placements), high CTR.
3. KEYWORDS: Array of 8 to 12 high-intent long-tail keywords (both singular and plural, including fees, government quota counselling, etc.).
4. AEO SNIPPET: A 40-50 word direct definition answer paragraph designed to win Google Featured Snippets (Position 0).
5. RATIONALE: A 1-sentence technical reason why this optimizes for #1 rank on Google.

Respond ONLY with a valid JSON object matching this exact TypeScript structure (no markdown formatting, no backticks, just pure raw JSON):
{
  "title": "string",
  "description": "string",
  "keywords": ["string", "string"],
  "aeoSnippet": "string",
  "rationale": "string"
}`;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-5',
      max_tokens: 4096,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Claude API error (${response.status}): ${errText}`);
  }

  const data = await response.json();
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
    throw new Error('Claude did not return a valid JSON object.');
  }

  const parsed = JSON.parse(match[0]) as ClaudeSeoSuggestion;
  return parsed;
}
