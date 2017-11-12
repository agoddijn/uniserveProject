
var webpack = require('webpack');
var path = require("path");

module.exports = {
    entry:  [
        'react-hot-loader/patch',
        './src/index.tsx'     
    ],

    output: {
        filename: "bundle.js",
        path: path.join(__dirname, "/build"),
        publicPath: "/build/",        
    },

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json"]
    },

    module: { 
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, 
                loaders: ["awesome-typescript-loader"], 
                include: path.join(__dirname, 'src'),
                exclude: path.resolve(__dirname, 'node_modules')
            }
        ]
    },

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
              'NODE_ENV': JSON.stringify('staging')
            }
          })
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
