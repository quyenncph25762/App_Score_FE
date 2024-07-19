import React, { Dispatch, useEffect, useState } from 'react';
import type { CheckboxProps, FormInstance, RadioChangeEvent, TableColumnsType } from 'antd';
import { Button, Checkbox, Form, Input, Radio, Space, Table, Tabs } from 'antd';
import { useDispatch } from 'react-redux';
import { useLazyFetchOneScoreTempQuery } from '../../store/scoretemp/scoretemp.service';
import { useNavigate } from 'react-router-dom';
import { ICriteriaDetail } from '../../store/criteriaDetail/criteriaDetail.interface';
import { ICriteria } from '../../store/criteria/criteria.interface';

type TabPosition = 'left' | 'right' | 'top' | 'bottom';
const onChange: CheckboxProps['onChange'] = (e) => {
    // console.log(`checked = ${e.target.checked}`);
};
const CriteriaTable: React.FC<{ criteria: ICriteria; form: FormInstance, index: number }> = ({ criteria, form, index }) => {
    const columns: TableColumnsType<ICriteriaDetail> = [
        {
            title: 'STT',
            dataIndex: '_id',
            render: (_, value: ICriteriaDetail) => (
                <Form.Item
                    name={[index, 'CriteriaDetailId']}
                    key={value._id}
                    initialValue={value._id}
                >
                    <Input hidden />
                </Form.Item>

            )
        },
        {
            title: 'Nội dung tiêu chí',
            dataIndex: 'Name',
            width: 400,

        },
        {
            title: 'Chỉ tiêu',
            dataIndex: 'Target',
            align: 'center',
            render: (_, value: ICriteriaDetail) => (
                <p className='font-semibold text-sm'>{value.Target}</p>
            )
        },
        {
            title: 'Tỉ lệ %',
            dataIndex: 'IsTypePercent',
            width: 200,
            render: (_, value: ICriteriaDetail) => (
                value.IsTypePercent ? (
                    <Form.Item
                        name={[index, 'TypePercentValue']}
                        key={value._id}
                        initialValue={""}
                    >
                        <Input placeholder='Nhập tỉ lệ % đạt được' />
                    </Form.Item>
                ) : <Input disabled />
            )
        },
        {
            title: 'Tổng số',
            dataIndex: 'IsTypeTotal',
            width: 200,
            render: (_, value: ICriteriaDetail) => (
                value.IsTypeTotal ? (
                    <Form.Item
                        name={[index, 'TypeTotalValue']}
                        key={value._id}
                        initialValue={""}
                    >
                        <Input placeholder='Nhập tổng số' />
                    </Form.Item>
                ) : <Input disabled />
            )
        },
        {
            title: 'Hiện trạng',
            dataIndex: 'IsCurrentStateType',
            width: 200,
            align: 'center',
            render: (_, value: ICriteriaDetail) => (
                value.IsCurrentStatusType ? (
                    <Form.Item
                        name={[index, 'CurrentStatusValue']}
                        key={value._id}
                        initialValue={""}
                    >
                        <Input placeholder='Nhập hiện trạng' />
                    </Form.Item>
                ) : <Form.Item
                    name={[index, 'CurrentStatusValue']}
                    key={value._id}
                    initialValue={false}
                >
                    <Checkbox onChange={onChange}>Đạt</Checkbox>
                </Form.Item>
            )
        },
        {
            title: 'Không tính',
        },
    ];
    return <Table
        columns={columns}
        bordered
        dataSource={criteria.listCriteria}
        pagination={false}
        rowKey="key"
    />
}
const ScoreFilePage = () => {
    const dispatch: Dispatch<any> = useDispatch()
    const [form] = Form.useForm()
    const navigate = useNavigate()
    const [triggerScoreTemp, { data: listScoreTemp, isLoading: loadingScoreTemp, isError: errorScoreTemp }] = useLazyFetchOneScoreTempQuery()
    const [listCriteriaDetail, setListCriteriaDetail] = useState<ICriteriaDetail[]>([])
    useEffect(() => {
        triggerScoreTemp(13)
    }, [])
    useEffect(() => {
        if (errorScoreTemp) {
            navigate("/err500")
            return
        }
    }, [errorScoreTemp])

    const [tabPosition, setTabPosition] = useState<TabPosition>('top');
    const changeTabPosition = (e: RadioChangeEvent) => {
        setTabPosition(e.target.value);
    };
    // const dataSource: ICriteriaDetail[] = listScoreTemp?.Criteria.map((scoretemp, index) => ({
    //     key: index + 1,
    //     _id: scoretemp._id,
    //     ScoreTempId: scoretemp.ScoreTempId,
    //     Name: scoretemp.Name,
    //     FieldId: scoretemp.FieldId,
    //     NameScoreTemp: scoretemp.NameScoreTemp,
    //     listCriteria: scoretemp.listCriteria
    // }));


    // ham chuyen doi object thanh mang
    const convertObjectToArray = (obj: Record<string, any>): any[] => {
        return Object.values(obj);
    };
    const handleFinish = (values: ICriteriaDetail) => {
        const valuesArr = convertObjectToArray(values)
        console.log(listScoreTemp)
        const newCode = randomCode()
        const newObject = { ScoreTempId: listScoreTemp._id, Status: 1, Score: 100, IsActive: 1, Code: newCode, EmployeeId: 2, listScoreFileDetail: valuesArr }
        console.log(newObject)
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
            {loadingScoreTemp ? <div>loading data...</div> : ""}
            <h1 className='my-4 font-semibold text-[16px]'>{listScoreTemp?.Name}</h1>
            <Form form={form} onFinish={handleFinish}>
                <Tabs
                    tabPosition='top'
                    items={listScoreTemp?.Criteria.map((criteria, index) => ({
                        label: `${criteria.Name}`,
                        key: String(index + 1),
                        children: <CriteriaTable criteria={criteria} form={form} index={index} />,
                    }))}
                />
                <Button type="primary" htmlType="submit">Submit</Button>
            </Form>
        </div>
    )
}
export default ScoreFilePage
