import { MetadataRoute } from 'next'
import { calculators } from '@/data/calculators'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://online-calc.com'
  
  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    },
  ]

  // Category pages
  const categoryPages = [
    'finance-calculators',
    'math-calculators',
    'health-calculators',
    'date-calculators',
    'everyday-calculators',
    'developer-calculators',
  ].map(category => ({
    url: `${baseUrl}/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Calculator pages
  const calculatorPages = calculators.map(calc => ({
    url: `${baseUrl}/calculators/${calc.category}/${calc.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...staticPages, ...categoryPages, ...calculatorPages]
}
