'use strict';

/**
 * staff-application service.
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::staff-application.staff-application');
