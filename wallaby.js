module.exports = function(w) {

    return {
        files: [
            'src/**/*.ts',
            'test/**/*.json'
        ],

        tests: [
            'test/**/*.spec.ts',
        ],
        env: {
            type: 'node',
            runner: 'node',
        },
        testFramework: 'jest',
    };
};