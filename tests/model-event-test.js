'use strict';

const assert = require('assert');
const Model = require('@janiscommerce/model');
const Settings = require('@janiscommerce/settings');

const sandbox = require('sinon').createSandbox();

const ModelEvent = require('../lib/model-event');

const modelEvent = new ModelEvent();

describe('EventParser', () => {
	const sampleQuery = {
		filters: {
			client: 'core',
			entity: 'test',
			event: 'testing'
		},
		limit: 1
	};

	const sampleQueryResponse = [
		{
			client: 'core',
			entity: 'test',
			event: 'testing',
			subscribers: ['https://test@test.com']
		}
	];

	afterEach(() => {
		sandbox.restore();
	});

	it('Should return empty setting when not are declared', () => {
		assert.deepStrictEqual(ModelEvent.settings, {});
	});

	it('Should return setting declared', () => {
		const settings = { databaseKey: 'testing' };
		sandbox.stub(Settings, 'get').returns(settings);

		assert.deepStrictEqual(ModelEvent.settings, settings);
	});

	it('Should return databaseKey as _default when settings are not declared', () => {
		assert.deepStrictEqual(modelEvent.databaseKey, '_default');
	});

	it('Should return databaseKey declared on settings', () => {
		const settings = { databaseKey: 'testing' };
		sandbox.stub(Settings, 'get').returns(settings);

		assert.strictEqual(modelEvent.databaseKey, 'testing');
	});

	it('Should return table as events when settings are not declared', () => {
		assert.deepStrictEqual(ModelEvent.table, 'events');
	});

	it('Should return the fields for SQL query', () => {
		assert.deepStrictEqual(ModelEvent.fields, {
			client: true,
			entity: true,
			event: true
		});
	});

	it('Should return table declared on settings', () => {
		const settings = { table: 'testing' };
		sandbox.stub(Settings, 'get').returns(settings);

		assert.strictEqual(ModelEvent.table, 'testing');
	});

	it('Should return undefined when does not receive entity or event', async () => {
		await assert.rejects(modelEvent.getEvent(), {
			name: 'ModelEventError',
			message: 'Entity and event are required and must be strings'
		});
	});

	it('Should return empty object when receive empty response from the model package', async () => {
		sandbox
			.stub(Model.prototype, 'get')
			.withArgs(sampleQuery)
			.returns(false);

		const event = await modelEvent.getEvent('core', 'test', 'testing');
		assert.deepStrictEqual(event, {});
	});

	it('Should return empty object when receive empty array from model package', async () => {
		sandbox
			.stub(Model.prototype, 'get')
			.withArgs(sampleQuery)
			.returns([]);

		const event = await modelEvent.getEvent('core', 'test', 'testing');
		assert.deepStrictEqual(event, {});
	});

	it('Should return the event return by model package', async () => {
		sandbox
			.stub(Model.prototype, 'get')
			.withArgs(sampleQuery)
			.returns(sampleQueryResponse);

		const event = await modelEvent.getEvent('core', 'test', 'testing');
		assert.deepStrictEqual(event, sampleQueryResponse[0]);
	});
});
