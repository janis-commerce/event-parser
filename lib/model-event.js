'use strict';

const Model = require('@janiscommerce/model');
const Settings = require('@janiscommerce/settings');

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
	 * Get event by filters
	 *
	 * @return {Array} The event
	 */
	getEvent(client, entity, event) {
		if(!entity || !event)
			return;

		return this.get({
			filters: {
				client,
				entity,
				event
			},
			limit: 1
		});
	}
}

module.exports = ModelEvent;
