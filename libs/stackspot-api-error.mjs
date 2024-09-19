export default class StackspotApiError extends Error{

	status;
	code;
	payload;

	/**
	 *
	 * @param {string|number} status
	 * @param {string} code
	 * @param {string} [message]
	 * @param {string} [payload]
	 * @param {Error} [cause]
	 */
	constructor(status, code, message, payload, cause){
		super(message);
		this.name = this.constructor.name;
		this.status = status;
		this.code = code;
		this.payload = payload;
		this.cause = cause;

		if('captureStackTrace' in Error)
			Error.captureStackTrace(this, StackspotApiError);
		else
			this.stack = (new Error()).stack;

		if(cause?.stack){
			if(!this.stack)
				this.stack = '';
			this.stack += `\nCaused by: ${cause?.stack}`;
		}
	}
}