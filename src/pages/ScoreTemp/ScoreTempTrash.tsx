import React, { Dispatch, useEffect, useState } from 'react'
import { Badge, Button, message, Modal, Popconfirm, Space, Spin, Table, TableColumnsType, Tooltip } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { ArrowLeftOutlined, DeleteFilled, DeleteOutlined, EditFilled, EyeFilled, EyeOutlined, LoadingOutlined, SyncOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { TableRowSelection } from 'antd/es/table/interface';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import Search, { SearchProps } from 'antd/es/input/Search';
import { IDepartment } from '../../store/department/department.interface';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchAllScoreTempFromTrashQuery, useFetchAllScoreTempQuery, useRemoveScoreTempToTrashMutation, useRevertScoreTempByCheckboxMutation, useRevertScoreTempMutation } from '../../store/scoretemp/scoretemp.service';
import { RootState } from '../../store';
import { fetchAllScoreTempSlice } from '../../store/scoretemp/scoretempSlice';
import { IScoreTemp } from '../../store/scoretemp/scoretemp.interface';
import { IId } from '../../store/interface/_id/id.interface';



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

const ScoreTempTrash = () => {
    const dispatch: Dispatch<any> = useDispatch()
    const navigate = useNavigate()
    const [onRevert] = useRevertScoreTempMutation()
    const [onRevertByCheckbox] = useRevertScoreTempByCheckboxMutation()
    const [checkStrictly, setCheckStrictly] = useState(false);
    const [listScoreTemp, setScoreTemp] = useState<IScoreTemp[]>([])
    // modal xem chi tiet
    const [open, setOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    // api
    const { data: listScoreTempApi, isSuccess: successApiScoreTemp, isLoading: LoadingApiScoreTemp, isError: errorApiScoreTemp, isFetching: isFetchingScoreTemp } = useFetchAllScoreTempFromTrashQuery()
    const listScoreTempReducer = useSelector((state: RootState) => state.scoreTempSlice.scoreTemps)
    useEffect(() => {
        if (errorApiScoreTemp) {
            navigate("/err500")
            return
        }
    }, [errorApiScoreTemp])
    // dispatch scoretemp vao redux
    useEffect(() => {
        if (listScoreTempApi) {
            dispatch(fetchAllScoreTempSlice(listScoreTempApi))
        }
    }, [listScoreTempApi, successApiScoreTemp])
    const showLoading = () => {
        setOpen(true);
        setLoading(true);

        // Simple loading mock. You should add cleanup logic in real world.
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };
    // nút checkbox
    const rowSelection: TableRowSelection<IScoreTemp> = {
        onChange: (selectedRowKeys, selectedRows) => {
            if (selectedRowKeys.length > 0) {
                // Nếu chọn thì xóa disaled 
                setScoreTemp(selectedRows)
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
    const columns: ColumnsType<IScoreTemp> = [
        {
            title: 'Tên phiếu chấm',
            dataIndex: 'Name',
        },

        {
            title: 'Loại đối tượng',
            render: (_, value: IScoreTemp) => (
                <p>{value.NameObject}</p>
            )
        },
        {
            title: 'Năm',
            render: (_, value: IScoreTemp) => (
                <p>{value.NameYear}</p>
            )
        },
        {
            title: 'Áp dụng',
            dataIndex: 'IsActive',
            render: (_, value: any) => (
                <p>{value.isActive ? <Badge status="processing" /> : <Badge status="default" />}</p>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (value: IScoreTemp) => (
                <Space size="middle" className='flex justify-start'>
                    <Popconfirm
                        title="Khôi phục lĩnh vực"
                        description={`Bạn muốn khôi phục: ${value.Name}?`}
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
    const confirmRevert = async (_id?: number) => {
        try {
            const results = await onRevert(_id)
            if (results.error) {
                return toast.error("Xóa thât!")
            }
            toast.success("Xóa thành công!")
        } catch (error) {
            toast.error(error)
        }
    }
    // data 
    const data: IScoreTemp[] = listScoreTempReducer.map((scoretemp, index) => ({
        key: index + 1,
        _id: scoretemp._id,
        Name: scoretemp.Name,
        Code: scoretemp.Code,
        IsActive: scoretemp.IsActive,
        ObjectId: scoretemp.ObjectId,
        YearId: scoretemp.YearId,
        Description: scoretemp.Description,
        NameObject: scoretemp.NameObject,
        NameYear: scoretemp.NameYear
    }));
    // nút filter
    const onChange: TableProps<IScoreTemp>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    // nút xóa tất cả
    const handleDeleteAll = async (listScoreTemp: any) => {
        if (listScoreTemp.length > 0) {
            const listScoreTempId = listScoreTemp.map((scoretemp) => scoretemp._id)
            Swal.fire({
                title: "Xác nhận xóa mục đã chọn ?",
                showCancelButton: true,
                confirmButtonColor: "#1677ff",
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Hủy",
                icon: "question",
            }).then(async (results) => {
                if (results.isConfirmed) {
                    await onRevertByCheckbox(listScoreTempId)
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
            {LoadingApiScoreTemp ? <div>loading data...</div> : ""}
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
            <div className="flex items-center gap-2">
                <Tooltip title="Trở về">
                    <Link to={`/scoretemp`}>
                        <ArrowLeftOutlined style={{
                            marginBottom: "12px"
                        }} />
                    </Link>
                </Tooltip>
                <h3 className='text-title mb-0'>Khôi phục phiếu chấm</h3>
                {isFetchingScoreTemp && <div> <Spin indicator={<LoadingOutlined spin />} size="small" /> Update data ...</div>}
            </div>
            <div className="flex justify-between">
                <Space className='mb-3'>
                    <Button type='primary' onClick={() => handleDeleteAll(listScoreTemp)}>Khôi phục tất cả</Button>
                    <Search placeholder="Tìm kiếm tên tiêu chí ..." className='w-[300px]' onSearch={onSearch} enterButton />
                </Space>
            </div>
            <Table columns={columns} rowSelection={{ ...rowSelection, checkStrictly }} dataSource={data} bordered onChange={onChange} />
        </div>
    )
}

export default ScoreTempTrash
