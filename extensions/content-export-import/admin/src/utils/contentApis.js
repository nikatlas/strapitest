import { request } from "strapi-helper-plugin";
import { filter } from 'lodash';
import pluralize from 'pluralize';
import {MODEL_KIND} from "../constants/model-kind";

export const getModels = () => {
  return request("/content-type-builder/content-types", {
    method: "GET",
  }).then((response) => {
    return filter(response.data, (model) => !model.plugin)
  }).catch(() => {
    return [];
  });
};

export const fetchEntries = async (apiId, kind) => {
  const url = (kind === MODEL_KIND.collection) ? `/${pluralize(apiId)}` : `/${apiId}`;
  let res = [];
  let temp=[];
  do {
	  temp = await request(url + '?_start=' + res.length, { method: 'GET' });
	  res = res.concat(temp);
  } while(temp.length > 0);
  return res;
};