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

	constructor(root: Stackspot);

	async #fetchToken(): Promise<StackspotAuthTokenResponse>;
	async getAccessToken(): Promise<string | undefined>;

}