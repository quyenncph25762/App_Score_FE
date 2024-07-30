import React, { Dispatch, useEffect, useState } from 'react'
import { Badge, Button, message, Modal, Popconfirm, Space, Spin, Table, TableColumnsType, Tooltip } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { DeleteFilled, DeleteOutlined, EditFilled, EyeFilled, EyeOutlined, LoadingOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { TableRowSelection } from 'antd/es/table/interface';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import Search, { SearchProps } from 'antd/es/input/Search';
import { IDepartment } from '../../store/department/department.interface';
import { useDispatch, useSelector } from 'react-redux';
import { useFetchAllScoreTempQuery, useLazyFetchOneScoreTempQuery, useRemoveScoreTempByCheckboxMutation, useRemoveScoreTempToTrashMutation } from '../../store/scoretemp/scoretemp.service';
import { RootState } from '../../store';
import { fetchAllScoreTempSlice, searchScoreTempSlice } from '../../store/scoretemp/scoretempSlice';
import { IScoreTemp } from '../../store/scoretemp/scoretemp.interface';
import { ICriteria } from '../../store/criteria/criteria.interface';
import { ICriteriaDetail } from '../../store/criteriaDetail/criteriaDetail.interface';



const ScoreTempPage = () => {
    const dispatch: Dispatch<any> = useDispatch()
    const navigate = useNavigate()
    const [onRemove] = useRemoveScoreTempToTrashMutation()
    const [onRemoveByCheckbox] = useRemoveScoreTempByCheckboxMutation()
    const [checkStrictly, setCheckStrictly] = useState(false);
    const [listScoreTemp, setScoreTemp] = useState<IScoreTemp[]>([])

    // modal xem chi tiet
    const [open, setOpen] = React.useState<boolean>(false);
    const [loading, setLoading] = React.useState<boolean>(true);
    // api
    const { data: listScoreTempApi, isSuccess: successApiScoreTemp, isLoading: LoadingApiScoreTemp, isError: errorApiScoreTemp, isFetching: isFetchingScoreTemp } = useFetchAllScoreTempQuery()
    const [triggerGetOneScoreTemp, { data: getOneScoreTemp, isError: errorScoreTempApi, isLoading: LoadingScoreTempApi, isSuccess: successScoreTempApi, isFetching: fetchingScoreTempApi }] = useLazyFetchOneScoreTempQuery()
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
    const showLoading = (_id: number) => {
        setOpen(true);
        if (_id) {
            triggerGetOneScoreTemp(_id)
        }
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
            dataIndex: 'isActive',
            render: (_, value: any) => (
                <p>{value.isActive ? <Badge status="processing" /> : <Badge status="default" />}</p>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (value: IScoreTemp) => (
                <Space size="middle" className='flex justify-start'>
                    <Tooltip title="Chỉnh sửa" color={'yellow'} key={'yellow'}>
                        <Link to={`/scoretemp/update/${value._id!}`}>
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
                        <EyeFilled className='text-xl text-green-400 cursor-pointer' onClick={() => showLoading(value._id!)} />
                    </Tooltip>
                </Space>
            )
        },
    ];
    const confirmDelete = async (_id?: number) => {
        try {
            const results = await onRemove(_id)
            if (results.error) {
                return toast.error("Xóa thất bại")
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
        NameYear: scoretemp.NameYear,
        Criteria: scoretemp.Criteria,
        IsDeleted: scoretemp.IsDeleted
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
                    await onRemoveByCheckbox(listScoreTempId)
                    toast.success("Xóa thành công!")
                }
            })
        }
    }
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        if (value) {
            dispatch(searchScoreTempSlice({ searchName: value, scoreTemps: listScoreTempApi }))
        } else {
            dispatch(fetchAllScoreTempSlice(listScoreTempApi))
        }
    };
    const handleReset = () => {
        dispatch(fetchAllScoreTempSlice(listScoreTempApi))
    }
    // Table
    const columnsPrewView: TableColumnsType<ICriteria> = [

        {
            title: 'Tên tiêu chí',
            dataIndex: 'Name',
            width: 400
        },

    ];
    const expandedRowRender = (record: ICriteria) => {
        const columns: ColumnsType<ICriteriaDetail> = [
            { title: "Tên tiêu chí", dataIndex: "Name", key: "Name" },
            { title: 'Chỉ tiêu', dataIndex: 'Target', key: 'Target' },
            { title: 'Tỷ lệ %', dataIndex: 'IsTypePercent', key: 'IsTypePercent', render: value => value ? 'Cho nhập' : 'Không nhập' },
            { title: 'Tổng số', dataIndex: 'IsTypeTotal', key: 'IsTypeTotal', render: value => value ? 'Cho nhập' : 'Không nhập' },
            { title: 'Hiện trạng', dataIndex: 'IsCurrentStatusType', key: 'IsCurrentStatusType', render: value => value ? 'Cho nhập' : 'Không nhập' },
        ];
        return (
            <Table
                bordered
                columns={columns}
                dataSource={record.listCriteria}
                pagination={false}
                rowKey="detailId"
            />
        );
    };
    const dataPreviews: ICriteria[] = getOneScoreTemp?.Criteria.map((scoretemp, index) => ({
        key: index + 1,
        _id: scoretemp._id,
        ScoreTempId: scoretemp.ScoreTempId,
        Name: scoretemp.Name,
        FieldId: scoretemp.FieldId,
        NameScoreTemp: scoretemp.NameScoreTemp,
        listCriteria: scoretemp.listCriteria
    }));
    return (
        <div>
            {LoadingApiScoreTemp ? <div>loading data...</div> : ""}
            <Modal
                title={<p>Chi tiết phiếu chấm: {getOneScoreTemp?.Name}</p>}
                width={1200}
                open={open}
                onCancel={() => setOpen(false)}
            >
                <Table columns={columnsPrewView} expandable={{ expandedRowRender }} dataSource={dataPreviews} bordered pagination={false} />
            </Modal>
            <div className="flex items-center gap-2">
                <h3 className='text-title mb-0'>Quản lí phiếu chấm</h3>
                <div className="iconDelete-title">
                    <Tooltip title="Thùng rác của bạn" color='red'>
                        <Link to={`/scoretemp/trash`}><DeleteOutlined color='red' /></Link>
                    </Tooltip>
                </div>
                {isFetchingScoreTemp && <div> <Spin indicator={<LoadingOutlined spin />} size="small" /> Update data ...</div>}
            </div>
            <div className="flex justify-between">
                <Space className='mb-3'>
                    <Button type='primary' danger onClick={() => handleDeleteAll(listScoreTemp)}>Xóa tất cả</Button>
                    <Search placeholder="Tìm kiếm tên tiêu chí ..." className='w-[300px]' onSearch={onSearch} enterButton />
                    <Button onClick={() => handleReset()}>reset</Button>
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
