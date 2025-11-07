import {buildFetchResponse, createMockStream, mockFetch, mockRoot} from './__test_utils__.mjs';
import {jest} from '@jest/globals';



// *Setting up the mocks:
const fetchMock = mockFetch();



// *Importing the modules after the mocks are set up:
const {default: StackspotAiAgents} = await import('./stackspot-ai-agents.mjs');



describe('Stackspot - AI - Agents', () => {



	// *Resetting mocks before each test:
	beforeEach(() => {
		fetchMock.clear();
		jest.restoreAllMocks();
	});



	it('sendPrompt should return JSON on success', async () => {
		const root = mockRoot();
		const agents = new StackspotAiAgents(root);

		const payload = {message: 'ok'};
		fetchMock.pushResponse(buildFetchResponse({status: 200, json: payload}));

		const res = await agents.sendPrompt('agent-1', 'hello');
		expect(res).toEqual(payload);

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toContain('/v1/agent/agent-1/chat');
		expect(init.method).toBe('post');
		const body = JSON.parse(init.body);
		expect(body.streaming).toBe(false);
	});



	it('sendPrompt should throw permission error when 403', async () => {
		const root = mockRoot();
		const agents = new StackspotAiAgents(root);

		fetchMock.pushResponse(buildFetchResponse({status: 403, text: 'forbidden'}));

		await expect(agents.sendPrompt('agent-1', 'hi')).rejects.toMatchObject({
			name: 'StackspotApiError',
			code: 'AGENTS_SEND_PROMPT_PERMISSION_ERROR',
			status: 403,
			payload: 'forbidden',
		});
	});



	it('sendPrompt should throw generic error for other status', async () => {
		const root = mockRoot();
		const agents = new StackspotAiAgents(root);

		fetchMock.pushResponse(buildFetchResponse({status: 500, text: 'boom'}));

		await expect(agents.sendPrompt('agent-1', 'hi')).rejects.toMatchObject({
			name: 'StackspotApiError',
			code: 'AGENTS_SEND_PROMPT_ERROR',
			status: 500,
			payload: 'boom',
		});
	});



	it('sendPromptStreamingRaw should return stream body', async () => {
		const root = mockRoot();
		const agents = new StackspotAiAgents(root);

		const stream = createMockStream();
		fetchMock.pushResponse(buildFetchResponse({status: 200, body: stream}));

		const res = await agents.sendPromptStreamingRaw('a1', 'hi');
		expect(res).toBe(stream);
	});



	it('sendPromptStreamingRaw should throw permission error when 403', async () => {
		const root = mockRoot();
		const agents = new StackspotAiAgents(root);

		fetchMock.pushResponse(buildFetchResponse({status: 403, text: 'nope'}));

		await expect(agents.sendPromptStreamingRaw('a1', 'hi')).rejects.toMatchObject({
			name: 'StackspotApiError',
			code: 'AGENTS_SEND_PROMPT_PERMISSION_ERROR',
			status: 403,
			payload: 'nope',
		});
	});



	it('sendPromptStreaming should emit parsed lines and close on stop_reason', async () => {
		const root = mockRoot();
		const agents = new StackspotAiAgents(root);

		const stream = createMockStream();
		fetchMock.pushResponse(buildFetchResponse({status: 200, body: stream}));

		const {collector, eventEmitter} = await agents.sendPromptStreaming('agent-1', 'hello');

		const events = {lines: [], closed: null, errors: []};
		eventEmitter.on('line', (raw, json) => events.lines.push(json));
		eventEmitter.on('close', (code) => {
			events.closed = code;
		});
		eventEmitter.on('error', (err) => events.errors.push(err));

		// emit two good lines and a final with stop_reason
		stream.emit('data', Buffer.from('data: {"message":"Hi"}\n'));
		stream.emit('data', Buffer.from('data: {"message":" there"}\n'));
		stream.emit('data', Buffer.from('data: {"message":"!","stop_reason":"stop"}\n'));

		// simulate underlying stream close
		stream.emit('close', 0);

		// allow microtask queue to process
		await Promise.resolve();

		expect(collector.messageBuffer).toBe('Hi there!');
		expect(events.errors.length).toBe(0);
		expect(events.closed).toBe(0);
		expect(events.lines.length).toBe(3);
	});



	it('sendPromptStreaming should emit error on malformed JSON line and then close due to stream error', async () => {
		const root = mockRoot();
		const agents = new StackspotAiAgents(root);

		const stream = createMockStream();
		fetchMock.pushResponse(buildFetchResponse({status: 200, body: stream}));

		const {eventEmitter} = await agents.sendPromptStreaming('agent-1', 'hello');

		const errors = [];
		let closed = null;
		eventEmitter.on('error', (e) => errors.push(e));
		eventEmitter.on('close', (code) => {
			closed = code;
		});

		stream.emit('data', Buffer.from('data: {bad json}\n'));
		stream.emit('error', new Error('net error'));

		await Promise.resolve();

		expect(errors.length).toBeGreaterThanOrEqual(1);
		expect(closed).toBe(1);
	});



});
