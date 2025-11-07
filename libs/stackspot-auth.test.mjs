import {buildFetchResponse, mockRoot, mockFetch} from './__test_utils__.mjs';
import {jest} from '@jest/globals';



// *Setting up the mocks:
const fetchMock = mockFetch();



// *Importing the modules after the mocks are set up:
const {default: StackspotAuth} = await import('./stackspot-auth.mjs');



describe('Stackspot - Auth', () => {



	// *Resetting mocks before each test:
	beforeEach(() => {
		fetchMock.clear();
		jest.restoreAllMocks();
	});



	it('getAccessToken should fetch and cache token', async () => {
		const root = mockRoot();
		const auth = new StackspotAuth(root);

		fetchMock.pushResponse(buildFetchResponse({status: 200, json: {access_token: 'tok1', expires_in: 3600}}));

		const t1 = await auth.getAccessToken();
		expect(t1).toBe('tok1');
		expect(fetchMock).toHaveBeenCalledTimes(1);

		const t2 = await auth.getAccessToken();
		expect(t2).toBe('tok1');
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});



	it('getAccessToken should refetch when expired', async () => {
		const root = mockRoot();
		const auth = new StackspotAuth(root);

		const nowSpy = jest.spyOn(Date, 'now');
		nowSpy.mockReturnValue(1000);

		fetchMock.pushResponse(buildFetchResponse({status: 200, json: {access_token: 'tok1', expires_in: 1}}));
		const t1 = await auth.getAccessToken();
		expect(t1).toBe('tok1');

		// advance time beyond expiry (expires_in=1s)
		nowSpy.mockReturnValue(3000);

		fetchMock.pushResponse(buildFetchResponse({status: 200, json: {access_token: 'tok2', expires_in: 3600}}));
		const t2 = await auth.getAccessToken();
		expect(t2).toBe('tok2');
		expect(fetchMock).toHaveBeenCalledTimes(2);
	});



	it('getAccessToken should throw StackspotApiError on HTTP error', async () => {
		const root = mockRoot();
		const auth = new StackspotAuth(root);

		fetchMock.pushResponse(buildFetchResponse({status: 400, text: 'bad request'}));

		await expect(auth.getAccessToken()).rejects.toMatchObject({
			name: 'StackspotApiError',
			code: 'AUTH_ERROR',
			status: 400,
			payload: 'bad request',
		});
	});



});
