import {defaults} from 'jest-config';

/**
 * @type {import('jest').Config}
 */
export default {
	verbose: false,
	moduleFileExtensions: [...defaults.moduleFileExtensions, 'mjs'],
	testRegex: `\.test\.mjs$`,
	transform: {}
};