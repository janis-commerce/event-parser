'use strict';

const assert = require('assert');

const sandbox = require('sinon').createSandbox();

const EventParser = require('../lib/event-parser');

const ModelEvent = require('../lib/model-event');

describe('EventParser', () => {
	const message = {
		client: 'core',
		entity: 'test',
		event: 'testing'
	};

	const event = {
		client: 'core',
		entity: 'test',
		event: 'testing',
		subscribers: ['http://test@test.com']
	};

	afterEach(() => {
		sandbox.restore();
	});

	it('Should throw error when not receive message', async () => {
		await assert.rejects(EventParser.getSubscribers(), {
			name: 'EventParserError',
			message: 'Message is required and must be an object'
		});
	});

	it('Should throw error when message is an array', async () => {
		await assert.rejects(EventParser.getSubscribers([]), {
			name: 'EventParserError',
			message: 'Message is required and must be an object'
		});
	});

	it('Should throw error when not receive entity', async () => {
		await assert.rejects(EventParser.getSubscribers({}), {
			name: 'EventParserError',
			message: 'Message entity and event are required'
		});
	});

	it('Should throw error when not receive event', async () => {
		await assert.rejects(EventParser.getSubscribers({ entity: 'test' }), {
			name: 'EventParserError',
			message: 'Message entity and event are required'
		});
	});

	it('Should return empty array when event is an empty object', async () => {
		sandbox.stub(ModelEvent.prototype, 'get').returns({});

		const subscribers = await EventParser.getSubscribers(message);
		assert.deepStrictEqual(subscribers, []);
	});

	it('Should return empty array when not found subscribers', async () => {
		sandbox.stub(ModelEvent.prototype, 'get').returns([{ ...event, subscribers: [] }]);

		const subscribers = await EventParser.getSubscribers(message);
		assert.deepStrictEqual(subscribers, []);
	});

	it('Should return the subscribers', async () => {
		sandbox.stub(ModelEvent.prototype, 'get').returns([event]);

		const subscribers = await EventParser.getSubscribers(message);
		assert.deepStrictEqual(subscribers, event.subscribers);
	});
});
