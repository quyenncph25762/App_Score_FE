import { Button, Popconfirm, Space, Spin, Table, TableProps, Tooltip } from 'antd'
import Search, { SearchProps } from 'antd/es/input/Search'
import React, { Dispatch, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'
import { IUser } from '../../store/users/user.interface'
import { deleteUserSlice, listUsersSlice, listUsersTrashSlice } from '../../store/users/userSlice'
import { ArrowLeftOutlined, LoadingOutlined, SyncOutlined } from '@ant-design/icons'
import { ColumnsType } from 'antd/es/table'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { useLazyFetchListUserQuery, useRevertUserMutation } from '../../store/users/user.service'
import { TableRowSelection } from 'antd/es/table/interface'
import { Link } from 'react-router-dom'
import { IDepartment } from '../../store/department/department.interface'
import { IIsDeleted } from '../../store/interface/IsDeleted/IsDeleted'
import { useLazyFetchAllWardQuery } from '../../store/wards/ward.service'

const UsersTrash = () => {
    const dispatch: Dispatch<any> = useDispatch()
    const [listUser, setListUser] = useState<IUser[]>([])
    const [checkStrictly, setCheckStrictly] = useState(false);
    // goi list user tu redux-toolkit
    const [triggerUser, { data: ListUserAPI, isError: isErrorListUser, isFetching: isFetchingUser, isLoading: isLoadingUserAPI, isSuccess: isSuccessUserApi }] = useLazyFetchListUserQuery()
    const [triggerWard, { data: wards, isError: isErrorWards }] = useLazyFetchAllWardQuery()
    const [onRevert] = useRevertUserMutation()
    if (isErrorListUser || isErrorWards) {
        console.log("Lỗi không call được dữ liệu từ server!")
        return
    }
    // danh sach list user tu redux
    const listUserReducer = useSelector((state: RootState) => state.userSlice?.users)
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
    // dispatch vao redux
    useEffect(() => {
        if (ListUserAPI?.results.length > 0) {
            dispatch(listUsersTrashSlice(ListUserAPI))
        }
    }, [isSuccessUserApi, ListUserAPI])
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
            title: 'Địa chỉ',
            dataIndex: 'Address',
            render: (_, value: IUser) => (
                <p>{value.NameWard} , {value.NameDistrict} , {value.NameCity}</p>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (value: IUser) => (
                <Space size="middle" className='flex justify-start'>
                    <Popconfirm
                        title="Khôi phục người dùng"
                        description={`Khôi phục: ${value.FullName}?`}
                        onConfirm={() => confirmRevert(value._id!)}
                        okText="Yes"
                        cancelText="No"
                        okButtonProps={{ className: "text-white bg-blue-500" }}
                    >
                        <Tooltip title="Khôi phục" color={'blue'} key={'blue'}>
                            <SyncOutlined className='text-xl text-blue-500' />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            )
        },
    ];
    const confirmRevert = async (id?: string) => {
        if (id) {
            const form: IIsDeleted = {
                IsDeleted: false
            }
            const results = await onRevert({ id: id, ...form })
            if (results.error) {
                toast.error("Khôi phục thất bại!")
                return
            }
            toast.success("Khôi phục thành công")
        }
    }
    // data 
    const data: IUser[] = listUserReducer.map((user, index) => ({
        key: index + 1,
        _id: user._id,
        Email: user.Email,
        FullName: user.FullName,
        Code: user.Code,
        IsActive: user.IsActive,
        UserName: user.UserName,
        Customer: user.Customer,
        Avatar: user.Avatar,
        DistrictId: user.DistrictId,
        WardId: user.WardId,
        ProvinceId: user.CityId,
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
        console.log('params', pagination, filters, sorter, extra);
    };
    // nut khôi phuc nhiều
    const handleRevertAll = async (listUser: IUser[]) => {
        try {
            if (listUser.length > 0) {
                const listUserId = listUser.map((user) => user._id)
                Swal.fire({
                    title: "Xác nhận Khôi phục mục đã chọn ?",
                    showCancelButton: true,
                    confirmButtonColor: "#1677ff",
                    confirmButtonText: "Xác nhận",
                    cancelButtonText: "Hủy",
                    icon: "question",
                }).then(async (results) => {
                    if (results.isConfirmed) {
                        const form = {
                            IsDeleted: false
                        }
                        for (const id of listUserId) {
                            await onRevert({ id: id, ...form })
                        }
                        toast.success("Khôi phục thành công!")
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    // search
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        console.log(value)
    };
    return (
        <div>

            <div className="flex items-center gap-2">
                <Tooltip title="Trở về">
                    <Link to={`/users`}>
                        <ArrowLeftOutlined style={{
                            marginBottom: "12px"
                        }} />
                    </Link>
                </Tooltip>
                <h3 className='text-title mb-0'>Khôi phục Người dùng</h3>
                {isFetchingUser && <div><Spin indicator={<LoadingOutlined spin />} size="small" /> Update data ...</div>}
            </div>
            <div className="flex justify-between">
                <Space className='mb-3'>
                    <Button type='primary' onClick={() => handleRevertAll(listUser)}>Khôi phục tất cả</Button>
                    <Search placeholder="Tìm kiếm tên người dùng ..." className='w-[300px]' onSearch={onSearch} enterButton />
                </Space>
            </div>
            <Table columns={columns} rowSelection={{ ...rowSelection, checkStrictly }} dataSource={data} bordered onChange={onChange} />
        </div >
    )
}

export default UsersTrash
