const path = require('path')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'
const isProd = !isDev
const filename = ext => isDev ? `[name].${ext}` : `[name].[hash].${ext}`
const cssLoaders = extra => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                hmr: isDev,
                reloadAll: true,
            },
        },
        'css-loader',
    ]

    if (extra) {
        loaders.push(extra)
    }

    return loaders
}

const optimization = () => {
    const config = {
        splitChunks: {
            chunks: 'all',
        },

    }
    if (isProd) {
        config.minimizer = [
            new OptimizeCssAssetWebpackPlugin(),
            new TerserWebpackPlugin()
        ]
    }

    return config
}

const babelOptions = preset => {
    const opts = {
        presets: [
            '@babel/preset-env'
        ],
        plugins: [
            '@babel/plugin-proposal-class-properties'
        ]
    }

    if (preset) {
        opts.presets.push(preset)
    }

    return opts
}


const jsLoaders = () => {
    const loaders = [{
        loader: 'babel-loader',
        options: babelOptions()
    }]
    if (isDev){
        loaders.push('eslint-loader')
    }
    return loaders
}


module.exports = {
    context: path.resolve(__dirname, 'src'),
    mode: 'development',
    entry: {
        main: ['@babel/polyfill', './index.js'],
        // second: ['@babel/polyfill', './pages/second/second.js'],
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: filename('js'),
        // publicPath: "../../"
    },
    resolve: {
        extensions: ['.js', '.json', '.png'],
        // alias: {}
    },
    optimization: optimization(),
    devtool: isDev ? 'source-map' : '',
    devServer: {
        // contentBase: path.join(__dirname,'src'),
        // contentBase: 'src/pages/main',
        // openPage: ['./pages/main/index.html'],
        // watchContentBase: true,
        port: 8080,
        hot: isDev,
    },
    plugins: [
        new HTMLWebpackPlugin({
            // filename: "index.html",
            template: './index.html',
            // chunks: ["index"],
            minify: {
                collapseWhiteSpace: isProd
            }
        }),
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: filename('css'),
        }),
        new MiniCssExtractPlugin({
            filename: filename('css'),
        }),
        // new CopyWebpackPlugin({
        //         patterns: [
        //             {
        //                 from: path.resolve(__dirname, 'src/assets'),
        //                 to: path.resolve(__dirname, 'build/assets'),
        //             }
        //         ]
        //     }
        // )
    ],
    module: {
        rules: [
            {
                test: /\.(png|jpg|svg|gif|mp3|mpe?g)$/,
                use: ['file-loader'],
                // use: [{
                //     loader: 'file-loader',
                //     options: {
                //         name: "[name].[ext]",
                //         outputPath: 'assets/images'
                //     }
                // }]
            },
            {
                test: /\.(mp3|mpe?g)$/,
                use: ['url-loader'],
            },

            {
                test: /\.(ttf|woff|woff2|eot)$/,
                use: ['file-loader']
            },
            {
                test: /\.xml$/,
                use: ['xml-loader']
            },
            {
                test: /\.csv$/,
                use: ['csv-loader']
            },
            {
                test: /\.css$/,
                use: cssLoaders()
            },
            {
                test: /\.less$/,
                use: cssLoaders('less-loader')
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: jsLoaders(),
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: babelOptions('@babel/preset-typescript')
            },
        ]
    }
}

