export function campaignName(value: unknown) {
  return typeof value === 'string' ? value.trim().replace(/^(?:(?:mr|mrs|ms|miss|dr)\.?(?:\s+|$))+/i, '').trim() : '';
}
export function messageIssues(text: string) {
  const issues=[];
  if (!text.trim().endsWith('Reply STOP to unsubscribe.')) issues.push('Keep the exact Reply STOP to unsubscribe. footer.');
  if (/\b(?:bit\.ly|tinyurl\.com|t\.co|shorturl\.at|goo\.gl|ow\.ly|buff\.ly|is\.gd)\b/i.test(text)) issues.push('Use your full branded URL instead of a public link shortener.');
  if (/http:\/\//i.test(text)) issues.push('Use a secure https:// link.');
  if (text.split(/\r?\n/).some(line => /^\s*https?:\/\/\S+\s*$/.test(line))) issues.push('Describe the link on the same line so customers know where it goes.');
  if (/[!?]{2,}/.test(text) || /\b(?:act now|free gift|winner)\b/i.test(text)) issues.push('Remove urgent slogans or repeated punctuation.');
  const prose=text.replaceAll('Reply STOP to unsubscribe.', '').replace(/https?:\/\/\S+/g, '').replace(/\b(?:OCF|SMS|GSM|TX)\b/g, '');
  if (/\b[A-Z]{3,}\b/.test(prose)) issues.push('Use sentence case instead of all-capital words.');
  return issues;
}
