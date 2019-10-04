'use strict';

const EventParserError = require('./event-parser-error');

const ModelEvent = require('./model-event');

const modelEvent = new ModelEvent();

class EventParser {
	/**
	 * Get the event actions
	 *
	 * @param {String} message object
	 * @return {Array} Event actions
	 * @throw EventParserError
	 */
	static async getSubscribers(message) {
		if(!message || typeof message !== 'object' || Array.isArray(message))
			throw new EventParserError('Message is required and must be an object', EventParserError.codes.INVALID_DATA);

		const { client = 'core', entity, event } = message;

		if(!entity || !event)
			throw new EventParserError('Message entity and event are required', EventParserError.codes.INVALID_DATA);

		const { subscribers } = await modelEvent.getEvent(client, entity, event);

		return subscribers && Array.isArray(subscribers) ? subscribers : [];
	}
}

module.exports = EventParser;
