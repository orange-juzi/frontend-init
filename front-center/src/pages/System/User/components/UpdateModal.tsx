import {
  ActionType,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import '@umijs/max';
import {Form, message, Modal, Upload, UploadFile, UploadProps} from 'antd';
import React, {useEffect, useState} from 'react';
import {localCache} from "@/utils/cache";
import {TOKEN} from "@/constant";
import {searchRoleList} from "@/services/backend-center/roleController";
import {searchDeptList} from "@/services/backend-center/deptController";
import {useForm} from "antd/es/form/Form";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {RcFile, UploadChangeParam} from "antd/es/upload";
import {update} from "@/services/backend-center/userController";

interface UpdateFormProps {
  // onCancel: () => void;
  // onOk: (values: API.InsertUserForm) => void;
  visible: boolean;
  actionRef: React.MutableRefObject<ActionType | undefined>; // 接收 actionRef 属性
  setUpdateModalVisible: any
  values: API.User
};
const UpdateModal: React.FC<UpdateFormProps> = (props) => {
  const {visible, setUpdateModalVisible, actionRef, values} = props
  const [form] = useForm()
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [fileList] = useState<UploadFile[]>([]);

  //上传文件前的校验
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('图片必须小于2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  //上传文件后的操作
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) { //info.file.response后端返回的数据
        console.log(info)
        message.success(info.file.response.msg)
        setLoading(false);
        setImageUrl(info.file.response.data);
      } else {
        message.error("图片上传错误")
      }
    }
  };
  const uploadButton = (
    <button style={{border: 0, background: 'none'}} type="button">
      {loading ? <LoadingOutlined/> : <PlusOutlined/>}
      <div style={{marginTop: 8}}>Upload</div>
    </button>
  );

  //取消按钮的操作
  const onCancel = () => {
    setUpdateModalVisible(false) //关闭弹窗
  }

  //更新操作
  const handleUpdate = async (fields: API.UpdateUserForm) => {
    const hide = message.loading('正在更新');
    try {
      const res = await update({
        ...fields
      });
      // console.log(res)
      hide();
      if (res.code === 200) {
        message.success(res.msg);
      } else {
        message.error(res.msg);
      }
      return res
    } catch (error) {
      hide();
      message.error('修改失败');
      // return false;
    }
  };


  //确认按钮的操作
  async function onOk() {
    const value: any = form.getFieldsValue() as API.UpdateUserForm;
    const newValues: any = {
      ...value,
      id: values.id,
      photo:imageUrl
    }
    const res = await handleUpdate(newValues) //表单中的内容传递给函数
    if (res?.code === 200) {
      onCancel()//添加成功后关闭弹窗
      actionRef.current?.reload(); //重新加载页面
    }
  }

  useEffect(() => {
    setImageUrl(values.photo || '');
    //角色字段处理，将查询出来的文本值映射成id值，只有赋值为数字类型的时候才可以显示选中
    const role = values.role?.split('，') as string[]
    const roleId = role?.map((roleId: string) => {
      const roleMapping: any = {
        '管理员': 0,
        '总经理': 1,
        '部门经理': 2,
        '普通员工': 3,
        'HR': 4,
        '财务': 5,
      };
      return roleMapping[roleId];
    });
    //部门字段处理，将查询出来的文本值映射成id值
    const dept = values.deptId as any
    const deptMapping: any = {
      '管理部': 1,
      '行政部': 2,
      '技术部': 3,
      '市场部': 4,
      '后勤部': 5,
      '人事部': 6,
    }
    const deptValue = Object.keys(deptMapping).find(key => key === dept) as string;
    const deptId = deptMapping[deptValue]

    form.setFieldsValue({
      username: values.username,
      nickname: values.nickname,
      photo: imageUrl,
      sex: values.sex,
      tel: values.tel,
      role: roleId,
      deptId: deptId,
      status: values.status,
      createTime: values.createTime,
      updateTime: values.updateTime
    });
  }, [values]);
  return (
    <Modal
      destroyOnClose  //配合destroyOnClose+reserve={false}才能保证表单内容清除
      title={'新建'}
      open={visible}//控制弹窗是否显示
      onCancel={onCancel}  //点击取消才执行onCancel函数
      onOk={onOk}  //点击确定才执行onOk函数
    >
      {/*autoComplete取消浏览器自动填充*/}
      <Form autoComplete="off" form={form} preserve={false} initialValues={{
        // username: values.username,
        // nickname: values.nickname,
        // photo: values.photo,
        // sex: values.sex,
        // tel: values.tel,
        // role: [values.role],
        // deptId: values.deptId,
        // status: values.status,
        // createTime: values.createTime,
        // updateTime: values.updateTime
      }}>
        <ProFormText
          rules={[
            {
              required: true,
              pattern: /^[a-zA-Z0-9]{5,20}$/,
              message: '用户名必须由 5 到 20 个字符的字母或数字组成！',
            },
          ]}
          width="md"
          name="username"
          label="账号"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '昵称为必填项',
            },
          ]}
          width="md"
          name="nickname"
          label="昵称"
        />
        <Form.Item
          label="头像"
          name="photo"
          rules={[{required: true, message: '用户头像不能为空'}]}
        >
          <Upload
            name="file"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            action="/api/user/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
            // fileList={fileList}
            headers={{"Token": `Bearer ${localCache.getCache(TOKEN)}`}}  // 添加请求头token
          >
            {imageUrl ? <img src={imageUrl} alt="avatar" style={{width: '100%'}}/> : uploadButton}
          </Upload>
        </Form.Item>

        <ProFormSelect
          rules={[
            {
              required: true,
              message: '性别为必填项',
            },
          ]}
          width="md"
          name="sex"
          label="性别"
          valueEnum={{
            "男": {text: "男"},
            "女": {text: "女"}
          }}
        />
        <ProFormText
          rules={[
            {
              required: true,
              pattern: /^1\d{10}$/,
              message: '电话内容不正确',
            },
          ]}
          width="md"
          name="tel"
          label="电话"
        />
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '角色为必填项',
            },
          ]}
          width="md"
          name="role"
          mode="multiple"//多选
          label="角色"
          request={async () => { //多选框，角色发起请求，需要返回label和value的对象数组
            const {data} = await searchRoleList()
            const options = data.map((item: any) => ({
              label: item.roleName,
              value: item.id,
            }));
            return options
          }}
        />
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '部门为必填项',
            },
          ]}
          width="md"
          name="deptId"
          label="部门"
          request={async () => {
            const {data} = await searchDeptList()
            const options = data.map((item: any) => ({
              label: item.deptName,
              value: item.id,
            }));
            return options
          }}
        />
        <ProFormSelect
          rules={[
            {
              required: true,
              message: '状态为必填项',
            },
          ]}
          width="md"
          name="status"
          label="状态"

          options={[//根据后端返回来id值，表单属性为数值，标签为文本
            {
              label: '在线',
              value: 1,
            },
            {
              label: '离线',
              value: 2,
            }
          ]}
        />
      </Form>
    </Modal>
  );
};
export default UpdateModal;
