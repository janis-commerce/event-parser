'use strict';

const EventParserError = require('./event-parser-error');

const ModelEvent = require('./model-event');

class EventParser {
	async getEvent(message) {
		if(!message)
			throw new EventParserError('message object is required', EventParserError.codes.INVALID_DATA);

		const { client = 'core', entity, event } = message;

		if(!entity || !event)
			throw new EventParserError('message entity and event are required', EventParserError.codes.INVALID_DATA);

		const modelEvent = new ModelEvent();

		try {
			const getEvent = await modelEvent.getAction(client, entity, event);

			if(!getEvent || getEvent.length === 0) {
				throw new EventParserError(
					`Event not found with params provided client: ${client}, entity: ${entity}, event: ${event}`,
					EventParserError.codes.NOT_FOUND
				);
			}

			const { actions } = getEvent[0];
			if(!actions || actions.length === 0)
				throw new EventParserError('Event does not have any associated action', EventParserError.codes.NOT_FOUND);

			return actions;
		} catch(err) {
			throw new EventParserError(err, EventParserError.codes.INTERNAL_ERROR);
		}
	}
}

module.exports = EventParser;
