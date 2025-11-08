import {Stackspot} from "./stackspot";
import EventEmitter from 'eventemitter3';

export declare interface AgentPromptStreamingResultLineJsonSource{
	type?: string | undefined | 'knowledge_source' | 'cross_account',
	name?: string | undefined,
	slug?: string | undefined,
	document_type?: string | undefined | 'knowledge_source' | 'cross_account',
	document_score?: number | undefined,
	document_id?: string | undefined,
	id?: string | undefined,
}


export declare interface AgentPromptStreamingResultLineJson{
	message?: string | undefined,
	upload_ids?: any | undefined,
	knowledge_source_id?: Array<string> | undefined,
	source?: Array<AgentPromptStreamingResultLineJsonSource> | undefined,
	cross_account_source?: Array<AgentPromptStreamingResultLineJsonSource> | undefined,
	tools_id?: Array<any> | undefined,
	/**
	 * The reason the agent stopped generating the response.
	 */
	stop_reason?: string | undefined | 'stop',
	/**
	 * Information about the tokens used in this response.
	 */
	tokens?: Array<AgentPromptResultToken> | undefined,
}


export declare interface AgentPromptStreamingResultCollector{
	/**
	 * The agent message will be streamed to this string as they receives it.
	 */
	messageBuffer: string,
	/**
	 * The raw agent response lines will be streamed to this array as they receive it.
	 */
	linesRaw: Array<string>,
	/**
	 * The agent response lines will be streamed to this array as they receive it, as JSON objects.
	 */
	linesJson: Array<AgentPromptStreamingResultLineJson>,
}


/**
 * Event emitter for agent streaming responses.
 */
export declare class AgentPromptStreamingEventEmitter extends EventEmitter {
	/**
	 * Listen for a new line received from the stream
	 */
	on(event: 'line', listener: (line: string, data: AgentPromptStreamingResultLineJson) => void): this;
	/**
	 * Listen for errors during streaming
	 */
	on(event: 'error', listener: (error: Error) => void): this;
	/**
	 * Listen for stream close event
	 */
	on(event: 'close', listener: (code?: any) => void): this;

	/**
	 * Listen for a new line received from the stream once
	 */
	once(event: 'line', listener: (line: string, data: AgentPromptStreamingResultLineJson) => void): this;
	/**
	 * Listen for errors during streaming once
	 */
	once(event: 'error', listener: (error: Error) => void): this;
	/**
	 * Listen for stream close event once
	 */
	once(event: 'close', listener: (code?: any) => void): this;

	/**
	 * Remove one (or all) listeners for the 'line' event
	 */
	off(event: 'line', listener?: (line: string, data: AgentPromptStreamingResultLineJson) => void): this;
	/**
	 * Remove one (or all) listeners for the 'error' event
	 */
	off(event: 'error', listener?: (error: Error) => void): this;
	/**
	 * Remove one (or all) listeners for the 'close' event
	 */
	off(event: 'close', listener?: (code?: any) => void): this;
}



export declare interface AgentPromptStreamingResult{
	/**
	 * An object that will collect the stream data.
	 */
	collector: AgentPromptStreamingResultCollector,
	/**
	 * An event emitter that will emit the stream data and errors.
	 */
	eventEmitter: AgentPromptStreamingEventEmitter,
}



export declare interface AgentPromptResultToken{
	/**
	 * Consumed tokens to process the prompt.
	 */
	user?: number | undefined,
	/**
	 * Consumed tokens to enrich the response, like Knowledge Sources for example.
	 */
	enrichment?: number | undefined,
	/**
	 * Consumed tokens by the prompt input.
	 */
	input?: number | undefined,
	/**
	 * Consumed tokens to generate the final response.
	 */
	output?: number | undefined,
}

export declare interface AgentPromptResult{
	/**
	 *
	 */
	message?: string | undefined,
	/**
	 *
	 */
	stop_reason?: string | undefined | 'stop',
	/**
	 * Information about the tokens consumed by this execution.
	 */
	tokens?: Array<AgentPromptResultToken> | undefined,
}

export declare interface AgentPromptOpts{
	/**
	 *
	 */
	stackspot_knowledge?: boolean | undefined,
	/**
	 * Includes the Knowledge Source IDs used in the response.
	 */
	return_ks_in_response?: boolean | undefined,
	/**
	 * A list of uploaded file IDs to be included in the agent's context in this execution.
	 */
	upload_ids?: Array<string> | undefined,
}


export declare class StackspotAiAgents {
	#root: Stackspot;


	/**
	 *
	 * @param {Stackspot} root
	 */
	constructor(root: Stackspot);


	/**
	 * Sends a prompt to an agent.
	 * It will wait for the agent to finish its execution and return the result.
	 * @param {string} agentId The agent ID.
	 * @param {string} prompt The prompt to be sent.
	 * @param {?AgentPromptOpts} [opts] Agent execution additional options.
	 * @returns {Promise<AgentPromptResult>}
	 */
	async sendPrompt(
		agentId: string,
		prompt: string,
		opts?: AgentPromptOpts | undefined
	): Promise<AgentPromptResult>;


	/**
	 * Sends a prompt to an agent.
	 * It will stream the agent's response as it's being generated.
	 * It's preferable to use {@link sendPromptStreaming} instead, unless you need to access the raw stream and parse it yourself.
	 * @param {string} agentId The agent ID.
	 * @param {string} prompt The prompt to be sent.
	 * @param {?AgentPromptOpts} [opts] Agent execution additional options.
	 * @returns {Promise<ReadableStream>}
	 */
	async sendPromptStreamingRaw(
		agentId: string,
		prompt: string,
		opts?: AgentPromptOpts | undefined
	): Promise<ReadableStream>;


	/**
	 * Sends a prompt to an agent.
	 * It will stream the agent's response as it's being generated.
	 * It will parse the response as readable stream of JSON objects.
	 * The last message will generally be a JSON object with the 'stop_reason' and the overall information about the execution.
	 * @param {string} agentId The agent ID.
	 * @param {string} prompt The prompt to be sent.
	 * @param {?AgentPromptOpts} [opts] Agent execution additional options.
	 * @returns {Promise<AgentPromptStreamingResult>}
	 */
	async sendPromptStreaming(
		agentId: string,
		prompt: string,
		opts?: AgentPromptOpts | undefined
	): Promise<AgentPromptStreamingResult>;


	/**
	 * Uploads files to be used by the agents context.
	 * @param {string} fileName The desired file name.
	 * @param {Buffer|string} content The content to upload, it can be a buffer or a string.
	 * @param {number?} [expiration] The form's expiration timeout (in seconds), defaults to 60.
	 * @returns {Promise<StackspotAiContentUpload>}
	 */
	async uploadFileForAgents(
		fileName: string,
		content: Buffer | string,
		expiration?: number = 60,
	): Promise<StackspotAiContentUpload>;


}