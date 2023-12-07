// const { createProxyMiddleware } = require('http-proxy-middleware')

/** @type {import('next').NextConfig} */
const path = require('node:path')

const nextConfig = {
  // 启动端口
  // reactStrictMode: true,
  // output: 'export',
  // cssModules: true, // 开启 CSS 模块
  // sassOptions: {
  //   includePaths: [path.join(__dirname, 'styles')]
  // },
  env: {
    API_URL: process.env.NEXT_APP_API_URL
  },
  async rewrites() {
    return [
      {
        source: '/apiPark/:path*',
        destination: 'https://m.mallcoo.cn/api/park/:path*'
      },
      {
        source: '/api/:path*',
        destination: 'https://m.mallcoo.cn/a/liteapp/api/:path*' // Replace with your target URL
      }
    ]
  }
  // async serverMiddleware() {
  //   const proxy = createProxyMiddleware('/api', {
  //     target: 'https://m.mallcoo.cn/a/liteapp/api', // Replace with your target URL
  //     changeOrigin: true,
  //     pathRewrite: {
  //       '^/api': '' // Remove the '/api' prefix when forwarding the request
  //     }
  //   })
  //   this.middlewares.use('/api', proxy)
  // },
  // transpilePackages: ['antd-mobile'] // 可行
  // webpack(config, { isServer }) {
  //   config.module.rules.push({
  //     test: /\.(js|mjs|jsx|ts|tsx)$/,
  //     exclude: /node_modules\/(?!antd-mobile)/,
  //     use: {
  //       loader: 'babel-loader',
  //       options: {
  //         presets: ['next/babel']
  //       }
  //     }
  //   })

  //   // disable css-module in Next.js
  //   config.module.rules.forEach((rule) => {
  //     const { oneOf } = rule
  //     if (oneOf) {
  //       oneOf.forEach((one) => {
  //         if (!`${one.issuer?.and}`.includes('_app')) { return }
  //         one.issuer.and = [path.resolve(__dirname)]
  //       })
  //     }
  //   })

  //   return config
  // }
}

module.exports = nextConfig
// module.exports = withLess(nextConfig)
// module.exports = withLess(nextConfig, {
//   lessLoaderOptions: {
//     javascriptEnabled: true,
//     modifyVars: {
//     }
//   }
// })
