import Buffer from "buffer"
import {StackspotAiContentUpload} from "./stackspot-ai";
import {Stackspot} from "./stackspot";


export declare class StackspotAiKs{
	#root: Stackspot;

	constructor(root: Stackspot);

	/**
	 * Creates a new Knowledge Source.
	 * @param {string} slug The slug ID of this new KS. It must be unique, and it CANNOT be changed later.
	 * @param {string} name The KS display name.
	 * @param {string} description The KS description.
	 * @param {string|'API'|'SNIPPET'|'CUSTOM'} type The KS type. It must be either 'API', 'SNIPPET', or 'CUSTOM'. For more information, please visit {@link https://ai.stackspot.com/docs/knowledge-source/ks#types-of-knowledge-objects}.
	 * @returns {Promise<void>}
	 */
	async createKs(slug: string, name: string, description: string, type: string|'API'|'SNIPPET'|'CUSTOM'): Promise<void>;
	/**
	 * Removes multiple objects from a Knowledge Source.
	 * @param {string} slug The slug ID of the KS.
	 * @param {string|'ALL'|'STANDALONE'|'UPLOADED'} mode The remove mode. Valid values are: 'ALL' (Removes all objects from KS), 'STANDALONE' (Removes only standalone objects), 'UPLOADED' (Removes only uploaded objects). For more information, please visit {@link https://ai.stackspot.com/docs/knowledge-source/create-update-via-api#delete-knowledge-sources-objects}.
	 * @returns {Promise<void>}
	 */
	async batchRemoveKsObjects(slug: string, mode: string|'ALL'|'STANDALONE'|'UPLOADED'): Promise<void>;
	/**
	 * Uploads new content to a Knowledge Source.
	 * @param {string} slug The KS slug identifier.
	 * @param {string} fileName The desired file name.
	 * @param {Buffer|string} content The content to upload, it can be a buffer or a string.
	 * @param {?StackspotAiContentUpload} [upload] If you want to reuse another upload form to upload more files, you can pass it here. It must be a 'KNOWLEDGE_SOURCE' upload form, otherwise this might upload the content to an undesired location.
	 * @returns {Promise<void>}
	 */
	async uploadKsObject(slug: string, fileName: string, content: Buffer | string, upload?: StackspotAiContentUpload | undefined): Promise<void>;

}