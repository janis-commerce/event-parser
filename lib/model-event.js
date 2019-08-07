'use strict';

const Model = require('@janiscommerce/model');
const Settings = require('@janiscommerce/settings');

class ModelEvent extends Model {
	static get settings() {
		return Settings.get('events') || {};
	}

	get databaseKey() {
		return this.constructor.settings.databaseKey || '_default';
	}

	static get table() {
		return this.settings.table || 'events';
	}

	getAction(client, entity, event) {
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
