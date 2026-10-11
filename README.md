# STRIDE — stride women
React + Vite + TypeScript storefront. Plain CSS, React Router, lucide-react, localStorage cart and wishlist.

## Run
`npm install` · `npm run dev` · `npm run build` · `npm run preview`

## Cloudflare Pages
Build command: `npm run build` · Output: `dist` · Node 18+

## GitHub Pages base
For a repository subpath, set `base: "/<repo-name>/"` in `vite.config.ts` and `basename="/<repo-name>"` on BrowserRouter. Keep `/` for Cloudflare root/custom domains.

Routes: `/`, `/shop`, `/product/:id`, `/about`, `/contact`; unknown routes return Home.
