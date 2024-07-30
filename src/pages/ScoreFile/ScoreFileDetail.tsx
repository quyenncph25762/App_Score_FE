import React, { Dispatch, useEffect, useState } from 'react';
import type { RadioChangeEvent } from 'antd';
import { Button, Form, Tabs } from 'antd';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ICriteriaDetail } from '../../store/criteriaDetail/criteriaDetail.interface';

import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { useLazyGetScoreFileByFieldQuery } from '../../store/scorefile/scorefile.service';
import ScoreFileTable from './ScoreFileTable';

type TabPosition = 'left' | 'right' | 'top' | 'bottom';

const ScoreFileDetail = () => {
    const dispatch: Dispatch<any> = useDispatch()
    const { id } = useParams()
    const [form] = Form.useForm()
    const navigate = useNavigate()
    // lay 1 scoretemp

    const [trigger, { data: listCriteria, isSuccess: isSuccessFetchOneCriteria, isError: isErrorFetchOneCriteria, isLoading: isLoadingCriteria }] = useLazyGetScoreFileByFieldQuery()
    useEffect(() => {
        if (id) {
            trigger(Number(id))
        }
    }, [id])
    useEffect(() => {
        if (isErrorFetchOneCriteria) {
            navigate("/err500")
            return
        }
    }, [isErrorFetchOneCriteria])

    const [tabPosition, setTabPosition] = useState<TabPosition>('top');
    const changeTabPosition = (e: RadioChangeEvent) => {
        setTabPosition(e.target.value);
    };
    // ham chuyen doi object thanh mang
    const convertObjectToArray = (obj: Record<string, any>): any[] => {
        return Object.values(obj);
    };
    const handleFinish = (values: ICriteriaDetail) => {
        const valuesArr = convertObjectToArray(values)
        const newCode = randomCode()
        const newObject = { scoreFileId: id, Status: 1, Score: 100, IsActive: 1, Code: newCode, EmployeeId: 2, listScoreFileDetail: valuesArr }
        console.log(newObject)
        // Swal.fire({
        //     title: "Xác nhận Nộp phiếu ?",
        //     showCancelButton: true,
        //     text: "Sau khi nộp phiếu sẽ không thể sửa lại phiếu chấm.",
        //     confirmButtonColor: "#1677ff",
        //     confirmButtonText: "Xác nhận",
        //     cancelButtonText: "Hủy",
        //     icon: "question",
        // }).then((results) => {
        //     if (results.isConfirmed) {
        //         console.log(newObject)
        //         toast.success("Xóa thành công!")
        //     }
        // })
    };
    function randomCode() {
        const characCode = "ABCDEGHIKLNMIOUXZ";
        let result = '';
        const length = 6
        const characCodeLength = characCode.length
        for (let i = 0; i < length; i++) {
            const locationCode = Math.floor(Math.random() * characCodeLength)
            const code = characCode[locationCode]
            result += code
        }
        return result
    }
    return (
        <div>
            {isLoadingCriteria ? <div>loading data...</div> : ""}
            <h1 className='my-4 font-semibold text-[16px]'>{listCriteria?.NameScoreTemp}</h1>
            <Form form={form} onFinish={handleFinish}>
                <Tabs
                    tabPosition='top'
                    items={listCriteria?.Criteria.map((criteria, index) => ({
                        label: `${criteria.Name}`,
                        key: String(index + 1),
                        children: <ScoreFileTable listCriteria={criteria.listCriteria} form={form}
                            index={criteria._id} />,
                    }))}
                />
                <Button type="primary" htmlType="submit" className='mt-3'>Nộp phiếu</Button>
            </Form>
        </div>
    )
}
export default ScoreFileDetail
