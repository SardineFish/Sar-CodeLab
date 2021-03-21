const path = require("path");
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
    // mode:"production",
    entry: {
        main: "./src/main.ts",
    },
    devtool: "source-map",
    output: {
        path: path.resolve(__dirname, "build"),
        filename: "[name].js",
        publicPath: "build/"
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }, {
                test: /\.ttf$/,
                use: ['file-loader']
            }
        ]
    },
    plugins: [
        new MonacoWebpackPlugin({
            publicPath: "build"
        })
    ]
};