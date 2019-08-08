'use strict';

const assert = require('assert');

const sandbox = require('sinon').createSandbox();

const Package = require('./../index');

const { EventParser, ModelEvent } = require('./../lib');

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
		subscribers: ['http://test@test.com']
	};

	afterEach(() => {
		sandbox.restore();
	});

	it('should return and instance of event parser', () => {
		assert.deepStrictEqual(Package, EventParser);
	});

	it('should throw error when not receive message', async () => {
		await assert.rejects(EventParser.getSubscribers(), {
			name: 'EventParserError',
			message: 'Message is required and must be an object'
		});
	});

	it('should throw error when message is an array', async () => {
		await assert.rejects(EventParser.getSubscribers([]), {
			name: 'EventParserError',
			message: 'Message is required and must be an object'
		});
	});

	it('should throw error when not receive entity', async () => {
		await assert.rejects(EventParser.getSubscribers({}), {
			name: 'EventParserError',
			message: 'Message entity and event are required'
		});
	});

	it('should throw error when not receive event', async () => {
		await assert.rejects(EventParser.getSubscribers({ entity: 'test' }), {
			name: 'EventParserError',
			message: 'Message entity and event are required'
		});
	});

	it('should return empty array when event is an empty object', async () => {
		sandbox.stub(ModelEvent.prototype, 'get').returns({});

		const subscribers = await EventParser.getSubscribers(message);
		assert.deepStrictEqual(subscribers, []);
	});

	it('should return empty array when not found subscribers', async () => {
		const event = { ...getEvent };
		event.subscribers = [];
		sandbox.stub(ModelEvent.prototype, 'get').returns([event]);

		const subscribers = await EventParser.getSubscribers(message);
		assert.deepStrictEqual(subscribers, []);
	});

	it('should return the subscribers', async () => {
		sandbox.stub(ModelEvent.prototype, 'get').returns([getEvent]);

		const subscribers = await EventParser.getSubscribers(message);
		assert.deepStrictEqual(subscribers, getEvent.subscribers);
	});
});
