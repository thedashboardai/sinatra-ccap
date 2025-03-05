const path = require("path");
const webpack = require('webpack');
module.exports = {
    mode: 'production',
    entry: ['./src/index.jsx'],
    module: {
        rules: require('./webpack.rules'),
    },
    output: {
        filename: '[name].[chunkhash].js',
        chunkFilename: '[name].[chunkhash].chunk.js',
        clean: true,
        publicPath: '/admin/'
    },
    plugins: [...require('./webpack.plugins'), 
                  new webpack.DefinePlugin({'process.env': JSON.stringify(process.env),
 }),],
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
        alias: {
            // Custom Aliases
            ...require('./webpack.aliases'),
            'react-router-dom': path.resolve(__dirname, '../../node_modules/react-router-dom'),
            "react-native$": require.resolve('react-native-web'),
        },
        fallback: {
            "fs": false,
            "tls": false,
            "net": false,
            "path": false,
            "zlib": false,
            "http": false,
            "https": false,
            "stream": false,
            "crypto": false,
            "crypto-browserify": require.resolve('crypto-browserify'), //if you want to use this module also don't forget npm i crypto-browserify
        }
    },
    stats: 'errors-warnings',
    optimization: {
        minimize: true,
        sideEffects: true,
        concatenateModules: true,
        runtimeChunk: 'single',
        splitChunks: {
            chunks: 'all',
            maxInitialRequests: 10,
            minSize: 0,
            cacheGroups: {
                vendor: {
                    name: 'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    chunks: 'all',
                },
            },
        },
    },
};