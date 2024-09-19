import {Stackspot} from "./stackspot";
import {StackspotAiKs} from "./stackspot-ai-ks";
import {StackspotAiQuickCommand} from "./stackspot-ai-quick-command";
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
	#quickCommand: StackspotAiQuickCommand;

	constructor(root: Stackspot);

	/**
	 * Access to Knowledge Source module
	 * @returns {StackspotAiKs}
	 */
	get ks(): StackspotAiKs;
	/**
	 * Access to Quick Commands module
	 * @returns {StackspotAiQuickCommand}
	 */
	get quickCommand(): StackspotAiQuickCommand;

	/**
	 * Starts a new upload form, call this method before attempting to upload any file, and use the returned information to execute the upload itself. But be aware that some upload methods already opens a new form by default.
	 * @param {string|'KNOWLEDGE_SOURCE'} targetType The target type to upload this file (e.g. 'KNOWLEDGE_SOURCE').
	 * @param {string} targetId The target ID (if it's a KS, use the KS slug identifier).
	 * @param {string} fileName The desired name of the file.
	 * @param {number} [expiration] The form's expiration timeout (in seconds), defaults to 600.
	 * @returns {Promise<StackspotAiContentUpload>}
	 */
	async openUploadContentForm(targetType: string|'KNOWLEDGE_SOURCE', targetId: string, fileName: string, expiration?: number): Promise<StackspotAiContentUpload>;
	/**
	 * Uploads a new content to an open Upload form.
	 * @param {StackspotAiContentUpload} upload The upload form, use the {@code openUploadContentForm} to open a new one.
	 * @param {Buffer|string} content The content to upload, it can be a buffer or a string.
	 * @returns {Promise<void>}
	 */
	async uploadContent(upload: StackspotAiContentUpload, content: Buffer | string): Promise<void>;
}