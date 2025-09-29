import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    {
        rules: {
            '@typescript-eslint/no-explicit-any': 'off', // Disable the rule
            'quotes': ['error', 'single', {'avoidEscape': true}],
            'object-curly-spacing': ['error', 'never'],
            'no-multiple-empty-lines': ['error', {'max': 2}],
            'import/no-extraneous-dependencies': [
                'off', {
                    'devDependencies': [
                        '**/?(*.)+(spec|test).[mtj]s?(x)'
                    ]
                }
            ]
        },

    },
);
