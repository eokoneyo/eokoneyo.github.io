const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const cpy = require('cpy');
const ManifestPlugin = require('webpack-manifest-plugin');

let jekyllConfigFileContents;

try {
    jekyllConfigFileContents = fs.readFileSync('./_config.yml', 'utf-8');
} catch (e) {
    console.log(e);
    process.exit(1);
}

const { webpack: jekyllWebpackConfig } = yaml.safeLoad(jekyllConfigFileContents);

module.exports = {
    mode: process.env.JEKYLL_ENV  === 'production' ? 'production' : 'development',
    entry: path.join(__dirname, jekyllWebpackConfig.entry),
    output: {
        filename: '[name]-bundle.[contenthash].js',
        path: path.resolve(__dirname, jekyllWebpackConfig.cache_directory),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader'
                }
            }
        ]
    },
    optimization: {
        noEmitOnErrors: true,
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        },
        runtimeChunk: {
            name: 'runtime'
        }
    },
    plugins: [
        new ManifestPlugin(),
        function() {
            // This makes the files webpack generated available to jekyll and our jekyll plugin,
            // so the assets might be copied
            this.plugin("done", async () => {
                await cpy(path.join(jekyllWebpackConfig.cache_directory, 'manifest.json'), path.join('_data') , {
                    rename: () => 'webpack-manifest.json'
                })
            });
        }
    ]
};
