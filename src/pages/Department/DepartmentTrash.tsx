import { Button, Popconfirm, Space, Table, Tooltip } from 'antd';
import React, { Dispatch, useEffect, useState } from 'react'
import { IDepartment } from '../../store/department/department.interface';
import { ArrowLeftOutlined, SyncOutlined } from '@ant-design/icons';
import { ColumnsType, TableProps } from 'antd/es/table';
import { useFetchAllDepartmentQuery, useRevertDepartmentMutation } from '../../store/department/department.service';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { fetchAllDepartment, fetchAllDepartmentTrash } from '../../store/department/departmentSlice';
import { TableRowSelection } from 'antd/es/table/interface';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import Search, { SearchProps } from 'antd/es/input/Search';
import { Link } from 'react-router-dom';
import { IIsDeletedUser } from '../../store/users/user.interface';

const DepartmentTrash = () => {
    const dispatch: Dispatch<any> = useDispatch()
    // nut khoi phuc
    const [onRevert] = useRevertDepartmentMutation()
    // listDeparment
    const [listDepartment, setDepartment] = useState<IDepartment[]>([])
    // state checked
    const [checkStrictly, setCheckStrictly] = useState(false);
    // department api & slice
    const { data: listDepartmentApi, isError: isErrorDepartment, isSuccess: isSuccessDepartment } = useFetchAllDepartmentQuery()
    const listDepartmentReducer = useSelector((state: RootState) => state.departmentSlice.departments)
    // neu co listDepartmentApi thi dispatch vao trong reducer
    useEffect(() => {
        if (listDepartmentApi) {
            dispatch(fetchAllDepartmentTrash(listDepartmentApi))
        }
    }, [isSuccessDepartment, listDepartmentApi])
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
            title: 'Tên phòng ban',
            dataIndex: 'name',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (value: IDepartment) => (
                <Space size="middle" className='flex justify-start'>
                    <Popconfirm
                        title="Khôi phục phòng ban"
                        description={`Bạn muốn khôi phục: ${value.name}?`}
                        onConfirm={() => confirmRevert(value.id!)}
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
    const data: IDepartment[] = listDepartmentReducer.map((item, index) => ({
        key: index + 1,
        id: item.id,
        name: item.name,
        isActive: item.isActive,
        isDeleted: item.isDeleted
    }))
    // nut khoi phuc
    const confirmRevert = async (id: string) => {
        try {
            if (id) {
                const form: IIsDeletedUser = {
                    isDeleted: 0
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
    const handleRevertAll = async (listDepartment: IDepartment[]) => {
        try {
            if (listDepartment.length > 0) {
                Swal.fire({
                    title: "Xác nhận Khôi phục mục đã chọn ?",
                    showCancelButton: true,
                    confirmButtonColor: "#1677ff",
                    confirmButtonText: "Xác nhận",
                    cancelButtonText: "Hủy",
                    icon: "question",
                }).then((results) => {
                    if (results.isConfirmed) {
                        toast.success("Khôi phục thành công!")
                    }
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
    // nút filter
    const onChange: TableProps<IDepartment>['onChange'] = (pagination, filters, sorter, extra) => {
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
                    <Link to={`/department`}>
                        <ArrowLeftOutlined style={{
                            marginBottom: "12px"
                        }} />
                    </Link>
                </Tooltip>
                <h3 className='text-title mb-0'>Khôi phục phòng ban</h3>
            </div>
            <div className="flex justify-between">
                <Space className='mb-3'>
                    <Button type='primary' onClick={() => handleRevertAll(listDepartment)}>Khôi phục tất cả</Button>
                    <Search placeholder="Tìm kiếm tên phòng ban ..." className='w-[300px]' onSearch={onSearch} enterButton />
                </Space>
            </div>
            <Table columns={columns} rowSelection={{ ...rowSelection, checkStrictly }} dataSource={data} bordered onChange={onChange} />
        </div>
    )
}

export default DepartmentTrash
