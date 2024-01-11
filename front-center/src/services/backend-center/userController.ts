// @ts-ignore
/* eslint-disable */
import {request} from '@umijs/max';

/** 获取当前用户 GET /user/currentUser */
export async function getCurrentUser(options?: { [key: string]: any }) {
  return request<API.currentUserResult>('/user/currentUser', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 查询用户列表 POST /user/getUserList */
export async function getUserList(
  body: API.SearchUserByPageForm,
  options?: { [key: string]: any },
) {
  return request<API.ResultPageUtils>('/user/getUserList', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 添加用户 POST /user/insert */
export async function insert(
  body: API.InsertUserForm,
  options?: { [key: string]: any },
) {
  return request<API.UserInsertResult>('/user/insert', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 修改用户 POST /user/update */
export async function update(
  body: API.UpdateUserForm,
  options?: { [key: string]: any },
) {
  return request<API.UserUpdateResult>('/user/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除用户 POST /user/delete */
export async function deleteUser(
  body: [],
  options?: { [key: string]: any },
) {
  return request<API.DeleteUpdateResult>('/user/delete', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户登录 POST /user/login */
export async function login(body: API.LoginForm, options?: { [key: string]: any }) {
  return request<API.UserLoginResult>('/user/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 退出登录 GET /user/logout */
export async function logout(options?: { [key: string]: any }) {
  return request<API.UserLogoutResult>('/user/logout', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 用户注册 POST /user/register */
export async function register(body: API.RegisterForm, options?: { [key: string]: any }) {
  return request<API.UserRegisterResult>('/user/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
