import { Checkbox, CheckboxProps, Form, Input, Table, TableColumnsType } from 'antd';
import React from 'react'
import { ICriteriaDetail } from '../../store/criteriaDetail/criteriaDetail.interface';
import { ICriteria } from '../../store/criteria/criteria.interface';
import { IScoreFileDetail } from '../../store/scorefileDetail/scorefileDetail.interface';

interface IProps {
    listCriteria: ICriteriaDetail[]
    index: number
    form: any
}
const ScoreFileTable = (props: IProps) => {
    const { listCriteria, index, form } = props
    const columns: TableColumnsType<IScoreFileDetail | ICriteriaDetail> = [
        {
            title: 'STT',
            dataIndex: '_id',
            render: (_, value: IScoreFileDetail) => (
                <Form.Item
                    name={[value._id, 'scorefileDetailId']}
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

        },
        {
            title: 'Tỉ lệ %',
            dataIndex: 'IsTypePercent',
            width: 200,
            render: (_, value: IScoreFileDetail) => (
                value.IsTypePercent ? (
                    <Form.Item
                        name={[value._id, 'TypePercentValue']}
                        key={value._id}
                        initialValue={value?.TypePercentValue}
                    >
                        <Input placeholder='Nhập tỉ lệ % đạt được' />
                    </Form.Item>
                ) : <Form.Item
                    name={[value._id, 'TypePercentValue']}
                    key={value._id}
                    initialValue={""}
                ><Input disabled /></Form.Item>
            )
        },
        {
            title: 'Tổng số',
            dataIndex: 'IsTypeTotal',
            width: 200,
            render: (_, value: IScoreFileDetail) => (
                value.IsTypeTotal ? (
                    <Form.Item
                        name={[value._id, 'TypeTotalValue']}
                        key={value._id}
                        initialValue={value?.TypeTotalValue}
                    >
                        <Input placeholder='Nhập tổng số' />
                    </Form.Item>
                ) : <Form.Item
                    name={[value._id, 'TypeTotalValue']}
                    key={value._id}
                    initialValue={""}
                > <Input disabled /></Form.Item>
            )
        },
        {
            title: 'Hiện trạng',
            dataIndex: 'IsCurrentStateType',
            width: 200,
            align: 'center',
            render: (_, value: IScoreFileDetail) => (
                value.IsCurrentStatusType ? (
                    <Form.Item
                        name={[value._id, 'CurrentStatusValue']}
                        key={value._id}
                        initialValue={value?.CurrentStatusValue}
                    >
                        <Input placeholder='Nhập hiện trạng' />
                    </Form.Item>
                ) : <Form.Item
                    name={[value._id, 'CurrentStatusValue']}
                    key={value._id}
                    initialValue={value?.CurrentStatusValue}
                    valuePropName="checked"
                >
                    <Checkbox key={value._id}>Đạt</Checkbox>
                </Form.Item>
            )
        },
        // {
        //     title: 'Không tính',
        // },
    ];
    const onChange: CheckboxProps['onChange'] = (e) => {
        // console.log(`checked = ${e.target.checked}`);
    };
    return (
        <div>
            <Table
                columns={columns}
                bordered
                dataSource={listCriteria}
                pagination={false}
                rowKey="key"
            />
        </div>
    )
}

export default ScoreFileTable
