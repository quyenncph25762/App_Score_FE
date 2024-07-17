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
import { useAddDepartmentMutation, useFetchAllDepartmentQuery, useLazyFetchOneDepartmentQuery, useRemoveDepartmentMutation, useUpdateDepartmentMutation } from '../../store/department/department.service';
import { RootState } from '../../store';
import { fetchAllDepartmentSlice, searchDepartmentSlice } from '../../store/department/departmentSlice';
import { IDepartment } from '../../store/department/department.interface';
import TextArea from 'antd/es/input/TextArea';
import Error500 from '../Error500';
import { useRemoveUserMutation } from '../../store/users/user.service';
import { IIsDeleted } from '../../store/interface/IsDeleted/IsDeleted';

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
const DepartmentPage = () => {
    const dispatch: Dispatch<any> = useDispatch()
    const navigate = useNavigate()
    // modal state 
    const [open, setOpen] = useState(false);
    // modal cap nhat
    const [openUpdate, setOpenUpdate] = useState(false);
    // state checked
    const [checkStrictly, setCheckStrictly] = useState(false);
    // listDeparment
    const [listDepartment, setDepartment] = useState<IDepartment[]>([])
    // form
    const [form] = Form.useForm()
    // form update
    const [formUpdate] = Form.useForm()
    // nut them 
    const [onAdd] = useAddDepartmentMutation()
    // nut xoa
    const [onDelete] = useRemoveDepartmentMutation()
    // nut cap nhat
    const [onUpdate] = useUpdateDepartmentMutation()
    // setValue mac dinh cho form add

    // department api & slice
    const { data: listDepartmentApi, isLoading: isLoadingDepartment, isFetching: isFetchingDepartment, isError: isErrorDepartment, isSuccess: isSuccessDepartment } = useFetchAllDepartmentQuery()
    // lay 1 department
    // trigger: nhan vao thi moi goi api
    const [trigger, { data: getOneDepartment, isSuccess: isSuccessFetchOneDepartment, isError: isErrorFetchOneDepartment }] = useLazyFetchOneDepartmentQuery()
    const listDepartmentReducer = useSelector((state: RootState) => state.departmentSlice.departments)
    // useEffect khi co loi
    useEffect(() => {
        if (isErrorDepartment || isErrorFetchOneDepartment) {
            navigate("/err500")
            return
        }
    }, [isErrorDepartment, isErrorFetchOneDepartment])
    // neu co listDepartmentApi thi dispatch vao trong reducer
    useEffect(() => {
        if (listDepartmentApi) {
            dispatch(fetchAllDepartmentSlice(listDepartmentApi))
        }
    }, [isSuccessDepartment, listDepartmentApi])
    // useEffect khi co getOneDeparrtment
    useEffect(() => {
        if (getOneDepartment) {
            // formUpdate.setFieldsValue({
            //     isActive: getOneDepartment.isActive,
            //     name: getOneDepartment.name
            // })
        }
    }, [isSuccessFetchOneDepartment, getOneDepartment])
    // modal
    // show modal them
    const showModal = () => {
        form.setFieldsValue({
            isActive: true,
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
    const rowSelection: TableRowSelection<IDepartment> = {
        onChange: (selectedRowKeys, selectedRows) => {
            if (selectedRowKeys.length > 0) {
                // Nếu chọn thì xóa disaled 
                setDepartment(selectedRows)
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
    const columns: ColumnsType<IDepartment> = [
        {
            title: 'Tên lĩnh vực',
            dataIndex: 'Name',
        },
        // {
        //     title: 'Áp dụng',
        //     dataIndex: 'isActive',
        //     render: (_, value: IDepartment) => (
        //         <p>{value.isActive ? <Badge status="processing" /> : <Badge status="default" />}</p>
        //     )
        // },
        // {
        //     title: 'Hành động',
        //     key: 'action',
        //     render: (value: IDepartment) => (
        //         <Space size="middle" className='flex justify-start'>
        //             <Tooltip title="Chỉnh sửa" color={'yellow'} key={'yellow'}>
        //                 <EditFilled className='text-xl text-yellow-400' onClick={() => showModalUpdate(value._id!)} />
        //             </Tooltip>
        //             <Popconfirm
        //                 title="Xóa lĩnh vực"
        //                 description={`Bạn có chắc muốn xóa: ${value.Name}`}
        //                 onConfirm={() => confirmDelete(value._id!)}
        //                 okText="Yes"
        //                 cancelText="No"
        //                 okButtonProps={{ className: "text-white bg-blue-500" }}
        //             >
        //                 <Tooltip title="Xóa" color={'red'} key={'red'}>
        //                     <DeleteFilled className='text-xl text-red-500' />
        //                 </Tooltip>
        //             </Popconfirm>
        //         </Space>
        //     )
        // },
    ];
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
    const data: IDepartment[] = listDepartmentReducer.map((item, index) => ({
        key: index + 1,
        _id: item._id,
        Name: item.Name,

    }))
    // nút filter
    const onChange: TableProps<IDepartment>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    // nút xóa tất cả
    const handleDeleteAll = async (listDepartment: IDepartment[]) => {
        if (listDepartment.length > 0) {
            // lấy ra những id của phòng ban
            const listDepartmentId = listDepartment.map((department) => department._id)
            Swal.fire({
                title: "Xác nhận xóa mục đã chọn ?",
                showCancelButton: true,
                confirmButtonColor: "#1677ff",
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Hủy",
                icon: "question",
            }).then(async (results) => {
                if (results.isConfirmed) {
                    const form: IIsDeleted = {
                        IsDeleted: true
                    }
                    for (const id of listDepartmentId) {
                        await onDelete({ id: id, ...form })
                    }
                    toast.success("Xóa thành công!")
                }
            })
        }
    }
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        if (value) {
            dispatch(searchDepartmentSlice({ searchTerm: value, departments: listDepartmentApi }))
        } else {
            dispatch(fetchAllDepartmentSlice(listDepartmentApi))
        }
    };
    const handleReset = () => {
        dispatch(fetchAllDepartmentSlice(listDepartmentApi))
    }
    // submit add phòng ban
    const onFinish = async (values: IDepartment) => {
        try {
            const results = await onAdd(values)
            if (results.error) {
                message.error(`Thêm thất bại , vui lòng thử lại!`);
                return
            }
            message.success(`Đã thêm thành công phòng: ${values.Name}`);
            form.resetFields()
            setOpen(false);
        } catch (error) {
            console.log(error)
        }
    }
    // submit update phòng ban
    const onFinishUpdate = async (values: IDepartment) => {
        try {
            if (getOneDepartment) {
                const results = await onUpdate({ _id: getOneDepartment._id, ...values })
                if (results.error) {
                    message.error(`Thêm thất bại , vui lòng thử lại!`);
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

            {isLoadingDepartment && <div>loading data...</div>}
            {/* modal them */}
            <Modal
                title="Thêm lĩnh vực"
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
                        <Col span={20}>
                            <Form.Item
                                name="Name"
                                label="Tên lĩnh vực"
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
                        <Col span={4} className='flex items-center'>
                            <Form.Item
                                name="isActive"
                                className='mb-0'
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item name="note" label="Mô tả">
                                <TextArea className='w-full'></TextArea>
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
                title="Cập nhật lĩnh vực"
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
                        <Col span={20}>
                            <Form.Item
                                name="Name"
                                label="Tên lĩnh vực"
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
                        <Col span={4} className='flex items-center'>
                            <Form.Item
                                name="isActive"
                                className='mb-0'
                            >
                                <Switch />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item name="note" label="Mô tả">
                                <TextArea className='w-full'></TextArea>
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
                <h3 className='text-title mb-0'>Quản lí lĩnh vực</h3>
                <div className="iconDelete-title">
                    <Tooltip title="Thùng rác của bạn" color='red'>
                        <Link to={`/department/trash`}><DeleteOutlined color='red' /></Link>
                    </Tooltip>
                </div>
                {isFetchingDepartment && <div> <Spin indicator={<LoadingOutlined spin />} size="small" /> Update data ...</div>}
            </div>
            <div className="flex justify-between">
                <Space className='mb-3'>
                    <Button type='primary' danger onClick={() => handleDeleteAll(listDepartment)}>Xóa tất cả</Button>
                    <Search placeholder="Tìm kiếm tên lĩnh vực ..." className='w-[300px]' onSearch={onSearch} enterButton />
                    <Button onClick={() => handleReset()}>reset</Button>
                </Space>
                <Button type='primary' className='mb-3' onClick={() => showModal()}>Thêm mới</Button>
            </div>
            <Table columns={columns} rowSelection={{ ...rowSelection, checkStrictly }} dataSource={data} bordered onChange={onChange} />
        </div>
    )
}

export default DepartmentPage
