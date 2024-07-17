import React, { useEffect, useState } from 'react'
import { Badge, Button, message, Modal, Popconfirm, Space, Table, TableColumnsType, Tooltip } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { DeleteFilled, EditFilled, EyeFilled, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { TableRowSelection } from 'antd/es/table/interface';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import Search, { SearchProps } from 'antd/es/input/Search';
import { IDepartment } from '../../store/department/department.interface';

interface DataType {
    key: React.Key;
    _id?: number;
    name: string;
    object: string
    isActive: boolean
    year: number
    scoretempDetail?: DataTypePreview[]
}

interface DataTypePreview {
    key: React.Key,
    _id?: number,
    name: string,
    target?: string;
    isPercentType?: string;
    isTotalType?: number;
    isCurrentState?: string;
    isPassed?: boolean
}

const ScoreTempPage = () => {
    const [checkStrictly, setCheckStrictly] = useState(false);
    const [listCriteria, setCriteria] = useState<DataType[]>([])
    // modal xem chi tiet
    const [open, setOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(true);

    const showLoading = () => {
        setOpen(true);
        setLoading(true);

        // Simple loading mock. You should add cleanup logic in real world.
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };
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
            title: 'Loại đối tượng',
            dataIndex: 'object',
        },
        {
            title: 'Năm',
            dataIndex: 'year',
        },
        {
            title: 'Áp dụng',
            dataIndex: 'isActive',
            render: (_, value: any) => (
                <p>{value.isActive ? <Badge status="processing" /> : <Badge status="default" />}</p>
            )
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
                    <Tooltip title="Xem chi tiết" color={"green"}>
                        <EyeFilled className='text-xl text-green-400 cursor-pointer' onClick={showLoading} />
                    </Tooltip>
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
            name: 'Phiếu chấm xã nông thôn mới',
            object: "Nông thon mới",
            year: 98,
            isActive: true,
        }
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

    // Table
    const columnsPrewView: TableColumnsType<DataTypePreview> = [
        {
            title: 'STT',
            dataIndex: 'key',
        },
        {
            title: 'Tên tiêu chí',
            dataIndex: 'name',
            onCell: () => {
                return {
                    style: {
                        maxWidth: 200
                    }
                }
            },
            width: 400
        },
        {
            title: 'Chỉ tiêu',
            dataIndex: 'target',
        },
        {
            title: 'Tỷ lệ %',
            dataIndex: 'isPercentType',
        },
        {
            title: 'Tổng số',
            dataIndex: 'isTotalType',
        },
        {
            title: 'Hiện trạng',
            dataIndex: 'isCurrentState',
        },
        {
            title: 'Đạt chuẩn',
            dataIndex: 'isPassed',
            render: (_, value: DataTypePreview) => (
                // Nếu isPasswed mà bằng undefine thì sẽ không hiện đạt hay không
                <strong>{value.isPassed === false ? <p className='text-red-500'>Không đạt</p> : "Đạt"}</strong>
            )
        },
    ];

    const dataPreviews: DataTypePreview[] = [
        {
            key: 1,
            name: 'Quy hoạch'
        },
        {
            key: 2,
            name: 'Có quy hoạch chung xây dựng xã còn thời hạn hoặc đã được rà soát, điều chỉnh theo quy định của pháp luật về quy hoạch',
            target: "Đạt",
            isPercentType: "60 %",
            isTotalType: 700,
            isCurrentState: "Đạt",
            isPassed: false
        },
    ];

    return (
        <div>
            <Modal
                title={<p>Chi tiết phiếu chấm</p>}
                footer={
                    <Button type="primary" onClick={showLoading}>
                        Reload
                    </Button>
                }
                width={1200}
                loading={loading}
                open={open}
                onCancel={() => setOpen(false)}
            >
                <Table columns={columnsPrewView} dataSource={dataPreviews} bordered pagination={false} />
            </Modal>
            <h3 className='text-title'>Quản lí phiếu chấm</h3>
            <div className="flex justify-between">
                <Space className='mb-3'>
                    <Button type='primary' danger onClick={() => handleDeleteAll(listCriteria)}>Xóa tất cả</Button>
                    <Search placeholder="Tìm kiếm tên tiêu chí ..." className='w-[300px]' onSearch={onSearch} enterButton />
                </Space>
                <Link to={`/scoretemp/add`}>
                    <Button type='primary' className='mb-3'>Thêm mới</Button>
                </Link>
            </div>
            <Table columns={columns} rowSelection={{ ...rowSelection, checkStrictly }} dataSource={data} bordered onChange={onChange} />
        </div>
    )
}

export default ScoreTempPage
