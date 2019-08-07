'use strict';

class EventParserError extends Error {
	static get codes() {
		return {
			INVALID_DATA: 1,
			NOT_FOUND: 2,
			INTERNAL_ERROR: 3
		};
	}

	constructor(err, code) {
		super(err);
		this.message = err.message || err;
		this.code = code;
		this.name = 'EventParserError';
	}
}

module.exports = EventParserError;
