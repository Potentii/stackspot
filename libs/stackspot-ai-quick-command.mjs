import fetch from "node-fetch";
import StackspotApiError from "./stackspot-api-error.mjs";
import {delay} from "./utils.mjs";
import StackspotError from "./stackspot-error.mjs";

export default class StackspotAiQuickCommand {

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
	 * Creates a new Quick Command execution. Generating a new executionId that can be queried by the 'getExecution' method.
	 * @param {string} slug The Quick Command slug identifier.
	 * @param {?(string|object|Array)} [input] The input for this execution, it can be a string, or an object/array.
	 * @param {?string} [conversationId] A conversation ID, this is used for continuing a previously started conversation. If it's the first call, you can ignore this field.
	 * @returns {Promise<string>} It returns the executionId.
	 */
	async createExecution(slug, input, conversationId){
		const inputData = typeof input == 'string'
			? input
			: { json: JSON.stringify(input) };

		const res = await fetch(
			`https://genai-code-buddy-api.stackspot.com/v1/quick-commands/create-execution/${slug}?${new URLSearchParams({ conversationId: conversationId }).toString()}`,
			{
				method: 'post',
				body: JSON.stringify({
					input_data: inputData,
				}),
				headers: {
					'Authorization': `Bearer ${await this.#root.auth.getAccessToken()}`,
					'Content-Type': 'application/json',
				},
				agent: this.#root.agent,
			}
		);

		if(res.status > 299)
			throw new StackspotApiError(res.status, `QUICK_COMMAND_CREATE_EXECUTION_ERROR`, `Error creating new Quick Command execution`, await res.text());

		return (await res.text()).replaceAll('\"', '');
	}


	/**
	 * Gets the current status of a Quick Command execution.
	 * @param {string} executionId The Quick Command execution ID.
	 * @returns {Promise<StackspotAiQuickCommandExecutionCallback>}
	 */
	async getExecution(executionId){
		const res = await fetch(
			`https://genai-code-buddy-api.stackspot.com/v1/quick-commands/callback/${executionId}`,
			{
				method: 'get',
				headers: {
					'Authorization': `Bearer ${await this.#root.auth.getAccessToken()}`,
				},
				agent: this.#root.agent,
			}
		);

		if(res.status > 299)
			throw new StackspotApiError(res.status, `QUICK_COMMAND_GET_EXECUTION_ERROR`, `Error getting a Quick Command execution`, await res.text());

		return await res.json();
	}


	/**
	 * Starts polling for a Quick Command execution until its status become 'COMPLETED' or 'FAILURE'. By default it polls the callback endpoint on every 500ms, but it can be configured in the opts.
	 * @param {string} executionId The Quick Command execution ID.
	 * @param {?QuickCommandPollExecutionOpts} [opts] The options of this polling, to configure things like max attempts, timeout, delay, etc.
	 * @returns {Promise<StackspotAiQuickCommandExecutionCallback>}
	 */
	async pollExecution(executionId, opts){
		let execution = null;
		let tries = 0;
		let startTs = Date.now();
		do{
			tries++;

			execution = await this.getExecution(executionId);

			if(typeof opts?.onCallbackResponse == 'function')
				await opts?.onCallbackResponse.call(null, execution);

			await delay(opts?.delay || 500);
		} while (
			!['COMPLETED', 'FAILURE'].includes(execution?.progress?.status)
			&& (!opts?.maxRetries || opts?.maxRetries <= 0 || tries < (opts?.maxRetries || 0))
			&& (!opts?.maxRetriesTimeout || opts?.maxRetriesTimeout <= 0 || (Date.now() - startTs) < opts?.maxRetriesTimeout)
		);

		if(!['COMPLETED', 'FAILURE'].includes(execution?.progress?.status))
			throw new StackspotError(`QUICK_COMMAND_EXECUTE_MAX_ATTEMPTS_REACHED_ERROR`, `Max attempts (by retries or time limit) reached for Quick Command execution, last execution: ${execution ? JSON.stringify(execution) : null}`);

		return execution;
	}


}