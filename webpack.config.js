const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: 'production',
    entry: ['./src/index.js','./src/scss/main.scss'], 
    devServer: {
        port: 3000,
        host: 'localhost',
        historyApiFallback: true,
    },
    devtool: 'source-map',
    output: {
        filename: 'bundle.js',
        path: path.resolve('./public/dist'),
        publicPath: '/dist/',
    },
    module: {
        rules: [
            { 
                test: /.jsx$/,
                exclude: /node_modules/,
                use: { 
                    loader: 'babel-loader',
                    options: { 
                        presets: ['@babel/preset-react', '@babel/preset-env']
                    }
                }
            },
            { 
                test: /.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-react', '@babel/preset-env']
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]
            },
            {
                test: /\.css$/,
                use: [
                    process.env.NODE_ENV !== 'production' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: 'dist/[name].bundle.css',
            chunkFilename: "dist/[id].css"
        })
    ]
}
