module.exports = function(wallaby) {

    return {
        files: [
            'src/**/*.ts',
            'src/**/*.json',
            'setupJest.js',
            '!src/**/*.spec.ts'
        ],

        tests: [
            'src/**/*.spec.ts',
        ],
        env: {
            type: 'node',
            runner: 'node',
        },
        testFramework: 'jest',
        compilers: {
            '**/*.ts': wallaby.compilers.typeScript({
              module: 'commonjs',
            })
          },
    };
};