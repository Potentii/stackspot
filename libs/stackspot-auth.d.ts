import {Stackspot} from "./stackspot";


export declare interface StackspotAuthTokenResponse{
	access_token: string,
}


export declare class StackspotAuth{
	#root: Stackspot;
	#tokenResponse: StackspotAuthTokenResponse | undefined;

	constructor(root: Stackspot);

	async #fetchToken(): Promise<StackspotAuthTokenResponse>;
	async getAccessToken(): Promise<string | undefined>;

}