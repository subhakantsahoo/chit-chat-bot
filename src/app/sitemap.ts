import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://main.d3g1sjoperhwf0.amplifyapp.com',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://main.d3g1sjoperhwf0.amplifyapp.com/chat',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    // Add all your important pages here
  ]
}
