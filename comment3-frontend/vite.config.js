import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// import vueI18n from "@intlify/vite-plugin-vue-i18n";
import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";

// https://vitejs.dev/config/
export default defineConfig({
	server: {
		port: 8003,
		watch: {
			ignored: [
				"**/vueold/**",
				"**/img/**",
				"**/dist/**",
				"**/assets/**",
			],
		},
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@ensdomains/address-encoder":
				"@ensdomains/address-encoder/lib/index.umd.js", // https://github.com/vitejs/vite/issues/6085
		},
	},
	plugins: [
		vue(),
		// vueI18n({
		// 	// if you want to use Vue I18n Legacy API, you need to set `compositionOnly: false`
		// 	// compositionOnly: false,
		// 	include: path.resolve(__dirname, "./locales/**"),
		// }),
	],
	css: {
		preprocessorOptions: {
			scss: {
				additionalData: `
              @import "./src/scss/common.scss";
            `,
			},
			less: {
				// lessOptions: {
				modifyVars: {
					"font-family": "Roboto",
					"primary-color": "#3d72de",
					"text-color": "#333333",
					"text-color-secondary": "#8C97AD",
					"font-size-base": "1rem",
					"font-size-lg": "1.3rem",
					"font-size-sm": "0.9rem",
					"line-height-base": "1",
					"btn-padding-base": "0 16px",
					"border-radius-base": "8px",
					"border-color-base": "#f2f2f2",
					"border-color-split": "#f2f2f2",
					"layout-body-background": "transparent",
					"layout-header-background": "transparent",
					"layout-sider-background": "transparent",
					"menu-inline-toplevel-item-height": "32px",
					"menu-item-height": "32px",
				},
				javascriptEnabled: true,
				// },
			},
		},
		loaderOptions: {},
	},
	build: {
		// minify: false,
		commonjsOptions: {
			transformMixedEsModules: true,
		},
	},
	define: {
		"process.env": {},
	},
	optimizeDeps: {
		esbuildOptions: {
			// Node.js global to browser globalThis
			define: {
				global: "globalThis",
			},
			// Enable esbuild polyfill plugins
			plugins: [
				NodeGlobalsPolyfillPlugin({
					buffer: true,
				}),
			],
		},
	},
});
