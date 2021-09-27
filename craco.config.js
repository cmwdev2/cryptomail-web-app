const CracoEsbuildPlugin = require('craco-esbuild');
const { addBeforeLoader, loaderByName } = require('@craco/craco');

module.exports = {
	plugins: [{
		plugin: CracoEsbuildPlugin,
		options: {
			enableSvgr: true, // Optional.
			esbuildLoaderOptions: {
				loader: 'tsx', // Set the value to 'tsx' if you use typescript
				target: 'esnext',
			},
			skipEsbuildJest: false, // Optional. Set to true if you want to use babel for jest tests,
			esbuildJestOptions: {
				loaders: {
					'.ts': 'ts',
					'.tsx': 'tsx',
				},
			},
		},
	}],
	webpack: {
		configure: (webpackConfig) => {
			const wasmExtensionRegExp = /\.wasm$/;
			webpackConfig.resolve.extensions.push('.wasm');
			webpackConfig.module.rules.forEach((rule) => {
				(rule.oneOf || []).forEach((oneOf) => {
					if (oneOf.loader && oneOf.loader.indexOf('file-loader') >= 0) {
						oneOf.exclude.push(wasmExtensionRegExp);
					}
				});
			});
			const wasmLoader = {
				test: /\.wasm$/,
				exclude: /node_modules/,
				loaders: ['wasm-loader'],
			};
			addBeforeLoader(webpackConfig, loaderByName('file-loader'), wasmLoader);
			return webpackConfig;
		},
	},
};
