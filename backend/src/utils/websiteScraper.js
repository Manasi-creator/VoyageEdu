const axios = require('axios');
const { JSDOM } = require('jsdom');

/**
 * Fetch metadata from a website URL
 * Extracts: title, description, image, and other Open Graph data
 */
async function fetchWebsiteMetadata(url) {
  try {
    // Format URL (add https:// if missing)
    let formattedUrl = url;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      formattedUrl = `https://${url}`;
    }

    // Fetch website HTML with timeout
    const response = await axios.get(formattedUrl, {
      timeout: 8000, // 8 second timeout
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5'
      },
      maxRedirects: 5,
      validateStatus: (status) => status < 500 // Accept 4xx but not 5xx
    });

    const html = response.data;
    if (!html || typeof html !== 'string') {
      return null;
    }

    const dom = new JSDOM(html, {
      url: formattedUrl,
      contentType: 'text/html'
    });
    const document = dom.window.document;

    // Extract metadata
    const metadata = {
      title: '',
      description: '',
      image: '',
      type: '',
      siteName: ''
    };

    // Try Open Graph tags first
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const ogImage = document.querySelector('meta[property="og:image"]');
    const ogType = document.querySelector('meta[property="og:type"]');
    const ogSiteName = document.querySelector('meta[property="og:site_name"]');

    // Fallback to standard meta tags
    const metaTitle = document.querySelector('title');
    const metaDescription = document.querySelector('meta[name="description"]');

    metadata.title = ogTitle?.content || metaTitle?.textContent || '';
    metadata.description = ogDescription?.content || metaDescription?.content || '';
    metadata.image = ogImage?.content || '';
    metadata.type = ogType?.content || 'website';
    metadata.siteName = ogSiteName?.content || '';

    // Clean up description (remove extra whitespace)
    if (metadata.description) {
      metadata.description = metadata.description.trim().substring(0, 300);
    }

    return metadata;
  } catch (error) {
    console.error(`Error fetching metadata for ${url}:`, error.message);
    return null;
  }
}

/**
 * Batch fetch metadata for multiple URLs
 */
async function fetchMultipleWebsiteMetadata(urls) {
  const results = {};
  
  // Process in batches of 5 to avoid overwhelming servers
  const batchSize = 5;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const promises = batch.map(async (url) => {
      const metadata = await fetchWebsiteMetadata(url);
      return { url, metadata };
    });
    
    const batchResults = await Promise.all(promises);
    batchResults.forEach(({ url, metadata }) => {
      results[url] = metadata;
    });

    // Small delay between batches to be respectful
    if (i + batchSize < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}

module.exports = {
  fetchWebsiteMetadata,
  fetchMultipleWebsiteMetadata
};

