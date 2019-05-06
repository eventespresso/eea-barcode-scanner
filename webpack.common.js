const path = require( 'path' );
const assets = './assets/src/';
const miniExtract = require( 'mini-css-extract-plugin' );
const autoprefixer = require( 'autoprefixer' );
const externals = {
	jquery: 'jQuery',
	'@eventespresso/eejs': 'eejs',
	'@eventespresso/i18n': 'eejs.i18n',
	'@eventespresso/components': 'eejs.components',
	'@eventespresso/validators': 'eejs.validators',
	'@eventespresso/helpers': 'eejs.helpers',
	'@eventespresso/model': 'eejs.model',
	'@eventespresso/value-objects': 'eejs.valueObjects',
	'@eventespresso/higher-order-components': 'eejs.hocs',
	'@eventespresso/editor-hocs': 'eejs.editorHocs',
	'@wordpress/element': 'wp.element',
	'@wordpress/components': 'wp.components',
	'@wordpress/data': 'wp.data',
	'@wordpress/compose': 'wp.compose',
	'@wordpress/i18n': 'wp.i18n',
	'@wordpress/api-fetch': 'wp.apiFetch',
	react: 'React',
	'react-dom': 'ReactDOM',
	'react-redux': 'eejs.vendor.reactRedux',
	redux: 'eejs.vendor.redux',
	classnames: 'eejs.vendor.classnames',
	lodash: 'lodash',
	'moment-timezone': 'eejs.vendor.moment',
};
/** see below for multiple configurations.
 /** https://webpack.js.org/configuration/configuration-types/#exporting-multiple-configurations */
const config = [
	{
		configName: 'base',
		entry: {
			'barcode-scanner-app': [
				assets + 'barcode-scanner-app/index.js',
			],
		},
		externals,
		output: {
			filename: 'eea-[name].[chunkhash].dist.js',
			path: path.resolve( __dirname, 'assets/dist' ),
		},
		module: {
			rules: [
				{
					test: /\.js$/,
					exclude: /node_modules/,
					use: 'babel-loader',
				},
				{
					test: /\.css$/,
					use: [
						miniExtract.loader,
						{
							loader: 'css-loader',
							query: {
								modules: true,
								localIdentName: '[local]',
							},
							//can't use minimize because cssnano (the
							// dependency) doesn't parser the browserlist
							// extension in package.json correctly, there's
							// a pending update for it but css-loader
							// doesn't have the latest yet.
							// options: {
							//     minimize: true
							// }
						},
						{
							loader: 'postcss-loader',
							options: {
								plugins: function() {
									return [ autoprefixer ];
								},
								sourceMap: true,
							},
						},
					],
				},
			],
		},
		watchOptions: {
			poll: 1000,
		},
	},
];
module.exports = config;
