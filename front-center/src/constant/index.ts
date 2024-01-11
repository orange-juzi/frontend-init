/**
 * 本地后端地址
 */
export const BACKEND_HOST_LOCAL: string = "http://localhost:8090/api";

/**
 * 线上后端地址
 */
export const BACKEND_HOST_PROD: string = "https://...";

/**
 * token名
 */
export const TOKEN: string = "token";

/**
 * 权限
 */
export const PERMISSION: string = "permission";

/**
 * 部门枚举值
 */
export const DEPT_ENUM = {
  1: '管理部',
  2: '行政部',
  3: '技术部',
  4: '市场部',
  5: '后勤部',
  6: '人事部',
}

export const ROLE_ENUM = {
  0: '管理员',
  1: '总经理',
  2: '部门经理',
  3: '普通员工',
  4: 'HR',
  5: '财务',
}

export const STATUS_ENUM = {
  1: '在线',
  2: '离线',
}
