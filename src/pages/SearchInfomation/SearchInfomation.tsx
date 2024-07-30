import { Badge, Button, Card, Checkbox, Col, Form, FormInstance, Input, Pagination, Radio, Row, Select, Space, Spin, TableProps } from 'antd'
import React, { Dispatch, useEffect, useRef, useState } from 'react'
import { useLazyFetchAllWardQuery } from '../../store/wards/ward.service'
import { useLazyFetchAllDistrictQuery } from '../../store/districts/district.service'
import { useFetchAllProvinceQuery } from '../../store/province/province.service'
import { useFetchAllObjectQuery } from '../../store/object/object.service'
import { useNavigate } from 'react-router-dom'
import { LoadingOutlined } from '@ant-design/icons'
import Search, { SearchProps } from 'antd/es/input/Search'
import FormItem from 'antd/es/form/FormItem'
import { useLazyFetchListUserQuery } from '../../store/users/user.service'
import { IUser } from '../../store/users/user.interface'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { useFetchAllYearQuery } from '../../store/year/year.service'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store'
import { listUserFilterByAddressSlice, listUserSearchSlice, listUsersSlice } from '../../store/users/userSlice'
import { useCreateScoreFileMutation } from '../../store/scorefile/scorefile.service'
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
    const dispatch: Dispatch<any> = useDispatch()
    const [form] = Form.useForm();
    // id cua nguoi phat phieu
    const [id, setId] = useState<number>(0)
    // nut them phieu cham
    const [onAddScoreFile] = useCreateScoreFileMutation()
    // tao 1 state để lưu gia tri search
    const [nameSearch, setNameSearch] = useState<string>("")
    const navigate = useNavigate()
    // api object
    const { data: ListObjectAPI, isError: isErrorListObject, isFetching: isFetchingObject, isLoading: isLoadingObjectAPI, isSuccess: isSuccessObjectApi } = useFetchAllObjectQuery()
    // api User
    const [triggerListUser, { data: ListUser, isLoading: LoadingListUser, isFetching: FetchingListUser, isError: ErrorListUser, isSuccess: isSuccessUser }] = useLazyFetchListUserQuery()
    // api year
    const { data: listYear, isLoading: LoadingYear, isFetching: FetchingYear, isError: ErrorYear } = useFetchAllYearQuery()
    const listUserReducer = useSelector((state: RootState) => state.userSlice.users)
    // tim kiem
    const onSearch: SearchProps['onSearch'] = (value, _e, info) => {
        toast.warning("Hiện chức năng đang phát triển")
        return
        setNameSearch(value)
        triggerListUser({ page: 1, searchName: value })
    };
    // API province 
    const { data: provinces, isError: isErrorProvinces } = useFetchAllProvinceQuery()
    // goi list district theo id cua province
    const [triggerDistrict, { data: districts, isError: isErrorDistricts }] = useLazyFetchAllDistrictQuery()

    // them list userAPI vao reducer 
    useEffect(() => {
        if (ListUser) {
            dispatch(listUsersSlice(ListUser))
        }
    }, [isSuccessUser, ListUser])
    // loc theo thanh pho , huyen
    const handleDistrictByProvince = (IdProvince: number) => {
        if (IdProvince) {
            toast.warning("Hiện chức năng đang phát triển")
            return
            dispatch(listUserFilterByAddressSlice({ provinceId: IdProvince, districtId: undefined, users: ListUser?.results }))
            triggerDistrict(IdProvince)
        }
    }
    // set mac dinh trang cho listUser
    useEffect(() => {
        triggerListUser({ page: 1, searchName: "" })
    }, [])
    // onChange paginate
    const onChangePaginate: (page: number, pageSize: number) => void = (page, pageSize) => {
        triggerListUser({ page: page, searchName: nameSearch });
    };
    // khi click vao phat phieu , lay ra id cua employee
    const handleClick = (id: number) => {
        setId(id)
    }
    // nut submit
    const onFinish = async (values: IUser) => {
        if (id) {
            const arrValues = Object.values(values)
            // loc ra co gia tri
            const filterValuesNotUndefine = arrValues.filter((value) => value.ObjectId !== undefined && value.YearId !== undefined)
            if (filterValuesNotUndefine.length === 0) {
                return Swal.fire({
                    icon: "error",
                    title: "Lỗi khi phát phiếu",
                    text: "Hãy chọn đối tượng phát phiếu và năm của phiếu !",
                });
            }
            Swal.fire({
                title: "Xác nhận phát phiếu ?",
                showCancelButton: true,
                confirmButtonColor: "#1677ff",
                confirmButtonText: "Xác nhận",
                cancelButtonText: "Hủy",
                icon: "question",
            }).then(async (results) => {
                if (results.isConfirmed) {
                    // Loc ra id nhan vao phat phieu
                    const filterUser = filterValuesNotUndefine.filter((user) => user.EmployeeId === id)

                    const results = await onAddScoreFile(filterUser[0])
                    if (results.error) {
                        return toast.error(`Phát phiếu không thành công do năm của phiếu không khớp với phiếu`)
                    }
                    toast.success(`Phát phiếu thành công`)
                    form.resetFields()
                }
            })
        }
    }
    console.log(`listUserReducer:`, listUserReducer)
    return (
        <div>
            <div className="flex gap-2">
                <h3 className='text-title mb-0'>Phát phiếu chấm</h3>
                {isFetchingObject || FetchingListUser || FetchingYear && <div> <Spin indicator={<LoadingOutlined spin />} size="small" /> Update data ...</div>}
                {isLoadingObjectAPI || LoadingListUser || LoadingYear ? <div className='ml-2'>loading data...</div> : ""}
            </div>
            <h1 className='mb-4 font-semibold'>Nhập khu vực muốn tìm kiếm</h1>
            <Search onSearch={onSearch} placeholder="Hãy nhập vào đây ..." enterButton="Tìm kiếm" size="large" />
            <Space className='mt-4'>
                <p>Lọc theo:</p>
                <Select
                    showSearch
                    placeholder="Tìm kiếm tỉnh"
                    optionFilterProp="children"
                    onChange={handleDistrictByProvince}
                >
                    {provinces?.map((item, index) => (
                        <Option value={`${item._id}`} key={item._id}>{item.Name}</Option>
                    ))}
                </Select>
                <Select
                    showSearch
                    placeholder="Tìm kiếm huyện"
                    optionFilterProp="children"
                >
                    {districts?.map((item, index) => (
                        <Option value={`${item._id}`} key={item._id}>{item.Name}</Option>
                    ))}
                </Select>
            </Space>
            <Form
                form={form}
                name="form"
                layout="vertical"
                style={{
                    width: "100%",
                    margin: 0
                }}

                autoComplete="off"
                onFinish={onFinish}
                className="mx-auto"
            >
                {listUserReducer?.map((user, index) => (
                    <Badge.Ribbon text={`${user.FullName}`} color="green" key={user._id}>
                        <Card key={user._id} title={`${user.Customer}`} className='mt-8' size="small">
                            <div className="flex flex-col">
                                <Space>
                                    <Form.Item label="Đối tượng" name={[index, "ObjectId"]} >
                                        <Select
                                            mode='multiple'
                                            showSearch
                                            placeholder="Chọn đối tượng phiếu"
                                            optionFilterProp="children"
                                            style={{ width: "300px" }}

                                        >
                                            {/* <p>{}</p> */}
                                            {ListObjectAPI?.map((item) => (
                                                <Option value={`${item._id}`} key={item._id} disabled={item.ApartmentId !== user.ApartmentId}>{item.NameObject}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                    <Form.Item label="Năm phiếu chấm" name={[index, "YearId"]} >
                                        <Select
                                            showSearch
                                            placeholder="Chọn số năm"
                                            optionFilterProp="children"
                                            style={{ width: "150px" }}
                                        >
                                            {listYear?.map((item, index) => (
                                                <Option value={`${item._id}`} key={index}>{item.Name}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Space>
                                <Form.Item hidden name={[index, "EmployeeId"]} initialValue={user._id}>
                                    <Input></Input>
                                </Form.Item>
                            </div>
                            <Button type='primary' htmlType='submit' name={`${user._id}`} key={user._id} onClick={() => handleClick(Number(user._id)!)}>Phát phiếu</Button>
                        </Card>
                    </Badge.Ribbon>
                ))
                }
            </Form>
            <Pagination onChange={onChangePaginate} pageSize={ListUser?.results.length} className='mt-4 float-end' defaultCurrent={1} total={ListUser?.results.length * ListUser?.pagination.pages.length} />
        </div >
    )
}

export default SearchInfomation
