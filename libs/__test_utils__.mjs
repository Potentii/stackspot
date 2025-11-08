// Shared test utilities for mocking node-fetch and creating simple streams
import EventEmitter from 'eventemitter3';
import {jest} from '@jest/globals';



export function mockFetch() {
	const fetchMock = makeFetchMock();
	jest.unstable_mockModule('node-fetch', () => ({ default: fetchMock }));

	return fetchMock;
}



export function mockDelay() {
	const delayMock = jest.fn(async () => {});
	jest.unstable_mockModule('./utils.mjs', () => ({delay: delayMock}));

	return delayMock;
}



export function mockRoot(overrides = {}) {
	return {
		realm: 'test-realm',
		clientId: 'test-client-id',
		clientSecret: 'test-client-secret',
		agent: undefined,

		auth: {
			getAccessToken: async () => 'test-token',
		},
		ai: {
			openUploadContentForm: jest.fn(async () => ({ url: 'https://upload.example/form', form: { k: 'v' } })),
			uploadContent: jest.fn(async () => {}),
		},
		...overrides,
	};
}


/**
 * A simple mock stream using EventEmitter with on('data'|'error'|'close')
 */
export function createMockStream() {
	const emitter = new EventEmitter();
	// attach on to mimic Node.js streams
	return {
		on: (evt, handler) => {
			emitter.on(evt, handler);
		},
		emit: (evt, ...args) => emitter.emit(evt, ...args),
	};
}


/**
 * Build a mock Response-like object for fetch with status/json/text/body
 */
export function buildFetchResponse({status = 200, json, text, body} = {}) {
	return {
		status,
		async json() {
			if (json instanceof Error) throw json;
			return typeof json === 'function' ? json() : json;
		},
		async text() {
			if (text instanceof Error) throw text;
			return typeof text === 'function' ? text() : (text ?? (json != null ? JSON.stringify(json) : ''));
		},
		body,
	};
}


/**
 * Create a controllable fetch mock that pops responses from a queue
 */
export function makeFetchMock(queue = []) {
	const fn = jest.fn(async () => {
		if (queue.length === 0) throw new Error('Fetch mock queue is empty');
		const next = queue.shift();
		if (typeof next === 'function') return next();
		return next;
	});
	fn.pushResponse = (res) => queue.push(res);
	fn.clear = () => {
		queue.length = 0;
		if (typeof fn.mockClear === 'function') fn.mockClear();
	};
	return fn;
}
