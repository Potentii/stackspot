import fetch from "node-fetch";
import * as FormData from "form-data";


export default class StackspotAi {

	#root;

	constructor(root) {
		this.#root = root;
	}


	/**
	 * Starts a new upload form, call this method before attempting to upload any file, and use the returned information to execute the upload itself. But be aware that some upload methods already opens a new form by default.
	 * @param targetType The target type to upload this file (e.g. 'KNOWLEDGE_SOURCE').
	 * @param targetId The target ID (if it's a KS, use the KS slug identifier).
	 * @param fileName The desired name of the file.
	 * @param expiration The form's expiration timeout (in seconds), defaults to 600.
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
			throw new Error(`Error opening new upload form (status ${res.status}): ${await res.text()}`);

		return await res.json();
	}


	/**
	 * Uploads a new content to an open Upload form.
	 * @param upload The upload form, use the {@code openUploadContentForm} to open a new one.
	 * @param content The content to upload, it can be a stream, a buffer, or a string.
	 * @param contentSize The size of the content/file in bytes.
	 */
	async uploadContent(upload, content, contentSize){

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
				headers: {
					'Content-Length': '' + contentSize,
				},
				agent: this.#root.agent,
			}
		);

		if(res.status > 299)
			throw new Error(`Error uploading new content (status ${res.status}): ${await res.text()}`);
	}


	/**
	 * Uploads new content to a Knowledge Source.
	 * @param ksSlug The KS slug identifier.
	 * @param fileName The desired file name.
	 * @param content The content to upload, it can be a stream, a buffer, or a string.
	 * @param contentSize The size of the content/file in bytes.
	 * @param upload If you want to reuse another upload form to upload more files, you can pass it here. It must be a 'KNOWLEDGE_SOURCE' upload form, otherwise this might upload the content to an undesired location.
	 */
	async ksUploadContent(ksSlug, fileName, content, contentSize, upload){
		if(!upload)
			upload = await this.openUploadContentForm('KNOWLEDGE_SOURCE', ksSlug, fileName);

		return this.uploadContent(upload, content, contentSize);
	}


}