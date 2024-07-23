import React, { Dispatch, useEffect, useState } from 'react'
import { Badge, Button, Col, Form, FormInstance, Input, message, Modal, Popconfirm, Result, Row, Space, Spin, Switch, Table, Tooltip } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { DeleteFilled, DeleteOutlined, EditFilled, LoadingOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { TableRowSelection } from 'antd/es/table/interface';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import Search, { SearchProps } from 'antd/es/input/Search';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import TextArea from 'antd/es/input/TextArea';
import Error500 from '../Error500';
import { IIsDeleted } from '../../store/interface/IsDeleted/IsDeleted';
import { IRole } from '../../store/role/role.interface';
import { useAddRoleMutation, useFetchAllRoleQuery, useLazyFetchOneRoleQuery, useRemoveRoleToTrashByCheckboxMutation, useRemoveRoleToTrashMutation, useUpdateRoleMutation } from '../../store/role/role.service';
import { fetchAllRoleSlice, searchRoleSlice } from '../../store/role/roleSlice';

const SubmitButton = ({ form }: { form: FormInstance }) => {
    const [submittable, setSubmittable] = React.useState(false);
    const values = Form.useWatch([], form);

    React.useEffect(() => {
        form.validateFields({ validateOnly: true }).then(
            () => {
                setSubmittable(true);
            },
            () => {
                setSubmittable(false);
            },
        );
    }, [values]);

    return (
        <Button type="primary" htmlType="submit" disabled={!submittable} className='bg-blue-500'>
            Thêm
        </Button>
    );
};
const SubmitButtonUpdate = ({ form }: { form: FormInstance }) => {
    const [submittable, setSubmittable] = React.useState(false);
    const values = Form.useWatch([], form);

    React.useEffect(() => {
        form.validateFields({ validateOnly: true }).then(
            () => {
                setSubmittable(true);
            },
            () => {
                setSubmittable(false);
            },
        );
    }, [values]);

    return (
        <Button type="primary" htmlType="submit" disabled={!submittable} className='bg-blue-500'>
            Thêm
        </Button>
    );
};
const RolePage = () => {
    const dispatch: Dispatch<any> = useDispatch()
    const navigate = useNavigate()
    // modal state 
    const [open, setOpen] = useState(false);
    // modal cap nhat
    const [openUpdate, setOpenUpdate] = useState(false);
    // state checked
    const [checkStrictly, setCheckStrictly] = useState(false);
    // listDeparment
    const [listRole, setRole] = useState<IRole[]>([])
    // form
    const [form] = Form.useForm()
    // form update
    const [formUpdate] = Form.useForm()
    // nut them 
    const [onAdd] = useAddRoleMutation()
    // nut xoa
    const [onDelete] = useRemoveRoleToTrashMutation()
    // nut xoa nhieu
    const [onDeleteByCheckBox] = useRemoveRoleToTrashByCheckboxMutation()
    // nut cap nhat
    const [onUpdate] = useUpdateRoleMutation()
    // setValue mac dinh cho form add

    // role api & slice
    const { data: listRoleApi, isLoading: isLoadingRole, isFetching: isFetchingRole, isError: isErrorRole, isSuccess: isSuccessRole } = useFetchAllRoleQuery()
    // lay 1 role
    const [trigger, { data: getOneRole, isSuccess: isSuccessFetchOneRole, isError: isErrorFetchOneRole }] = useLazyFetchOneRoleQuery()
    console.log(getOneRole)
    const listRoleReducer = useSelector((state: RootState) => state.roleSlice.roles)
    // useEffect khi co loi
    useEffect(() => {
        if (isErrorRole || isErrorFetchOneRole) {
            navigate("/err500")
            return
        }
    }, [isErrorRole, isErrorFetchOneRole])
    // neu co listRoleApi thi dispatch vao trong reducer
    useEffect(() => {
        if (listRoleApi) {
            dispatch(fetchAllRoleSlice(listRoleApi))
        }
    }, [isSuccessRole, listRoleApi, dispatch])
    // useEffect khi co getOneDeparrtment
    useEffect(() => {
        if (getOneRole) {
            formUpdate.setFieldsValue({
                NameRole: getOneRole.NameRole,
                Note: getOneRole.Note
            })
        }
    }, [isSuccessFetchOneRole, getOneRole])
    // modal
    // show modal them
    const showModal = () => {
        form.setFieldsValue({
            IsDeleted: false
        })
        setOpen(true);
    };
    const handleOk = () => {
        setOpen(false);
    };
    const handleCancel = () => {
        setOpen(false);
        form.resetFields()
    };
    // show modal cap nhat
    const showModalUpdate = (id: string) => {
        if (id) {
            trigger(id)
        }
        setOpenUpdate(true);
    };
    const handleOkUpdate = () => {
        setOpenUpdate(false);
    };
    const handleCancelUpdate = () => {
        setOpenUpdate(false);
        formUpdate.resetFields()
    };
    // nút checkbox
    const rowSelection: TableRowSelection<IRole> = {
        onChange: (selectedRowKeys, selectedRows) => {
            if (selectedRowKeys.length > 0) {
                // Nếu chọn thì xóa disaled 
                setRole(selectedRows)
                document.querySelector(".handleDeleteAll")?.removeAttribute("disabled")
            } else {
                // Nếu không chọn thì disabled 
                document.querySelector(".handleDeleteAll")?.setAttribute("disabled", "true")

            }
        },
        onSelect: (record, selected, selectedRows) => {
            // console.log(record, selected, selectedRows);
        },
        onSelectAll: (selected, selectedRows, changeRows) => {
            // console.log(selected, selectedRows, changeRows);
        },
    };
    // column
    const columns: ColumnsType<IRole> = [
        {
            title: 'Tên vai trò',
            dataIndex: 'NameRole',
        },
        {
            title: 'Ghi chú',
            dataIndex: 'Note',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (value: IRole) => (
                <Space size="middle" className='flex justify-start'>
                    <Tooltip title="Chỉnh sửa" color={'yellow'} key={'yellow'}>
                        <EditFilled className='text-xl text-yellow-400' onClick={() => showModalUpdate(value._id!)} />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa vai trò"
                        description={`Bạn có chắc muốn xóa: ${value.NameRole}`}
                        onConfirm={() => confirmDelete(value._id!)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ className: "text-white bg-blue-500" }}
                    >
                        <Tooltip title="Xóa" color={'red'} key={'red'}>
                            <DeleteFilled className='text-xl text-red-500' />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            )
        },
    ];
    // xoa vao thung rac
    const confirmDelete = async (id?: string) => {
        try {
            const form: IIsDeleted = {
                IsDeleted: true
            }
            const results = await onDelete({ id: id, ...form })
            if (results.error) {
                toast.error("Xóa thất bại!")
            } else {
                toast.success("Xóa thành công!")
            }
        } catch (error) {
            console.log(error)
        }
    }
    // data 
    const data: IRole[] = listRoleReducer.map((item, index) => ({
        key: index + 1,
        _id: item._id,
        NameRole: item.NameRole,
        Note: item.Note,
        IsDeleted: item.IsDeleted
    }))
    // nút filter
    const onChange: TableProps<IRole>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    // nút xóa tất cả
    const handleDeleteAll = async (listRole: any) => {
        if (listRole.length > 0) {
            // lấy ra những id của vai trò
            const listRoleId = listRole.map((role) => role._id)
            Swal.fire({
                title: "Xác nhận xóa mục đã chọn ?",
                showCancelButton: true,
                confirmButtonColor: "#1677ff",
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Hủy",
                icon: "question",
            }).then(async (results) => {
                if (results.isConfirmed) {
                    const results = await onDeleteByCheckBox(listRoleId)
                    if (results.error) {
                        toast.error("Xóa không thành công!")
                        return
                    }
                    toast.success("Xóa thành công!")
                }
            })
        }
    }
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        if (value) {
            dispatch(searchRoleSlice({ searchTerm: value, roles: listRoleApi }))
        } else {
            dispatch(fetchAllRoleSlice(listRoleApi))
        }
    };
    const handleReset = () => {
        dispatch(fetchAllRoleSlice(listRoleApi))
    }
    // submit add vai trò
    const onFinish = async (values: IRole) => {
        try {
            const results = await onAdd(values)
            if (results.error) {
                message.error(`Thêm thất bại , vui lòng thử lại!`);
                return
            }
            message.success(`Đã thêm thành công vai trò: ${values.NameRole}`);
            form.resetFields()
            setOpen(false);
        } catch (error) {
            console.log(error)
        }
    }
    // submit update phòng ban
    const onFinishUpdate = async (values: IRole) => {
        try {
            if (getOneRole) {
                const results = await onUpdate({ _id: getOneRole._id, ...values })
                if (results.error) {
                    message.error(`Sửa thất bại , vui lòng thử lại!`);
                    return
                }
                message.success(`Đã sửa thành công`);
                formUpdate.resetFields()
                setOpenUpdate(false);
            }
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            {isLoadingRole && <div>loading data...</div>}
            {/* modal them */}
            <Modal
                title="Thêm vai trò"
                open={open}
                width={800}
                onOk={handleOk}
                onCancel={handleCancel}
                footer={null}
            >
                <Form
                    form={form}
                    name="validateOnly"
                    layout="vertical"
                    style={{
                        width: "100%",
                        margin: 0,
                        padding: "20px"
                    }}
                    autoComplete="off"
                    onFinish={onFinish}
                    className="mx-auto"
                >
                    <Row gutter={25}>
                        <Col span={24}>
                            <Form.Item
                                name="NameRole"
                                label="Tên vai trò"
                                rules={[
                                    { required: true, message: '* Không được để trống' },
                                    {
                                        validator: (_, value) => {
                                            if (value && value.trim() === '') {
                                                return Promise.reject('Không được để khoảng trắng');
                                            }
                                            return Promise.resolve();
                                        },
                                    },
                                    { min: 3, message: 'Tối thiểu 6 kí tự' },

                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <Form.Item name="IsDeleted" hidden></Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item name="Note" label="Ghi chú">
                                <Input></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Space style={{
                        display: "flex",
                        justifyContent: "flex-end"
                    }}>
                        <Button htmlType="reset">Reset</Button>
                        <SubmitButton form={form} />
                    </Space>
                </Form>
            </Modal>
            {/* modal update */}
            <Modal
                title="Cập nhật vai trò"
                open={openUpdate}
                width={800}
                onOk={handleOkUpdate}
                onCancel={handleCancelUpdate}
                footer={null}
            >
                <Form
                    form={formUpdate}
                    name="validateOnly"
                    layout="vertical"
                    style={{
                        width: "100%",
                        margin: 0,
                        padding: "20px"
                    }}
                    autoComplete="off"
                    onFinish={onFinishUpdate}
                    className="mx-auto"
                >
                    <Row gutter={25}>
                        <Col span={24}>
                            <Form.Item
                                name="NameRole"
                                label="Tên vai trò"
                                rules={[
                                    { required: true, message: '* Không được để trống' },
                                    {
                                        validator: (_, value) => {
                                            if (value && value.trim() === '') {
                                                return Promise.reject('Không được để khoảng trắng');
                                            }
                                            return Promise.resolve();
                                        },
                                    },
                                    { min: 3, message: 'Tối thiểu 6 kí tự' },

                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item name="Note" label="Ghi chú">
                                <Input></Input>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Space style={{
                        display: "flex",
                        justifyContent: "flex-end"
                    }}>
                        <Button htmlType="reset">Reset</Button>
                        <SubmitButtonUpdate form={formUpdate} />
                    </Space>
                </Form>
            </Modal>
            <div className="flex items-center gap-2">
                <h3 className='text-title mb-0'>Quản lí vai trò</h3>
                <div className="iconDelete-title">
                    <Tooltip title="Thùng rác của bạn" color='red'>
                        <Link to={`/roles/trash`}><DeleteOutlined color='red' /></Link>
                    </Tooltip>
                </div>
                {isFetchingRole && <div> <Spin indicator={<LoadingOutlined spin />} size="small" /> Update data ...</div>}
            </div>
            <div className="flex justify-between">
                <Space className='mb-3'>
                    <Button type='primary' danger onClick={() => handleDeleteAll(listRole)}>Xóa tất cả</Button>
                    <Search placeholder="Tìm kiếm tên vai trò ..." className='w-[300px]' onSearch={onSearch} enterButton />
                    <Button onClick={() => handleReset()}>reset</Button>
                </Space>
                <Button type='primary' className='mb-3' onClick={() => showModal()}>Thêm mới</Button>
            </div>
            <Table columns={columns} rowSelection={{ ...rowSelection, checkStrictly }} dataSource={data} bordered onChange={onChange} />
        </div>
    )
}

export default RolePage
