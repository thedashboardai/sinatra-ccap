const webpack = require('webpack');
const {inDev} = require('./webpack.helpers');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const path = require('path')

module.exports = [
    new ForkTsCheckerWebpackPlugin(),
    inDev() && new webpack.HotModuleReplacementPlugin(),
    inDev() && new ReactRefreshWebpackPlugin(),
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'process.env.MY_ENV': JSON.stringify(process.env.MY_ENV),
        'process.env.QUICK': JSON.stringify(process.env.QUICK),
    }),
    new HtmlWebpackPlugin({
        template: 'src/index.html',
        inject: true,
        favicon: "./src/assets/favicon.ico"
    }),
    new MiniCssExtractPlugin({
        filename: '[name].[chunkhash].css',
        chunkFilename: '[name].[chunkhash].chunk.css',
    }),
    new CopyPlugin({
        patterns: [
            {
                from: path.join(__dirname, "..", "..", "/src/_redirects"),
                to: "_redirects",
                toType: "file"
            },
        ]
    }),
].filter(Boolean);