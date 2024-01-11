import {ActionType, ProFormSelect, ProFormText} from "@ant-design/pro-components";
import React, {useState} from "react";
import {Form, message, Modal, Upload, UploadFile, UploadProps} from "antd";
import {useForm} from "antd/es/form/Form";
import {searchRoleList} from "@/services/backend-center/roleController";
import {searchDeptList} from "@/services/backend-center/deptController";
import {insert} from "@/services/backend-center/userController";
import {LoadingOutlined, PlusOutlined} from "@ant-design/icons";
import {RcFile, UploadChangeParam} from "antd/es/upload";
import {localCache} from "@/utils/cache";
import {TOKEN} from "@/constant";

interface CreateFormProps {
  // onCancel: () => void;
  // onOk: (values: API.InsertUserForm) => void;
  visible: boolean;
  actionRef: React.MutableRefObject<ActionType | undefined>; // 接收 actionRef 属性
  setCreateModalVisible: any
};

const CreateModal: React.FC<CreateFormProps> = ((props) => {
  const {visible, setCreateModalVisible, actionRef} = props
  const [form] = useForm()
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  //添加用户请求
  const handleAdd = async (fields: API.InsertUserForm) => {
    const hide = message.loading('正在添加');
    try {
      const res = await insert({
        ...fields,
        photo: imageUrl //将photo参数传入请求参数中
      });
      hide();
      if (res.code === 200) {
        message.success(res.msg);
      } else {
        message.error(res.msg);
      }
      return res;
    } catch (error) {
      hide();
      message.error('添加失败');
      // return false;
    }
  };
  //这是其他办法，将子组件表单的值传递给父组件
  // const handleOk = async () => {
  //   try {
  //     // 获取表单数据
  //     const values = form.getFieldsValue() as API.InsertUserForm;
  //     // 调用父组件的 onOk 函数，并传递表单数据
  //     onOk(values);
  //   } catch (error) {
  //     message.error("系统异常")
  //   }
  // };

  //取消按钮的操作
  const onCancel = () => {
    setCreateModalVisible(false) //关闭弹窗
    setImageUrl('')//弹窗取消后清空图片内容
  }

  //确认按钮的操作
  async function onOk() {
    //获取表单数据
    const values = form.getFieldsValue() as API.InsertUserForm;
    const res = await handleAdd(values) //表单中的内容传递给函数
    if (res?.code === 200) {
      onCancel()//添加成功后关闭弹窗
      actionRef.current?.reload(); //重新加载页面
    }
  }


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

  return (
    <Modal
      destroyOnClose  //配合destroyOnClose+reserve={false}才能保证表单内容清除
      title={'新建'}
      open={visible}//控制弹窗是否显示
      onCancel={onCancel}  //点击取消才执行onCancel函数
      onOk={onOk}  //点击确定才执行onOk函数
    >
      {/*autoComplete取消浏览器自动填充*/}
      <Form autoComplete="off" form={form} preserve={false}>
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
              pattern: /^[a-zA-Z0-9]{6,20}$/,
              message: '密码必须由6 到 20 个字符的字母或数字组成！',
            },
          ]}
          width="md"
          name="password"
          label="密码"
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
          rules={[{ required: true, message: '用户头像不能为空' }]}
        >
          <Upload
            name="file"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            action="/api/user/upload"
            beforeUpload={beforeUpload}
            onChange={handleChange}
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
          valueEnum={{
            1: {text: "在线"},
            2: {text: "离线"},
          }}
        />
      </Form>
    </Modal>
  )
})

export default CreateModal;
