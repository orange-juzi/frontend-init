// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';

/** 获取角色列表 GET /role/searchRoleList */
export async function searchRoleList(options?: { [key: string]: any }) {
  return request<API.RoleSearchResult>('/role/searchRoleList', {
    method: 'GET',
    ...(options || {}),
  });
}
