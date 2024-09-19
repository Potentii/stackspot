import fetch from "node-fetch";
import StackspotApiError from "./stackspot-api-error.mjs";

export default class StackspotAiKs {

	/**
	 * @type {Stackspot}
	 */
	#root;

	/**
	 *
	 * @param {Stackspot} root
	 */
	constructor(root) {
		if(!root)
			throw new TypeError(`Stackspot: Invalid root object "${root}"`);
		this.#root = root;
	}


	/**
	 * Creates a new Knowledge Source.
	 * @param {string} slug The slug ID of this new KS. It must be unique, and it CANNOT be changed later.
	 * @param {string} name The KS display name.
	 * @param {string} description The KS description.
	 * @param {string|'API'|'SNIPPET'|'CUSTOM'} type The KS type. It must be either 'API', 'SNIPPET', or 'CUSTOM'. For more information, please visit {@link https://ai.stackspot.com/docs/knowledge-source/ks#types-of-knowledge-objects}.
	 * @returns {Promise<void>}
	 */
	async createKs(slug, name, description, type){
		const res = await fetch(
			`https://genai-code-buddy-api.stackspot.com/v1/knowledge-sources`,
			{
				method: 'post',
				body: JSON.stringify({
					slug: slug,
					name: name,
					description: description,
					type: type,
				}),
				headers: {
					'Authorization': `Bearer ${await this.#root.auth.getAccessToken()}`,
					'Content-Type': 'application/json',
				},
				agent: this.#root.agent,
			}
		);

		if(res.status > 299)
			throw new StackspotApiError(res.status, `KS_CREATE_ERROR`, `Error creating new Knowledge Source`, await res.text());
	}

	/**
	 * Removes multiple objects from a Knowledge Source.
	 * @param {string} slug The slug ID of the KS.
	 * @param {string|'ALL'|'STANDALONE'|'UPLOADED'} mode The remove mode. Valid values are: 'ALL' (Removes all objects from KS), 'STANDALONE' (Removes only standalone objects), 'UPLOADED' (Removes only uploaded objects). For more information, please visit {@link https://ai.stackspot.com/docs/knowledge-source/create-update-via-api#delete-knowledge-sources-objects}.
	 * @returns {Promise<void>}
	 */
	async batchRemoveKsObjects(slug, mode){
		if(!['ALL','STANDALONE','UPLOADED'].includes(mode))
			throw new TypeError(`Cannot batch remove Knowledge Source objects, invalid mode "${mode}"`);

		const query = mode === 'ALL'
			? ''
			: '?' + new URLSearchParams({ standalone: mode === 'STANDALONE' }).toString();

		const res = await fetch(
			`https://genai-code-buddy-api.stackspot.com/v1/knowledge-sources/${slug}/objects${query}`,
			{
				method: 'delete',
				headers: {
					'Authorization': `Bearer ${await this.#root.auth.getAccessToken()}`
				},
				agent: this.#root.agent,
			}
		);

		if(res.status > 299)
			throw new StackspotApiError(res.status, `KS_OBJ_BATCH_REMOVE_ERROR`, `Error batch removing objects from a Knowledge Source`, await res.text());
	}


	/**
	 * Uploads new content to a Knowledge Source.
	 * @param {string} slug The KS slug identifier.
	 * @param {string} fileName The desired file name.
	 * @param {Buffer|string} content The content to upload, it can be a buffer or a string.
	 * @param {?StackspotAiContentUpload} [upload] If you want to reuse another upload form to upload more files, you can pass it here. It must be a 'KNOWLEDGE_SOURCE' upload form, otherwise this might upload the content to an undesired location.
	 * @returns {Promise<void>}
	 */
	async uploadKsObject(slug, fileName, content, upload){
		if(!upload)
			upload = await this.#root.ai.openUploadContentForm('KNOWLEDGE_SOURCE', slug, fileName);

		return this.#root.ai.uploadContent(upload, content);
	}


}