/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimizaciones para producción
  reactStrictMode: true,
  // Output standalone para Docker
  output: 'standalone',
  // Configuración para mejor rendimiento móvil
  images: {
    formats: ['image/avif', 'image/webp'],
  },
}

module.exports = nextConfig
