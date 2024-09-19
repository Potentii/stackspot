import {Stackspot} from "./stackspot";


export declare interface StackspotAuthTokenResponse{
	access_token: string,
	expires_in: number,
	refresh_token: string,
	refresh_expires_in: number,
	token_type: string,
	scope: string,
	session_state: string,
	'not-before-policy': number,
}


export declare class StackspotAuth{
	#root: Stackspot;
	#tokenResponse: StackspotAuthTokenResponse | undefined;
	#getAt: number | undefined;

	constructor(root: Stackspot);

	/**
	 * Fetches a new authentication token.
	 * @private
	 * @returns {Promise<StackspotAuthTokenResponse>}
	 */
	async #fetchToken(): Promise<StackspotAuthTokenResponse>;
	/**
	 * Retrieves a new access token, or uses the cached one if it stills valid.
	 * @returns {Promise<?string>}
	 */
	async getAccessToken(): Promise<string | undefined>;

}