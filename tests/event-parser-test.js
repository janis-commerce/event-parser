'use strict';

const assert = require('assert');

const sandbox = require('sinon').createSandbox();

const Package = require('./../index');

const { EventParser, ModelEvent } = require('./../lib');

const eventParser = new EventParser();

describe('EventParser', () => {
	const message = {
		client: 'core',
		entity: 'test',
		event: 'testing'
	};

	const getEvent = {
		client: 'core',
		entity: 'test',
		event: 'testing',
		actions: [
			{
				source: 'shipping',
				client: 'core/client',
				entity: 'order',
				event: 'create'
			}
		]
	};

	afterEach(() => {
		sandbox.restore();
	});

	it('should return and instance of event parser', () => {
		assert.deepStrictEqual(Package, EventParser);
	});

	it('should throw error when not receive params', async () => {
		await assert.rejects(eventParser.getActions(), {
			name: 'EventParserError',
			message: 'message is required'
		});
	});

	it('should throw error when not receive entity', async () => {
		await assert.rejects(eventParser.getActions({}), {
			name: 'EventParserError',
			message: 'message entity and event are required'
		});
	});

	it('should throw error when not receive event', async () => {
		await assert.rejects(eventParser.getActions({ entity: 'test' }), {
			name: 'EventParserError',
			message: 'message entity and event are required'
		});
	});

	it('should throw error when not found any event', async () => {
		sandbox.stub(ModelEvent.prototype, 'get').returns([]);

		const { client, entity, event } = message;
		await assert.rejects(eventParser.getActions(message), {
			name: 'EventParserError',
			message: `Event not found with params provided client: '${client}', entity: '${entity}', event: '${event}'`
		});
	});

	it('should throw error when not found any actions associated with the event', async () => {
		const event = { ...getEvent };
		event.actions = [];
		sandbox.stub(ModelEvent.prototype, 'get').returns([event]);

		await assert.rejects(eventParser.getActions(message), {
			name: 'EventParserError',
			message: 'Event does not have any associated action'
		});
	});

	it('should return the action', async () => {
		sandbox.stub(ModelEvent.prototype, 'get').returns([getEvent]);

		const actions = await eventParser.getActions(message);
		assert.deepStrictEqual(actions, getEvent.actions);
	});
});
