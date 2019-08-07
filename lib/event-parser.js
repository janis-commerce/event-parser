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
	async getActions(message) {
		if(!message || typeof message !== 'object')
			throw new EventParserError('message is required', EventParserError.codes.INVALID_DATA);

		const { client = 'core', entity, event } = message;

		if(!entity || !event)
			throw new EventParserError('message entity and event are required', EventParserError.codes.INVALID_DATA);

		const modelEvent = new ModelEvent();
		const getEvent = await modelEvent.getEvent(client, entity, event);

		if(!getEvent || !Array.isArray(getEvent) || getEvent.length === 0) {
			throw new EventParserError(
				`Event not found with params provided client: '${client}', entity: '${entity}', event: '${event}'`,
				EventParserError.codes.NOT_FOUND
			);
		}

		const { actions } = getEvent[0];
		if(!actions || !Array.isArray(actions) || actions.length === 0)
			throw new EventParserError('Event does not have any associated action', EventParserError.codes.NOT_FOUND);

		return actions;
	}
}

module.exports = EventParser;
