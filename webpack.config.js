const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
	entry: {
		bundle: ["babel-polyfill", './src/main.js']
	},
	resolve: {
		extensions: ['.mjs', '.js', '.ts', '.svelte']
	},
	output: {
		path: __dirname + '/docs',
		filename: '[name].js',
		chunkFilename: '[name].[id].js'
	},
	devServer: {
		contentBase: __dirname + '/docs',
		compress: true,
		port: 9000,
		https:true
	},
	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /(node_modules)/,
				use: {
				  loader: 'babel-loader',
				  options: {
					presets: ['@babel/preset-env']
				  }
				}
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.svelte$/,
				exclude: /node_modules/,
				use: {
					loader: 'svelte-loader',
					options: {
						emitCss: true,
						hotReload: true
					}
				}
			},
			{
				test: /\.css$/,
				use: [
					/**
					 * MiniCssExtractPlugin doesn't support HMR.
					 * For developing, use 'style-loader' instead.
					 * */
					prod ? MiniCssExtractPlugin.loader : 'style-loader',
					'css-loader'
				]
			}
		]
	},
	mode,
	devtool: prod ? false: 'source-map'
};