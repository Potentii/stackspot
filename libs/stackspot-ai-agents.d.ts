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

	stop_reason?: string | undefined | 'stop',
	/**
	 * Information about the tokens used in this response.
	 */
	tokens?: Array<AgentPromptResultToken> | undefined,
}


export declare interface AgentPromptStreamingResultCollector{
	messageBuffer: string,
	linesRaw: Array<string>,
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
	collector: AgentPromptStreamingResultCollector,
	eventEmitter: AgentPromptStreamingEventEmitter,
}



export declare interface AgentPromptResultToken{
	user?: number | undefined,
	enrichment?: number | undefined,
	/**
	 * The number of tokens used by the prompt input.
	 */
	input?: number | undefined,
	/**
	 * The number of tokens used by the prompt output.
	 */
	output?: number | undefined,
}

export declare interface AgentPromptResult{
	message?: string | undefined,
	stop_reason?: string | undefined | 'stop',
	/**
	 * Information about the tokens used in this response.
	 */
	tokens?: Array<AgentPromptResultToken> | undefined,
}

export declare interface AgentPromptOpts{
	/**
	 *
	 */
	stackspotKnowledge?: boolean,
	/**
	 *
	 */
	returnKsInResponse?: boolean,
}


export declare class StackspotAiAgents{
	#root: Stackspot;

	constructor(root: Stackspot);

	/**
	 *
	 * @param {string} agentId
	 * @param {string} prompt
	 * @param {?AgentPromptOpts} [opts]
	 * @returns {Promise<AgentPromptResult>}
	 */
	async sendPrompt(
		agentId: string,
		prompt: string,
		opts?: AgentPromptOpts | undefined
	): Promise<AgentPromptResult>;


	/**
	 *
	 * @param {string} agentId
	 * @param {string} prompt
	 * @param {?AgentPromptOpts} [opts]
	 * @returns {Promise<ReadableStream>}
	 */
	async sendPromptStreamingRaw(
		agentId: string,
		prompt: string,
		opts?: AgentPromptOpts | undefined
	): Promise<ReadableStream>;


	/**
	 *
	 * @param {string} agentId
	 * @param {string} prompt
	 * @param {?AgentPromptOpts} [opts]
	 * @returns {Promise<AgentPromptStreamingResult>}
	 */
	async sendPromptStreaming(
		agentId: string,
		prompt: string,
		opts?: AgentPromptOpts | undefined
	): Promise<AgentPromptStreamingResult>;

}