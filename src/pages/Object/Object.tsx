import React, { Dispatch, useEffect, useState } from 'react'
import { Badge, Button, Col, Form, FormInstance, Input, message, Modal, Popconfirm, Result, Row, Skeleton, Space, Spin, Switch, Table, Tooltip } from 'antd';
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
import { useAddObjectMutation, useFetchAllObjectQuery, useLazyFetchOneObjectQuery, useRemoveObjectMutation, useUpdateObjectMutation } from '../../store/object/object.service';
import { IObject } from '../../store/object/object.interface';
import { getAllObjectSlice, searchObjectSlice } from '../../store/object/objectSlice';
import { IIsDeleted } from '../../store/interface/IsDeleted/IsDeleted';
import CheckoutFuntion from '../../hooks/funtions/Checkout';

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
const ObjectPage = () => {
    // funtion kiem tra xem nguoi dung dang nhap chua ?
    CheckoutFuntion()
    const dispatch: Dispatch<any> = useDispatch()
    const navigate = useNavigate()
    // modal state 
    const [open, setOpen] = useState(false);
    // modal cap nhat
    const [openUpdate, setOpenUpdate] = useState(false);
    // state checked
    const [checkStrictly, setCheckStrictly] = useState(false);
    // listObject
    const [listObject, setObject] = useState<IObject[]>([])
    // id object
    const [idObject, setIdObject] = useState<string>("")
    // form
    const [form] = Form.useForm()
    // form update
    const [formUpdate] = Form.useForm()
    // nut them 
    const [onAdd] = useAddObjectMutation()
    // nut xoa
    const [onDelete] = useRemoveObjectMutation()
    // nut cap nhat
    const [onUpdate] = useUpdateObjectMutation()
    // setValue mac dinh cho form add

    // object api & slice
    const { data: listObjectApi, isLoading: isLoadingObject, isFetching: isFetchingObject, isError: isErrorObject, isSuccess: isSuccessObject } = useFetchAllObjectQuery()
    // lay 1 object
    const [trigger, { data: getOneObject, isSuccess: isSuccessFetchOneObject, isLoading: isLoadingGetOneObject, isError: isErrorFetchOneObject }] = useLazyFetchOneObjectQuery()
    console.log(getOneObject)
    const listObjectReducer = useSelector((state: RootState) => state.objectSlice.objects)
    // useEffect khi co loi
    useEffect(() => {
        if (isErrorObject || isErrorFetchOneObject) {
            navigate("/err500")
            return
        }
    }, [isErrorObject, isErrorFetchOneObject])
    // neu co listObjectApi thi dispatch vao trong reducer
    useEffect(() => {
        if (listObjectApi) {
            dispatch(getAllObjectSlice(listObjectApi))
        }
    }, [isSuccessObject, listObjectApi])
    // useEffect khi co getOneObject
    useEffect(() => {
        if (getOneObject) {
            formUpdate.setFieldsValue({
                // isActive: getOneObject.isActive,
                name: getOneObject.NameObject
            })
        }
    }, [isSuccessFetchOneObject, getOneObject])
    // modal
    // show modal them
    const showModal = () => {
        form.setFieldsValue({
            isActive: true,
            IsDeleted: 0
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
    const rowSelection: TableRowSelection<IObject> = {
        onChange: (selectedRowKeys, selectedRows) => {
            if (selectedRowKeys.length > 0) {
                // Nếu chọn thì xóa disaled 
                setObject(selectedRows)
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
    const columns: ColumnsType<IObject> = [
        {
            title: 'Tên đối tượng',
            dataIndex: 'NameObject',
        },
        // {
        //     title: 'Áp dụng',
        //     dataIndex: 'isActive',
        //     render: (_, value: IObject) => (
        //         <p>{value.isActive ? <Badge status="processing" /> : <Badge status="default" />}</p>
        //     )
        // },
        // {
        //     title: 'Hành động',
        //     key: 'action',
        //     render: (value: IObject) => (
        //         <Space size="middle" className='flex justify-start'>
        //             <Tooltip title="Chỉnh sửa" color={'yellow'} key={'yellow'}>
        //                 <EditFilled className='text-xl text-yellow-400' onClick={() => showModalUpdate(value._id!)} />
        //             </Tooltip>
        //             <Popconfirm
        //                 title="Xóa đối tượng"
        //                 description={`Bạn có chắc muốn xóa: ${value.NameObject}`}
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
    const data: IObject[] = listObjectReducer.map((item, index) => ({
        key: index + 1,
        _id: item._id,
        NameObject: item.NameObject,
        IsDeleted: item.IsDeleted
    }))
    // nút filter
    const onChange: TableProps<IObject>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    // nút xóa tất cả
    // const handleDeleteAll = async (listObject: IObject[]) => {
    //     if (listObject.length > 0) {
    //         const listObjectId = listObject.map((object) => object._id)
    //         Swal.fire({
    //             title: "Xác nhận xóa mục đã chọn ?",
    //             showCancelButton: true,
    //             confirmButtonColor: "#1677ff",
    //             confirmButtonText: "Xác nhận",
    //             cancelButtonText: "Hủy",
    //             icon: "question",
    //         }).then(async (results) => {
    //             if (results.isConfirmed) {
    //                 const form: IIsDeleted = {
    //                     IsDeleted: true
    //                 }
    //                 for (const id of listObjectId) {
    //                     await onDelete({ id: id, ...form })
    //                 }
    //                 toast.success("Xóa thành công!")
    //             }
    //         })
    //     }
    // }
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        if (value) {
            dispatch(searchObjectSlice({ searchTerm: value, objects: listObjectReducer }))
        } else {
            dispatch(getAllObjectSlice(listObjectApi))
        }
    };
    const handleReset = () => {
        dispatch(getAllObjectSlice(listObjectApi))
    }
    // submit add phòng ban
    const onFinish = async (values: IObject) => {
        try {
            const results = await onAdd(values)
            if (results.error) {
                message.error(`Thêm thất bại , vui lòng thử lại!`);
                return
            }
            message.success(`Đã thêm thành công phòng: ${values.NameObject}`);
            form.resetFields()
            setOpen(false);
        } catch (error) {
            console.log(error)
        }
    }
    // submit update phòng ban
    const onFinishUpdate = async (values: IObject) => {
        // try {
        //     if (getOneObject) {
        //         const results = await onUpdate({ _id: getOneObject._id, ...values })
        //         if (results.error) {
        //             message.error(`Thêm thất bại , vui lòng thử lại!`);
        //             return
        //         }
        //         message.success(`Đã sửa thành công`);
        //         formUpdate.resetFields()
        //         setOpenUpdate(false);
        //     }
        // } catch (error) {
        //     console.log(error)
        // }
    }
    return (
        <div>
            {isLoadingObject && <div> <Spin indicator={<LoadingOutlined spin />} size="small" /> loading data...</div>}
            {/* modal them */}
            {/* <Modal
                title="Thêm đối tượng"
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
                                name="name"
                                label="Tên đối tượng"
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
                            <Form.Item name="IsDeleted" hidden>
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
                            <Form.Item name="descripton" label="Mô tả">
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
            </Modal> */}
            {/* modal update */}
            {/* <Modal
                title="Cập nhật đối tượng"
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
                                name="name"
                                label="Tên đối tượng"
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
                            <Form.Item name="description" label="Mô tả">
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
            </Modal> */}
            <div className="flex items-center gap-2">
                <h3 className='text-title mb-0'>Quản lí đối tượng</h3>
                {/* <div className="iconDelete-title">
                    <Tooltip title="Thùng rác của bạn" color='red'>
                        <Link to={`/object/trash`}><DeleteOutlined color='red' /></Link>
                    </Tooltip>
                </div> */}
                {isFetchingObject && <div> <Spin indicator={<LoadingOutlined spin />} size="small" /> Update data ...</div>}
            </div>
            <div className="flex justify-between">
                <Space className='mb-3'>
                    {/* <Button type='primary' danger onClick={() => handleDeleteAll(listObject)}>Xóa tất cả</Button> */}
                    <Search placeholder="Tìm kiếm đối tượng ..." className='w-[300px]' onSearch={onSearch} enterButton />
                    <Button onClick={() => handleReset()}>reset</Button>
                </Space>
                {/* <Button type='primary' className='mb-3' onClick={() => showModal()}>Thêm mới</Button> */}
            </div>
            <Table columns={columns} rowSelection={{ ...rowSelection, checkStrictly }} dataSource={data} bordered onChange={onChange} />
        </div>
    )
}

export default ObjectPage