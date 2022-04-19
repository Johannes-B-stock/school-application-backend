'use strict';

/**
 * school-application service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::school-application.school-application');
