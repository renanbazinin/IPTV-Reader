// src/utils/parseM3U8.js
export function parseM3U8(content) {
  const lines = content.split(/\r?\n/).map(l => l.trim());
  const result = [];
  let attrs = null;
  let title = '';

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
      console.log(`parsed channel: ${entry.title}, logo→`, entry.logo);  // debug output
      result.push(entry);
      attrs = null;
      title = '';
    }
  }

  return result;
}
