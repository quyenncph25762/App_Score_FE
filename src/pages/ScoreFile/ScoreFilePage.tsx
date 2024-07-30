import React, { Dispatch, useEffect, useState } from 'react'
import { Badge, Button, Col, Form, FormInstance, Input, message, Modal, Popconfirm, Result, Row, Space, Spin, Switch, Table, TableColumnsType, Tooltip } from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import { CheckSquareOutlined, CrownOutlined, DeleteFilled, DeleteOutlined, EditFilled, EyeFilled, HighlightOutlined, LoadingOutlined, SendOutlined, StarOutlined } from '@ant-design/icons';
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
import { useFetchAllScoreFileQuery, useLazyFetchOneScoreFileQuery, useLazyGetScoreFileByFieldQuery } from '../../store/scorefile/scorefile.service';
import { fetchAllScoreFileSlice } from '../../store/scorefile/scoreFileSlice';
import { useRemoveScoreTempToTrashMutation } from '../../store/scoretemp/scoretemp.service';
import { useIsActiveScoreFileMutation } from '../../store/scorefile/scorefile.service';
import { ICriteria } from '../../store/criteria/criteria.interface';
import { IScoreFileDetail } from '../../store/scorefileDetail/scorefileDetail.interface';
import { ICriteriaDetail } from '../../store/criteriaDetail/criteriaDetail.interface';
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
    // state checked
    const [checkStrictly, setCheckStrictly] = useState(false);
    // listDeparment
    const [listScoreFile, setScoreFile] = useState<IScoreFile[]>([])
    // nut duyet scorefile
    const [onActive] = useIsActiveScoreFileMutation()
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
    // const [trigger, { data: getOneScorefile, isSuccess: isSuccessFetchOneScorefile, isError: isErrorFetchOneScorefile }] = useLazyFetchOneScoreFileQuery()
    const [trigger, { data: getOneScorefile, isSuccess: isSuccessFetchOneScorefile, isError: isErrorFetchOneScorefile }] = useLazyGetScoreFileByFieldQuery()
    const listScoreFileReducer = useSelector((state: RootState) => state.scoreFileSlice.scorefiles)
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
    // show modal cap nhat
    const showModalGetOne = (id: number) => {
        setOpen(true);
        if (id) {
            trigger(id)
        }
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
            title: 'STT',
            dataIndex: 'key',
        },
        {
            title: 'Tên Phiếu',
            dataIndex: 'NameScoreTemp',
        },
        {
            title: 'Năm',
            dataIndex: 'NameYear',
        },
        {
            title: 'Áp dụng',
            render: (_, value: IScoreFile) => (
                <p>{value.IsActive ? <Badge status="processing" /> : <Badge status="default" />}</p>
            )
        },
        {
            title: 'Hành động',
            key: 'action',
            render: (_, value: IScoreFile) => (
                <Space size="middle" className='flex justify-start'>
                    {/* neu chua cham thi hien */}
                    {value.Status !== 1 && (!value.IsActive ?
                        <Tooltip title="Xác nhận" color={'green'}>
                            <CheckSquareOutlined className='text-xl text-green-400' onClick={() => handleApprove(value._id!)} />
                        </Tooltip>
                        :
                        <Tooltip title="Chấm điểm" color={'yellow'}>
                            <Link to={`/scorefile/${value._id}`}>
                                <HighlightOutlined className='text-xl text-yellow-500' />
                            </Link>
                        </Tooltip>)}

                    {/* neu cham roi thi hien gui phieu cham */}
                    {value.Status === 1 && <Tooltip title="Gửi phiếu lên" color={'yellow'}>
                        <SendOutlined className='text-xl text-yellow-400' onClick={() => handleSendTo(value._id!)} />
                    </Tooltip>}
                    {/* xem hien trang */}
                    {value.IsActive && value.Status > 0 ? <Tooltip title="Xem hiện trạng" color={'green'} key={'green'}>
                        <EyeFilled className='text-xl text-green-400' onClick={() => showModalGetOne(value._id!)} />
                    </Tooltip> : ""}
                    <Popconfirm
                        title="Xóa vai trò"
                        description={`Bạn có chắc muốn xóa: ${value.NameScoreTemp}`}
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
    // func gui phieu
    const handleSendTo = (id: number) => {
        Swal.fire({
            title: "Xác nhận gửi phiếu lên cấp cao hơn ?",
            showCancelButton: true,
            confirmButtonColor: "#1677ff",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy",
            icon: "question",
        }).then(async (results) => {
            try {
                if (results.isConfirmed) {
                    // const resultsApi = await onActive(id)
                    // if (resultsApi.error) {
                    //     return toast.error("Lỗi khi duyệt phiếu!")
                    // }
                    toast.warning("Chức năng hiện đang phát triển")
                }
            } catch (error) {
                return toast.error(error)
            }
        })
    }
    // func duyet
    const handleApprove = (id: number) => {
        Swal.fire({
            title: "Xác nhận duyệt ?",
            showCancelButton: true,
            text: "Sau khi duyệt phiếu , thì sẽ tiến hành chấm phiếu",
            confirmButtonColor: "#1677ff",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy",
            icon: "question",
        }).then(async (results) => {
            try {
                if (results.isConfirmed) {
                    const resultsApi = await onActive(id)
                    if (resultsApi.error) {
                        return toast.error("Lỗi khi duyệt phiếu!")
                    }
                    toast.success("Đã duyệt phiếu thành công!")
                }
            } catch (error) {
                return toast.error(error)
            }
        })

    }
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
    const data: IScoreFile[] = listScoreFileReducer.map((item, index) => ({
        key: index + 1,
        Code: item.Code,
        _id: item._id,
        NameScoreTemp: item.NameScoreTemp,
        IsActive: item.IsActive,
        Status: item.Status,
        NameYear: item.NameYear,
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
    console.log(getOneScorefile)
    // Table
    const columnsPrewView: TableColumnsType<ICriteria> = [

        {
            title: 'Tên tiêu chí',
            dataIndex: 'Name',
            width: 400
        },

    ];
    const expandedRowRender = (record: ICriteria) => {
        const columns: ColumnsType<IScoreFileDetail | ICriteriaDetail> = [
            { title: "Tên tiêu chí", dataIndex: "Name", key: "Name", width: 700 },
            { title: 'Chỉ tiêu', dataIndex: 'Target', key: 'Target' },
            { title: 'Tỷ lệ %', dataIndex: 'IsTypePercent', key: 'IsTypePercent', render: (_, value: IScoreFileDetail) => value.TypePercentValue ? value.TypePercentValue : '' },
            { title: 'Tổng số', dataIndex: 'IsTypeTotal', key: 'IsTypeTotal', render: (_, value: IScoreFileDetail) => value.TypeTotalValue ? value.TypeTotalValue : '' },
            { title: 'Hiện trạng', dataIndex: 'IsCurrentStatusType', key: 'IsCurrentStatusType', render: (_, value: IScoreFileDetail) => value.CurrentStatusValue ? value.CurrentStatusValue === 1 ? <p className='text-green-500 font-semibold'>Đạt</p> : value.TypePercentValue : <p className='text-red-500 font-semibold'>Không đạt</p> },
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
    console.log(getOneScorefile)
    const dataPreviews: ICriteria[] = getOneScorefile?.Criteria.map((scoretemp, index) => ({
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
            <Modal
                title={<p>Chi tiết phiếu chấm: {getOneScorefile?.NameScoreTemp}</p>}
                width={1200}
                open={open}
                onCancel={() => setOpen(false)}
            >
                <Table columns={columnsPrewView} expandable={{ expandedRowRender }} dataSource={dataPreviews} bordered pagination={false} />
            </Modal>
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
