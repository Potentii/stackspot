import fetch from "node-fetch";
import StackspotApiError from "./stackspot-api-error.mjs";


export default class StackspotAuth {
	/**
	 * @type {Stackspot}
	 */
	#root;
	/**
	 * @type {?StackspotAuthTokenResponse}
	 */
	#tokenResponse;
	/**
	 * @type {?number}
	 */
	#getAt;

	constructor(root) {
		if(!root)
			throw new TypeError(`Stackspot: Invalid root object "${root}"`);
		this.#root = root;
	}


	/**
	 * Fetches a new authentication token.
	 * @private
	 * @returns {Promise<StackspotAuthTokenResponse>}
	 */
	async #fetchToken(){
		const res = await fetch(
			`https://idm.stackspot.com/${this.#root.realm}/oidc/oauth/token`,
			{
				method: 'post',
				body: new URLSearchParams({
					grant_type: 'client_credentials',
					client_id: this.#root.clientId,
					client_secret: this.#root.clientSecret,
				}),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				agent: this.#root.agent,
			}
		);

		if(res.status > 299)
			throw new StackspotApiError(res.status, `AUTH_ERROR`, `Error while authenticating on Stackspot`, await res.text());

		return await res.json();
	}


	/**
	 * Refreshes the authentication token.
	 * FIXME the OIDC endpoint is not properly refreshing the token
	 * @private
	 * @returns {Promise<StackspotAuthTokenResponse>}
	 */
	async #refreshToken(){
		const res = await fetch(
			`https://idm.stackspot.com/${this.#root.realm}/oidc/oauth/token`,
			{
				method: 'post',
				body: new URLSearchParams({
					grant_type: 'refresh_token',
					refresh_token: this.#tokenResponse.refresh_token,
					client_id: this.#root.clientId,
					client_secret: this.#root.clientSecret,
				}),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				agent: this.#root.agent,
			}
		);

		if(res.status > 299)
			throw new StackspotApiError(res.status, `AUTH_REFRESH_ERROR`, `Error while authenticating (token refresh) on Stackspot`, await res.text());

		return await res.json();
	}


	/**
	 * Retrieves a new access token, or uses the cached one if it stills valid.
	 * @returns {Promise<?string>}
	 */
	async getAccessToken(){
		if (!this.#tokenResponse?.access_token || (this.#getAt + (this.#tokenResponse.expires_in * 1000)) <= Date.now()) {
			this.#tokenResponse = await this.#fetchToken();
			this.#getAt = Date.now();
		}

		return this.#tokenResponse?.access_token;
	}


	/**
	 * Cleans the cached token
	 * @private
	 */
	_invalidateToken(){
		this.#tokenResponse = null;
	}





}