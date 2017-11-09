
var webpack = require('webpack');
var path = require("path");

module.exports = {
    entry:  [
        'react-hot-loader/patch',
        './src/index.tsx'     
    ],

    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "/dist"),
        publicPath: "/dist/",        
    },

    // Enable sourcemaps for debugging webpack's output.
    // Use: 'cheap-module-source-map' for source maps or 'eval' for speed
    devtool: 'eval',  

    devServer: {
        port: 8080,
        hot: true,
        proxy: {
            "/login": "http://localhost:3035",
            "/logout": "http://localhost:3035",
            "/ajax": "http://localhost:3035"
        }
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: { 
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, 
                loaders: ['react-hot-loader/webpack', "awesome-typescript-loader"], 
                include: path.join(__dirname, 'src'),
                exclude: path.resolve(__dirname, 'node_modules')
            }
        ]
    },

    plugins: [
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
              'NODE_ENV': JSON.stringify('development')
            }
          }),

    ],

    // When importing a module whose path matches one of the following, just
    // assume a corresponding global variable exists and use that instead.
    // This is important because it allows us to avoid bundling all of our
    // dependencies, which allows browsers to cache those libraries between builds.
    externals: {
        "react": "React",
        "react-dom": "ReactDOM"
    },
};
