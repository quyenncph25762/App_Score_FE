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
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
const { Option } = Select;

// const OPTIONS = ['Apples', 'Nails', 'Bananas', 'Helicopters'];
// const SubmitButton = ({ form }: { form: FormInstance }) => {
//     const [submittable, setSubmittable] = React.useState(false);
//     const values = Form.useWatch([], form);

//     React.useEffect(() => {
//         form?.validateFields({ validateOnly: true }).then(
//             () => {
//                 setSubmittable(true);
//             },
//             () => {
//                 setSubmittable(false);
//             },
//         );
//     }, [values]);

//     return (
//         <Button type="primary" htmlType="submit" disabled={!submittable} className='bg-blue-500 mt-3 max-w-[200px] mb-4'>
//             Tiến hành phát phiếu
//         </Button>
//     );
// };
const SearchInfomation = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    // api object
    const { data: ListObjectAPI, isError: isErrorListObject, isFetching: isFetchingObject, isLoading: isLoadingObjectAPI, isSuccess: isSuccessObjectApi } = useFetchAllObjectQuery()

    const { data: ListUser, isLoading: LoadingListUser, isFetching: FetchingListUser, isError: ErrorListUser } = useFetchListUserAllQuery()
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        console.log(value)
    };
    // API province 
    const { data: provinces, isError: isErrorProvinces } = useFetchAllProvinceQuery()
    // goi list district theo id cua province
    const [triggerDistrict, { data: districts, isError: isErrorDistricts }] = useLazyFetchAllDistrictQuery()


    // loc theo thanh pho , huyen
    const handleDistrictByProvince = (IdProvince: number) => {
        if (IdProvince) {
            triggerDistrict(IdProvince)
        }
    }
    // form
    const onClickApprove = (number: number) => {
        Swal.fire({
            title: "Xác nhận duyệt ?",
            showCancelButton: true,
            confirmButtonColor: "#1677ff",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy",
            icon: "question",
        }).then((results) => {
            if (results.isConfirmed) {
                toast.success("Xóa thành công!")
            }
        })
    };

    const onFinish = async (values: IUser) => {
        const arrValues = Object.values(values)
        // loc ra nhung gia tri da tich
        const filterValues = arrValues.filter((value) => value.ObjectId !== undefined)
        Swal.fire({
            title: "Xác nhận phát phiếu ?",
            showCancelButton: true,
            confirmButtonColor: "#1677ff",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy",
            icon: "question",
        }).then((results) => {
            if (results.isConfirmed) {
                console.log(filterValues)
                toast.success("Phát phiếu thành công!")
                form.resetFields()
            }
        })
    }
    return (
        <div>
            <div className="flex gap-2">
                <h3 className='text-title mb-0'>Phát phiếu</h3>
                {isFetchingObject || isFetchingObject && <div> <Spin indicator={<LoadingOutlined spin />} size="small" /> Update data ...</div>}
                {isLoadingObjectAPI || LoadingListUser ? <div className='ml-2'>loading data...</div> : ""}
            </div>
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
            {ListUser?.results.map((user, index) => (
                <Badge.Ribbon text="Xã nông thôn mới" color="green">
                    <Form
                        key={index}
                        form={form}
                        name={`form_${index}`}
                        layout="vertical"
                        style={{
                            width: "100%",
                            margin: 0
                        }}

                        autoComplete="off"
                        onFinish={onFinish}
                        className="mx-auto"
                    >
                        <Card key={index} title={`${user.Customer}`} className='mt-8' size="small">
                            <div className="flex flex-col">
                                <Form.Item label="Đối tượng" name={[index, "ObjectId"]} key={index}>
                                    <Select
                                        mode='multiple'
                                        showSearch
                                        placeholder="Chọn đối tượng phiếu"
                                        optionFilterProp="children"
                                        style={{ width: "300px" }}
                                    >
                                        {ListObjectAPI?.map((item, index) => (
                                            <Option value={`${item._id}`} key={index}>{item.NameObject}</Option>
                                        ))}
                                    </Select>
                                </Form.Item>
                                <Form.Item hidden name={[index, "EmployeeId"]} initialValue={user._id}>
                                </Form.Item>
                            </div>
                            <Button type='primary' htmlType='submit' key={index}>Phát phiếu</Button>
                        </Card>
                    </Form>
                </Badge.Ribbon>
            ))}
        </div >
    )
}

export default SearchInfomation
