
const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;
// console.log('IS DEV: ', isDev);

const optimization = () => {
    const config = {
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all'
        }
    }

    if (isProd) {
        config.minimizer = [
            new CssMinimizerPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config;
}

const getPlugins = () => {
    const plugins = [
        new HtmlWebPackPlugin({
            template: './index.html',
            minify: {
                collapseWhiteSpace: isProd,
            }
        }),
        new CleanWebpackPlugin(),
        // new CopyWebpackPlugin({
        //     patterns: [
        //         {
        //             from: path.resolve(__dirname, 'src/assets/favicon.ico'),
        //             to: path.resolve(__dirname, 'dist')
        //         }
        //     ]
        // }),
        new MiniCssExtractPlugin({
            filename: filename('css')
        })
    ];

    // if (isProd) plugins.push(new BundleAnalyzerPlugin());

    return plugins;
}

const filename = ext => isDev ? `[name].${ext}` : `[name].[chunkhash].${ext}`;

const cssLoaders = add => {
    const config = [
        {
            loader: MiniCssExtractPlugin.loader,
        },
        'css-loader'
    ];

    if (add) config.push(add);

    return config;
}

module.exports = {
    performance: {
        maxAssetSize: 500000,
        maxEntrypointSize: 500000,
    },
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        index: './index.ts',
    },
    devtool: false,
    output: {
        filename: filename('js'),
        path: path.resolve(__dirname, 'dist'),
        assetModuleFilename: 'images/[hash][ext]',
    },
    resolve: {
        extensions: ['.js', '.json', '.png', '.css', '.ts'],
        alias: {
           '@models': path.resolve(__dirname, 'src/models'),
           '@': path.resolve(__dirname, 'src'), 
        }
    },
    // devtool: isDev ? 'source-map' : 'nosources-map',
    optimization: optimization(),
    plugins: getPlugins(),
    devServer: {
        port: 4200,
        compress: true,
        client: {
            reconnect: 1,
            logging: 'error', //'log' | 'info' | 'warn' | 'error' | 'none' | 'verbose'
            overlay: {
                errors: true,
                warnings: false,
            }
        },
        hot: isDev,
    },
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [{
                    loader: MiniCssExtractPlugin.loader,
                },
                'css-loader',
                'sass-loader',
                ]
            },
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.(png|jpg|svg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[hash][ext][query]',
                }
            },
            {
                test: /\.ttf$/,
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[hash][ext][query]',
                }
            },
            {
                test: /\.ts?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    }
}