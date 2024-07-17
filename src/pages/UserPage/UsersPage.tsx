import React, { Dispatch, useEffect, useRef, useState } from 'react'
import { Badge, Button, Col, Form, FormInstance, Image, Input, message, Modal, Popconfirm, Radio, Result, Row, Select, SelectProps, Space, Spin, Switch, Table, Tooltip, Typography, Upload, Flex } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { DeleteFilled, DeleteOutlined, EditFilled, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { TableRowSelection } from 'antd/es/table/interface';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload';
import { SearchProps } from 'antd/es/input/Search';
import { useAddUserMutation, useLazyFetchListUserQuery, useLazyFetchOneUserQuery, useRemoveUserMutation, useUpdateUserMutation } from '../../store/users/user.service';
import { useDispatch, useSelector } from 'react-redux';
import { deleteUserSlice, listUserSearchSlice, listUsersSlice } from '../../store/users/userSlice';
import { RootState } from '../../store';
import { IUser } from '../../store/users/user.interface';
import { useFetchAllProvinceQuery } from '../../store/province/province.service';
import { useFetchAllDepartmentQuery } from '../../store/department/department.service';
import { fetchAllDepartmentSlice } from '../../store/department/departmentSlice';
import { useFetchAllObjectQuery } from '../../store/object/object.service';
import { getAllObjectSlice } from '../../store/object/objectSlice';
import { IDepartment } from '../../store/department/department.interface';
import { IIsDeleted } from '../../store/interface/IsDeleted/IsDeleted';
import { useFetchAllApartmentQuery } from '../../store/apartment/apartment.service';
import { useLazyFetchAllWardQuery } from '../../store/wards/ward.service';
import { useLazyFetchAllDistrictQuery } from '../../store/districts/district.service';
import { useFetchAllRoleQuery } from '../../store/role/role.service';
import Item from 'antd/es/list/Item';
import { useLazyFetchInfoEmployeeByEmployeeIdQuery } from '../../store/infoEmployee/infoEmployee.service';
import { IInfoEmployee } from '../../store/infoEmployee/infoEmployee.interface';
const { Option } = Select;
const { Search } = Input;


const SubmitButton = ({ form }: { form: FormInstance }) => {
    const [submittable, setSubmittable] = React.useState(false);
    const values = Form.useWatch([], form);

    React.useEffect(() => {
        form?.validateFields({ validateOnly: true }).then(
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
    const [triggerListUser, { data: ListUserAPI, isError: isErrorListUser, isFetching: isFetchingUser, isLoading: isLoadingUserAPI, isSuccess: isSuccessUserApi }] = useLazyFetchListUserQuery()
    // goi list infoEmployee theo employeeId
    const [triggerInFoEmployee, { data: listInfoEmployee, isError: isErrorInfo, isLoading: isLoadingInfo }] = useLazyFetchInfoEmployeeByEmployeeIdQuery()
    useEffect(() => {
        triggerListUser(1)
    }, [])
    // goi object API 
    const { data: ListObjectAPI, isError: isErrorListObject, isFetching: isFetchingObject, isLoading: isLoadingObjectAPI, isSuccess: isSuccessObjectApi } = useFetchAllObjectQuery()
    // gọi Api Vai trò 
    const { data: ListRoleApi, isError: isErrorListRole, isLoading: isLoadingRole } = useFetchAllRoleQuery()
    // goi list department tu redux-toolkit
    const { data: listDepartmentApi, isError: isErrorDepartmenApi, isLoading: isLoadingDepartmentApi, isSuccess: isSuccessDepartmentApi } = useFetchAllDepartmentQuery()
    // api cac cap tai khoan
    const { data: listApartments, isLoading: isLoadingApartmentApi } = useFetchAllApartmentQuery()
    // goi list ward theo id cua district
    const [triggerWard, { data: wards, isError: isErrorWards }] = useLazyFetchAllWardQuery()
    // goi list district theo id cua province
    const [triggerDistrict, { data: districts, isError: isErrorDistricts }] = useLazyFetchAllDistrictQuery()
    // console.log(`districts:`, districts)
    const { data: provinces, isError: isErrorProvinces } = useFetchAllProvinceQuery()
    useEffect(() => {
        if (isErrorListUser || isErrorOneUser || isErrorWards || isErrorDistricts || isErrorProvinces || isErrorListObject || isErrorInfo) {
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
    //  list object trong reducer
    const listObjectReducer = useSelector((state: RootState) => state.objectSlice.objects)
    const [currentPage, setCurrentPage] = useState(1)
    // neu ma goi thanh cong thi dispatch vao redux
    useEffect(() => {
        if (ListUserAPI?.results.length > 0) {
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
    // const listInfoEmployeeRef: any = useRef()
    // Xet du lieu cho formUpdate
    // useEffect lay du lieu update user thay doi theo khi call api getOneUser
    // set value cho form theo id
    useEffect(() => {
        if (getOneUser) {
            formUpdate.setFieldsValue({
                Code: getOneUser.Code,
                FullName: getOneUser.FullName,
                UserName: getOneUser.UserName,
                CityId: getOneUser.CityId,
                DistrictId: getOneUser.DistrictId,
                // DepartmentId: getOneUser.DepartmentId,
                Fields: listInfoEmployee ? listInfoEmployee.map((item) => item.FieldId) : "",
                RoleId: getOneUser.RoleId,
                ObjectId: getOneUser.ObjectId,
                WardId: getOneUser.WardId,
                IsActive: getOneUser.IsActive,
                Customer: getOneUser.Customer,
                Email: getOneUser.Email,
                Phone: getOneUser.Phone,
                CreatorUserId: 1,
                ApartmentId: Number(getOneUser.ApartmentId)
            })
            triggerDistrict(getOneUser.CityId)
            triggerWard(getOneUser.DistrictId)
        }
    }, [isSuccessGetOneUser, getOneUser, listInfoEmployee])

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
            IsActive: true,
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
            // trigger getOneEmployee
            trigger(id)
            // trigger getInfoEmployee by Employee Id
            triggerInFoEmployee(id)
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
        {
            title: 'Tên đăng nhập',
            dataIndex: 'UserName'
        },
        {
            title: 'Tên người dùng',
            dataIndex: 'FullName',
            render: (_, value: IUser) => (
                <div className="">
                    <p>{value.Customer}</p>
                    <p className='text-[#1677ff] font-semibold text-[12px]'>{value.FullName}</p>
                </div>
            )
        },
        {
            title: 'Vai trò',
            dataIndex: 'RoleName',
        },
        {
            title: 'Email',
            dataIndex: 'Email',
        },
        {
            title: 'Đối tượng',
            dataIndex: 'ObjectName'
        },
        {
            title: 'Địa chỉ',
            render: (_, value: IUser) => (
                <p>{value.NameWard} , {value.NameDistrict} , {value.NameCity}</p>
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
                        title={`Xóa tải khoản: ${value.Customer}`}
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
        Customer: user.Customer,
        Code: user.Code,
        IsActive: user.IsActive,
        UserName: user.UserName,
        Avatar: user.Avatar,
        ObjectId: user.ObjectId,
        DistrictId: user.DistrictId,
        WardId: user.WardId,
        CityId: user.CityId,
        RoleId: user.RoleId,
        IsDeleted: user.IsDeleted,
        ApartmentId: user.ApartmentId,
        NameCity: user.NameCity,
        NameDistrict: user.NameDistrict,
        NameWard: user.NameWard,
        ObjectName: user.ObjectName,
        RoleName: user.RoleName,
        Phone: user.Phone
    }));
    // nút filter
    const onChange: TableProps<IUser>['onChange'] = (pagination, filters, sorter, extra) => {
        setCurrentPage(pagination.current)
        triggerListUser(pagination.current)
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
            const password = "123456";
            // Tạo đối tượng mới với ApartmentId đã chuyển đổi
            const newValues = { ...values, Password: password };
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
                const results = await onUpdateUser({ _id: getOneUser._id, ...values })
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
    const optionsSelect: SelectProps['options'] = listDepartmentApi?.map((item) => ({
        label: item.Name, // Hoặc thuộc tính tương ứng từ item
        value: item._id, // Hoặc thuộc tính tương ứng từ item
        // disabled: !item.isActive
    }));
    const handleChangeSelect = (value: string[]) => {
        console.log(`selected ${value}`);
    };
    // update
    const optionsSelectUpdate: SelectProps['options'] = listDepartmentApi?.map((item) => ({
        label: item.Name, // Hoặc thuộc tính tương ứng từ item
        value: item._id, // Hoặc thuộc tính tương ứng từ item
        // disabled: !item.isActive
    }));
    const handleChangeSelectUpdate = (value: string[]) => {
        console.log(`selected ${value}`);
    };
    // loc theo thanh pho , huyen
    const handleDistrictByProvince = (IdProvince: number) => {
        if (IdProvince) {
            triggerDistrict(IdProvince)
        }
    }
    const handleWardByDistrictId = (IdDistrict: number) => {
        if (IdDistrict) {
            triggerWard(IdDistrict)
        }
    }
    // -------- SELECT OPTIONS
    // select objects
    const selectObjects = listObjectReducer?.map((item, index) => ({
        label: item.NameObject,
        value: item._id,
    }))
    // select provinces
    const selectProvinces = provinces?.map((item, index) => ({
        label: item.Name,
        value: item._id,
    }))
    // select districts
    const selectDistricts = districts?.map((item, index) => ({
        label: item.Name,
        value: item._id,
    }))
    // select wards
    const selectWards = wards?.map((item, index) => ({
        label: item.Name,
        value: item._id,
    }))
    // selectRole
    const selectRoles = ListRoleApi?.map((item, index) => ({
        label: item.NameRole,
        value: item._id,
    }))
    // radioApartments Add
    const radioApartmentsAdd = listApartments?.map((apartment, index) => ({
        label: apartment.Name,
        value: apartment._id
    }))
    // radioApartments update
    const radioApartmentsUpdate = listApartments?.map((apartment, index) => ({
        label: apartment.Name,
        value: apartment._id
    }))
    return (
        <div className=''>
            {isLoadingUserAPI || isLoadingApartmentApi || isLoadingObjectAPI || isLoadingRole || isLoadingInfo ? <div>loading data...</div> : ""}
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
                            {/* <Form.Item name="Avatar">
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
                            </Form.Item> */}
                            <Image src='https://media.istockphoto.com/id/177228186/fr/photo/jeune-capybara.jpg?s=612x612&w=0&k=20&c=fSMMXOPp5aJzdOV6UnQQDiCGkE7BXUOAmEsspxJxW7I=' className='rounded-[50%] object-cover' width={160} height={160}></Image>
                            <Form.Item name="IsDeleted">
                                <Input type='hidden'></Input>
                            </Form.Item>
                        </Col>
                        <Col span={16}>
                            <Row gutter={12}>
                                {/* cap tai khoan */}
                                <Col span={12}>
                                    <Form.Item label="Cấp tài khoản" name="ApartmentId" rules={[
                                        { required: true, message: '* Không được để trống' },
                                    ]}>
                                        <Radio.Group options={radioApartmentsAdd}>
                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                {/* RoleId */}
                                <Col span={12}>
                                    <Form.Item
                                        name="RoleId"
                                        label="Vai trò"
                                        rules={[
                                            { required: true, message: '* Không được để trống' },
                                        ]}
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Tìm kiếm vai trò"
                                            optionFilterProp="children"
                                        >
                                            {ListRoleApi?.map((item, index) => (
                                                <Option value={`${item._id}`} key={index}>{item.NameRole}</Option>
                                            ))}
                                        </Select>
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
                                        name="IsActive"
                                        className='mb-0'
                                    >
                                        <Switch />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        {/* Customer */}
                        <Col span={12}>
                            <Form.Item
                                name="Customer"
                                label="Tên Khu vực"
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
                        {/* FullName */}
                        <Col span={12}>
                            <Form.Item name="FullName" label="Người sở hữu" rules={[
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

                            ]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        {/* Phone */}
                        <Col span={12}>
                            <Form.Item
                                name="Phone"
                                label="Số điện thoại"
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
                                    { min: 9, message: 'Tối thiểu 9 kí tự' },

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
                                name="Fields"
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
                            >
                                <Select
                                    showSearch
                                    placeholder="Tìm kiếm đối tượng"
                                    optionFilterProp="children"

                                >
                                    {listObjectReducer?.map((item, index) => (
                                        <Option value={`${item._id}`} key={index} >{item.NameObject}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* Address */}
                    <Row gutter={12}>
                        {/* province */}
                        <Col span={8}>
                            <Form.Item name="CityId" label="Tỉnh" rules={[
                                { required: true, message: '* Không được để trống' }
                            ]}>
                                <Select
                                    showSearch
                                    placeholder="Tìm kiếm tỉnh"
                                    optionFilterProp="children"
                                    onChange={handleDistrictByProvince}
                                >
                                    {provinces?.map((item, index) => (
                                        <Option value={`${item._id}`} key={index} >{item.Name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        {/* district */}
                        <Col span={8}>
                            <Form.Item name="DistrictId" label="Huyện" rules={[
                                { required: true, message: '* Không được để trống' }
                            ]}>
                                <Select
                                    showSearch
                                    placeholder="Tìm kiếm huyện"
                                    optionFilterProp="children"
                                    onChange={handleWardByDistrictId}
                                >
                                    {districts?.map((item, index) => (
                                        <Option value={`${item._id}`} key={index}>{item.Name}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                        {/* ward */}
                        <Col span={8}>
                            <Form.Item name="WardId" label="Xã" rules={[
                                { required: true, message: '* Không được để trống' }
                            ]}>
                                <Select
                                    showSearch
                                    placeholder="Tìm kiếm xã"
                                    optionFilterProp="children"
                                >
                                    {wards?.map((item, index) => (
                                        <Option value={`${item._id}`} key={index}>{item.Name}</Option>
                                    ))}
                                </Select>
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
                            <Image src={getOneUser?.Avatar ? `${getOneUser.Avatar}` : "https://qph.cf2.quoracdn.net/main-qimg-1a4bafe2085452fdc55f646e3e31279c-lq"} className='rounded-[50%] object-cover' width={160} height={160}></Image>
                        </Col>
                        {/*  */}
                        <Col span={16}>
                            {/* cap tai khoan */}
                            <Row gutter={12}>
                                <Col span={12}>
                                    <Form.Item label="Cấp tài khoản" name="ApartmentId" rules={[
                                        { required: true, message: '* Không được để trống' },
                                    ]}>
                                        <Radio.Group options={radioApartmentsUpdate}>

                                        </Radio.Group>
                                    </Form.Item>
                                </Col>
                                {/* RoleId */}
                                <Col span={12}>
                                    <Form.Item
                                        name="RoleId"
                                        label="Vai trò"
                                        rules={[
                                            { required: true, message: '* Không được để trống' }
                                        ]}
                                    >
                                        <Select
                                            showSearch
                                            placeholder="Tìm kiếm vai trò"
                                            optionFilterProp="children"
                                            options={selectRoles}
                                        >

                                        </Select>
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
                                        name="IsActive"
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
                                name="Customer"
                                label="Tên khu vực"
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
                        {/* FullName */}
                        <Col span={12}>
                            <Form.Item name="FullName" label="Người sở hữu" rules={[
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

                            ]}>
                                <Input />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={12}>
                        {/* Phone */}
                        <Col span={12}>
                            <Form.Item
                                name="Phone"
                                label="Số điện thoại"
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
                                    { min: 9, message: 'Tối thiểu 9 kí tự' },

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
                                name="Fields"
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
                            >
                                <Select
                                    showSearch
                                    placeholder="Tìm kiếm đối tượng"
                                    optionFilterProp="children"
                                    allowClear
                                    options={selectObjects}
                                >

                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>
                    {/* địa chỉ */}
                    <Row gutter={12}>
                        {/* province */}
                        <Col span={8}>
                            <Form.Item name="CityId" label="Tỉnh" rules={[
                                { required: true, message: '* Không được để trống' }
                            ]}>
                                <Select
                                    showSearch
                                    placeholder="Tìm kiếm tỉnh"
                                    optionFilterProp="children"
                                    options={selectProvinces}
                                    onChange={handleDistrictByProvince}
                                >

                                </Select>
                            </Form.Item>
                        </Col>
                        {/* district */}
                        <Col span={8}>
                            <Form.Item name="DistrictId" label="Huyện" rules={[
                                { required: true, message: '* Không được để trống' }
                            ]}>
                                <Select
                                    showSearch
                                    placeholder="Tìm kiếm huyện"
                                    optionFilterProp="children"
                                    onChange={handleWardByDistrictId}
                                    options={selectDistricts}
                                >
                                </Select>
                            </Form.Item>
                        </Col>
                        {/* ward */}
                        <Col span={8}>
                            <Form.Item name="WardId" label="Xã" rules={[
                                { required: true, message: '* Không được để trống' }
                            ]}>
                                <Select
                                    showSearch
                                    placeholder="Tìm kiếm xã"
                                    optionFilterProp="children"
                                    options={selectWards}
                                >
                                </Select>
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
            <Table columns={columns} pagination={{
                current: currentPage,
                pageSize: ListUserAPI?.results.length,
                total: (ListUserAPI?.results.length * ListUserAPI?.pagination.pages.length)
            }} rowSelection={{ ...rowSelection, checkStrictly }} dataSource={data} bordered onChange={onChange} />
        </div >
    )
}

export default UsersPage
