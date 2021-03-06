'use strict';

const uitls  = require('./utils/content');
const _ = require('lodash');

/**
 * ContentExportImport.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

module.exports = {
  importData: async (ctx) => {
    const { targetModel, source, kind } = ctx.request.body;
    let ids = [];
    try {
      if (kind === 'collectionType' && Array.isArray(source)) {
        for (let i = 0; i < source.length; i++) {
          //await uitls.importItemByContentType(targetModel, source[i])
          await uitls.importSingleType(targetModel, source[i]);
          ids.push(source[i].id);
        }
        await utils.deleteByReverseIds(targetModel, ids);
      } else {
        await uitls.importSingleType(targetModel, source);
      }
    } catch (e) {
      console.log(e);
      ctx.throw(409, e.message);
    }
  },
  deleteAllData: async (targetModelUid, ctx) => {
    try {
      const all = await uitls.findAll(targetModelUid);
      const ids = _.map(all, (item) => item.id);
      await uitls.deleteByIds(targetModelUid, ids);
      return all.length;
    } catch (e) {
      ctx.throw(409, e.message);
    }
  }
};
