module.exports = {
  // GET /hello
  findDoubles: async ctx => {
	let total = await strapi.plugins.upload.services.upload.count();
  	let free = await strapi.services.plugins.removeFreeImages();
  	let dups = await strapi.services.plugins.removeDuplicateImages();
    ctx.send('Deleted ' + free + 'hanging images and ' + dups + ' duplicates\n Current Counter: ' + (total-free-dups));
  },
};