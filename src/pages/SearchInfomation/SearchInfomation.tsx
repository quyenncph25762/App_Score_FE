import { Badge, Button, Card, Checkbox, Col, Form, FormInstance, Input, Radio, Row, Select, Space, Spin } from 'antd'
import React, { useEffect, useState } from 'react'
import { useLazyFetchAllWardQuery } from '../../store/wards/ward.service'
import { useLazyFetchAllDistrictQuery } from '../../store/districts/district.service'
import { useFetchAllProvinceQuery } from '../../store/province/province.service'
import { useFetchAllObjectQuery } from '../../store/object/object.service'
import { useNavigate } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import Search, { SearchProps } from 'antd/es/input/Search'
import FormItem from 'antd/es/form/FormItem'
import { useFetchListUserAllQuery } from '../../store/users/user.service'
import { IUser } from '../../store/users/user.interface'
const { Option } = Select;

const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters'];
const SubmitButton = ({ form }: { form: FormInstance }) => {
    const [submittable, setSubmittable] = React.useState(false);
    const values = Form.useWatch([], form);

    React.useEffect(() => {
        form?.validateFields({ validateOnly: true }).then(
            () => {
                setSubmittable(true);
            },
            () => {
                setSubmittable(false);
            },
        );
    }, [values]);

    return (
        <Button type="primary" htmlType="submit" disabled={!submittable} className='bg-blue-500 mt-3 max-w-[200px] mb-4'>
            Tiến hành phát phiếu
        </Button>
    );
};
const SearchInfomation = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    // api object
    const { data: ListObjectAPI, isError: isErrorListObject, isFetching: isFetchingObject, isLoading: isLoadingObjectAPI, isSuccess: isSuccessObjectApi } = useFetchAllObjectQuery()

    const { data: ListUser, isLoading: LoadingListUser, isFetching: FetchingListUser, isError: ErrorListUser } = useFetchListUserAllQuery()
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        console.log(value)
    };
    const handleChange = (value: string[]) => {
        console.log(`selected ${value}`);
    };
    const handleChangeListUser = (value: string[]) => {
        console.log(`selected ${value}`);
    };
    const onFinish = async (values: any) => {
        console.log(values)
    }
    return (
        <div>

            <div className="flex gap-2">
                <h3 className='text-title mb-0'>Phát phiếu</h3>
                {isFetchingObject || isFetchingObject && <div> <Spin indicator={<LoadingOutlined spin />} size="small" /> Update data ...</div>}
                {isLoadingObjectAPI || LoadingListUser ? <div className='ml-2'>loading data...</div> : ""}
            </div>
            <Form
                form={form}
                name="validateOnly"
                layout="vertical"
                style={{
                    width: "100%",
                    margin: 0,

                }}
                autoComplete="off"
                onFinish={onFinish}
                className=""
            >
                {/* Address */}
                <Row gutter={12} className='flex flex-col'>
                    {/* ObbjectId */}

                    <Col span={8}>
                        <Form.Item name="ObjectId" label="Đối tượng phiếu" rules={[
                            { required: true, message: '* Không được để trống' }
                        ]}>
                            <Select
                                mode="multiple"
                                showSearch
                                placeholder="Chọn đối tượng"
                                optionFilterProp="children"
                                onChange={handleChange}
                            >
                                {ListObjectAPI?.map((item, index) => (
                                    <Option value={`${item._id}`} key={index}>{item.NameObject}</Option>
                                ))}
                            </Select>
                        </Form.Item>

                    </Col>
                    <Col span={8}>
                        <Form.Item label="Chọn tài khoản" name="EmployeeId" rules={[
                            { required: true, message: '* Không được để trống' }
                        ]}>
                            <Select
                                mode="multiple"
                                showSearch
                                placeholder="Chọn tài khoản"
                                optionFilterProp="children"
                                onChange={handleChangeListUser}
                            >
                                {ListUser?.results.map((item, index) => (
                                    <Option value={`${item._id}`} key={index}>{item.Customer}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col className=''>
                        <SubmitButton form={form} />
                    </Col>
                </Row>

            </Form>
        </div >
    )
}

export default SearchInfomation
