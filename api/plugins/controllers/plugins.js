'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
	upvote: async (ctx) => {
		let { id } = ctx.params;
		id = parseInt(id);
		let rip = ctx.req.headers['x-forwarded-for'] || ctx.req.connection.remoteAddress;
		let plugin = await strapi.query('plugins').find({id});
		if(!plugin[0]) {
			ctx.throw(400, { status: "error", message: "Plugin doesnt exist" });
			return;
		}


		let upvoter = await strapi.query('upvotes').find({ ip: rip });
		if(!upvoter[0]) {
			upvoter = await strapi.query('upvotes').create({ip: rip});
		} else {
			upvoter = upvoter[0];
		}

		let plugins = upvoter.plugins.map((i) => i.id);
		if(plugins && plugins.includes(id)) {
			await strapi.query('plugins').update({id}, {stars: (plugin[0].stars || 1) - 1})
			// remove from memory
			await strapi.query('upvotes').update({ip: rip}, { plugins: plugins.filter((i) => i != id) })
			ctx.send({ message: "Removed upvote successfully!", status: "ok" });
		} else {
			await strapi.query('plugins').update({id}, {stars: (plugin[0].stars || 0) + 1})
			// add to memory
			await strapi.query('upvotes').update({ip: rip}, { plugins: [...(plugins || []), id] })
			ctx.send({ message: "Upvoted successfully!", status: "ok" });
		}
	} 
};
