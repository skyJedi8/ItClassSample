export function isValidQuote(data: Record<string, unknown>) {
  const required = ['fullName', 'phone', 'cityZip'];
  return required.every((field) => typeof data[field] === 'string' && (data[field] as string).trim().length > 1);
}
