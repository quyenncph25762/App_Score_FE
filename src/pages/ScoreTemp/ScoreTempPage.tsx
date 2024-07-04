import React, { useEffect, useState } from 'react'
import { Button, message, Popconfirm, Space, Table, Tooltip } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { TableRowSelection } from 'antd/es/table/interface';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import Search, { SearchProps } from 'antd/es/input/Search';

interface DataType {
    key: React.Key;
    _id?: number;
    name: string;
    chinese: number;
    math: number;
    english: number;
}
const ScoreTempPage = () => {
    const [checkStrictly, setCheckStrictly] = useState(false);
    const [listCriteria, setCriteria] = useState<DataType[]>([])
    // nút checkbox
    const rowSelection: TableRowSelection<DataType> = {
        onChange: (selectedRowKeys, selectedRows) => {
            if (selectedRowKeys.length > 0) {
                // Nếu chọn thì xóa disaled 
                setCriteria(selectedRows)
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
    const columns: ColumnsType<DataType> = [
        {
            title: 'Tên phiếu chấm',
            dataIndex: 'name',
        },

        {
            title: 'Chinese Score',
            dataIndex: 'chinese',
            sorter: {
                compare: (a, b) => a.chinese - b.chinese,
                multiple: 3,
            },
        },
        {
            title: 'Math Score',
            dataIndex: 'math',
            sorter: {
                compare: (a, b) => a.math - b.math,
                multiple: 2,
            },
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (value: any) => (
                <Space size="middle" className='flex justify-start'>
                    <Tooltip title="Chỉnh sửa" color={'yellow'} key={'yellow'}>
                        <Link to={`/criteria/update`}>
                            <EditFilled className='text-xl text-yellow-400' />
                        </Link>
                    </Tooltip>
                    <Popconfirm
                        title="Xóa danh mục"
                        description="Bạn có chắc muốn xóa danh mục này"
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
    const confirmDelete = (id?: number) => {
        toast.success("Xóa thành công!")
    }
    // data 
    const data: DataType[] = [
        {
            key: '1',
            _id: 1,
            name: 'John Brown',
            chinese: 98,
            math: 60,
            english: 70,
        },
        {
            key: '2',
            _id: 3,
            name: 'John Brown',
            chinese: 98,
            math: 60,
            english: 70,
        },
        {
            key: '3',
            _id: 4,
            name: 'John Brown',
            chinese: 98,
            math: 60,
            english: 70,
        },

    ];
    // nút filter
    const onChange: TableProps<DataType>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    // nút xóa tất cả
    const handleDeleteAll = async (listCriteria: DataType[]) => {
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
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        console.log(value)
    };
    return (
        <div>
            <h3 className='text-title'>Quản lí phiếu chấm</h3>
            <div className="flex justify-between">
                <Space className='mb-3'>
                    <Button type='primary' danger onClick={() => handleDeleteAll(listCriteria)}>Xóa tất cả</Button>
                    <Search placeholder="Tìm kiếm tên tiêu chí ..." className='w-[300px]' onSearch={onSearch} enterButton />
                </Space>
                <Button type='primary' className='mb-3'>Thêm mới</Button>
            </div>
            <Table columns={columns} rowSelection={{ ...rowSelection, checkStrictly }} dataSource={data} bordered onChange={onChange} />
        </div>
    )
}

export default ScoreTempPage
