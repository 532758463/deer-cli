

let config = {
    presets: ['@babel/preset-env', '@babel/preset-typescript', '@babel/preset-react'],
    plugins: ['@babel/plugin-transform-runtime'],
};
if (process.env.NODE_ENV_TEST !== 'true') {
    config = {
        presets: [
            [
                '@babel/preset-env',
                {
                    modules: true,
                    targets: {
                        browsers: [
                            'chrome >= 30',
                            'firefox >= 30',
                            'ie >= 11',
                            'safari >= 7',
                            'ios >= 6',
                            'android >= 4',
                        ],
                    },
                    useBuiltIns: 'usage',
                    corejs: { version: 3, proposals: true },
                },
            ],
            '@babel/preset-typescript',
            '@babel/preset-react',
        ],
        plugins: [
            '@babel/plugin-transform-runtime',
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            '@babel/proposal-class-properties',
        ],
    };
}
module.exports = config;