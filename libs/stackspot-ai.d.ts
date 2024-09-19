import {Stackspot} from "./stackspot";
import {StackspotAiKs} from "./stackspot-ai-ks";
import Buffer from "buffer"

export declare interface StackspotAiContentUploadForm{
	key: string,
	policy: string,
	'x-amz-algorithm': string,
	'x-amz-credential': string,
	'x-amz-date': string,
	'x-amz-security-token': string,
	'x-amz-signature': string,
}
export declare interface StackspotAiContentUpload{
	id: string,
	url: string,
	form: StackspotAiContentUploadForm,
}


export declare class StackspotAi{
	#root: Stackspot;
	#ks: StackspotAiKs;

	constructor(root: Stackspot);

	get ks(): StackspotAiKs;

	async openUploadContentForm(targetType: string|'KNOWLEDGE_SOURCE', targetId: string, fileName: string, expiration?: number): Promise<StackspotAiContentUpload>;
	async uploadContent(upload: StackspotAiContentUpload, content: Buffer | string): Promise<void>;
}