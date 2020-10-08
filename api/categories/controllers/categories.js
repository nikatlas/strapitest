'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    let entity;
    if (ctx.is('multipart')) {
      const { data, files } = parseMultipartData(ctx);
      entity = await strapi.services.restaurant.create(data, { files });
    } else {
      entity = await strapi.services.restaurant.create(ctx.request.body);
    }
    let sanentity = sanitizeEntity(entity, { model: strapi.models.restaurant });
    console.log("Entity:",entity, sanentity);
    return sanentity;
  },
};
