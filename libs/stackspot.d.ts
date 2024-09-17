import {Agent} from "node:http";
import {StackspotAuth} from "./stackspot-auth";
import {StackspotAi} from "./stackspot-ai";

export declare interface StackspotOpts{
	clientId: string | undefined,
	clientSecret: string | undefined,
	realm: string | undefined,
	agent: Agent | undefined,
}

export declare class Stackspot{
	#clientId: string | undefined;
	#clientSecret: string | undefined;
	#realm: string | undefined;
	#agent: Agent | undefined;

	#auth: StackspotAuth;
	#ai: StackspotAi;

	constructor(opts?: StackspotOpts);

	get instance(): Stackspot;

	get auth(): StackspotAuth;
	get ai(): StackspotAi;

	get clientId(): string | undefined;
	get clientSecret(): string | undefined;
	get realm(): string | undefined;
	get agent(): Agent | undefined;

}