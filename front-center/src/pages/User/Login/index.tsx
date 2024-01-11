import Footer from '@/components/Footer';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import {useEmotionCss} from '@ant-design/use-emotion-css';
import {Helmet, history, useModel} from '@umijs/max';
import {Checkbox, Form, message, Tabs} from 'antd';
import React, {useEffect, useState} from 'react';
import {flushSync} from 'react-dom';
import Settings from '../../../../config/defaultSettings';
import {localCache} from "@/utils/cache";
import {PERMISSION, TOKEN} from "@/constant";
import {CheckboxChangeEvent} from "antd/es/checkbox";
import {login} from "@/services/backend-center/userController";

const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const {initialState, setInitialState} = useModel('@@initialState');
  const [isRemPwd, setIsRemPwd] = useState<boolean>(false)
  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    };
  });
  const [form] = Form.useForm();
  //获取初始状态的用户信息
  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      localCache.setCache("username",userInfo.username)
      localCache.setCache("password",userInfo.password)
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });

    }
  };
  //登录表单提交
  const handleSubmit = async (values: API.LoginForm) => {
    try {
      // 登录
      const res = await login({
        ...values
      });
      if (res.code === 200) {
        const defaultLoginSuccessMessage = '登录成功！';
        message.success(defaultLoginSuccessMessage);
        localCache.setCache(TOKEN, res.data?.token)
        localCache.setCache(PERMISSION, res.data?.permission)
        // 保存已登录用户信息
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      } else {
        message.warning(res.msg)
      }
    } catch (error) {
      const defaultLoginFailureMessage = '登录失败，请重试！';
      message.error(defaultLoginFailureMessage);
    }
  };
  //多选框事件
  const onChange = (e: CheckboxChangeEvent) => {
    setIsRemPwd(e.target.checked)
    localStorage.setItem("isRemPwd",JSON.stringify(e.target.checked))
  };
  //记住密码
  useEffect(()=>{
    if (!localCache.getCache("isRemPwd")) {
      form.setFieldValue("username","")
      form.setFieldValue("password","")
      return;
    }
    //能直接设置表单中的内容
    form.setFieldValue("username",localCache.getCache("username"))
    form.setFieldValue("password",localCache.getCache("password"))
    setIsRemPwd(localCache.getCache("isRemPwd"))
  },[])
  return (
    <div className={containerClassName}>
      <Helmet>
        <title>
          {'登录'}- {Settings.title}
        </title>
      </Helmet>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          form={form}
          logo={<img alt="logo" src="/logo.png"/>}
          title="橘子通用模版"
          subTitle={'快速开发，易上手！最好用的前端模版'}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginForm);
          }}
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: '账户密码登录',
              }
            ]}
          />
          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                placeholder={'请输入用户名'}
                rules={[
                  {
                    required: true,
                    message: '用户名是必填项！',
                  },
                  {
                    pattern: /^[a-zA-Z0-9]{5,20}$/,
                    message: '用户名必须由 5 到 20 个字符的字母或数字组成！',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={'请输入密码'}
                rules={[
                  {
                    required: true,
                    message: '密码是必填项！',
                  },
                ]}
              />
            </>
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <Checkbox name="isRemPwd" onChange={onChange} checked={isRemPwd}>
              记住密码
            </Checkbox>
            <a
              style={{
                float: 'right',
              }}
              href="/user/register"
            >
              新用户注册
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer/>
    </div>
  );
};
export default Login;
