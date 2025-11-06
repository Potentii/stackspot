import fetch from "node-fetch";
import StackspotApiError from "./stackspot-api-error.mjs";
import EventEmitter from 'eventemitter3';

export default class StackspotAiAgents {

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


	async sendPrompt(agentId, prompt, opts = {}){

		const res = await fetch(
			`https://genai-inference-app.stackspot.com/v1/agent/${agentId}/chat`,
			{
				method: 'post',
				body: JSON.stringify({
					"streaming": false,
					"user_prompt": prompt,
					"stackspot_knowledge": opts.stackspotKnowledge || false,
					"return_ks_in_response": opts.returnKsInResponse || false,
				}),
				headers: {
					'Authorization': `Bearer ${await this.#root.auth.getAccessToken()}`,
					'Content-Type': 'application/json',
				},
				agent: this.#root.agent,
			}
		);

		if(res.status > 299) {
			if(res.status === 403)
				throw new StackspotApiError(res.status, `AGENTS_SEND_PROMPT_PERMISSION_ERROR`, `Error sending prompt to Agent, not authorized to perform this action`, await res.text());
			throw new StackspotApiError(res.status, `AGENTS_SEND_PROMPT_ERROR`, `Error sending prompt to Agent`, await res.text());
		}

		return res.json();
	}


	async sendPromptStreamingRaw(agentId, prompt, opts = {}){

		const res = await fetch(
			`https://genai-inference-app.stackspot.com/v1/agent/${agentId}/chat`,
			{
				method: 'post',
				body: JSON.stringify({
					"streaming": true,
					"user_prompt": prompt,
					"stackspot_knowledge": opts.stackspotKnowledge || false,
					"return_ks_in_response": opts.returnKsInResponse || false,
				}),
				headers: {
					'Authorization': `Bearer ${await this.#root.auth.getAccessToken()}`,
					'Content-Type': 'application/json',
				},
				agent: this.#root.agent,
			}
		);

		if(res.status > 299) {
			if(res.status === 403)
				throw new StackspotApiError(res.status, `AGENTS_SEND_PROMPT_PERMISSION_ERROR`, `Error sending prompt to Agent, not authorized to perform this action`, await res.text());
			throw new StackspotApiError(res.status, `AGENTS_SEND_PROMPT_ERROR`, `Error sending prompt to Agent`, await res.text());
		}

		return res.body;
	}


	async sendPromptStreaming(agentId, prompt, opts = {}){

		const stream = await this.sendPromptStreamingRaw(agentId, prompt, opts);

		let closed = false;

		const eventEmitter = new EventEmitter();

		const collector = {
			messageBuffer: '',
			linesRaw: [],
			linesJson: [],

			stop_reason: undefined,
			upload_ids: undefined,
			knowledge_source_id: undefined,
			source: undefined,
			cross_account_source: undefined,
			tools_id: undefined,
		};

		let lineBuffer = '';

		stream.on('data', chunk => {
			if(closed){
				console.warn(`Received data after agent stream closed: ${chunk.toString()}`);
				return;
			}

			lineBuffer += chunk.toString() || '';

			const lines = lineBuffer.split('\n');
			lineBuffer = lines.pop();

			for (const line of lines) {
				if (line?.trim()?.length) {
					collector.linesRaw.push(line);
					try {
						// const forcedJson = `{${line.replace(/^\s*(data):/i, `"$1":`)}}`;
						const dataJsonStr = line.replace(/^\s*?data:\s*?/i, '');

						const data = JSON.parse(dataJsonStr);
						collector.linesJson.push(data);

						collector.messageBuffer += data?.message || '';

						eventEmitter.emit('line', line, data);

						// TODO collect other returned fields

						if(data?.stop_reason?.trim()?.length){
							closed = true;
							eventEmitter.emit('close', 0);
						}
					} catch (err) {
						eventEmitter.emit('error', new Error(`Failed to parse line: "${line}"`));
					}
				}
			}
		});


		stream.on('error', err => {
			eventEmitter.emit('error', err);

			closed = true;
			eventEmitter.emit('close', 1);
		});


		stream.on('close', code => {
			if(closed)
				return;

			if(collector.stop_reason?.trim()?.length){
				closed = true;
				eventEmitter.emit('close', 0);
			} else {
				closed = true;
				eventEmitter.emit('close', code || -1);
			}
		});


		return {
			collector,
			eventEmitter,
		};
	}


}