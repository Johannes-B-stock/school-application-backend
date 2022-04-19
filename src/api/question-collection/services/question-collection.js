'use strict';

/**
 * question-collection service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::question-collection.question-collection');
