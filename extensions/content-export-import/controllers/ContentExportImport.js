'use strict';

const PLUGIN_ID = 'content-export-import';

const validator = require('./validations');

module.exports = {
  importContent: async (ctx) => {
    const importService = strapi.plugins[PLUGIN_ID].services['contentexportimport'];
    const validationResult = validator.validateImportContentRequest(
      ctx.request.body);
    if (validationResult) {
      ctx.throw(400, validationResult);
      return;
    }
    await importService.importData(ctx);
    ctx.send({
      message: 'ok',
    });
  },
  deleteAllContent: async (ctx) => {
    const importService = strapi.plugins[PLUGIN_ID].services['contentexportimport'];
    const validationResult = validator.validateDeleteRequest(ctx.request.body);
    if (validationResult) {
      ctx.throw(400, validationResult);
      return;
    }
    let count = 0;
    let temp = -1;
    do {
      temp = await importService.deleteAllData(
      ctx.request.body.targetModelUid, ctx);
      count += temp;
    } while(temp > 0);
    ctx.send({
      message: 'ok',
      count,
    });
  }
};
