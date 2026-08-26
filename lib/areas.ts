export const serviceAreas = [
  { name: 'Houston', slug: 'houston' },
  { name: 'Conroe', slug: 'conroe' },
  { name: 'Spring', slug: 'spring' },
  { name: 'The Woodlands', slug: 'the-woodlands' },
  { name: 'Katy', slug: 'katy' },
  { name: 'Sugar Land', slug: 'sugar-land' }
] as const;

export const areas = serviceAreas.map((area) => area.name);
