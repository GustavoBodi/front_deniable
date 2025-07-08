import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/vote',
        destination: 'http://localhost:3030/vote',
      },
      {
        source: '/api/results',
        destination: 'http://127.0.0.1:3030/election/results'
      },
      {
        source: '/api/flush',
        destination: 'http://127.0.0.1:3030/admin/flush'
      },
      {
        source: '/api/receipt/:id',
        destination: 'http://127.0.0.1:3030/receipt/:id'
      }
    ];
  },
};


export default nextConfig;
