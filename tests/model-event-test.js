'use strict';

const assert = require('assert');
const Model = require('@janiscommerce/model');
const Settings = require('@janiscommerce/settings');

const sandbox = require('sinon').createSandbox();

const { ModelEvent } = require('../lib');

const modelEvent = new ModelEvent();

describe('EventParser', () => {
	afterEach(() => {
		sandbox.restore();
	});

	it('should return empty setting when not are declared', () => {
		assert.deepStrictEqual(ModelEvent.settings, {});
	});

	it('should return setting declared', () => {
		const settings = { databaseKey: 'testing' };
		sandbox.stub(Settings, 'get').returns(settings);

		assert.deepStrictEqual(ModelEvent.settings, settings);
	});

	it('should return databaseKey as _default when settings are not declared', () => {
		assert.deepStrictEqual(modelEvent.databaseKey, '_default');
	});

	it('should return databaseKey declared on settings', () => {
		const settings = { databaseKey: 'testing' };
		sandbox.stub(Settings, 'get').returns(settings);

		assert.strictEqual(modelEvent.databaseKey, 'testing');
	});

	it('should return table as events when settings are not declared', () => {
		assert.deepStrictEqual(ModelEvent.table, 'events');
	});

	it('should return table declared on settings', () => {
		const settings = { table: 'testing' };
		sandbox.stub(Settings, 'get').returns(settings);

		assert.strictEqual(ModelEvent.table, 'testing');
	});

	it('should return undefined when does not receive entity or event', async () => {
		await assert.rejects(modelEvent.getEvent(), {
			name: 'ModelEventError',
			message: 'Entity and event are required and must be strings'
		});
	});

	it('should return the event return by model package', async () => {
		const events = [
			{
				client: 'core',
				entity: 'test',
				event: 'testing',
				subscribers: ['https://test@test.com']
			}
		];
		sandbox
			.stub(Model.prototype, 'get')
			.withArgs({
				filters: {
					client: 'core',
					entity: 'test',
					event: 'testing'
				},
				limit: 1
			})
			.returns(events);

		const event = await modelEvent.getEvent('core', 'test', 'testing');
		assert.deepStrictEqual(event, events[0]);
	});
});
