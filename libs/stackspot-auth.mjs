import fetch from "node-fetch";


export default class StackspotAuth {

	#root;
	#tokenResponse;

	constructor(root) {
		this.#root = root;
	}


	/**
	 * Fetches a new authentication token.
	 * @private
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
			throw new Error(`Error while authenticating on Stackspot (status ${res.status}): ${await res.text()}`);

		return await res.json();
	}


	/**
	 * Retrieves a new access token, or uses the cached one if it still valid.
	 */
	async getAccessToken(){
		if (!this.#tokenResponse?.access_token)
			this.#tokenResponse = await this.#fetchToken();

		return this.#tokenResponse?.access_token;
	}





}