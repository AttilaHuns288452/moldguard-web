/**
 * Emit FAQPage JSON-LD from content.ts so the answers are eligible for rich
 * results (AEO). One source of truth: rewrite whenever the FAQ changes.
 */
import { readFileSync, writeFileSync } from 'node:fs'

const src = readFileSync('src/content.ts', 'utf8')
const block = src.slice(src.indexOf('export const FAQ'), src.indexOf('export const CONTACT_PAGE'))
const qs = [...block.matchAll(/q:\s*'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1])
const as = [...block.matchAll(/a:\s*'((?:[^'\\]|\\.)*)'/g)].map((m) => m[1])
if (qs.length !== as.length) throw new Error(`FAQ mismatch: ${qs.length} q vs ${as.length} a`)

// Decode the string escapes used by content.ts, including its currency symbol.
const un = (s) => s.replace(/\\u([0-9a-f]{4})|\\(['"\\nrt])/gi, (_, hex, escaped) =>
  hex ? String.fromCharCode(parseInt(hex, 16)) : ({ n: '\n', r: '\r', t: '\t' }[escaped] ?? escaped))
const schema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: qs.map((q, i) => ({
    '@type': 'Question',
    name: un(q),
    acceptedAnswer: { '@type': 'Answer', text: un(as[i]) },
  })),
}
writeFileSync('public/faq.json', JSON.stringify(schema, null, 2) + '\n')
console.log(`faq.json: ${qs.length} questions`)
