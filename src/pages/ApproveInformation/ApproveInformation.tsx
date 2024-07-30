import { Badge, Button, Card, Col, Dropdown, Form, FormInstance, Modal, RadioChangeEvent, Row, Select, SelectProps, Space, TableColumnsType } from 'antd';
import Search, { SearchProps } from 'antd/es/input/Search'
import React, { Dispatch, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useFetchAllScoreTempQuery, useLazyFetchOneScoreTempQuery } from '../../store/scoretemp/scoretemp.service';
import { useNavigate } from 'react-router-dom';
import { fetchAllScoreTempSlice, searchScoreTempSlice } from '../../store/scoretemp/scoretempSlice';
import { RootState } from '../../store';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useFetchAllProvinceQuery } from '../../store/province/province.service';
import { useLazyFetchAllDistrictQuery } from '../../store/districts/district.service';
import { ICriteria } from '../../store/criteria/criteria.interface';
import Table, { ColumnsType } from 'antd/es/table';
import { ICriteriaDetail } from '../../store/criteriaDetail/criteriaDetail.interface';
import { IScoreFileDetail } from '../../store/scorefileDetail/scorefileDetail.interface';
import { useLazyFetchOneScoreFileQuery } from '../../store/scorefile/scorefile.service';
import { IScoreFile } from '../../store/scorefile/scofile.interface';
import { DownOutlined } from '@ant-design/icons';
import { useLazyFetchAllCriteriaByScoreTempIdQuery } from '../../store/criteria/criteria.service';
const { Option } = Select;
interface ExpandedDataType {
    key: React.Key;
    date: string;
    name: string;
    upgradeNum: string;
}
const items = [
    { key: '1', label: 'Action 1' },
    { key: '2', label: 'Action 2' },
];
const ApproveInformation = () => {
    const dispatch: Dispatch<any> = useDispatch()
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)
    // API phieu cham
    const { data: listScoreTempApi, isSuccess: SuccessScoreTempApi, isError: ErrorScoreTempApi, isFetching: FetchingScoreTemp, isLoading: LoadingScoreTemp } = useFetchAllScoreTempQuery()
    // danh sach phieu
    const listScoreTempReducer = useSelector((state: RootState) => state.scoreTempSlice.scoreTemps)
    // api tieu chi
    const [triggerFetchCriteria, { data: listCriteria, isSuccess: isSucccessListCriteria }] = useLazyFetchAllCriteriaByScoreTempIdQuery()
    if (isSucccessListCriteria) {
        console.log(listCriteria)
    }
    // getOne ScoreFile
    const [triggerGetOneScoreFile, { data: getOneScoreFile, isError: errorScoreFileApi, isLoading: LoadingScoreFileApi, isSuccess: successScoreFileApi, isFetching: fetchingScoreFileApi }] = useLazyFetchOneScoreFileQuery()
    // API province 
    const { data: provinces, isError: isErrorProvinces } = useFetchAllProvinceQuery()
    // goi list district theo id cua province
    const [triggerDistrict, { data: districts, isError: isErrorDistricts }] = useLazyFetchAllDistrictQuery()
    useEffect(() => {
        dispatch(fetchAllScoreTempSlice([]))
    }, [])
    useEffect(() => {
        if (ErrorScoreTempApi) {
            navigate("/err500")
            return
        }
    }, [ErrorScoreTempApi])
    // form
    const onClickApprove = (number: number) => {
        Swal.fire({
            title: "Xác nhận duyệt ?",
            showCancelButton: true,
            text: "Sau khi duyệt phiếu , phiếu sẽ được gửi lên đơn vị cao hơn ",
            confirmButtonColor: "#1677ff",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy",
            icon: "question",
        }).then((results) => {
            if (results.isConfirmed) {
                toast.warning("Hiện tính năng đang phát triển")
            }
        })
    };
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        toast.warning("Hiện chức năng đang phát triển")
        return
        if (value) {
            dispatch(fetchAllScoreTempSlice(listScoreTempApi))
            dispatch(searchScoreTempSlice({ searchName: value, scoreTemps: listScoreTempApi }))
            console.log(1)
        } else {
            dispatch(fetchAllScoreTempSlice([]))
        }
    };
    // loc theo thanh pho , huyen
    const handleDistrictByProvince = (IdProvince: number) => {
        if (IdProvince) {
            triggerDistrict(IdProvince)
        }
    }
    // select provinces
    const showModal = (_id: number) => {
        setIsModalOpen(true);
        if (_id) {
            triggerGetOneScoreFile(_id)
        }
    };
    useEffect(() => {
        if (getOneScoreFile) {
            triggerFetchCriteria(getOneScoreFile.ScoreTempId)
        }
    }, [getOneScoreFile])

    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const dataSource = [
        {
            key: '1',
            name: 'Mike',
            age: 32,
            address: '10 Downing Street',
        },
        {
            key: '2',
            name: 'John',
            age: 42,
            address: '10 Downing Street',
        },
    ];

    const expandedRowRender = () => {
        const columns: TableColumnsType<ExpandedDataType> = [
            { title: 'Date', dataIndex: 'date', key: 'date' },
            { title: 'Name', dataIndex: 'name', key: 'name' },
            {
                title: 'Status',
                key: 'state',
                render: () => <Badge status="success" text="Finished" />,
            },
            { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
        ];

        const data = [];
        for (let i = 0; i < 3; ++i) {
            data.push({
                key: i.toString(),
                date: '2014-12-24 23:12:00',
                name: 'This is production name',
                upgradeNum: 'Upgraded: 56',
            });
        }
        return <Table columns={columns} dataSource={data} pagination={false} />;
    };
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Age',
            dataIndex: 'age',
            key: 'age',
        },
        {
            title: 'Address',
            dataIndex: 'address',
            key: 'address',
        },
    ];
    return (
        <div>
            <Modal width={1000} title="Xem chi tiết" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Table bordered pagination={false} dataSource={dataSource} columns={columns} expandable={{ expandedRowRender, defaultExpandedRowKeys: ['0'] }}>
                    <th>1</th>
                    <th>1</th>
                    <th>1</th>
                    <th>1</th>
                </Table>
            </Modal>
            <h1 className='mb-4 font-semibold'>Nhập khu vực muốn tìm kiếm</h1>
            <Search onSearch={onSearch} placeholder="Hãy nhập vào đây ..." enterButton="Tìm kiếm" size="large" />
            <Space className='mt-4'>
                <p>Lọc theo:</p>
                {/* province */}
                <Select
                    showSearch
                    placeholder="Tìm kiếm tỉnh"
                    optionFilterProp="children"
                    onChange={handleDistrictByProvince}
                >
                    {provinces?.map((item, index) => (
                        <Option value={`${item._id}`} key={index}>{item.Name}</Option>
                    ))}
                </Select>
                {/* district */}
                <Select
                    showSearch
                    placeholder="Tìm kiếm huyện"
                    optionFilterProp="children"
                >
                    {districts?.map((item, index) => (
                        <Option value={`${item._id}`} key={index}>{item.Name}</Option>
                    ))}
                </Select>
            </Space>
            <div className="my-10"></div>
            <Space direction='vertical' size="middle" style={{ display: 'flex' }}>
                <Badge.Ribbon text="Xã nông thôn mới" color="green">
                    <Card title="Thành phố Từ Sơn" size="small">
                        <div className="flex flex-col">
                            <Space direction='vertical'>
                                <p className=''>Tổng số tiêu chí không đạt: <span className='text-red-500'>2</span></p>
                                <p className='text-[#1677ff] cursor-pointer' onClick={() => showModal(13)}>Xem chi tiết</p>
                            </Space>
                            <Space className='mt-2' onClick={() => onClickApprove(1)}>
                                <Button type='primary'>Phê duyệt</Button>
                            </Space>
                        </div>
                    </Card>
                </Badge.Ribbon>
            </Space>
        </div>
    )
}

export default ApproveInformation
