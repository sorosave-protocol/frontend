const createNextIntlPlugin = require('next-intl/plugin');
 
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');
 
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Mantén aquí cualquier otra configuración que ya tuviera el proyecto original
  reactStrictMode: true,
};
 
module.exports = withNextIntl(nextConfig);