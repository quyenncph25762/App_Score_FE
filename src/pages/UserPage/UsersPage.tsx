import React, { Dispatch, useEffect, useState } from 'react'
import { Badge, Button, Col, Form, FormInstance, Image, Input, message, Modal, Popconfirm, Radio, Result, Row, Select, SelectProps, Space, Spin, Switch, Table, Tooltip, Typography, Upload, Flex } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { DeleteFilled, DeleteOutlined, EditFilled, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { TableRowSelection } from 'antd/es/table/interface';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload';
import { SearchProps } from 'antd/es/input/Search';
import { useAddUserMutation, useFetchListUserQuery, useLazyFetchOneUserQuery, useRemoveUserMutation, useUpdateUserMutation } from '../../store/users/user.service';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserSlice, listUserSearchSlice, listUsersSlice } from '../../store/users/userSlice';
import { RootState } from '../../store';
import { IUser } from '../../store/users/user.interface';
import { useFetchAllDistrictQuery } from '../../store/districts/district.service';
import { useFetchAllProvinceQuery } from '../../store/province/province.service';
import { useFetchAllDepartmentQuery } from '../../store/department/department.service';
import { fetchAllDepartmentSlice } from '../../store/department/departmentSlice';
import { useFetchAllObjectQuery } from '../../store/object/object.service';
import { getAllObjectSlice } from '../../store/object/objectSlice';
import { IDepartment } from '../../store/department/department.interface';
import { IIsDeleted } from '../../store/interface/IsDeleted/IsDeleted';
import { useFetchAllApartmentQuery } from '../../store/apartment/apartment.service';
import { useLazyFetchAllWardQuery } from '../../store/wards/ward.service';
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
    // truyen props tu app
    const dispatch: Dispatch<any> = useDispatch()
    const navigate = useNavigate()
    // gọi api khi nhấn trigger
    const [trigger, { data: getOneUser, isError: isErrorOneUser, isSuccess: isSuccessGetOneUser }] = useLazyFetchOneUserQuery()
    // goi list user tu redux-toolkit
    const { data: ListUserAPI, isError: isErrorListUser, isFetching: isFetchingUser, isLoading: isLoadingUserAPI, isSuccess: isSuccessUserApi } = useFetchListUserQuery()
    // goi object API 
    const { data: ListObjectAPI, isError: isErrorListObject, isFetching: isFetchingObject, isLoading: isLoadingObjectAPI, isSuccess: isSuccessObjectApi } = useFetchAllObjectQuery()

    // goi list department tu redux-toolkit
    // const { data: listDepartmentApi, isError: isErrorDepartmenApi, isLoading: isLoadingDepartmentApi, isSuccess: isSuccessDepartmentApi } = useFetchAllDepartmentQuery()
    // api cac cap tai khoan
    const { data: listApartments, isLoading: isLoadingApartmentApi } = useFetchAllApartmentQuery()
    // goi list ward 
    const [triggerWard, { data: wards, isError: isErrorWards }] = useLazyFetchAllWardQuery()
    const { data: districts, isError: isErrorDistricts } = useFetchAllDistrictQuery()
    const { data: provinces, isError: isErrorProvinces } = useFetchAllProvinceQuery()
    useEffect(() => {
        if (isErrorListUser || isErrorOneUser || isErrorWards || isErrorDistricts || isErrorProvinces || isErrorListObject) {
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
    //  list object trong reducer
    const listObjectReducer = useSelector((state: RootState) => state.objectSlice.objects)
    // neu ma goi thanh cong thi dispatch vao redux
    useEffect(() => {
        if (ListUserAPI?.length > 0) {
            dispatch(listUsersSlice(ListUserAPI))
        }
    }, [isSuccessUserApi, ListUserAPI])
    // dispatch department
    // useEffect(() => {
    //     if (listDepartmentApi) {
    //         dispatch(fetchAllDepartmentSlice(listDepartmentApi))
    //     }
    // }, [isSuccessDepartmentApi, listDepartmentApi, dispatch])
    // dispatch object
    useEffect(() => {
        if (ListObjectAPI) {
            dispatch(getAllObjectSlice(ListObjectAPI))
        }
    }, [isSuccessObjectApi, ListObjectAPI])
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
                Code: getOneUser.Code,
                FullName: getOneUser.FullName,
                UserName: getOneUser.UserName,
                ProvinceId: getOneUser.ProvinceId,
                DistrictId: getOneUser.DistrictId,
                // DepartmentId: getOneUser.DepartmentId,
                ObjectId: getOneUser.ObjectId,
                WardId: getOneUser.WardId,
                // isActive: getOneUser.isActive,
                Address: getOneUser.Address,
                Email: getOneUser.Email,
                CreatorUserId: 1,
                Gender: getOneUser.Gender,
                ApartmentId: Number(getOneUser.ApartmentId)
            })
        }
    }, [isSuccessGetOneUser, getOneUser, openUpdate])

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
            Code: randomCode(),
            UserName: randomUserName(),
            // isActive: true,
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
    // show Modal update
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
            dataIndex: 'FullName',
        },
        {
            title: 'Tên truy cập',
            dataIndex: 'UserName',
        },
        {
            title: 'Email',
            dataIndex: 'Email',
        },
        {
            title: 'Địa chỉ',
            dataIndex: 'Address',
            render: (_, value: IUser) => (
                <p>{value.Address},{value.WardId},{value.DistrictId},{value.WardId}</p>
            )
        },
        // {
        //     title: 'Áp dụng',
        //     dataIndex: 'isActive',
        //     render: (_, value: IUser) => (
        //         <p>{value.isActive ? <Badge status="processing" /> : <Badge status="default" />}</p>
        //     )
        // },
        {
            title: 'Hành động',
            key: 'action',
            render: (value: IUser) => (
                <Space size="middle" className='flex justify-start'>
                    <Tooltip title="Chỉnh sửa" color={'yellow'} key={'yellow'}>
                        <EditFilled className='text-xl text-yellow-400 cursor-pointer' onClick={() => showModalUpdate(value._id!)} />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa người dùng"
                        description={`Bạn có chắc muốn xóa: ${value.UserName}`}
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
    const confirmDelete = async (id?: string) => {
        if (id) {
            const form: IIsDeleted = {
                IsDeleted: true
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
        _id: user._id,
        Email: user.Email,
        FullName: user.FullName,
        Code: user.Code,
        // isActive: user.isActive,
        UserName: user.UserName,
        Address: user.Address,
        Avatar: user.Avatar,
        DistrictId: user.DistrictId,
        WardId: user.WardId,
        ProvinceId: user.ProvinceId,
        IsDeleted: user.IsDeleted,
        ApartmentId: user.ApartmentId,
        Gender: user.Gender
    }));
    // nút filter
    const onChange: TableProps<IUser>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    // nút xóa tất cả
    const handleDeleteAll = async (listUser: IUser[]) => {
        if (listUser.length > 0) {
            const listUserId = listUser.map((user) => user._id)
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
                    for (const id of listUserId) {
                        await onDeleteUser({ id: id, ...form })
                    }
                    toast.success("Xóa thành công!")
                }
            })
        }
    }
    // actions them moi
    const onFinish = async (values: IUser) => {
        try {
            const { ApartmentId, ...data } = values
            const ApartmentIdNumber = Number(ApartmentId);
            // Tạo đối tượng mới với ApartmentId đã chuyển đổi
            const newValues = { ...data, ApartmentId: ApartmentIdNumber };
            console.log(newValues)
            return
            const results = await onAddUser(newValues)
            if (results.error) {
                message.error(`Thêm thất bại , vui lòng thử lại!`);
                return
            }
            message.success(`Đã thêm thành công người dùng: ${values.FullName}`);
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
            if (getOneUser) {
                const { ApartmentId, ...data } = values
                const ApartmentIdNumber = Number(ApartmentId);
                const newValues = { ...data, ApartmentId: ApartmentIdNumber };
                console.log(newValues)
                const results = await onUpdateUser({ _id: getOneUser._id, ...newValues })
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

    // option select
    // add
    const optionsSelect: SelectProps['options'] = listDepartmentReducer.map((item) => ({
        label: item.name, // Hoặc thuộc tính tương ứng từ item
        value: item.id, // Hoặc thuộc tính tương ứng từ item
        disabled: !item.isActive
    }));
    const handleChangeSelect = (value: string[]) => {
        console.log(`selected ${value}`);
    };
    // update
    const optionsSelectUpdate: SelectProps['options'] = listDepartmentReducer.map((item) => ({
        label: item.name, // Hoặc thuộc tính tương ứng từ item
        value: item.id, // Hoặc thuộc tính tương ứng từ item
        disabled: !item.isActive
    }));
    const handleChangeSelectUpdate = (value: string[]) => {
        console.log(`selected ${value}`);
    };
    return (
        <div className=''>
            {isLoadingUserAPI || isLoadingApartmentApi || isLoadingObjectAPI ? <div>loading data...</div> : ""}
            <div className="flex items-center gap-2">
                <h3 className='text-title mb-0'>Quản lí người dùng</h3>
                <div className="iconDelete-title">
                    <Tooltip title="Thùng rác của bạn" color='red'>
                        <Link to={`/users/trash`}><DeleteOutlined color='red' /></Link>
                    </Tooltip>
                </div>
                {isFetchingUser && <div> <Spin indicator={<LoadingOutlined spin />} size="small" /> Update data ...</div>}

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
                    <Row gutter={12}>
                        {/* avatar */}
                        <Col span={8} className='flex justify-center text-center'>
                            {/* Upload Images */}
                            <Form.Item name="Avatar">
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
                            <Form.Item name="IsDeleted">
                                <Input type='hidden'></Input>
                            </Form.Item>
                        </Col>
                        {/* cap tai khoan */}
                        <Col span={16}>
                            <Row gutter={12}>
                                <Col span={24}>
                                    <Form.Item label="Cấp tài khoản" name="ApartmentId">
                                        <Radio.Group>
                                            {listApartments?.map((apartment, index) => (
                                                <Radio.Button key={index} value={`${apartment.id}`} type='number'>{apartment.Name}</Radio.Button>
                                            ))}
                                            {/* <Radio.Button value="2" type='number'>Cấp Xã</Radio.Button>
                                            <Radio.Button value="2" type='number'>Cấp Huyện</Radio.Button>
                                            <Radio.Button value="3" type='number'>Cấp Tỉnh</Radio.Button> */}
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                {/* Code */}
                                <Col span={6}>
                                    <Form.Item
                                        name="Code"
                                        label="Code"
                                    >
                                        <Input disabled />
                                    </Form.Item>

                                </Col>
                                {/* UserName */}
                                <Col span={14}>
                                    <Form.Item
                                        name="UserName"
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
                                    <Form.Item
                                        name="isActive"
                                        className='mb-0'
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    {/* fullname */}
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item
                                name="FullName"
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
                        {/* Email */}
                        <Col span={12}>
                            <Form.Item
                                name="Email"
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
                    {/*linh vuc */}
                    <Row gutter={12}>
                        <Col span={12}>
                            <Form.Item
                                name="DepartmentId"
                                label="Lĩnh vực"
                            >
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="Please select"
                                    onChange={handleChangeSelect}
                                    options={optionsSelect}
                                />
                            </Form.Item>
                        </Col>
                        {/* đối tượng */}
                        <Col span={12}>
                            <Form.Item
                                name="ObjectId"
                                label="Đối tượng"
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
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Tìm kiếm đối tượng"
                                    optionFilterProp="children"

                                >
                                    {listObjectReducer?.map((item, index) => (
                                        <Option value={`${item.id}`} key={index} disabled={!item.isActive}>{item.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* Address */}
                    <Row gutter={12}>
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
                    {/* dia chi */}
                    <Row>
                        <Col span={24}>
                            <Form.Item name="Address" label="Địa chỉ">
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
                            <Form.Item name="Avatar">
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
                        {/*  */}
                        <Col span={16}>
                            {/* cap tai khoan */}
                            <Row gutter={12}>
                                <Col span={24}>
                                    <Form.Item label="Cấp tài khoản" name="ApartmentId">

                                        <Radio.Group defaultValue={String(getOneUser?.ApartmentId)}>
                                            {listApartments?.map((apartment) => (
                                                <Radio.Button key={apartment.id} value={`${apartment.id}`}>
                                                    {apartment.Name}
                                                </Radio.Button>
                                            ))}
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                {/* Code */}
                                <Col span={6}>
                                    {/* Name Category */}
                                    <Form.Item
                                        name="Code"
                                        label="Code"
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                {/* username */}
                                <Col span={14}>
                                    <Form.Item
                                        name="UserName"
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
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        {/* fullname */}
                        <Col span={12}>
                            <Form.Item
                                name="FullName"
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
                        {/* email */}
                        <Col span={12}>
                            <Form.Item
                                name="Email"
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
                    <Row gutter={12}>
                        {/* phong ban */}
                        <label htmlFor=""></label>
                        <Col span={12}>
                            <Form.Item
                                name="DepartmentId"
                                label="Lĩnh vực"
                            >
                                <Select
                                    mode="multiple"
                                    style={{ width: '100%' }}
                                    placeholder="Please select"
                                    onChange={handleChangeSelectUpdate}
                                    options={optionsSelectUpdate}
                                >
                                    {/* {listDepartmentReducer?.map((item, index) => (
                                        <Option value={`${item.id}`} key={index} disabled={!item.isActive}>{item.name}</Option>
                                    ))} */}
                                </Select>
                            </Form.Item>
                        </Col>
                        {/* đối tượng */}
                        <Col span={12}>
                            <Form.Item
                                name="ObjectId"
                                label="Đối tượng"
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
                                ]}
                            >
                                <Select
                                    showSearch
                                    placeholder="Tìm kiếm đối tượng"
                                    optionFilterProp="children"

                                >
                                    {listObjectReducer?.map((item, index) => (
                                        <Option value={`${item.id}`} key={index} disabled={!item.isActive}>{item.name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* địa chỉ */}
                    <Row gutter={12}>
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
                    {/* Address */}
                    <Row>
                        <Col span={24}>
                            <Form.Item name="Address" label="Địa chỉ">
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
                    <Search placeholder="Tìm kiếm người dùng ..." className='w-[300px]' onSearch={onSearch} enterButton />
                    <Button onClick={() => handleReset()}>reset</Button>
                </Space>
                <Button type='primary' className='mb-3' onClick={showModal}>Thêm mới</Button>
            </div>
            <Table columns={columns} rowSelection={{ ...rowSelection, checkStrictly }} dataSource={data} bordered onChange={onChange} />
        </div >
    )
}

export default UsersPage
