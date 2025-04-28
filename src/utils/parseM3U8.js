// src/utils/parseM3U8.js
export function parseM3U8(content, sourceUrl = '') {
  const lines = content.split(/\r?\n/).map(l => l.trim());
  const result = [];
  let attrs = null;
  let title = '';
  
  // Check if this is a direct stream or playlist
  let isDirectStream = false;
  
  // If content starts with #EXTM3U and doesn't have #EXTINF entries, it's likely a direct stream
  if (lines[0]?.startsWith('#EXTM3U') && !content.includes('#EXTINF')) {
    isDirectStream = true;
  }
  
  // Also check if URL ends with .m3u8 and no other indicators of a playlist
  if (sourceUrl && sourceUrl.toLowerCase().endsWith('.m3u8') && !content.includes('#EXTINF')) {
    isDirectStream = true;
  }
  
  // For direct streams, create a single channel entry
  if (isDirectStream) {
    const streamTitle = sourceUrl 
      ? sourceUrl.split('/').pop().replace('.m3u8', '') 
      : 'Direct Stream';
    
    return [{
      id: 'direct-stream',
      title: streamTitle,
      logo: '', // No logo for direct streams
      group: 'Direct Streams',
      url: sourceUrl || content.trim() // Use source URL if available, otherwise the content may be the URL
    }];
  }
  
  // Regular playlist parsing logic
  for (const line of lines) {
    if (line.startsWith('#EXTINF')) {
      // pull title after the first comma
      const commaIndex = line.indexOf(',');
      title = commaIndex > -1 ? line.slice(commaIndex + 1).trim() : '';
      // pull all key="value" pairs, now including hyphens in keys
      attrs = {};
      const attrRe = /([\w-]+?)="([^"]*)"/g;
      let m;
      while ((m = attrRe.exec(line))) {
        attrs[m[1]] = m[2];
      }
    }
    else if (line && !line.startsWith('#') && attrs) {
      // next non-comment = URL → emit
      const entry = {
        id:    attrs['tvg-id']     || title,
        title,
        logo:  attrs['tvg-logo']   || '',
        group: attrs['group-title']|| '',
        url:   line
      };
      result.push(entry);
      attrs = null;
      title = '';
    }
  }

  return result;
}
