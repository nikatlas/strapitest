'use strict';
const { sanitizeEntity } = require('strapi-utils');

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */
function validateEmail(email) {
  	const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  	return re.test(String(email).toLowerCase());
}

module.exports = {
	async create(ctx) {
		let b = ctx.request.body;
	    if(b.email && validateEmail(b.email)) {
	    	let entity;
	    	entity = await strapi.query('newsletter').findOne({ email: b.email });
	    	if(!entity)
	    		entity = await strapi.services.newsletter.create(ctx.request.body);
	    	return sanitizeEntity(entity, { model: strapi.models.newsletter });
	    } else {
	    	return ctx.throw(400, "Wrong email provided!");
	    }
	}
};
