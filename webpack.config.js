const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin')


module.exports = {
  entry: {
	  viewer: './src/Test/index.ts'
  },
  devtool: 'source-map',
  
  
  
  plugins: [
	    new CircularDependencyPlugin({
	      // exclude detection of files based on a RegExp
	      exclude: /a\.js|node_modules/,
	
	      // add errors to webpack instead of warnings
	      failOnError: false,
	      // allow import cycles that include an asyncronous import,
	      // e.g. via import(/* webpackMode: "weak" */ './file.js')
	      allowAsyncCycles: false,
	      // set the current working directory for displaying module paths
	      cwd: process.cwd(),
	    })
	  ],
  
  
  
  
  
  module: {
	rules: [
		{
		  test: /\.ts$/,
		  use: 'ts-loader',
		  exclude: /node_modules/,
		},
		{
		  enforce: 'pre',
		  test: /\.js$/,
		  loader: 'source-map-loader',
		  exclude: /node_modules/,
		},
	  ],
	  },
  resolve: {
	    extensions: [ '.tsx', '.ts', '.js' ],
	  },
  
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist')
    ,library: 'cmme',
    libraryTarget: 'umd'
  },
  mode:"development"
};
