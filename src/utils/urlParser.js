export function extractTaskIdFromUrl(url) {
  if (!url || typeof url !== 'string') {
    return null;
  }

  url = url.trim();

  const pParamMatch = url.match(/[?&]p=([a-f0-9]{32})/i);
  if (pParamMatch) {
    return pParamMatch[1];
  }

  const pathMatch = url.match(/notion\.so\/[^/]*?([a-f0-9]{32})(?:[?&#]|$)/i);
  if (pathMatch) {
    return pathMatch[1];
  }

  const directIdMatch = url.match(/^([a-f0-9]{32})$/i);
  if (directIdMatch) {
    return directIdMatch[1];
  }

  const dashedIdMatch = url.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
  if (dashedIdMatch) {
    return dashedIdMatch[1].replace(/-/g, '');
  }

  return null;
}