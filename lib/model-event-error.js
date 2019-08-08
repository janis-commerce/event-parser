'use strict';

class ModelEventError extends Error {
	static get codes() {
		return {
			INVALID_DATA: 1
		};
	}

	constructor(err, code) {
		super(err);
		this.message = err.message || err;
		this.code = code;
		this.name = 'ModelEventError';
	}
}

module.exports = ModelEventError;
