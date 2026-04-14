/**
 * Scrapes a job description URL using a CORS proxy.
 * Uses the free Jina Reader API (r.jina.ai) to bypass heavy bot blocks (like LinkedIn)
 * and natively returns clean, LLM-friendly markdown!
 */
export async function scrapeJobUrl(url: string): Promise<string> {
  try {
    // Validate simple URL
    new URL(url)
    
    // r.jina.ai acts as a proxy that renders JS and extracts markdown text cleanly
    const proxyUrl = `https://r.jina.ai/${url}`
    
    // We add headers to ask for cors / text bypass
    const response = await fetch(proxyUrl, {
      headers: {
        'Accept': 'text/plain',
        'X-Return-Format': 'markdown'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`)
    }
    
    // Jina returns pure text/markdown
    let text = await response.text()
    
    // Clean up excessive whitespace
    text = text.replace(/[\n\r]+/g, '\n').replace(/\s{2,}/g, ' ').trim()
    
    if (!text || text.length < 50) {
      throw new Error('Could not parse meaningful text from the page. It might be heavily heavily JavaScript rendered or actively blocking scrapers.')
    }
    
    // Cap to ~15000 characters to prevent overloading LLM context
    return text.slice(0, 15000)
    
  } catch (err: any) {
    console.error('Job Scrape Error:', err)
    throw new Error(err.message || 'Failed to scrape job description.')
  }
}
