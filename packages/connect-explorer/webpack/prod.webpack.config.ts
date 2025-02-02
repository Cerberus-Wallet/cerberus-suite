import webpack from 'webpack';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import { execSync } from 'child_process';

const commitHash = execSync('git rev-parse HEAD').toString().trim();

const DIST = path.resolve(__dirname, '../build');

const config: webpack.Configuration = {
    mode: 'production',
    entry: {
        index: path.resolve(__dirname, '../src/index.tsx'),
    },
    output: {
        filename: '[name].[hash].js',
        publicPath: './',
        path: DIST,
    },
    module: {
        rules: [
            {
                test: /\.(j|t)sx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        presets: [
                            [
                                '@babel/preset-react',
                                {
                                    runtime: 'automatic',
                                },
                            ],
                            '@babel/preset-typescript',
                        ],
                        plugins: [
                            [
                                'babel-plugin-styled-components',
                                {
                                    displayName: true,
                                    preprocess: true,
                                },
                            ],
                        ],
                    },
                },
            },
            {
                test: /\.(gif|jpe?g|png|svg)$/,
                type: 'asset/resource',
                generator: {
                    filename: './images/[name][contenthash][ext]',
                },
            },
        ],
    },
    // todo: this block is identical in connect-web and connect-explorer
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        modules: ['node_modules'],
        mainFields: ['browser', 'module', 'main'],
        fallback: {
            fs: false, // ignore "fs" import in markdown-it-imsize
            path: false, // ignore "path" import in markdown-it-imsize
        },
    },
    performance: {
        hints: false,
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ['index'],
            template: path.resolve(__dirname, '../src/index.html'),
            filename: 'index.html',
            inject: true,
            minify: false,
        }),
        new webpack.DefinePlugin({
            'process.env.__CERBERUS_CONNECT_SRC': JSON.stringify(process.env.__CERBERUS_CONNECT_SRC),
            'process.env.COMMIT_HASH': JSON.stringify(commitHash),
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, '../src/images'),
                    to: path.resolve(DIST, 'images'),
                },
                {
                    from: path.resolve(__dirname, '../../../docs/packages/connect'),
                    to: path.resolve(DIST, 'docs'),
                },
            ],
        }),
    ],
    optimization: {
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false,
                    },
                },
            }),
        ],
    },
};

export default config;
