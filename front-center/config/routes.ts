
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {name: '登录', path: '/user/login', component: './User/Login'},
      {name: '注册', path: '/user/register', component: './User/Register'},
    ],
  },
  {path: '/welcome', name: '欢迎', icon: 'smile', component: './Welcome'},
  {
    path: '/system',
    name: '系统管理',
    icon: 'bank',
    access: 'canAdmin',
    routes: [
      {path: '/system', redirect: '/system/user'},
      {path: '/system/user', name: '用户管理', component: './System/User', access: 'canAdmin'},
    ],
  },
  // {name: '查询表格', icon: 'table', path: '/list', component: './TableList'},
  {path: '/', redirect: '/welcome'},
  {path: '*', layout: false, component: './404'},
];
