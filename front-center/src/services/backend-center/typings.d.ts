declare namespace API {
  type LoginForm = {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
  };

  type PageUtils = {
    total?: string;
    pageSize?: number;
    totalPage?: number;
    currentPage?: number;
    list?: Record<string, any>[];
  };

  type RegisterForm = {
    /** 用户名 */
    username: string;
    /** 密码 */
    password: string;
    /** 确认密码 */
    checkPassword: string;
  };

  type UserLoginResult = {
    /** 返回码 */
    code?: number;
    /** 返回消息 */
    msg?: string;
    /** 返回数据 */
    data?: Record<string, any>;
  };

  type UserRegisterResult = {
    /** 返回码 */
    code?: number;
    /** 返回消息 */
    msg?: string;
    /** 返回数据 */
    data?: number;
  };

  type UserLogoutResult = {
    /** 返回码 */
    code?: number;
    /** 返回消息 */
    msg?: string;
    /** 返回数据 */
    data?: Record<string, any>;
  };

  type ResultPageUtils = {
    /** 返回码 */
    code?: number;
    /** 返回消息 */
    msg?: string;
    data?: PageUtils;
  };

  type UserInsertResult = {
    /** 返回码 */
    code?: number;
    /** 返回消息 */
    msg?: string;
    data?: boolean;
  };

  type UserUpdateResult = {
    /** 返回码 */
    code?: number;
    /** 返回消息 */
    msg?: string;
    data?: boolean;
  };

  type DeleteUpdateResult = {
    /** 返回码 */
    code?: number;
    /** 返回消息 */
    msg?: string;
    data?: boolean;
  };

  type currentUserResult = {
    /** 返回码 */
    code?: number;
    /** 返回消息 */
    msg?: string;
    data?: User;
  };

  type RoleSearchResult = {
    /** 返回码 */
    code?: number;
    /** 返回消息 */
    msg?: string;
    data?: Role;
  };

  type DeptSearchResult = {
    /** 返回码 */
    code?: number;
    /** 返回消息 */
    msg?: string;
    data?: Dept;
  };

  type SearchUserByPageForm = {
    /** 页数 */
    current: number;
    /** 每页记录数 */
    pageSize: number;
    /** 昵称 */
    nickname?: string;
    /** 性别 */
    sex?: string;
    /** 角色 */
    role?: string;
    /** 部门 */
    deptId?: number;
    status?: number;
  };

  type InsertUserForm = {
    /** 账号 */
    username: string;
    /** 密码 */
    password: string;
    /** 昵称 */
    nickname?: string;
    /** 头像 */
    photo?: string;
    /** 性别 */
    sex?: string;
    /** 电话 */
    tel?: string;
    /** 角色 */
    role?: [];
    /** 部门 */
    deptId?: number;
    status?: number;
  };

  type UpdateUserForm = {
    /** id */
    id?: number;
    /** 账号 */
    username?: string;
    /** 昵称 */
    nickname?: string;
    /** 头像 */
    photo?: string;
    /** 性别 */
    sex?: string;
    /** 电话 */
    tel?: string;
    /** 角色 */
    role?: [];
    /** 部门 */
    deptId?: number;
    status?: number;
  };

  type User = {
    /** 用户ID */
    id?: number;
    /** 用户名 */
    username?: string;
    /** 密码 */
    password?: string;
    /** 昵称 */
    nickname?: string;
    /** photo */
    photo?: string;
    /** 姓名 */
    name?: string;
    /** 性别 */
    sex?: Record<string, any>;
    /** 手机号码 */
    tel?: string;
    /** 邮箱 */
    email?: string;
    /** 角色集合 */
    role?: string;
    /** 是否是超级管理员 */
    root?: number;
    /** 部门编号 */
    deptId?: number;
    /** 状态 */
    status?: number;
    /** 创建时间 */
    createTime?: string;
    /** 修改时间 */
    updateTime?: string;
    /** 是否删除 */
    isDeleted?: number;
  };
}
