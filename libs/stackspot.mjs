import StackspotAuth from "./stackspot-auth.mjs";
import StackspotAi from "./stackspot-ai.mjs";

let _instance = null;


export default class Stackspot {

	#clientId;
	#clientSecret;
	#realm;
	#agent;

	#auth = new StackspotAuth(this);
	#ai = new StackspotAi(this);


	constructor(opts) {
		this.#clientId = opts?.clientId || process.env.STACKSPOT_CLIENT_ID;
		this.#clientSecret = opts?.clientSecret || process.env.STACKSPOT_CLIENT_SECRET;
		this.#realm = opts?.realm || process.env.STACKSPOT_REALM;
		this.#agent = opts?.agent;
	}



	/**
	 * Gets the global singleton instance
	 */
	get instance(){
		if(!_instance)
			_instance = new Stackspot();
		return _instance;
	}


	get auth(){
		return this.#auth;
	}

	get ai(){
		return this.#ai;
	}


	get clientId() {
		return this.#clientId;
	}

	get clientSecret() {
		return this.#clientSecret;
	}

	get realm() {
		return this.#realm;
	}

	get agent() {
		return this.#agent;
	}
}