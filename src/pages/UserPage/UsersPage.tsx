import React, { Dispatch, useEffect, useState } from 'react'
import { Badge, Button, Col, Flex, Form, FormInstance, Image, Input, message, Modal, Popconfirm, Result, Row, Select, Space, Spin, Switch, Table, Tooltip, Upload } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { DeleteFilled, DeleteOutlined, EditFilled, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { TableRowSelection } from 'antd/es/table/interface';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload';
import { SearchProps } from 'antd/es/input/Search';
import { useAddUserMutation, useFetchListUserQuery, useFetchOneUserQuery, useRemoveUserMutation, useUpdateUserMutation } from '../../store/users/user.service';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserSlice, listUserSearchSlice, listUsersSlice } from '../../store/users/userSlice';
import { RootState } from '../../store';
import { IIsDeletedUser, IUser } from '../../store/users/user.interface';
import { useFetchAllWardQuery } from '../../store/wards/ward.service';
import { useFetchAllDistrictQuery } from '../../store/districts/district.service';
import { useFetchAllProvinceQuery } from '../../store/province/province.service';
import { useFetchAllDepartmentQuery } from '../../store/department/department.service';
import { fetchAllDepartment } from '../../store/department/departmentSlice';
const { Option } = Select;
const { Search } = Input;


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
        <Button type="primary" htmlType="submit" disabled={!submittable} className='bg-orange-500'>
            Cập nhật
        </Button>
    );
};


function randomCode() {
    const characCode = "ABCDEGHIKLNMIOUXZ";
    let result = '';
    const length = 6
    const characCodeLength = characCode.length
    for (let i = 0; i < length; i++) {
        const locationCode = Math.floor(Math.random() * characCodeLength)
        const code = characCode[locationCode]
        result += code
    }
    return result
}
function randomUserName() {
    const characCode = "1234567890";
    let result = 'USER';
    const length = 6
    const characCodeLength = characCode.length
    for (let i = 0; i < length; i++) {
        const locationCode = Math.floor(Math.random() * characCodeLength)
        const code = characCode[locationCode]
        result += code
    }
    return result
}


