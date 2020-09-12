const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const cpy = require('cpy');
const webpack = require('webpack');
const getLogger = require('webpack-log');
const TerserPlugin = require('terser-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

const logger = getLogger({ name: 'webpack-batman' });

/**
 * @typedef jekyllWebpackConfig
 * @property entry {string}
 * @property cache_directory {string}
 * @property output {{ path: string}}
 */

/**
 * @typedef jekyllSearchDataConfig
 * @property filename {string}
 * @property output_path {string}
 */

/**
 * @type {{
 *   webpack: jekyllWebpackConfig,
 *   search_data: jekyllSearchDataConfig
 * }}
 */
let jekyllConfigFileContents;

try {
  jekyllConfigFileContents = yaml.safeLoad(
    fs.readFileSync('./_config.yml', 'utf-8')
  );
} catch (e) {
  logger.warn(e);
  process.exit(1);
}

const {
  webpack: jekyllWebpackConfig,
  search_data: searchData,
} = jekyllConfigFileContents;

module.exports = {
  mode: process.env.JEKYLL_ENV === 'production' ? 'production' : 'development',
  entry: jekyllWebpackConfig.entry.map((entryItem) =>
    path.join(__dirname, entryItem)
  ),
  output: {
    filename: '[name]-bundle.[contenthash:8].js',
    path: path.resolve(__dirname, jekyllWebpackConfig.cache_directory),
    publicPath: path.join('/', jekyllWebpackConfig.output.path),
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
      {
        test: /\.(t|(m?j))s$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  devtool: process.env.JEKYLL_ENV === 'production' ? false : 'source-map',
  optimization: {
    moduleIds: 'hashed',
    noEmitOnErrors: true,
    usedExports: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          // only create vendors for file that is not a stylesheet
          test: /node_modules\/(?!(.*\.(sa|sc|c)ss$))/,
          name: 'vendors',
          chunks: 'initial',
        },
      },
    },
    runtimeChunk: {
      name: 'runtime',
    },
    minimize: process.env.JEKYLL_ENV === 'production',
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
    }),
    new ManifestPlugin({
      // Only list main chunks and assets and exclude dynamic imports,
      // since we use the generated list to add scripts to our app
      filter: ({ isInitial, isAsset }) => {
        return isAsset || isInitial;
      },
    }),
    new InjectManifest({
      swDest: 'sw.js',
      swSrc: path.join(__dirname, 'assets', '_js/sw/index.js'),
      exclude: [/\.map$/],
    }),
    new webpack.DefinePlugin({
      // define value of path to search data from _config.yml for use in serviceworker
      __SEARCH_DATA_PATH__: JSON.stringify(
        path.join('/', searchData.output_path, searchData.filename)
      ),
    }),
    function provideMetaForJekyll() {
      this.hooks.done.tap(
        'provide-meta-for-jekyll',
        async ({ hash: buildHash }) => {
          // Save build hash for use within the app
          fs.writeFileSync(
            path.join(__dirname, '_data', 'version.yml'),
            `hash: "${buildHash}"`
          );

          // This makes a list of the files webpack generated available to jekyll
          // and our jekyll plugin, so the assets might be copied
          await cpy(
            path.join(jekyllWebpackConfig.cache_directory, 'manifest.json'),
            path.join('_data'),
            {
              rename: () => 'webpack-manifest.json',
            }
          );

          logger.debug('Jekyll injected with build meta...');
        }
      );
    },
  ],
};
