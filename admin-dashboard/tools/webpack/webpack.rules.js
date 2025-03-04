const {inDev} = require('./webpack.helpers');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = [
    {
        // Typescript loader with Babel integration
        test: /\.tsx?$/,
        exclude: /(node_modules|\.webpack)/,
        use: [
            {
                loader: 'babel-loader', // Add Babel loader first
                options: {
                    presets: ['@babel/preset-react'], // Ensure React preset is included
                    plugins: [
                        {
                            visitor: {
                                JSXElement(path) {
                                    // Handle TText replacement
                                    if (path.node.openingElement.name.name === 'TText') {
                                        path.node.openingElement.name.name = 'p';
                                    }

                                    // Handle font family modification (with checks)
                                    const styles = path.node.openingElement.attributes.find(
                                        (attr) => attr.name.name === 'style'
                                    );

                                    if (styles && typeof styles.value === 'string') {  // Ensure styles.value is a string
                                        const updatedStyles = styles.value.replace(/Raleway_(\d{3})[^\s]*/g, (match) => {
                                            // Check if the match starts with "Raleway_"
                                            if (match.startsWith('Raleway_')) {
                                                return 'Raleway';
                                            } else {
                                                // Return the original match if it doesn't start with "Raleway_"
                                                return match;
                                            }
                                        });

                                        // Only update if the style actually changed
                                        if (updatedStyles !== styles.value) {
                                            styles.value = updatedStyles;
                                        }
                                    }
                                },
                            },
                        },
                    ],
                },
            },
            {
                loader: 'ts-loader', // TypeScript loader remains
                options: {
                    transpileOnly: true,
                    allowTsInNodeModules: true,
                },
            },
        ],
    },

    {
        test: /\.(js)x?$/,
        exclude: /(node_modules|\.webpack)/,
        use: {
            loader: "babel-loader",
            options: {
                // Disable reading babel configuration
                configFile: false,

                // The configuration for compilation
                presets: [
                    ['@babel/preset-env', {useBuiltIns: 'usage'}],
                    '@babel/preset-react',
                    '@babel/preset-flow',
                    "@babel/preset-typescript"
                ],
                plugins: [
                    '@babel/plugin-proposal-class-properties',
                    '@babel/plugin-proposal-object-rest-spread',
                    {
                        visitor: {
                            JSXElement(path) {
                                // Handle TText replacement
                                if (path.node.openingElement.name.name === 'TText') {
                                    path.node.openingElement.name.name = 'p';
                                }

                                // Handle font family modification (with checks)
                                const styles = path.node.openingElement.attributes.find(
                                    (attr) => attr.name.name === 'style'
                                );

                                if (styles && typeof styles.value === 'string') {  // Ensure styles.value is a string
                                    const updatedStyles = styles.value.replace(/Raleway_(\d{3})[^\s]*/g, (match) => {
                                        // Check if the match starts with "Raleway_"
                                        if (match.startsWith('Raleway_')) {
                                            return 'Raleway';
                                        } else {
                                            // Return the original match if it doesn't start with "Raleway_"
                                            return match;
                                        }
                                    });

                                    // Only update if the style actually changed
                                    if (updatedStyles !== styles.value) {
                                        styles.value = updatedStyles;
                                    }
                                }
                            },
                        },
                    },
                ],
            },
        },
    },
    {
        // CSS Loader
        test: /\.css$/,
        use: [
            {loader: inDev() ? 'style-loader' : MiniCssExtractPlugin.loader},
            {loader: 'css-loader'},
        ],
    },
    {
        // SCSS (SASS) Loader
        test: /\.s[ac]ss$/i,
        use: [
            {loader: inDev() ? 'style-loader' : MiniCssExtractPlugin.loader},
            {loader: 'css-loader'},
            {loader: 'sass-loader'},
        ],
    },
    {
        // Less loader
        test: /\.less$/,
        use: [
            {loader: inDev() ? 'style-loader' : MiniCssExtractPlugin.loader},
            {loader: 'css-loader'},
            {loader: 'less-loader'},
        ],
    },
    {
        // Assets loader
        // More information here https://webpack.js.org/guides/asset-modules/
        test: /\.(gif|jpe?g|tiff|png|webp|bmp|svg|eot|ttf|woff|woff2)$/i,
        type: 'asset',
        generator: {
            filename: 'assets/[hash][ext][query]',
        },
    },
];