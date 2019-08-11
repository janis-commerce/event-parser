# event-parser

[![Build Status](https://travis-ci.org/janis-commerce/event-parser.svg?branch=master)](https://travis-ci.org/janis-commerce/event-parser)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/event-parser/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/event-parser?branch=master)

A package for parse the events and get the subscribers

## Installation

```sh
npm install @janiscommerce/event-parser
```

## Settings

This package use the [Settings](https://www.npmjs.com/package/@janiscommerce/settings) package for handle settings.

The setting key is `events` and the available settings are the following

| Setting     | Default Value | Description                            |
| ----------- | ------------- | -------------------------------------- |
| databaseKey | \_default     | The database key from DB configuration |
| table       | events        | The events table name                  |

Example: .janiscommerce.json settings

```javascript
{
	"events" : {
		"databaseKey": "your-database-name",
		"table": "your-table/collection-name"
	}
}

```

## Usage

```js
const EventParser = require('@janiscommerce/event-parser');

const actions = await EventParser.getSubscribers(message);
```

## Subscribe Events

Insert into the events table in database declared on your settings

```javascript
{
	"client" : "core",
	"entity" : "order",
	"event" : "create",
	"subscribers" : [
		"your subscribers"
		...
	]
}

```

_The expected subscribers are endpoints to deliver the event_

## Examples

#### Use without client

```javascript
/** 
  Expected message:
	message = {
		entity: 'order',
		event: 'create'
	}
*/

const EventParser = require('@janiscommerce/event-parser');
const client = await EventParser.getSubscribers(message);

/**
	Expected output:
	[...subscribers...]
 */
```

#### Use with client

```javascript
/** 
  Expected message:
	message = {
		client: 'client-name'
		entity: 'order',
		event: 'create'
	}
*/

const EventParser = require('@janiscommerce/event-parser');
const client = await EventParser.getSubscribers(message);

/**
	Expected output:
	[...subscribers...]
 */
```
