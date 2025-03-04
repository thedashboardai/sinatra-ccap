const path = require("path");
const fs = require("fs");
var nodeExternals = require('webpack-node-externals');
// const isPackageASymlinked = fs.existsSync(path.resolve(__dirname, "../../node_modules/@thedashboardai/dashboard-components"))
const packagePath = path.resolve(__dirname, "../../node_modules/@thedashboardai/dashboard-components");

const isPackageASymlinked = fs.existsSync(packagePath) && fs.lstatSync(packagePath).isSymbolicLink();

console.log("SYM LINKING HERE")
console.log(isPackageASymlinked)

module.exports = {
    mode: 'development',
    entry: ['./src/index.jsx'],
    module: {
        rules: require('./webpack.rules'),
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        publicPath: '/'
    },
    plugins: require('./webpack.plugins'),
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
        alias: {
            ...require('./webpack.aliases'),
            ...(isPackageASymlinked && {"@thedashboardai/dashboard-components": fs.realpathSync(path.resolve(__dirname, "../../node_modules/@thedashboardai/dashboard-components"))}),
            ...(isPackageASymlinked && {"@assets": fs.realpathSync(path.resolve(__dirname, "../../node_modules/@thedashboardai/dashboard-components/src/assets"))}),
            'react-router-dom': path.resolve(__dirname, '../../node_modules/react-router-dom'),
            "react-native$": require.resolve('react-native-web'),
            '../Utilities/Platform': 'react-native-web/dist/exports/Platform',
            '../../Utilities/Platform': 'react-native-web/dist/exports/Platform',
            './Platform': 'react-native-web/dist/exports/Platform'
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
    devtool: 'cheap-module-source-map',
    devServer: {
        open: true,
        historyApiFallback: true,
        hot: true,
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
    performance: {
        hints: false,
    },
};