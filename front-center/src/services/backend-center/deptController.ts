// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';

/** 获取角色列表 GET /dept/searchDeptList */
export async function searchDeptList(options?: { [key: string]: any }) {
  return request<API.DeptSearchResult>('/dept/searchDeptList', {
    method: 'GET',
    ...(options || {}),
  });
}
