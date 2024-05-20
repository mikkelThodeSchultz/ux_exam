// eslint-disable-next-line no-undef
module.exports = {
    'env': {
        'browser': true,
        'es2021': true
    },
    'extends': 'eslint:recommended',
    'overrides': [
    ],
    'parserOptions': {
        'ecmaVersion': 'latest',
        'sourceType': 'module',
    },
    'rules': {
        'indent': [
            'error',
            4
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],
        'no-var': ['error'],
        'prefer-const':[ 'error'],
        'no-unused-vars':[ 'error'],
        'valid-typeof': ['error'],
        'for-direction': ['error'],
        'no-dupe-else-if': ['error'],
        'no-duplicate-case': ['error'],
        'no-dupe-keys': ['error'],
        'no-unneeded-ternary':['error'],
        'camelcase': 'error', 
        'eqeqeq': 'error',
        'no-console': 'warn',
        'no-sparse-arrays': 'warn',
        'no-cond-assign': 'warn', 
        'no-constant-condition': 'warn',
        'brace-style': 'error',
        'no-template-curly-in-string': 'error',
        'yoda': 'error'

    }
};
