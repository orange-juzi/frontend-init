import {ExclamationCircleFilled, PlusOutlined} from '@ant-design/icons';
import type {ActionType, ProColumns} from '@ant-design/pro-components';
import {
  FooterToolbar,
  PageContainer,
  ProTable,
} from '@ant-design/pro-components';
import '@umijs/max';
import {Button, message, Modal, Space, TablePaginationConfig, Typography} from 'antd';
import React, {useRef, useState} from 'react';
import UpdateModal from './components/UpdateModal';
import {deleteUser, getUserList} from "@/services/backend-center/userController";
import CreateModal from "@/pages/System/User/components/CreateModal";

const User: React.FC = () => {
  // 是否显示新建窗口
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  // 是否显示更新窗口
  const [updateModalVisible, setUpdateModalVisible] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.User>();
  const [selectedRowsState, setSelectedRows] = useState<API.User[]>([]);
  const [current, setCurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [total, setTotal] = useState(0)

  /**
   *  Delete node
   * @zh-CN 删除节点
   *
   * @param row
   */
  const handleRemove = async (row: any) => {
    const hide = message.loading('正在删除');
    if (!row) return true;
    let res;
    try {
      //批量删除的时候
      if (row.length >= 1) {
        const id: number[] = []
        row.forEach((item: API.User) => {
          id.push(item.id as number)
        })
        res = await deleteUser(id as any);
        hide();
        message.success(res.msg);
        actionRef?.current?.reload();
        setCurrent(1)
        return true;
      }
      //单个删除按钮
      res = await deleteUser([row.id] as any);
      hide();
      message.success(res.msg);
      actionRef?.current?.reload();
      setCurrent(1)
      return true;
    } catch (error) {
      hide();
      message.error("删除失败！");
      return false;
    }
  };
  const {confirm} = Modal;
  const showDeleteConfirm = (record:any) => {
    confirm({
      title: '删除',
      icon: <ExclamationCircleFilled/>,
      content: '你确定要删除该用户吗？',
      okText: '确认',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        if (record.length >= 1) {
          handleRemove(selectedRowsState as any);
          setSelectedRows([]);
          actionRef.current?.reloadAndRest?.();
          return;
        }
        handleRemove(record)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const columns: ProColumns<API.User>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      align: "center",
      // valueType: 'indexBorder', // 这是 antd 的内置配置，可显示边框的序号
      hideInSearch: true,
      width: 48,
      render: (_, __, index) => {//按顺序排列
        return index + 1 + (current - 1) * pageSize;
      },
    },
    {
      title: '账号',
      dataIndex: 'username',
      valueType: "text",
      align: "center",
      hideInSearch: true
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      align: "center",
      valueType: 'text',
    },
    {
      title: '头像',
      dataIndex: 'photo',
      align: "center",
      valueType: 'image',
      hideInSearch: true,
    },
    {
      title: '性别',
      dataIndex: 'sex',
      align: "center",
      valueType: 'text'
    },
    {
      title: '电话',
      dataIndex: 'tel',
      align: "center",
      hideInSearch: true,
    },
    {
      title: '角色',
      dataIndex: 'role',
      align: "center",
      // valueEnum: {
      //   0: {
      //     text: '管理员',
      //   },
      //   1: {
      //     text: '总经理',
      //   },
      //   2: {
      //     text: '部门经理',
      //   },
      //   3: {
      //     text: '普通员工',
      //   },
      //   4: {
      //     text: 'HR',
      //   },
      //   5: {
      //     text: '财务',
      //   },
      // },
      // render: (_, record) => { //根据后端返回的角色id数组形式，[1,3]这样的格式，转化对应的文本
      //   const roleIds = JSON.parse(record.role as string);
      //   const roleTexts = roleIds.map((roleId:string) => {
      //     const roleMapping:any = {
      //       0: '管理员',
      //       1: '总经理',
      //       2: '部门经理',
      //       3: '普通员工',
      //       4: 'HR',
      //       5: '财务',
      //     };
      //     return roleMapping[roleId];
      //   });
      //   return roleTexts.join(', '); // 如果有多个角色，以逗号分隔显示
      // },
    },
    {
      title: '部门',
      dataIndex: 'deptId',
      align: "center",
      valueEnum: {
        1: {
          text: '管理部',
        },
        2: {
          text: '行政部',
        },
        3: {
          text: '技术部',
        },
        4: {
          text: '市场部',
        },
        5: {
          text: '后勤部',
        },
        6: {
          text: '人事部',
        },
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 70,
      align: "center",
      valueEnum: {
        1: {
          text: '在线',
          status: 'Success',
        },
        2: {
          text: '离线',
          status: 'Error',
        },
      }
    },
    {
      title: '创建时间',
      sorter: true,
      dataIndex: 'createTime',
      valueType: 'dateTime',
      align: "center",
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '更新时间',
      sorter: true,
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      align: "center",
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 90,
      align: "center",
      render: (_, record) => [
        <Space size="middle" key="option">
          <Typography.Link
            onClick={() => {
              setUpdateModalVisible(true);
              //如果后端返回的是id采用此方式
              // const roleIds = JSON.parse(record.role as string);
              // const roleTexts = roleIds.map((roleId:string) => {
              //   const roleMapping:any = {
              //     0: '管理员',
              //     1: '总经理',
              //     2: '部门经理',
              //     3: '普通员工',
              //     4: 'HR',
              //     5: '财务',
              //   };
              //   return roleMapping[roleId];
              // });
              // const role= record.role?.split(', '); // 如果有多个角色，以逗号分隔显示
              // const roleTexts = role.map((roleId:string) => {
              //     const roleMapping:any = {
              //       '管理员': 0,
              //           '总经理': 1,
              //           '部门经理': 2,
              //           '普通员工': 3,
              //           'HR': 4,
              //           '财务': 5,
              //     };
              //     return roleMapping[roleId];
              //   });
              // console.log(roleTexts)
              // 创建一个新的记录以在显示时使用角色的文本值   //
              const newRecord: any = {
                ...record,
                // status: record.status === 1 ? '在线' : '离线',
                // role: roleTexts,
              };
              setCurrentRow(newRecord);
            }}
          >
            修改
          </Typography.Link>
          <Typography.Link type='danger' onClick={() => {
            showDeleteConfirm(record)
          }}>
            删除
          </Typography.Link>
        </Space>
      ],
    },
  ];

  // 自定义分页配置
  const customPagination: TablePaginationConfig = {
    pageSizeOptions: ['10', '20', '30', '50'],
    total: total,
    showSizeChanger: true,
    showQuickJumper: true,
    current: current,
    pageSize: pageSize,
    size: 'default',
    showTotal: (totalCount: number) => `共${totalCount} 条`,
  };
  //分页变化事件
  const onChange = (page: any) => {
    setCurrent(page.current)//默认当前页为1，当变化的时候，就需要重新设置值
    setPageSize(page.pageSize)//默认记录数为10，当变化的时候，就需要重新设置值
  }
  return (
    <PageContainer>
      <ProTable<API.User>
        headerTitle={'查询用户'}
        actionRef={actionRef}
        rowKey="id" //根据request返回的data对象包含的id值
        search={{
          labelWidth: 120,
        }}
        onReset={() => { //重置按钮，让页面回到第一页
          setCurrent(1)
        }}
        onChange={onChange}
        pagination={customPagination} //自定义分页控件
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              setCreateModalVisible(true); //点击新建按钮的时候，打开弹窗
            }}
          >
            <PlusOutlined/> 新建
          </Button>,
        ]}
        request={async (params) => {
          const {data, code} = await getUserList(
            // current: params.current,
            // pageSize: params.pageSize,
            // keyword: params.keyword, 传递查询表单的参数
            {...params} as API.SearchUserByPageForm
          )
          setTotal(prevTotal => Number(data?.total) || prevTotal);//更新总条数
          return {
            success: code === 200,
            data: data?.list ?? []
          }
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              项 &nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={() => {showDeleteConfirm(selectedRowsState)
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}

      {/*新增表单*/}
      <CreateModal visible={createModalVisible}
                   actionRef={actionRef} //传递给子组件，让子组件添加完成 后重新加载页面
                   setCreateModalVisible={setCreateModalVisible}
      />

      {/*修改表单*/}
      <UpdateModal
        actionRef={actionRef}
        visible={updateModalVisible}
        values={currentRow || {}}
        setUpdateModalVisible={setUpdateModalVisible}
      />


    </PageContainer>
  );
};
export default User;
