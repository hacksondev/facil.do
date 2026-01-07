import type { MetadataRoute } from 'next'
import { getAllFeatureIds } from './data/features'

const baseUrl = 'https://facil.do'

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/terminos`, lastModified: new Date() },
    { url: `${baseUrl}/privacidad`, lastModified: new Date() },
  ]

  const featureRoutes: MetadataRoute.Sitemap = getAllFeatureIds().map((id) => ({
    url: `${baseUrl}/features/${id}`,
    lastModified: new Date(),
  }))

  return [...staticRoutes, ...featureRoutes]
}
