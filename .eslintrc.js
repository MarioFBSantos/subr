module.exports = {
	settings: {
		jest: {
			version: require('jest/package.json').version,
		},
	},
	env: {
		browser: true,
		es2021: true,
		'jest/globals': true,
	},
	extends: [
		'standard',
		'plugin:prettier/recommended',
		'plugin:jest/recommended',
		'plugin:jest/style',
		'plugin:jest/all',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 12,
		sourceType: 'module',
	},
	plugins: ['@typescript-eslint', 'prettier', 'jest'],
	rules: {
		'prettier/prettier': ['error', { endOfLine: 'auto' }, 0],

		// jest

		'jest/no-disabled-tests': 'warn',
		'jest/no-focused-tests': 'error',
		'jest/no-identical-title': 'error',
		'jest/prefer-to-have-length': 'warn',
		'jest/valid-expect': 'error',
		'jest/no-hooks': 'off',
		'jest/prefer-expect-assertions': 'off',
		'jest/require-hook': 'off',

		'object-shorthand': ['error', 'always'],
		'no-unused-vars': 'off',
		'new-cap': 'off',
		'@typescript-eslint/interface-name-prefix': 'off',
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/explicit-module-boundary-types': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'refer-promise-reject-errors': 'off',
		'no-useless-constructor': 'off',
		'no-async-promise-executor': 'off',
		'no-fallthrough': 'off',
		'@typescript-eslint/no-useless-constructor': 'off',
	},
};
