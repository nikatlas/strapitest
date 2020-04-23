'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
	removeFreeImages: async (perPage = 100) => {
	    // console.log(strapi.plugins.upload.services.upload);
	    // return;
	    const config = await strapi
	      .store({
	        environment: strapi.config.environment,
	        type: 'plugin',
	        name: 'upload',
	      })
	      .get({ key: 'provider' }); 
	    let counter = 0;
	    const count = await strapi.services.plugins.traverseImages(async(image) => {
	    		if(image.related && image.related.length < 1) {
	    			await strapi.plugins.upload.services.upload.remove(image, config);
	    			counter++;
	    		}
		});
		console.log("Counter: ", count);    	
		console.log("Removed: ", counter);  
		return counter;  
	},

	removeDuplicateImages: async (perPage = 100) => {
	    // console.log(strapi.plugins.upload.services.upload);
	    // return;
	    const config = await strapi
	      .store({
	        environment: strapi.config.environment,
	        type: 'plugin',
	        name: 'upload',
	      })
	      .get({ key: 'provider' }); 
	    let counter = 0;
	    const set = new Set();
	    const count = await strapi.services.plugins.traverseImages(async(image) => {
	    		if(image && image.sha256 && set.has(image.sha256)) {
	    			await strapi.plugins.upload.services.upload.remove(image, config);
	    			counter++;
	    		} else {
	    			set.add(image.sha256);
	    		}
		});
		console.log("Counter: ", count);    	
		console.log("Duplicated Removed: ", counter);
		return counter; 
	},

	traverseImages: async (callback) => {
		const perPage = 100;
	    const count = await strapi.plugins.upload.services.upload.count();
		const pages = count/perPage;
		let results = [];
	    for(var i = 0; i < pages; i++) {
	    	results = results.concat(
	    		await	strapi.plugins.upload.services.upload
	    		.fetchAll({_start: i*perPage, _limit: perPage})
	    	);
	    }
	    for(var j = 0; j < count; j++) {
	    	const image = results[j];
	    	await callback(image);
	    }	
	    return count;
	},

	traverse: async (table, callback) => {
		const perPage = 100;
	    const count = await table.count();
		const pages = count/perPage;
		let results = [];
	    for(var i = 0; i < pages; i++) {
	    	results = results.concat(
	    		await	table.findAll({_start: i*perPage, _limit: perPage})
	    	);
	    }
	    for(var j = 0; j < count; j++) {
	    	await callback(results[j]);
	    }	
	    return count;
	},

	deleteImage: async(image) => {
		const config = await strapi
	      .store({
	        environment: strapi.config.environment,
	        type: 'plugin',
	        name: 'upload',
	      })
	      .get({ key: 'provider' });
		return await strapi.plugins.upload.services.upload.remove(image, config);
	},


	crawlAdobe: async() => {

	}
};