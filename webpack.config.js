const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const path = require("path");

module.exports = {
    mode: "development",
    devtool: "inline-source-map",
    entry: {
        IntelliSearch: "./src/SearchClient.ts",
        "IntelliSearch.min": "./src/SearchClient.ts"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
        libraryTarget: "umd",
        library: "IntelliSearch",
        umdNamedDefine: true
    },
    resolve: {
        mainFields: ["browser", "module", "main"],
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: [".ts", ".tsx", ".js"]
    },
    plugins: [
        new UglifyJsPlugin({
            sourceMap: true,
            include: /\.min\.js$/
        })
    ],
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
        ]
    },
    watch: false,
    watchOptions: {
        aggregateTimeout: 300, // The default
        ignored: ["dist", "es", "lib", "doc", "samples", "node_modules"]
    }
};
