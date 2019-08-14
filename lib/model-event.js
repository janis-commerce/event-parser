'use strict';

const Model = require('@janiscommerce/model');
const Settings = require('@janiscommerce/settings');

const ModelEventError = require('./model-event-error');

class ModelEvent extends Model {
	/**
	 * Get the MS settings
	 *
	 * @return {Object} Setting
	 */
	static get settings() {
		return Settings.get('events') || {};
	}

	/**
	 * Get Database key
	 *
	 * @return {String} Database key to search in settings
	 */
	get databaseKey() {
		return this.constructor.settings.databaseKey || '_default';
	}

	/**
	 * Get table name
	 *
	 * @return {String} Table/Document name
	 */
	static get table() {
		return this.settings.table || 'events';
	}

	/**
	 * Get fields for MySQL query
	 *
	 * @return {Object} Fields to include in get
	 */
	static get fields() {
		return {
			client: true,
			entity: true,
			event: true
		};
	}

	/**
	 * Get event by filters
	 *
	 * @param {String} client The client
	 * @param {String} entity The entity
	 * @param {String} event The event
	 *
	 * @return {Object} The event
	 */
	async getEvent(client, entity, event) {
		if(!entity || !event) {
			throw new ModelEventError(
				'Entity and event are required and must be strings',
				ModelEventError.codes.INVALID_DATA
			);
		}

		const events = await this.get({
			filters: {
				client,
				entity,
				event
			},
			limit: 1
		});

		return events && Array.isArray(events) && events.length > 0 ? events[0] : {};
	}
}

module.exports = ModelEvent;
