var Bookshelf = require('bookshelf').mysqlAuth;

const filterModel = (model, item) => {
  let res = {};
  for(var i in model._attributes)
    if(item[i]){
      if(model._attributes[i].type) {
        res[i] = item[i];
      } else if (model._attributes[i].collection) {
        res[i] = JSON.parse(item[i]);
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
  
  const existing = await strapi.query(uid).find({ id: id });

  if (existing.length > 0) {
    return strapi.query(uid).update({
      id: existing[0].id
    }, fitem)
  } else {
    return model.forge({id}).save(fitem, {method: 'insert'});
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

module.exports = {
  importItemByContentType,
  findAll,
  deleteByIds,
  importSingleType,
};
