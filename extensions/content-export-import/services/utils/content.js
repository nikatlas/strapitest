var Bookshelf = require('bookshelf').mysqlAuth;

const isGood = (model, item) => {
  // console.log(model);
  switch(model.modelName) {
    case 'plugins':
      if (!item.tools[0] || !item.author)
        return false;
      break;
  }
  return true;
}

const filterModel = (model, item) => {
  let res = {};
  // console.log(model._attributes)
  for(var i in model._attributes)
    if(item[i]){
      if(model._attributes[i].type) {
        res[i] = item[i];
      } else if (model._attributes[i].collection) {
        res[i] = JSON.parse(item[i]);
      } else if (model._attributes[i].model) {
        res[i] = parseInt(item[i]);
      }
    }
  return res;
}
const importItemByContentType = (id, item) => {
  return strapi.query(id).create(item);
};

const importSingleType = async (uid, item) => {
  const { id, ...rest } = item;
  const model = strapi.query(uid).model;
  const fitem = filterModel(model,rest);
  if(!isGood(model, fitem)) return deleteByIds(uid, [id]);

  const existing = await strapi.query(uid).find({ id: id });

  if (existing.length > 0) {
    return strapi.query(uid).update({ id }, fitem)
  } else {
    await model.forge({id}).save(null, {method: 'insert'});
    return strapi.query(uid).update({ id }, fitem) 
    // return strapi.query(uid).create({__id:item.id, _id:item.id, ...item});
  }
};

const findAll = (uid) => {
  return strapi.query(uid).find({});
};

const deleteByIds = (uid, ids) => {
  return strapi.query(uid).delete({
    id_in: ids
  });
};
const deleteByReverseIds = (uid, ids) => {
  return strapi.query(uid).delete({
    id_nin: ids
  });
};

module.exports = {
  importItemByContentType,
  findAll,
  deleteByIds,
  deleteByReverseIds,
  importSingleType,
};
