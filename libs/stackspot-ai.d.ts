import {Stackspot} from "./stackspot";
import {ReadStream} from "node:fs";
import {Buffer} from "node:buffer";

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

	constructor(root: Stackspot);

	async openUploadContentForm(targetType: string, targetId: string, fileName: string, expiration?: number): Promise<StackspotAiContentUpload>;
	async uploadContent(upload: StackspotAiContentUpload, content: ReadStream | Buffer | string, contentSize: number): Promise<void>;
	async ksUploadContent(ksSlug: string, fileName: string, content: ReadStream | Buffer | string, contentSize: number, upload?: StackspotAiContentUpload | undefined): Promise<void>;

}