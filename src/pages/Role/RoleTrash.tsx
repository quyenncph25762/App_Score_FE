import { Button, Popconfirm, Space, Spin, Table, Tooltip } from 'antd';
import React, { Dispatch, useEffect, useState } from 'react'
import { ArrowLeftOutlined, LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { ColumnsType, TableProps } from 'antd/es/table';
import { useFetchAllDepartmentQuery, useRevertDepartmentMutation } from '../../store/department/department.service';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchAllDepartmentSlice, fetchAllDepartmentTrash } from '../../store/department/departmentSlice';
import { TableRowSelection } from 'antd/es/table/interface';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Search, { SearchProps } from 'antd/es/input/Search';
import { Link } from 'react-router-dom';
import { IIsDeleted } from '../../store/interface/IsDeleted/IsDeleted';
import { useFetchAllRoleFromTrashQuery, useFetchAllRoleQuery, useRevertRoleByCheckboxMutation, useRevertRoleMutation } from '../../store/role/role.service';
import { fetchAllRoleFromTrashSlice } from '../../store/role/roleSlice';
import { IRole } from '../../store/role/role.interface';

const RoleTrash = () => {
    const dispatch: Dispatch<any> = useDispatch()
    // nut khoi phuc
    const [onRevert] = useRevertRoleMutation()
    // nut khoi phuc nhieu
    const [onRevertByCheckbox] = useRevertRoleByCheckboxMutation()
    // listDeparment
    const [listRole, setRole] = useState<IRole[]>([])
    // state checked
    const [checkStrictly, setCheckStrictly] = useState(false);
    // department api & slice
    const { data: listRoleApi, isError: isErrorRole, isFetching: isFetchingRole, isSuccess: isSuccessRole } = useFetchAllRoleFromTrashQuery()
    const listRoleReducer = useSelector((state: RootState) => state.roleSlice.roles)
    // neu co listDepartmentApi thi dispatch vao trong reducer
    useEffect(() => {
        if (listRoleApi) {
            dispatch(fetchAllRoleFromTrashSlice(listRoleApi))
        }
    }, [isSuccessRole, listRoleApi])
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
                    <Popconfirm
                        title="Khôi phục lĩnh vực"
                        description={`Bạn muốn khôi phục: ${value.NameRole}?`}
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
    // data 
    const data: IRole[] = listRoleReducer.map((item, index) => ({
        key: index + 1,
        _id: item._id,
        NameRole: item.NameRole,
        Note: item.Note,
        IsDeleted: item.IsDeleted
    }))
    // nut khoi phuc
    const confirmRevert = async (id: string) => {
        try {
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
        } catch (error) {
            console.log(error)
        }
    }
    // nut khôi phuc nhiều
    const handleRevertAll = async (listRole: any) => {
        try {
            if (listRole.length > 0) {
                const listRoleId = listRole.map((role) => role._id)
                Swal.fire({
                    title: "Xác nhận Khôi phục mục đã chọn ?",
                    showCancelButton: true,
                    confirmButtonColor: "#1677ff",
                    confirmButtonText: "Xác nhận",
                    cancelButtonText: "Hủy",
                    icon: "question",
                }).then(async (results) => {
                    if (results.isConfirmed) {
                        const results = await onRevertByCheckbox(listRoleId)
                        if (results.error) {
                            return toast.error("Khôi phục không thành công!")
                        }
                        toast.success("Khôi phục thành công!")
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    // nút filter
    const onChange: TableProps<IRole>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    // nút tìm kiếm
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        console.log(value)
    };
    return (
        <div>
            <div className="flex items-center gap-2">
                <Tooltip title="Trở về">
                    <Link to={`/roles`}>
                        <ArrowLeftOutlined style={{
                            marginBottom: "12px"
                        }} />
                    </Link>
                </Tooltip>
                <h3 className='text-title mb-0'>Khôi phục lĩnh vực</h3>
                {isFetchingRole && <div> <Spin indicator={<LoadingOutlined spin />} size="small" /> Update data ...</div>}
            </div>
            <div className="flex justify-between">
                <Space className='mb-3'>
                    <Button type='primary' onClick={() => handleRevertAll(listRole)}>Khôi phục tất cả</Button>
                    <Search placeholder="Tìm kiếm tên vai trò ..." className='w-[300px]' onSearch={onSearch} enterButton />
                </Space>
            </div>
            <Table columns={columns} rowSelection={{ ...rowSelection, checkStrictly }} dataSource={data} bordered onChange={onChange} />
        </div>
    )
}

export default RoleTrash
