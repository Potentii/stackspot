import Buffer from "buffer"
import {StackspotAiContentUpload} from "./stackspot-ai";
import {Stackspot} from "./stackspot";


export declare class StackspotAiKs{
	#root: Stackspot;

	constructor(root: Stackspot);

	async createKs(slug: string, name: string, description: string, type: string|'API'|'SNIPPET'|'CUSTOM');
	async batchRemoveKsObjects(slug: string, mode: string|'ALL'|'STANDALONE'|'UPLOADED');
	async uploadKsObject(slug: string, fileName: string, content: Buffer | string, upload?: StackspotAiContentUpload | undefined): Promise<void>;

}