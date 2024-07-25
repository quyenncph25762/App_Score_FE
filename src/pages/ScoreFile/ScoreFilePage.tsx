import React, { Dispatch, useEffect, useState } from 'react'
import { Badge, Button, Col, Form, FormInstance, Input, message, Modal, Popconfirm, Result, Row, Space, Spin, Switch, Table, Tooltip } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { CrownOutlined, DeleteFilled, DeleteOutlined, EditFilled, EyeFilled, LoadingOutlined, StarOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { TableRowSelection } from 'antd/es/table/interface';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import Search, { SearchProps } from 'antd/es/input/Search';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import TextArea from 'antd/es/input/TextArea';
import Error500 from '../Error500';
import { IIsDeleted } from '../../store/interface/IsDeleted/IsDeleted';
import { IRole } from '../../store/role/role.interface';
import { useAddRoleMutation, useFetchAllRoleQuery, useLazyFetchOneRoleQuery, useRemoveRoleToTrashByCheckboxMutation, useRemoveRoleToTrashMutation, useUpdateRoleMutation } from '../../store/role/role.service';
import { fetchAllRoleSlice, searchRoleSlice } from '../../store/role/roleSlice';
import { IScoreFile } from '../../store/scorefile/scofile.interface';
import { useFetchAllScoreFileQuery, useLazyFetchOneScoreFileQuery } from '../../store/scorefile/scorefile.service';
import { fetchAllScoreFileSlice } from '../../store/scorefile/scoreFileSlice';
import { useRemoveScoreTempToTrashMutation } from '../../store/scoretemp/scoretemp.service';

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
        <Button type="primary" htmlType="submit" disabled={!submittable} className='bg-blue-500'>
            Thêm
        </Button>
    );
};
const ScoreFilePage = () => {
    const dispatch: Dispatch<any> = useDispatch()
    const navigate = useNavigate()
    // modal state 
    const [open, setOpen] = useState(false);
    // modal cap nhat
    const [openUpdate, setOpenUpdate] = useState(false);
    // state checked
    const [checkStrictly, setCheckStrictly] = useState(false);
    // listDeparment
    const [listScoreFile, setScoreFile] = useState<IScoreFile[]>([])
    // form
    const [form] = Form.useForm()
    // form update
    const [formUpdate] = Form.useForm()
    // nut xoa
    const [onDelete] = useRemoveScoreTempToTrashMutation()
    // nut xoa nhieu
    const [onDeleteByCheckBox] = useRemoveRoleToTrashByCheckboxMutation()
    // setValue mac dinh cho form add

    // role api & slice
    const { data: listScoreFileApi, isLoading: isLoadingScoreFile, isFetching: isFetchingScoreFile, isError: isErrorScoreFile, isSuccess: isSuccessScoreFile } = useFetchAllScoreFileQuery()
    // lay 1 role
    const [trigger, { data: getOneScorefile, isSuccess: isSuccessFetchOneScorefile, isError: isErrorFetchOneScorefile }] = useLazyFetchOneScoreFileQuery()
    const listScoreFileReducer = useSelector((state: RootState) => state)
    // useEffect khi co loi
    useEffect(() => {
        if (isErrorFetchOneScorefile) {
            navigate("/err500")
            return
        }
    }, [isErrorFetchOneScorefile])
    // neu co listRoleApi thi dispatch vao trong reducer
    useEffect(() => {
        if (listScoreFileApi) {
            dispatch(fetchAllScoreFileSlice(listScoreFileApi))
        }
    }, [isSuccessScoreFile, listScoreFileApi, dispatch])
    // useEffect khi co getOneDeparrtment
    // modal
    // show modal them
    const showModal = () => {
        form.setFieldsValue({
            IsDeleted: false
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
    // show modal cap nhat
    const showModalGetOne = (id: number) => {
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
        formUpdate.resetFields()
    };
    // nút checkbox
    const rowSelection: TableRowSelection<IScoreFile> = {
        onChange: (selectedRowKeys, selectedRows) => {
            if (selectedRowKeys.length > 0) {
                // Nếu chọn thì xóa disaled 
                setScoreFile(selectedRows)
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
    const columns: ColumnsType<IScoreFile> = [
        {
            title: 'Tên Phiếu',
            dataIndex: 'Name',
        },
        {
            title: 'Năm',
            dataIndex: 'Note',
        },
        {
            title: 'Áp dụng',
            dataIndex: 'IsActive',
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (value: IScoreFile) => (
                <Space size="middle" className='flex justify-start'>
                    <Tooltip title="Chấm điểm" color={'yellow'} key={'yellow'}>
                        <Link to={`/scorefile/${value._id}`}>
                            <StarOutlined className='text-xl text-yellow-400' />
                        </Link>
                    </Tooltip>
                    <Tooltip title="Xem hiện trạng" color={'green'} key={'green'}>
                        <EyeFilled className='text-xl text-green-400' onClick={() => showModalGetOne(value._id!)} />
                    </Tooltip>

                    <Popconfirm
                        title="Xóa vai trò"
                        description={`Bạn có chắc muốn xóa: ${value.NameScoretemp}`}
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
    // xoa vao thung rac
    const confirmDelete = async (id?: number) => {
        try {
            const results = await onDelete(id)
            if (results.error) {
                toast.error("Xóa thất bại!")
            } else {
                toast.success("Xóa thành công!")
            }
        } catch (error) {
            console.log(error)
        }
    }
    // data 
    const data: IScoreFile[] = listScoreFile.map((item, index) => ({
        key: index + 1,
        Code: item.NameScoretemp,
        _id: item._id,
        NameScoretemp: item.NameScoretemp,
        IsActive: item.IsActive,
        Status: item.Status,
        Score: item.Score,
        ScoreFileDetails: item.ScoreFileDetails
    }))
    // nút filter
    const onChange: TableProps<IScoreFile>['onChange'] = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    // nút xóa tất cả
    const handleDeleteAll = async (listScoreFile: any) => {
        if (listScoreFile.length > 0) {
            // lấy ra những id của vai trò
            const listRoleId = listScoreFile.map((scorefile) => scorefile._id)
            Swal.fire({
                title: "Xác nhận xóa mục đã chọn ?",
                showCancelButton: true,
                confirmButtonColor: "#1677ff",
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Hủy",
                icon: "question",
            }).then(async (results) => {
                if (results.isConfirmed) {
                    const results = await onDeleteByCheckBox(listRoleId)
                    if (results.error) {
                        toast.error("Xóa không thành công!")
                        return
                    }
                    toast.success("Xóa thành công!")
                }
            })
        }
    }
    return (
        <div>

            {isLoadingScoreFile && <div>loading data...</div>}
            <div className="flex items-center gap-2">
                <h3 className='text-title mb-0'>Quản lí số liệu</h3>
                <div className="iconDelete-title">
                    <Tooltip title="Thùng rác của bạn" color='red'>
                        <Link to={`/scorefiles/trash`}><DeleteOutlined color='red' /></Link>
                    </Tooltip>
                </div>
                {isFetchingScoreFile && <div> <Spin indicator={<LoadingOutlined spin />} size="small" /> Update data ...</div>}
            </div>
            <div className="flex justify-between">
                <Space className='mb-3'>
                    <Button type='primary' danger onClick={() => handleDeleteAll(listScoreFile)}>Xóa tất cả</Button>
                </Space>
            </div>
            <Table columns={columns} rowSelection={{ ...rowSelection, checkStrictly }} dataSource={data} bordered onChange={onChange} />
        </div>
    )
}

export default ScoreFilePage
