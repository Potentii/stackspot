import {Agent} from "node:http";
import {StackspotAuth} from "./stackspot-auth";
import {StackspotAi} from "./stackspot-ai";

export declare interface StackspotOpts{
	clientId?: string | undefined,
	clientSecret?: string | undefined,
	realm?: string | undefined,
	agent?: Agent | undefined,
}

export declare class Stackspot{
	#clientId: string | undefined;
	#clientSecret: string | undefined;
	#realm: string | undefined;
	#agent: Agent | undefined;

	#auth: StackspotAuth;
	#ai: StackspotAi;

	/**
	 * Creates a new Stackspot instance.
	 * @param {?StackspotOpts} [opts]
	 */
	constructor(opts?: StackspotOpts);

	/**
	 * Completely reconfigure this Stackspot instance.
	 * @param {?StackspotOpts} [opts] The new Stackspot options, if not set it will use the environment variables to configure this instance.
	 */
	config(opts?: StackspotOpts);

	/**
	 * Sets the clientId.
	 * @param {?string} clientId
	 * @returns {Stackspot}
	 */
	setClientId(clientId: string | undefined): Stackspot;
	/**
	 * Sets the clientSecret.
	 * @param {?string} clientSecret
	 * @returns {Stackspot}
	 */
	setClientSecret(clientSecret: string | undefined): Stackspot;
	/**
	 * Sets the realm.
	 * @param {?string} realm
	 * @returns {Stackspot}
	 */
	setRealm(realm: string | undefined): Stackspot;
	/**
	 * Sets the agent.
	 * @param {?Agent} agent
	 * @returns {Stackspot}
	 */
	setAgent(agent: Agent | undefined): Stackspot;

	/**
	 * Gets the global Stackspot singleton instance.
	 */
	static get instance(): Stackspot;

	/**
	 * Access the Stackspot Auth module.
	 * @returns {StackspotAuth}
	 */
	get auth(): StackspotAuth;
	/**
	 * Access the Stackspot AI module.
	 * @returns {StackspotAi}
	 */
	get ai(): StackspotAi;

	/**
	 * Get the current clientId.
	 * @returns {?string}
	 */
	get clientId(): string | undefined;
	/**
	 * Get the current clientSecret.
	 * @returns {?string}
	 */
	get clientSecret(): string | undefined;
	/**
	 * Get the current realm.
	 * @returns {?string}
	 */
	get realm(): string | undefined;
	/**
	 * Get the current agent.
	 * @returns {?Agent}
	 */
	get agent(): Agent | undefined;

}