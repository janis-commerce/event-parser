'use strict';

const EventParserError = require('./event-parser-error');

const ModelEvent = require('./model-event');

class EventParser {
	/**
	 * Get the event actions
	 *
	 * @param {String} message object
	 * @return {Array} Event actions
	 * @throw EventParserError
	 */
	static async getSubscribers(message) {
		if(!message || typeof message !== 'object')
			throw new EventParserError('message is required', EventParserError.codes.INVALID_DATA);

		const { client = 'core', entity, event } = message;

		if(!entity || !event)
			throw new EventParserError('message entity and event are required', EventParserError.codes.INVALID_DATA);

		const modelEvent = new ModelEvent();
		const getEvent = await modelEvent.getEvent(client, entity, event);

		if(!getEvent || !Array.isArray(getEvent) || getEvent.length === 0)
			return [];

		const { subscribers } = getEvent[0];
		return subscribers && Array.isArray(subscribers) ? subscribers : [];
	}
}

module.exports = EventParser;
