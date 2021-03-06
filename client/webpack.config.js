var webpack = require('webpack')
var path = require('path')
var WebpackChunkHash = require('webpack-chunk-hash')
var InlineChunkPlugin = require('html-webpack-inline-chunk-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var WebpackAutoInject = require('webpack-auto-inject-version')

// Should resolve to the docroot subdirectory of the working directory
var BUILD_DIR = path.resolve(__dirname, 'docroot')
// Should resolve to the src subdirectory of the working directory
var APP_DIR = path.resolve(__dirname, 'src')

/* Leftover snippets from trying to get dynamic loading of chunks working
    'js/Home': APP_DIR + '/user/Home.jsx',
    'js/User': APP_DIR + '/user/User.jsx'
    filename: '[name].[chunkhash].js',
    chunkFilename: "[chunkhash].js"
*/

// This regular expression defines how to split the application into
// chunks. It currently looks for components that are routes (.jsx files
// in /routes directories. It should not be changed without changing how
// dynmaic loading of chunks works within index.jsx.
var routeComponentRegex = /routes\/([^/]+\/?[^/]+).jsx/

var config = {
  // Tells webpack to generate a source map for debugging. Could be hidden
  // behind a production switch, as the source map is not needed for
  // production
  devtool: 'source-map',
  // Root of the dependency try, key of the object will be the root of
  // thie filename of the main chunk
  entry: {
    'main': APP_DIR + '/index.jsx'
  },
  output: {
    path: BUILD_DIR,
    // Filename template applies to all chunks, including vendor. Path is
    // prefixed to continue to allow all chunks to be stored in the same
    // directory.
    filename: 'js/[name].[chunkhash].js',
    // Chunk plugin suggests that .chunk. should be replace with .[chunkhash]. to
    // assist the browswer with understanding what it can cache. Right now that
    // is a potential future optimization, given how long it took to get this
    // configuration working.
    chunkFilename: 'js/[id].chunk.js',
    // publicPath is necessary to ensure that dynamic chunk loading happens from the
    // same directory rather than nested directories that align to the source structure
    publicPath: '/base/ui/'
  },
  // Setting for webpack-dev-server to make the browserHistory component of
  // react-router to work
  devServer: {
    historyApiFallback: true
  },
  // Allows import statements to omit file suffixes for both js and .jsx files
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    // Reads NODE_ENV from the environment where webpack is invoked, and replaces
    // process.env.NODE_ENV within application source with its value. Used to
    // define environment-specific behavior
    new webpack.DefinePlugin({
      'process.env': {
        // During build replace process.env.NODE_ENV with contents of NODE_ENV
        // environment variable present when webpack was run
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        // During build replace process.env.URL_ROOT with contents of URL_ROOT
        // environment variable present when webpack was run
        'URL_ROOT': JSON.stringify(process.env.URL_ROOT),
        // During build replace process.env.API_ROOT with contents of API_ROOT
        // environment variable present when webpack was run
        'API_ROOT': JSON.stringify(process.env.API_ROOT)
      }
    }),
    // Will auto-inject application version number from package.json, but
    // TODO: Fix regexp for updated bundle filename(s); this should be main(something)
    new WebpackAutoInject({autoIncrease: false, injectByTagFileRegex: /^bundle\.js$/}),
    // Should package all contents of node_modules (3rd party components) in a separate
    // chunk withe a filename prefixed with vendor
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor'],
      minChunks: function (module) {
        return module.context && module.context.indexOf('node_modules') !== -1
      }
    }),
    // Generates a hash token on each build of a bundle; should not change unless
    // source changes. Assists browsers with caching unchanged code between reloads
    new WebpackChunkHash(),
    // Updates HTML file during build, and will inject the <script> tag to include
    // both the main javascript file (continaing the applicatino) and vendor javascript
    // file (containing 3rd party code)
    new HtmlWebpackPlugin({
      template: APP_DIR + '/html/index.html',
      filename: BUILD_DIR + '/index.html',
      inject: true
    }),
    // Generates the manifest that identifies the specific builds of main and vendor
    // to embed in the HTML
    new InlineChunkPlugin({
      inlineChunks: ['manifest']
    })
  ],
  module: {
    loaders: [
      // Loader specification for JSX files that are not named routes
      // Note that this includes the required babel presets for react
      // and ES6 / ES2015, so a .babel_preset file is not required
      {
        test: /\.jsx$/,
        include: APP_DIR,
        loader: 'babel-loader',
        exclude: routeComponentRegex,
        query: {
//          cacheDirectory: true,
          presets: ['react', 'es2015'],
          env: {
            development: {
              plugins: [
                ['react-intl', {
                  messagesDir: './docroot/messages/'
                }]
              ]
            }
          }
        }
      },
      // Loader specification for JSX files that are named routes
      // Note that this applies the lazy bundle loader first
      // Note that this includes the required babel presets for react
      // and ES6 / ES2015, so a .babel_preset file is not required
      {
        test: routeComponentRegex,
        include: APP_DIR,
//        loaders: ['bundle-loader?lazy', 'babel-loader?presets[]=react,presets[]=es2015']
        loaders: ['bundle-loader?lazy', 'babel-loader?' + JSON.stringify({
          presets: ['react', 'es2015'],
          env: {
            development: {
              plugins: [
                ['react-intl', { messagesDir: './docroot/messages' }]
              ]
            }
          }
        })]
      },
      // Loader specification for .js files, assumes they are ES6 / ES2015
      {
        test: /\.js$/,
        include: APP_DIR,
        loader: 'babel-loader',
        exclude: routeComponentRegex,
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.png$/,
        loader: 'url-loader?limit=100000'
      },
      {
        test: /\.jpg$/,
        loader: 'file-loader'
      },
      {
        test: /\.gif$/,
        loader: 'file-loader'
      },
      {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff&name=[name].[ext]'
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=application/octet-stream&name=[name].[ext]'
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader'
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&mimetype=image/svg+xml'
      },
      {
        test: /\.less$/,
        loaders: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  }
}

module.exports = config
