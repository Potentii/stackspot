import {Stackspot} from "./stackspot";

export declare interface StackspotAiQuickCommandExecutionCallbackProgress{
	/**
	 * Execution start timestamp (formatted as ISO8601, example: '2024-02-15T20:48:43.990Z').
	 */
	start: string,
	/**
	 * Execution end timestamp (formatted as ISO8601, example: '2024-02-15T20:48:43.990Z').
	 */
	end?: string | undefined,
	/**
	 * Duration of the execution (in seconds).
	 */
	duration?: number | undefined,
	/**
	 * Percentage of the execution (in a '0.00' to '1.00' range).
	 */
	execution_percentage: number,
	/**
	 * Execution status, it can be either 'CREATED', 'RUNNING', 'FAILURE', or 'COMPLETED'.
	 */
	status: string|'CREATED'|'RUNNING'|'FAILURE'|'COMPLETED',
}


export declare interface StackspotAiQuickCommandExecutionCallbackStepResult{
	status_code?: number | undefined,
	headers?: Record<string, string> | undefined,
	data?: string | undefined,
	json_data?: object | undefined,
	answer?: string | undefined,
	sources?: Array | undefined,
}
export declare interface StackspotAiQuickCommandExecutionCallbackStep{
	step_name: string,
	execution_order: number,
	type: string|'LLM',
	step_result: StackspotAiQuickCommandExecutionCallbackStepResult,
}

export declare interface StackspotAiQuickCommandExecutionCallback{
	execution_id: string,
	quick_command_slug: string,
	conversation_id: string,
	result?: string | undefined,
	progress?: StackspotAiQuickCommandExecutionCallbackProgress | undefined,
	steps?: StackspotAiQuickCommandExecutionCallbackStep[] | undefined,
}


export declare interface QuickCommandPollExecutionOpts{
	/**
	 * The max number of polling retries. 0 (or unset) will make it try indefinitely.
	 */
	maxRetries?: number,
	/**
	 * The max timeout (in milliseconds) of polling retries. 0 (or unset) will make it try indefinitely.
	 */
	maxRetriesTimeout?: number,
	/**
	 * Sets the delay between each poll request, in milliseconds. It defaults to 500ms.
	 */
	delay?: number,
	/**
	 * A callback function to execute some logic after each poll response.
	 */
	onCallbackResponse?: (response: StackspotAiQuickCommandExecutionCallback) => any | Promise<any>
}


// export declare interface QuickCommandFullExecution{
// 	/**
// 	 * The total number of polling retries executed.
// 	 */
// 	callbackTries: number,
// 	/**
// 	 * The time elapsed since the start of the callback polling, in milliseconds.
// 	 */
// 	callbackTimeElapsed: number,
// 	/**
// 	 * The last execution callback, use this to get the Quick Command response.
// 	 */
// 	execution: StackspotAiQuickCommandExecutionCallback | undefined,
// 	/**
// 	 * If the last polling returns an API error (and opts.failOnPollingError != true), this is the error thrown.
// 	 */
// 	error?: Error | undefined,
// }

export declare class StackspotAiQuickCommand{
	#root: Stackspot;

	constructor(root: Stackspot);

	/**
	 * Creates a new Quick Command execution. Generating a new executionId that can be queried by the 'getExecution' method.
	 * @param {string} slug The Quick Command slug identifier.
	 * @param {?(string|object|Array)} [input] The input for this execution, it can be a string, or an object/array.
	 * @param {?string} [conversationId] A conversation ID, this is used for continuing a previously started conversation. If it's the first call, you can ignore this field.
	 * @returns {Promise<string>} It returns the executionId.
	 */
	async createExecution(slug: string, input?: string | object | Array | undefined, conversationId?: string | undefined): Promise<string>;
	/**
	 * Gets the current status of a Quick Command execution.
	 * @param {string} executionId The Quick Command execution ID.
	 * @returns {Promise<StackspotAiQuickCommandExecutionCallback>}
	 */
	async getExecution(executionId: string): Promise<StackspotAiQuickCommandExecutionCallback>;
	/**
	 * Starts polling for a Quick Command execution until its status become 'COMPLETED' or 'FAILURE'. By default it polls the callback endpoint on every 500ms, but it can be configured in the opts.
	 * @param {string} executionId The Quick Command execution ID.
	 * @param {?QuickCommandPollExecutionOpts} [opts] The options of this polling, to configure things like max attempts, timeout, delay, etc.
	 * @returns {Promise<StackspotAiQuickCommandExecutionCallback>}
	 */
	async pollExecution(executionId: string, opts?: QuickCommandPollExecutionOpts | undefined): Promise<StackspotAiQuickCommandExecutionCallback>;
}