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


	/**
	 * Creates a new stackspot instance.
	 * @param {?StackspotOpts} [opts]
	 */
	constructor(opts) {
		this.config(opts);
	}


	/**
	 * Completely reconfigure this stackspot instance.
	 * @param {?StackspotOpts} [opts] The new stackspot options, if not set it will use the environment variables to configure this instance.
	 */
	config(opts){
		this.#clientId = opts?.clientId || process.env.STACKSPOT_CLIENT_ID;
		this.#clientSecret = opts?.clientSecret || process.env.STACKSPOT_CLIENT_SECRET;
		this.#realm = opts?.realm || process.env.STACKSPOT_REALM;
		this.#agent = opts?.agent;
		this.#auth._invalidateToken();
	}



	/**
	 * Gets the global stackspot singleton instance.
	 */
	static get instance(){
		if(!_instance)
			_instance = new Stackspot();
		return _instance;
	}


	/**
	 * Sets the clientId.
	 * @param {?string} clientId
	 * @returns {Stackspot}
	 */
	setClientId(clientId){
		this.#clientId = clientId;
		return this;
	}

	/**
	 * Sets the clientSecret.
	 * @param {?string} clientSecret
	 * @returns {Stackspot}
	 */
	setClientSecret(clientSecret){
		this.#clientSecret = clientSecret;
		return this;
	}

	/**
	 * Sets the realm.
	 * @param {?string} realm
	 * @returns {Stackspot}
	 */
	setRealm(realm){
		this.#realm = realm;
		return this;
	}

	/**
	 * Sets the agent.
	 * @param {?Agent} agent
	 * @returns {Stackspot}
	 */
	setAgent(agent){
		this.#agent = agent;
		return this;
	}


	/**
	 * Access the stackspot auth module.
	 * @returns {StackspotAuth}
	 */
	get auth(){
		return this.#auth;
	}

	/**
	 * Access the stackspot AI module.
	 * @returns {StackspotAi}
	 */
	get ai(){
		return this.#ai;
	}


	/**
	 * Get the current clientId.
	 * @returns {?string}
	 */
	get clientId() {
		return this.#clientId;
	}

	/**
	 * Get the current clientSecret.
	 * @returns {?string}
	 */
	get clientSecret() {
		return this.#clientSecret;
	}

	/**
	 * Get the current realm.
	 * @returns {?string}
	 */
	get realm() {
		return this.#realm;
	}

	/**
	 * Get the current agent.
	 * @returns {?Agent}
	 */
	get agent() {
		return this.#agent;
	}
}