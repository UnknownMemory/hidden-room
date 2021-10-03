const webpack = require('webpack');
const path = require('path');
const dotenv = require('dotenv').config({path: path.join(__dirname, '.env')});
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        app: './src/index.js',
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        publicPath: '/',
        filename: 'bundle.js',
    },
    devServer: {
        static: './',
        historyApiFallback: true,
        port: 8081,
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.scss$/,
                include: [path.resolve(__dirname, 'src/sass')],
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
            },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(dotenv.parsed),
        }),
        new HtmlWebpackPlugin({
            template: __dirname + '/index.html',
            filename: 'index.html',
            inject: 'body',
        }),
        new MiniCssExtractPlugin({
            filename: 'style.css',
            chunkFilename: '[id].css',
        }),
    ],
};
