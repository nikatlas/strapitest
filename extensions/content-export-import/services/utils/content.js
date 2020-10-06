const importItemByContentType = (id, item) => {
  return strapi.query(id).create(item);
};

const importSingleType = async (uid, item) => {
  const existing = await strapi.query(uid).find({ code: item.id });
  if (existing.length > 0) {
    return strapi.query(uid).update({
      code: existing[0].code,
    }, item)
  } else {
    return strapi.query(uid).create({ ...item, code: item.id });
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
