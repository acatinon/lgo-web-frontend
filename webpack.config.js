const path = require('path');
const glob = require('glob');
const webpack = require('webpack');
const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const PATHS = {
	src: path.join(__dirname, 'src')
}

module.exports = {
	entry: {
		bundle: ["babel-polyfill", './src/main.js']
	},
	resolve: {
		extensions: ['.mjs', '.js', '.ts', '.svelte'],
		alias: {
			"../../theme.config$": path.join(__dirname, "/semantic-ui/theme.config"),
			"../semantic-ui/site": path.join(__dirname, "/semantic-ui/site"),
			'jquery.inputmask': path.join(__dirname, "/src/js/jquery.inputmask"),
			'inputmask.numeric.extensions': path.join(__dirname, "/src/js/inputmask.numeric.extensions"),
		}
	},
	devServer: {
		contentBase: './docs',
		writeToDisk: true
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
		https: true
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
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.less$/,
				use: [
					{
						loader: MiniCssExtractPlugin.loader,
						options: {
							outputPath: 'css'
						}
					},
					'css-loader',
					'less-loader'
				]
			},
			{
				test: /\.(a?png|svg)$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10000,
							outputPath: 'images'
						}
					}
				]
			},
			{
				test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav)$/,
				use: 'file-loader'
			},
			{
				test: /\.(eot|ttf|woff|woff2)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							outputPath: 'fonts'
						}
					}
				]
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin(),
		new CleanWebpackPlugin({
			cleanOnceBeforeBuildPatterns: ['**/*', "!CNAME"]
		}),
		new OptimizeCssAssetsPlugin(),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: '[name].css',
			chunkFilename: '[id].css',
		}),
		new PurgecssPlugin({
			paths: glob.sync(`${PATHS.src}/**/*`, { nodir: true, ignore: [`${PATHS.src}/css/overlay-scrollbars.css`] }),
			rejected: true
		}),
		new webpack.ProvidePlugin({
			jQuery: 'jquery'
		})
	],
	mode: mode,
	devtool: prod ? false : 'source-map'
};