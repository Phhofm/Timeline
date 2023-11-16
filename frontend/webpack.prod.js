const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
//const JavaScriptObfuscator = require('webpack-obfuscator');

module.exports = merge(common, {
    mode: 'production', // loads TerserPlugin, configures DefinePlugin  -> 1.1MB
    plugins: [
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.optimize\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorPluginOptions: {
                preset: ['default', {
                    discardComments: {
                        removeAll: true
                    }
                }],
            },
            canPrint: true
        }),
        /*
        new JavaScriptObfuscator ({
            rotateUnicodeArray: true,
            obfuscatorOptions:{
                compact: true,
                controlFlowFlattening: false,
                controlFlowFlatteningThreshold: 0.75,
                deadCodeInjection: false,
                deadCodeInjectionThreshold: 0.4,
                debugProtection: true,
                debugProtectionInterval: false,
                disableConsoleOutput: true,
                domainLock: [],
                identifierNamesGenerator: 'mangled',
                identifiersPrefix: '',
                inputFileName: '',
                log: false,
                renameGlobals: false,
                reservedNames: [],
                reservedStrings: [],
                rotateStringArray: true,
                seed: 0,
                selfDefending: true,
                sourceMap: false,
                sourceMapBaseUrl: '',
                sourceMapFileName: '',
                sourceMapMode: 'separate',
                stringArray: true,
                stringArrayEncoding: false,
                stringArrayThreshold: 0.75,
                target: 'browser',
                transformObjectKeys: false,
                unicodeEscapeSequence: false
            },
        }, [])
        */
    ],
    optimization: {
        moduleIds: 'hashed',
        minimize: true,
        minimizer: [
            new TerserPlugin({
                cache: true,
                parallel: true,
                sourceMap: false, // Must be set to true if using source-maps in production
                terserOptions: {
                    toplevel: true,
                    output: {
                        comments: false,
                    },
                },
                extractComments: false,
            }),
        ],
    }
});