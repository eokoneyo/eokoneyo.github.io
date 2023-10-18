const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const webpack = require('webpack');
const getLogger = require('webpack-log');
const Dotenv = require('dotenv-webpack');
const TerserPlugin = require('terser-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { InjectManifest } = require('workbox-webpack-plugin');

const webpackLogger = getLogger({ name: 'webpack-batman' });

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
  jekyllConfigFileContents = yaml.load(
    fs.readFileSync('./_config.yml', 'utf-8')
  );
} catch (e) {
  webpackLogger.warn(e);
  process.exit(1);
}

const { webpack: jekyllWebpackConfig, search_data: searchData } =
  jekyllConfigFileContents;

/**
 *
 * @type {import('webpack').WebpackOptionsNormalized}
 */
module.exports = {
  mode: process.env.JEKYLL_ENV === 'production' ? 'production' : 'development',
  entry: jekyllWebpackConfig.entry.map((entryItem) =>
    path.join(__dirname, entryItem)
  ),
  stats: process.env.JEKYLL_ENV === 'production' ? "errors-only" :  "normal",
  output: {
    filename: '[name]-bundle.[contenthash:8].js',
    path: path.resolve(__dirname, jekyllWebpackConfig.cache_directory),
    publicPath: path.join('/', jekyllWebpackConfig.output.path),
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        type: 'javascript/auto',
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          { loader: 'css-loader' },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.((sv|pn|jpe?)g|gif)$/i,
        type: 'asset/resource',
        generator: {
          // special config to ensure process img assets as the original path
          // since jekyll handles copying files in our assets' directory already
          filename: '[folder]/[name].[ext]',
          emit: false,
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][ext]',
        },
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
    moduleIds: 'deterministic',
    emitOnErrors: false,
    usedExports: true,
    splitChunks: {
      cacheGroups: {
        default: false,
        defaultVendors: {
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
          compress: {},
          format: {
            comments: false,
          },
          safari10: true
        },
        extractComments: {
          condition: /@preserve|@license|@cc_on/i,
          filename: (fileData) => `${path.basename(fileData.filename, '.js')}.LICENSE.txt`,
          banner: (licenseFile) => `License information can be found in ${licenseFile}`,
        },
      }),
    ],
  },
  plugins: [
    new Dotenv({
      systemvars: process.env.JEKYLL_ENV === 'production',
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
    }),
    new WebpackManifestPlugin({
      // Only list main chunks and assets, allowing us to exclude dynamic imports,
      // since we use the generated list to add scripts to our app
      filter: ({ isInitial, isAsset }) => isAsset || isInitial,
    }),
    new InjectManifest({
      swDest: 'sw.js',
      swSrc: path.join(__dirname, 'assets', '_scripts/sw/index.ts'),
      exclude: [/\.map$/],
    }),
    new webpack.DefinePlugin({
      // define value of path to search data from _config.yml for use in serviceworker
      __SEARCH_DATA_PATH__: JSON.stringify(
        path.join('/', searchData.output_path, searchData.filename)
      ),
      'process.env.NODE_ENV': JSON.stringify(
        process.env.JEKYLL_ENV || 'development'
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

          const cpy = (await import('cpy')).default

          // This makes a list of the files webpack generated available to jekyll
          // and our jekyll plugin, so the assets might be copied
          await cpy(
            path.join(jekyllWebpackConfig.cache_directory, 'manifest.json'),
            path.join('_data'),
            {
              flat: true,
              rename: (basename) => `webpack-${basename}`,
            }
          );

          webpackLogger.debug('Jekyll injected with build meta...');
        }
      );
    },
  ],
};
