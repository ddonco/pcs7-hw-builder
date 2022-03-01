module.exports = {
  content: [
    "./packages/renderer/index.html",
    "./packages/renderer/src/**/*.{vue,js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {},
    screens: {
      "xs": "400px"
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
