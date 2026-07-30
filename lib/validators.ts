export function isValidQuote(data: Record<string, unknown>) {
  const required = ['fullName', 'phone', 'serviceAddress', 'propertyType', 'timeframe', 'contactPreference', 'servicesNeeded'];
  return required.every((field) => typeof data[field] === 'string' && (data[field] as string).trim().length > 1);
}