const UsersPage = () => {
    const dispatch: Dispatch<any> = useDispatch()
    const navigate = useNavigate()
    // ham setId khi bam vao nut sua
    const [userId, setUserId] = useState<string>("")
    const { data: getOneUser, isError: isErrorOneUser, isSuccess: isSuccessGetOneUser } = useFetchOneUserQuery(userId ? userId : "")
    // goi list user tu redux-toolkit
    const { data: ListUserAPI, isError: isErrorListUser, isFetching, isLoading: isLoadingUserAPI, isSuccess: isSuccessUserApi } = useFetchListUserQuery()
    // goi list phong ban tu redux-toolkit
    const { data: ListDepartmentAPI, isError: isErrorListDepartment, isFetching: isFetchingDepartment, isLoading: isLoadingDepartmentAPI, isSuccess: isSuccessDepartmentApi } = useFetchAllDepartmentQuery()
    // goi list department tu redux-toolkit
    // goi list ward 
    const { data: wards, isError: isErrorWards } = useFetchAllWardQuery()
    const { data: districts, isError: isErrorDistricts } = useFetchAllDistrictQuery()
    const { data: provinces, isError: isErrorProvinces } = useFetchAllProvinceQuery()
    useEffect(() => {
        if (isErrorListUser || isErrorOneUser || isErrorWards || isErrorDistricts || isErrorProvinces || isErrorListDepartment) {
            navigate("/err500")
            return
        }
    }, [isErrorListUser, isErrorOneUser, isErrorWards, isErrorDistricts, isErrorProvinces])
    // lay 1 user theo id
    // ondelete user
    const [onDeleteUser] = useRemoveUserMutation()
    // onadd user
    const [onAddUser] = useAddUserMutation()
    // onUpdate user
    const [onUpdateUser] = useUpdateUserMutation()
    // 
    const [checkStrictly, setCheckStrictly] = useState(false);
    const [listUser, setListUser] = useState<IUser[]>([])
    // modal state add
    const [open, setOpen] = useState(false);
    // modal State update
    const [openUpdate, setOpenUpdate] = useState(false);
    // danh sach list user tu redux
    const listUserReducer = useSelector((state: RootState) => state.userSlice?.users)
    // danh sach list phong ban tu redux
    const listDepartmentReducer = useSelector((state: RootState) => state.departmentSlice.departments)
    // neu ma goi thanh cong thi dispatch vao redux
    useEffect(() => {
        if (ListUserAPI?.length > 0) {
            dispatch(listUsersSlice(ListUserAPI))
        }
    }, [isSuccessUserApi, ListUserAPI])
    useEffect(() => {
        if (ListDepartmentAPI?.length > 0) {
            dispatch(fetchAllDepartment(ListDepartmentAPI))
        }
    }, [isSuccessDepartmentApi, ListDepartmentAPI])
    // form add
    const [form] = Form.useForm();
    // form user update
    const [formUpdate] = Form.useForm();

    // Xet du lieu cho formUpdate
    // useEffect lay du lieu update user thay doi theo khi call api getOneUser
    // set value cho form theo id
    useEffect(() => {
        if (getOneUser) {
            formUpdate.setFieldsValue({
                code: getOneUser.code,
                name: getOneUser.name,
                username: getOneUser.username,
                ProvinceId: getOneUser.ProvinceId,
                DistrictId: getOneUser.DistrictId,
                DepartmentId: getOneUser.DepartmentId,
                WardId: getOneUser.WardId,
                isActive: getOneUser.isActive,
                address: getOneUser.address,
                email: getOneUser.email
            })
        }
    }, [isSuccessGetOneUser, getOneUser, openUpdate, userId])

    // nút checkbox
    const rowSelection: TableRowSelection<IUser> = {
        onChange: (selectedRowKeys, selectedRows) => {
            if (selectedRowKeys.length > 0) {
                // Nếu chọn thì xóa disaled 
                setListUser(selectedRows)
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
    // image 
    const props: UploadProps = {
        listType: "picture-card",
        name: "images",
        multiple: false,
        action: "/public/images",
    };
    // show modal them
    const showModal = () => {
        // Xet du lieu cho form add
        form.setFieldsValue({
            code: randomCode(),
            username: randomUserName(),
            isActive: 1,
            isDeleted: 0
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
    // show Modal update
    const showModalUpdate = (id: string) => {
        if (id) {
            setUserId(id)
        }
        setOpenUpdate(true);
    };
    const handleOkUpdate = () => {
        setOpenUpdate(false);
    };
    const handleCancelUpdate = () => {
        setOpenUpdate(false);
    };
    // column
    const columns: ColumnsType<IUser> = [
        // {
        //     dataIndex: 'key',
        //     render: (value: any) => <Link to={``} className='uppercase font-bold '>{value}</Link>,
        //     className: 'w-[100px]'
        // },
        {
            title: 'Tên người dùng',
            dataIndex: 'name',
        },
        {
            title: 'Tên truy cập',
            dataIndex: 'username',
        },
        {
            title: 'Email',
            dataIndex: 'email',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'address',
            render: (_, value: IUser) => (
                <p>{value.address},{value.WardId},{value.DistrictId},{value.WardId}</p>
            )
        },
        {
            title: 'Áp dụng',
            dataIndex: 'isActive',
            render: (_, value: IUser) => (
                <p>{value.isActive ? <Badge status="processing" /> : <Badge status="default" />}</p>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (value: IUser) => (
                <Space size="middle" className='flex justify-start'>
                    <Tooltip title="Chỉnh sửa" color={'yellow'} key={'yellow'}>
                        <EditFilled className='text-xl text-yellow-400 cursor-pointer' onClick={() => showModalUpdate(value.id!)} />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa người dùng"
                        description={`Bạn có chắc muốn xóa: ${value.name}`}
                        onConfirm={() => confirmDelete(value.id!)}
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
    const confirmDelete = async (id?: string) => {
        if (id) {
            const form: IIsDeletedUser = {
                isDeleted: 1
            }
            const results = await onDeleteUser({ id: id, ...form })
            if (results.error) {
                toast.error("Xóa thất bại!")
                return
            }
            dispatch(deleteUserSlice(id))
            toast.success("Xóa thành công!")
        }
    }
    // data 
    const data: IUser[] = listUserReducer.map((user, index) => ({
        key: index + 1,
        id: user.id,
        email: user.email,
        name: user.name,
        code: user.code,
        isActive: user.isActive,
        username: user.username,
        address: user.address,
        avatar: user.avatar,
        DistrictId: user.DistrictId,
        WardId: user.WardId,
        ProvinceId: user.ProvinceId,
        isDeleted: user.isDeleted
    }));
    // nút filter
    const onChange: TableProps<IUser>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    // nút xóa tất cả
    const handleDeleteAll = async (listCriteria: IUser[]) => {
        if (listCriteria.length > 0) {
            Swal.fire({
                title: "Xác nhận xóa mục đã chọn ?",
                showCancelButton: true,
                confirmButtonColor: "#1677ff",
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Hủy",
                icon: "question",
            }).then((results) => {
                if (results.isConfirmed) {
                    toast.success("Xóa thành công!")
                }
            })
        }
    }
    // actions them moi
    const onFinish = async (values: IUser) => {
        try {
            const results = await onAddUser(values)
            if (results.error) {
                message.error(`Thêm thất bại , vui lòng thử lại!`);
                return
            }
            message.success(`Đã thêm thành công người dùng: ${values.name}`);
            // sau khi them xong thi reset value
            form.resetFields()
            setOpen(false);
        } catch (error) {
            console.log(error)
        }
        // let newImages;
        // if (values.images && values.images.file) {
        //     newImages = values.images.file.response[0];
        // } else {
        //     newImages = [];
        // }
        // const value = {
        //     ...values,
        //     images: newImages
        // };


    };
    // actions cap nhat
    const onFinishUpdate = async (values: IUser) => {
        try {
            if (userId) {
                const results = await onUpdateUser({ id: userId, ...values })
                if (results.error) {
                    message.error(`Cập nhật thất bại , vui lòng thử lại!`);
                    return
                }
                message.success(`Cập nhật thành công`);
                formUpdate.resetFields()
                setOpenUpdate(false);
            }
        } catch (error) {
            console.log(error)
        }
    };
    // search
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        if (value) {
            // dispatch list user tu api vao redux trc khi nhan search
            dispatch(listUsersSlice(ListUserAPI))
            dispatch(listUserSearchSlice({ searchTerm: value, users: listUserReducer }))
        } else {
            dispatch(listUsersSlice(ListUserAPI))
        }
    };

    const handleReset = () => {
        dispatch(listUsersSlice(ListUserAPI))
    }

    return (
        <div className=''>

            {/* {isFetching && <div>Updating User data...</div>}
            {isLoadingUserAPI && <div>loading User data...</div>}
            {isLoadingDepartmentAPI && <div>Updating Department data...</div>}
            {isFetchingDepartment && <div>loading Department data...</div>} */}
            <div className="flex items-center gap-2">
                <h3 className='text-title mb-0'>Quản lí người dùng</h3>
                <div className="iconDelete-title">
                    <Tooltip title="Thùng rác của bạn" color='red'>
                        <Link to={`/users/trash`}><DeleteOutlined color='red' /></Link>
                    </Tooltip>
                </div>
            </div>
            {/* modal them moi nguoi dung */}
            <Modal
                title="Thêm người dùng"
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
                    {/* thong tin nguoi dung */}
                    <Row gutter={30}>
                        <Col span={8} className='flex justify-center text-center'>
                            {/* Upload Images */}
                            <Form.Item name="avatar">
                                <label htmlFor="" className='text-center'>Ảnh đại diện</label>
                                <Upload {...props}
                                    maxCount={1}
                                    className="mt-3"
                                >
                                    <div>
                                        <PlusOutlined />
                                        <div className='w-full'>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                            <Form.Item name="isDeleted">
                                <Input type='hidden'></Input>
                            </Form.Item>
                        </Col>
                        <Col span={16}>
                            <Row gutter={12}>
                                {/* Code */}
                                <Col span={6}>
                                    <Form.Item
                                        name="code"
                                        label="Code"
                                    >
                                        <Input disabled />
                                    </Form.Item>

                                </Col>
                                {/* username */}
                                <Col span={14}>
                                    <Form.Item
                                        name="username"
                                        label="Tên người dùng"
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
                                            { min: 3, message: 'Tối thiểu 3 kí tự' },

                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                {/* active */}
                                <Col span={4} className='flex items-center'>
                                    {/* Name Category */}
                                    <Form.Item
                                        name="isActive"
                                        className='mb-0'
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                {/* fullname */}
                                <Col span={12}>
                                    <Form.Item
                                        name="name"
                                        label="Họ và tên"
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
                                            { min: 3, message: 'Tối thiểu 3 kí tự' },

                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                {/* phong ban */}
                                <Col span={12}>
                                    <Form.Item
                                        name="Department"
                                        label="Phòng ban"
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Tìm kiếm phòng ban"
                                            optionFilterProp="children"
                                        >
                                            {listDepartmentReducer?.map((item, index) => (
                                                <Option value={`${item.id}`} key={index} disabled={!item.isActive}>{item.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {/* email */}
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: '* Không được để trống' },
                                    { type: 'email', message: 'Địa chỉ email không hợp lệ' },
                                    {
                                        validator: (_, value) => {
                                            if (value && value.trim() === '') {
                                                return Promise.reject('Không được để khoảng trắng');
                                            }
                                            return Promise.resolve();
                                        },
                                    },
                                    { min: 3, message: 'Tối thiểu 3 kí tự' },

                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* address */}
                    <Row gutter={30}>
                        {/* province */}
                        <Col span={8}>
                            <Form.Item name="ProvinceId" label="Tỉnh">
                                <Select
                                    showSearch
                                    placeholder="Tìm kiếm tỉnh"
                                    optionFilterProp="children"

                                >
                                    {provinces?.map((item, index) => (
                                        <Option value={`${item.id}`} key={index}>{item.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        {/* district */}
                        <Col span={8}>
                            <Form.Item name="DistrictId" label="Huyện">
                                <Select
                                    showSearch
                                    placeholder="Tìm kiếm huyện"
                                    optionFilterProp="children"
                                >
                                    {districts?.map((item, index) => (
                                        <Option value={`${item.id}`} key={index}>{item.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        {/* ward */}
                        <Col span={8}>
                            <Form.Item name="WardId" label="Xã">
                                <Select
                                    showSearch
                                    placeholder="Tìm kiếm xã"
                                    optionFilterProp="children"
                                >
                                    {wards?.map((item, index) => (
                                        <Option value={`${item.id}`} key={index}>{item.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* address */}
                    <Row>
                        <Col span={24}>
                            <Form.Item name="address" label="Địa chỉ">
                                <Input />
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
            {/* modal cap nhat */}
            <Modal
                title="Cập nhật người dùng"
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
                    {/* thông tin người dùng */}
                    <Row gutter={30}>
                        <Col span={8} className='flex justify-center text-center'>
                            {/* Upload Images */}
                            <Form.Item name="images">
                                <label htmlFor="" className='text-center'>Ảnh đại diện</label>
                                <Upload {...props}
                                    maxCount={1}
                                    style={{ width: "500px" }}
                                    className="user-page-upload mt-3"
                                >
                                    <div>
                                        <PlusOutlined />
                                        <div className='w-full'>Upload</div>
                                    </div>
                                </Upload>
                            </Form.Item>
                        </Col>
                        <Col span={16}>
                            <Row gutter={12}>
                                {/* Code */}
                                <Col span={6}>
                                    {/* Name Category */}
                                    <Form.Item
                                        name="code"
                                        label="Code"
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                {/* username */}
                                <Col span={14}>
                                    <Form.Item
                                        name="username"
                                        label="Tên người dùng"
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
                                            { min: 3, message: 'Tối thiểu 3 kí tự' },

                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                {/* active */}
                                <Col span={4} className='flex items-center'>
                                    {/* Name Category */}
                                    <Form.Item
                                        name="isActive"
                                        className='mb-0'
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                {/* fullname */}
                                <Col span={12}>
                                    <Form.Item
                                        name="name"
                                        label="Họ và tên"
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
                                            { min: 3, message: 'Tối thiểu 3 kí tự' },

                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                {/* phong ban */}
                                <Col span={12}>
                                    <Form.Item
                                        name="DepartmentId"
                                        label="Phòng ban"
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Tìm kiếm phòng ban"
                                            optionFilterProp="children"
                                        >
                                            {listDepartmentReducer?.map((item, index) => (
                                                <Option value={`${item.id}`} key={index} disabled={!item.isActive}>{item.name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {/* email */}
                    <Row>
                        <Col span={24}>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: '* Không được để trống' },
                                    { type: 'email', message: 'Địa chỉ email không hợp lệ' },
                                    {
                                        validator: (_, value) => {
                                            if (value && value.trim() === '') {
                                                return Promise.reject('Không được để khoảng trắng');
                                            }
                                            return Promise.resolve();
                                        },
                                    },
                                    { min: 3, message: 'Tối thiểu 3 kí tự' },

                                ]}
                            >
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* địa chỉ */}
                    <Row gutter={30}>
                        {/* province */}
                        <Col span={8}>
                            <Form.Item name="ProvinceId" label="Tỉnh">
                                <Select
                                    showSearch
                                    placeholder="Tìm kiếm tỉnh"
                                    optionFilterProp="children"
                                >
                                    {provinces?.map((item, index) => (
                                        <Option value={`${item.id}`} key={index}>{item.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        {/* district */}
                        <Col span={8}>
                            <Form.Item name="DistrictId" label="Huyện">
                                <Select
                                    showSearch
                                    placeholder="Tìm kiếm huyện"
                                    optionFilterProp="children"
                                >
                                    {districts?.map((item, index) => (
                                        <Option value={`${item.id}`} key={index}>{item.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        {/* ward */}
                        <Col span={8}>
                            <Form.Item name="WardId" label="Xã">
                                <Select
                                    showSearch
                                    placeholder="Tìm kiếm xã"
                                    optionFilterProp="children"
                                >
                                    {wards?.map((item, index) => (
                                        <Option value={`${item.id}`} key={index}>{item.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={24}>
                            <Form.Item name="address" label="Địa chỉ">
                                <Input />
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

            <div className="flex justify-between">
                <Space className='mb-3'>
                    <Button type='primary' danger onClick={() => handleDeleteAll(listUser)}>Xóa tất cả</Button>
                    <Search placeholder="Tìm kiếm tên người dùng ..." className='w-[300px]' onSearch={onSearch} enterButton />
                    <Button onClick={() => handleReset()}>reset</Button>
                </Space>
                <Button type='primary' className='mb-3' onClick={showModal}>Thêm mới</Button>
            </div>
            <Table columns={columns} rowSelection={{ ...rowSelection, checkStrictly }} dataSource={data} bordered onChange={onChange} />
        </div >
    )
}

export default UsersPage
