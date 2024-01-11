﻿import type {RequestOptions} from '@@/plugin-request/request';
import {history, RequestConfig} from '@umijs/max';
import {message} from 'antd';
import {localCache} from "@/utils/cache";
import {TOKEN} from "@/constant";


// 与后端约定的响应数据格式
interface ResponseStructure {
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
}

// const isDev = process.env.NODE_ENV === 'development';

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const requestConfig: RequestConfig = {
  // baseURL: isDev ? BACKEND_HOST_LOCAL : BACKEND_HOST_PROD,
  baseURL: "/api",
  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      // 拦截请求配置，进行个性化处理。
      const token = localCache.getCache(TOKEN);
      if (config.headers && token) {
        config.headers["token"] = 'Bearer ' + token;
      }
       //进入到主页面，并且没有token就重新登录
      if (!token && !location.pathname.includes('/user/login')) {
        // 用户未登录，跳转到登录页
        message.warning("您还未登录，请先登录！")
        window.location.href = `/user/login?redirect=${window.location.href}`;
      }
      return config
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      // 请求地址
      const requestPath: string = response.config.url ?? '';
      //token
      const token: string = localCache.getCache(TOKEN);
      // 拦截响应数据，进行个性化处理
      const {data} = response as unknown as ResponseStructure;
      if (!data) {
        throw new Error('服务异常');
      }
      // 错误码处理
      const code: number = data.code;
      // 未登录，且不为获取用户登录信息接口
      // if (code !== 200 && !requestPath.includes("/user/currentUser")
      //   && !location.pathname.includes('/user/login')) {
      //   console.log(requestPath)
      //   // 跳转至登录页
      //   // window.location.href = `/user/login?redirect=${window.location.href}`;
      //   message.error("请先登录!");
      // }
      if (!token && !location.pathname.includes('/user/login') && !location.pathname.includes('/user/register')) {
        message.error("您还未登录，请先登录！");
        history.push("/user/login")
      }
      return response;
    },
  ],
};
