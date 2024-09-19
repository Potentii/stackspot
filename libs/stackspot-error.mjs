export default class StackspotError extends Error{

	code;

	/**
	 *
	 * @param {string} code
	 * @param {string} [message]
	 * @param {Error} [cause]
	 */
	constructor(code, message, cause){
		super(message);
		this.name = this.constructor.name;
		this.code = code;
		this.cause = cause;

		if('captureStackTrace' in Error)
			Error.captureStackTrace(this, StackspotError);
		else
			this.stack = (new Error()).stack;

		if(cause?.stack){
			if(!this.stack)
				this.stack = '';
			this.stack += `\nCaused by: ${cause?.stack}`;
		}
	}
}