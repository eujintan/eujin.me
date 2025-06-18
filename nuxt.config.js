export default {
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      if (ctx && ctx.isClient) {
        config.optimization.splitChunks.maxSize = 64000;
      }
    },
  },
  /*
   ** Headers of the page
   ** Doc: https://vue-meta.nuxtjs.org/api/#metainfo-properties
   */
  head: {
    title: "Welcome To My Personal Website | TAN EU JIN 🚀",
    meta: [
      { charset: "utf-8" },
      { name: "Content-Type", content: "text/html", charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "Welcome To My Personal Website | TAN EU JIN 🚀",
        name: "Welcome To My Personal Website | TAN EU JIN 🚀",
        content: "Welcome To My Personal Website | TAN EU JIN 🚀",
      },
      { hid: "og:url", name: "og:url", content: "https://eujin.me/" },
      { hid: "url", name: "url", content: "https://eujin.me/" },
      {
        hid: "og:title",
        name: "og:title",
        content: "Welcome To My Personal Website | TAN EU JIN 🚀",
      },
      {
        hid: "og:description",
        name: "og:description",
        content:
          "Personal website of Tan Eu Jin. Built using the NuxtJs framework.",
      },
      {
        hid: "description",
        name: "description",
        content:
          "Personal website of Tan Eu Jin. Built using the NuxtJs framework.",
      },
      {
        hid: "og:image",
        name: "og:image",
        content: "https://eujin.me/og-image.png",
      },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Noto+Sans+Display:wght@100;400;700&display=swap",
      },
    ],
  },
  modules: ["@nuxtjs/google-gtag", "@nuxtjs/vuetify", "nuxt-compress"],
  components: true,
  "google-gtag": {
    id: "G-250JQS16WE",
    debug: true,
  },
  vuetify: {
    theme: { light: true },
    customVariables: ["~/assets/variables.scss"],
    treeShake: true,
    defaultAssets: {
      icons: "mdi",
    },
    icons: {
      iconfont: "mdi",
    },
  },
  server: {
    // Bind to all network interfaces
    host: "0.0.0.0",
  },
  "nuxt-compress": {
    gzip: {
      threshold: 8192,
    },
    brotli: {
      threshold: 8192,
    },
  },
};
