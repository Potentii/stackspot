import {buildFetchResponse, mockFetch, mockRoot} from './__test_utils__.mjs';
import {jest} from '@jest/globals';



// *Setting up the mocks:
const fetchMock = mockFetch();



// *Importing the modules after the mocks are set up:
const {default: StackspotAiKs} = await import('./stackspot-ai-ks.mjs');



describe('Stackspot - AI - KS', () => {



	// *Resetting mocks before each test:
	beforeEach(() => {
		fetchMock.clear();
		jest.restoreAllMocks();
	});



	it('createKs should POST and succeed', async () => {
		const root = mockRoot();
		const ks = new StackspotAiKs(root);

		fetchMock.pushResponse(buildFetchResponse({status: 200, text: ''}));

		await ks.createKs('slug-1', 'Name', 'Desc', 'CUSTOM');

		expect(fetchMock).toHaveBeenCalledTimes(1);
		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toContain('/v1/knowledge-sources');
		const body = JSON.parse(init.body);
		expect(body).toEqual({slug: 'slug-1', name: 'Name', description: 'Desc', type: 'CUSTOM'});
		expect(init.headers.Authorization).toBe('Bearer test-token');
	});



	it('createKs should throw on error status', async () => {
		const root = mockRoot();
		const ks = new StackspotAiKs(root);

		fetchMock.pushResponse(buildFetchResponse({status: 500, text: 'boom'}));

		await expect(ks.createKs('a', 'b', 'c', 'CUSTOM')).rejects.toMatchObject({
			name: 'StackspotApiError',
			code: 'KS_CREATE_ERROR',
			status: 500,
			payload: 'boom',
		});
	});



	it('batchRemoveKsObjects should DELETE with mode=ALL (no query)', async () => {
		const root = mockRoot();
		const ks = new StackspotAiKs(root);

		fetchMock.pushResponse(buildFetchResponse({status: 200, text: ''}));
		await ks.batchRemoveKsObjects('ks1', 'ALL');

		const [url, init] = fetchMock.mock.calls[0];
		expect(url).toMatch(/knowledge-sources\/ks1\/objects$/);
		expect(init.method).toBe('delete');
	});



	it('batchRemoveKsObjects should DELETE with standalone=true when STANDALONE', async () => {
		const root = mockRoot();
		const ks = new StackspotAiKs(root);

		fetchMock.pushResponse(buildFetchResponse({status: 200, text: ''}));
		await ks.batchRemoveKsObjects('ks1', 'STANDALONE');

		const [url] = fetchMock.mock.calls[0];
		expect(url).toMatch(/objects\?standalone=true$/);
	});



	it('batchRemoveKsObjects should DELETE with standalone=false when UPLOADED', async () => {
		const root = mockRoot();
		const ks = new StackspotAiKs(root);

		fetchMock.pushResponse(buildFetchResponse({status: 200, text: ''}));
		await ks.batchRemoveKsObjects('ks1', 'UPLOADED');

		const [url] = fetchMock.mock.calls[0];
		expect(url).toMatch(/objects\?standalone=false$/);
	});



	it('batchRemoveKsObjects should throw TypeError for invalid mode', async () => {
		const root = mockRoot();
		const ks = new StackspotAiKs(root);

		await expect(ks.batchRemoveKsObjects('ks1', 'WRONG')).rejects.toBeInstanceOf(TypeError);
	});



	it('batchRemoveKsObjects should throw on API error', async () => {
		const root = mockRoot();
		const ks = new StackspotAiKs(root);

		fetchMock.pushResponse(buildFetchResponse({status: 403, text: 'nope'}));
		await expect(ks.batchRemoveKsObjects('ks1', 'ALL')).rejects.toMatchObject({
			name: 'StackspotApiError',
			code: 'KS_OBJ_BATCH_REMOVE_ERROR',
			status: 403,
			payload: 'nope',
		});
	});



	it('uploadKsObject should use provided upload form when given', async () => {
		const upload = {url: 'https://upload.example/form2', form: {a: 1}};
		const root = mockRoot();
		const ks = new StackspotAiKs(root);

		await ks.uploadKsObject('ks1', 'file.txt', 'content', upload);

		expect(root.ai.openUploadContentForm).not.toHaveBeenCalled();
		expect(root.ai.uploadContent).toHaveBeenCalledWith(upload, 'content');
	});



	it('uploadKsObject should open form then upload when not provided', async () => {
		const root = mockRoot();
		const ks = new StackspotAiKs(root);

		await ks.uploadKsObject('ks1', 'file.txt', 'content');

		expect(root.ai.openUploadContentForm).toHaveBeenCalledWith('KNOWLEDGE_SOURCE', 'ks1', 'file.txt', 600);
		const upload = await root.ai.openUploadContentForm.mock.results[0].value;
		expect(root.ai.uploadContent).toHaveBeenCalledWith(upload, 'content');
	});



});
