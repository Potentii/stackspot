import {buildFetchResponse, mockDelay, mockFetch, mockRoot} from './__test_utils__.mjs';
import {jest} from '@jest/globals';



// *Setting up the mocks:
const fetchMock = mockFetch();
const delayMock = mockDelay();



// *Importing the modules after the mocks are set up:
const {default: StackspotAiQuickCommand} = await import('./stackspot-ai-quick-command.mjs');



describe('Stackspot - AI - Quick Command', () => {



	// *Resetting mocks before each test:
	beforeEach(() => {
		fetchMock.clear();
		delayMock.mockClear();
		jest.restoreAllMocks();
	});



	it('createExecution should return executionId (quotes stripped)', async () => {
		const root = mockRoot();
		const qc = new StackspotAiQuickCommand(root);

		fetchMock.pushResponse(buildFetchResponse({status: 200, text: '"exec-123"'}));

		const id = await qc.createExecution('my-qc', {x: 1}, 'conv-1');
		expect(id).toBe('exec-123');

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toContain('/v1/quick-commands/create-execution/my-qc');
		expect(init.method).toBe('post');
		expect(init.headers.Authorization).toBe('Bearer test-token');
	});



	it('createExecution should throw on API error', async () => {
		const root = mockRoot();
		const qc = new StackspotAiQuickCommand(root);

		fetchMock.pushResponse(buildFetchResponse({status: 500, text: 'boom'}));

		await expect(qc.createExecution('slug', 'input')).rejects.toMatchObject({
			name: 'StackspotApiError',
			code: 'QUICK_COMMAND_CREATE_EXECUTION_ERROR',
			status: 500,
			payload: 'boom',
		});
	});



	it('getExecution should return JSON execution object', async () => {
		const root = mockRoot();
		const qc = new StackspotAiQuickCommand(root);

		const exec = {progress: {status: 'IN_PROGRESS'}};
		fetchMock.pushResponse(buildFetchResponse({status: 200, json: exec}));

		const res = await qc.getExecution('exec-1');
		expect(res).toEqual(exec);

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toContain('/v1/quick-commands/callback/exec-1');
		expect(init.method).toBe('get');
		expect(init.headers.Authorization).toBe('Bearer test-token');
	});



	it('getExecution should throw on API error', async () => {
		const root = mockRoot();
		const qc = new StackspotAiQuickCommand(root);

		fetchMock.pushResponse(buildFetchResponse({status: 404, text: 'notfound'}));

		await expect(qc.getExecution('exec-x')).rejects.toMatchObject({
			name: 'StackspotApiError',
			code: 'QUICK_COMMAND_GET_EXECUTION_ERROR',
			status: 404,
			payload: 'notfound',
		});
	});



	it('pollExecution should loop until COMPLETED and return execution', async () => {
		const root = mockRoot();
		const qc = new StackspotAiQuickCommand(root);

		const callbacks = [
			buildFetchResponse({status: 200, json: {progress: {status: 'IN_PROGRESS'}}}),
			buildFetchResponse({status: 200, json: {progress: {status: 'COMPLETED'}}}),
		];
		// Two sequential GETs for getExecution
		fetchMock.pushResponse(callbacks[0]);
		fetchMock.pushResponse(callbacks[1]);

		const res = await qc.pollExecution('exec-1', {delay: 1});
		expect(res).toEqual({progress: {status: 'COMPLETED'}});
		expect(delayMock).toHaveBeenCalled();
	});



	it('pollExecution should throw when max attempts reached by retries', async () => {
		const root = mockRoot();
		const qc = new StackspotAiQuickCommand(root);

		// Always IN_PROGRESS so it will hit max retries
		fetchMock.pushResponse(buildFetchResponse({status: 200, json: {progress: {status: 'IN_PROGRESS'}}}));
		fetchMock.pushResponse(buildFetchResponse({status: 200, json: {progress: {status: 'IN_PROGRESS'}}}));
		fetchMock.pushResponse(buildFetchResponse({status: 200, json: {progress: {status: 'IN_PROGRESS'}}}));

		await expect(qc.pollExecution('exec-1', {maxRetries: 2, delay: 1})).rejects.toMatchObject({
			name: 'StackspotError',
			code: 'QUICK_COMMAND_EXECUTE_MAX_ATTEMPTS_REACHED_ERROR',
		});
	});



});
