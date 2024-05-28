import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
    {
        languageOptions: { 
            globals: globals.browser 
        },
        rules: {
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
            'eqeqeq': 'error',
            'no-console': 'warn',
            'no-sparse-arrays': 'warn',
            'no-cond-assign': 'warn', 
            'no-constant-condition': 'warn',
            'brace-style': 'error',
            'no-template-curly-in-string': 'error',
            'yoda': 'error'
        }
  
    },
    pluginJs.configs.recommended,
];