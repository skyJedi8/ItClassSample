export const serviceAreas = [
  { name: 'Houston', slug: 'houston' },
  { name: 'Katy', slug: 'katy' },
  { name: 'Sugar Land', slug: 'sugar-land' },
  { name: 'Spring', slug: 'spring' },
  { name: 'The Woodlands', slug: 'the-woodlands' }
] as const;

export const areas = serviceAreas.map((area) => area.name);
