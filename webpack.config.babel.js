import path from 'path'

export default {
    entry: ['babel-polyfill', './src/main.js'],
    target: 'web',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'app.js',
    },
    module: {
        loaders: [
            {
                test: /\.jsx?/,
                loader: 'babel',
                exclude: [/node_modules/],
            },
            {
                test: /\.json/,
                loader: 'json',
                exclude: [/node_modules/],
            }
        ],
        preLoaders: [
            {
                test: /\.jsx?$/,
                loader: 'eslint',
                exclude: [/node_modules/],
            },
        ],
    },
    devtool: 'source-map',
    resolve: {
        root: path.resolve(__dirname),
        alias: {
            app: 'src',
        },
        extensions: ['', '.js', '.jsx']
    },
}
