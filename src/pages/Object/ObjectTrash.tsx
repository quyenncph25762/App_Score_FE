import React, { Dispatch, useEffect, useState } from 'react'
import { Badge, Button, Col, Form, FormInstance, Input, message, Modal, Popconfirm, Result, Row, Space, Switch, Table, Tooltip } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { ArrowLeftOutlined, DeleteFilled, DeleteOutlined, EditFilled, SyncOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { TableRowSelection } from 'antd/es/table/interface';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import Search, { SearchProps } from 'antd/es/input/Search';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { IIsDeleted } from '../../store/department/department.interface';
import { useAddObjectMutation, useFetchAllObjectQuery, useFetchOneObjectQuery, useRemoveObjectMutation, useRevertObjectMutation, useUpdateObjectMutation } from '../../store/object/object.service';
import { IObject } from '../../store/object/object.interface';
import { getAllObjectSlice, getObjectFromTrashSlice, searchObjectSlice } from '../../store/object/objectSlice';

const ObjectPageTrash = () => {
    const dispatch: Dispatch<any> = useDispatch()
    const navigate = useNavigate()
    // state checked
    const [checkStrictly, setCheckStrictly] = useState(false);
    // listObject
    const [listObject, setObject] = useState<IObject[]>([])
    // nut xoa
    const [onRevert] = useRevertObjectMutation()
    // setValue mac dinh cho form add

    // object api & slice
    const { data: listObjectApi, isLoading: isLoadingObject, isFetching: isFetchingObject, isError: isErrorObject, isSuccess: isSuccessObject } = useFetchAllObjectQuery()

    const listObjectReducer = useSelector((state: RootState) => state.objectSlice.objects)
    // useEffect khi co loi
    useEffect(() => {
        if (isErrorObject) {
            navigate("/err500")
            return
        }
    }, [isErrorObject])
    // neu co listObjectApi thi dispatch vao trong reducer
    useEffect(() => {
        if (listObjectApi) {
            dispatch(getObjectFromTrashSlice(listObjectApi))
        }
    }, [isSuccessObject, listObjectApi])

    // nút checkbox
    const rowSelection: TableRowSelection<IObject> = {
        onChange: (selectedRowKeys, selectedRows) => {
            if (selectedRowKeys.length > 0) {
                // Nếu chọn thì xóa disaled 
                setObject(selectedRows)
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
    const columns: ColumnsType<IObject> = [
        {
            title: 'Tên đối tượng',
            dataIndex: 'name',
        },
        {
            title: 'Áp dụng',
            dataIndex: 'isActive',
            render: (_, value: IObject) => (
                <p>{value.isActive ? <Badge status="processing" /> : <Badge status="default" />}</p>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (value: IObject) => (
                <Space size="middle" className='flex justify-start'>
                    <Popconfirm
                        title="khôi phục đối tượng"
                        description={`Bạn có chắc muốn khôi phục: ${value.name}`}
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
    const confirmRevert = async (id?: string) => {
        try {
            const form: IIsDeleted = {
                isDeleted: 0
            }
            const results = await onRevert({ id: id, ...form })
            if (results.error) {
                toast.error("Khôi phục thất bại!")
            } else {
                toast.success("Khôi phục thành công!")
            }
        } catch (error) {
            console.log(error)
        }
    }
    // data 
    const data: IObject[] = listObjectReducer.map((item, index) => ({
        key: index + 1,
        id: item.id,
        name: item.name,
        description: item.description,
        isActive: item.isActive,
        isDeleted: item.isDeleted
    }))
    // nút filter
    const onChange: TableProps<IObject>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    // nút xóa tất cả
    const handleRevertAll = async (listObject: IObject[]) => {
        if (listObject.length > 0) {
            const listObjectId = listObject.map((object) => object.id)
            Swal.fire({
                title: "Xác nhận khôi phục mục đã chọn ?",
                showCancelButton: true,
                confirmButtonColor: "#1677ff",
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Hủy",
                icon: "question",
            }).then(async (results) => {
                if (results.isConfirmed) {
                    const form: IIsDeleted = {
                        isDeleted: 0
                    }
                    for (const id of listObjectId) {
                        await onRevert({ id: id, ...form })
                    }
                    toast.success("khôi phục thành công!")
                }
            })
        }
    }
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        if (value) {
            dispatch(getAllObjectSlice(listObjectApi))
            dispatch(searchObjectSlice({ searchTerm: value, objects: listObjectReducer }))
        } else {
            dispatch(getAllObjectSlice(listObjectApi))
        }
    };
    return (
        <div>
            {isFetchingObject && <div>Updating data...</div>}
            {isLoadingObject && <div>loading data...</div>}
            <div className="flex items-center gap-2">
                <Tooltip title="Trở về">
                    <Link to={`/object`}>
                        <ArrowLeftOutlined style={{
                            marginBottom: "12px"
                        }} />
                    </Link>
                </Tooltip>
                <h3 className='text-title mb-0'>Khôi phục đối tượng</h3>
            </div>
            <div className="flex justify-between">
                <Space className='mb-3'>
                    <Button type='primary' onClick={() => handleRevertAll(listObject)}>Khôi phục tất cả</Button>
                    <Search placeholder="Tìm kiếm tên phòng ban ..." className='w-[300px]' onSearch={onSearch} enterButton />
                </Space>
            </div>
            <Table columns={columns} rowSelection={{ ...rowSelection, checkStrictly }} dataSource={data} bordered onChange={onChange} />
        </div>
    )
}

export default ObjectPageTrash
