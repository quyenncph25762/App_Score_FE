import { Button, Col, Form, FormInstance, Radio, Row, Select } from 'antd'
import React from 'react'
import { useLazyFetchAllWardQuery } from '../../store/wards/ward.service'
import { useLazyFetchAllDistrictQuery } from '../../store/districts/district.service'
import { useFetchAllProvinceQuery } from '../../store/province/province.service'
import { useFetchAllObjectQuery } from '../../store/object/object.service'
const { Option } = Select;


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
        <Button type="primary" htmlType="submit" disabled={!submittable} className='bg-blue-500'>
            Thêm
        </Button>
    );
};
const SearchInfomation = () => {
    const [form] = Form.useForm();
    // goi list ward theo id cua district
    const [triggerWard, { data: wards, isError: isErrorWards }] = useLazyFetchAllWardQuery()
    // goi list district theo id cua province
    const [triggerDistrict, { data: districts, isError: isErrorDistricts }] = useLazyFetchAllDistrictQuery()
    // console.log(`districts:`, districts)
    const { data: provinces, isError: isErrorProvinces } = useFetchAllProvinceQuery()

    // api object
    const { data: ListObjectAPI, isError: isErrorListObject, isFetching: isFetchingObject, isLoading: isLoadingObjectAPI, isSuccess: isSuccessObjectApi } = useFetchAllObjectQuery()

    // loc theo thanh pho , huyen
    const handleDistrictByProvince = (IdProvince: number) => {
        if (IdProvince) {
            triggerDistrict(IdProvince)
        }
    }
    const handleWardByDistrictId = (IdDistrict: number) => {
        if (IdDistrict) {
            triggerWard(IdDistrict)
        }
    }
    const onFinish = async (values: any) => {
        console.log(values)
    }
    return (
        <div>
            <div className="flex items-center gap-2">
                <h3 className='text-title mb-0'>Nhập thông tin</h3>
            </div>
            <Form
                form={form}
                name="validateOnly"
                layout="vertical"
                style={{
                    width: "100%",
                    margin: 0,
                    padding: "20px"
                }}
                autoComplete="off"
                onFinish={onFinish}
                className="flex flex-col"
            >
                {/* Address */}
                <Row gutter={12} className='flex flex-col'>
                    <Form.Item name="apartmentId" label="Cấp tài khoản" rules={[
                        { required: true, message: '* Không được để trống' }
                    ]}>
                        <Radio.Group name="apartmentId" defaultValue={1}>
                            <Radio value={1}>Cấp tỉnh</Radio>
                            <Radio value={2}>Cấp Huyện</Radio>
                            <Radio value={3}>Cấp Xã</Radio>
                        </Radio.Group>
                    </Form.Item>
                    {/* province */}
                    <Col span={8}>
                        <Form.Item name="CityId" label="Tỉnh" rules={[
                            { required: true, message: '* Không được để trống' }
                        ]}>
                            <Select
                                showSearch
                                placeholder="Tìm kiếm tỉnh"
                                optionFilterProp="children"
                                onChange={handleDistrictByProvince}
                            >
                                {provinces?.map((item, index) => (
                                    <Option value={`${item._id}`} key={index} >{item.Name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* district */}
                    <Col span={8}>
                        <Form.Item name="DistrictId" label="Huyện" rules={[
                            { required: true, message: '* Không được để trống' }
                        ]}>
                            <Select
                                showSearch
                                placeholder="Tìm kiếm huyện"
                                optionFilterProp="children"
                                onChange={handleWardByDistrictId}
                            >
                                {districts?.map((item, index) => (
                                    <Option value={`${item._id}`} key={index}>{item.Name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* ward */}
                    <Col span={8}>
                        <Form.Item name="WardId" label="Xã" rules={[
                            { required: true, message: '* Không được để trống' }
                        ]}>
                            <Select
                                showSearch
                                placeholder="Tìm kiếm xã"
                                optionFilterProp="children"
                            >
                                {wards?.map((item, index) => (
                                    <Option value={`${item._id}`} key={index}>{item.Name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
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
                            >
                                {ListObjectAPI?.map((item, index) => (
                                    <Option value={`${item._id}`} key={index}>{item.NameObject}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <SubmitButton form={form} />
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default SearchInfomation
