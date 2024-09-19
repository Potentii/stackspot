import fetch, {FormData} from "node-fetch";
import StackspotAiKs from "./stackspot-ai-ks.mjs";
import StackspotApiError from "./stackspot-api-error.mjs";
import StackspotAiQuickCommand from "./stackspot-ai-quick-command.mjs";


export default class StackspotAi {

	/**
	 * @type {Stackspot}
	 */
	#root;
	/**
	 * @type {StackspotAiKs}
	 */
	#ks;
	/**
	 * @type {StackspotAiQuickCommand}
	 */
	#quickCommand;



	constructor(root) {
		if(!root)
			throw new TypeError(`Stackspot: Invalid root object "${root}"`);
		this.#root = root;
		this.#ks = new StackspotAiKs(root);
		this.#quickCommand = new StackspotAiQuickCommand(root);
	}


	/**
	 * Access to Knowledge Source module
	 * @returns {StackspotAiKs}
	 */
	get ks(){
		return this.#ks;
	}


	/**
	 * Access to Quick Commands module
	 * @returns {StackspotAiQuickCommand}
	 */
	get quickCommand(){
		return this.#quickCommand;
	}


	/**
	 * Starts a new upload form, call this method before attempting to upload any file, and use the returned information to execute the upload itself. But be aware that some upload methods already opens a new form by default.
	 * @param {string|'KNOWLEDGE_SOURCE'} targetType The target type to upload this file (e.g. 'KNOWLEDGE_SOURCE').
	 * @param {string} targetId The target ID (if it's a KS, use the KS slug identifier).
	 * @param {string} fileName The desired name of the file.
	 * @param {number} [expiration] The form's expiration timeout (in seconds), defaults to 600.
	 * @returns {Promise<StackspotAiContentUpload>}
	 */
	async openUploadContentForm(targetType, targetId, fileName, expiration = 600){
		const res = await fetch(
			`https://genai-code-buddy-api.stackspot.com/v1/file-upload/form`,
			{
				method: 'post',
				body: JSON.stringify({
					target_type: targetType,
					target_id: targetId,
					file_name: fileName,
					expiration: expiration,
				}),
				headers: {
					'Authorization': `Bearer ${await this.#root.auth.getAccessToken()}`,
					'Content-Type': 'application/json',
				},
				agent: this.#root.agent,
			}
		);

		if(res.status > 299)
			throw new StackspotApiError(res.status, `UPLOAD_FORM_CREATE_ERROR`, `Error opening new upload form`, await res.text());

		return await res.json();
	}


	/**
	 * Uploads a new content to an open Upload form.
	 * @param {StackspotAiContentUpload} upload The upload form, use the {@code openUploadContentForm} to open a new one.
	 * @param {Buffer|string} content The content to upload, it can be a buffer or a string.
	 * @returns {Promise<void>}
	 */
	async uploadContent(upload, content){

		const formData = new FormData();
		const body = {
			...upload.form,
			file: content,
		}
		for (let key in body) {
			if(body.hasOwnProperty(key)){
				formData.append(key, body[key]);
			}
		}

		const res = await fetch(
			upload.url,
			{
				method: 'post',
				body: formData,
				agent: this.#root.agent,
			}
		);

		if(res.status > 299)
			throw new StackspotApiError(res.status, `UPLOAD_ERROR`, `Error uploading new content`, await res.text());
	}




}