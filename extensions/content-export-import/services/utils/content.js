var Bookshelf = require('bookshelf').mysqlAuth;

const filterModel = (model, item) => {
  let res = {};
  for(var i in model._attributes)
    if(item[i])
      res[i] = item[i];
  return res;
}
const importItemByContentType = (id, item) => {
  return strapi.query(id).create(item);
};

const importSingleType = async (uid, item) => {
  let { id, ...rest } = item;
  const existing = await strapi.query(uid).find({ id: id });
  if (existing.length > 0) {
    return strapi.query(uid).update({
      id: existing[0].id
    }, rest)
  } else {
    let model = strapi.query(uid).model;
    let fitem = filterModel(model,rest);
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
