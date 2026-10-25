/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async redirects() {
    return [{ source: '/cotizador', destination: '/admin/cotizador', permanent: false }];
  },
};

export default nextConfig;
