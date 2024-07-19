import { CloseOutlined, DeleteOutlined, LoadingOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Col, Form, FormInstance, Input, message, Row, Select, SelectProps, Space, Spin, Switch, Tooltip, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea';
import { Option } from 'antd/es/mentions';
import React, { Dispatch, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useFetchAllObjectQuery } from '../../store/object/object.service';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getAllObjectSlice } from '../../store/object/objectSlice';
import { useFetchAllDepartmentQuery } from '../../store/department/department.service';
import { fetchAllDepartmentSlice } from '../../store/department/departmentSlice';
import { IDepartment } from '../../store/department/department.interface';
import { useLazyFetchOneScoreTempQuery, useUpdateScoreTempMutation } from '../../store/scoretemp/scoretemp.service';
import { useFetchAllYearQuery } from '../../store/year/year.service';
import { useLazyFetchAllCriteriaByScoreTempIdQuery } from '../../store/criteria/criteria.service';
import { useLazyFetchAllCriteriaDetailByCriteriaQuery } from '../../store/criteriaDetail/criteriaDetail.service';


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
            Cập nhật phiếu chấm
        </Button>
    );
};


const ScoreTempUpdate = () => {
    // truyen props tu app
    const dispatch: Dispatch<any> = useDispatch()
    const [form] = Form.useForm();
    const { id } = useParams()
    const [onUpdate] = useUpdateScoreTempMutation()
    // scoretemptdetail
    const [checkedPercent, setCheckedPercent] = useState(true);
    const [checkedTotal, setCheckedTotal] = useState(true);
    const [checkedCurrentStatus, setCheckedCurrentStatus] = useState(true);
    const navigate = useNavigate()
    // api object
    const { data: fetchAllObject, isSuccess: isSuccessObject, isLoading: isLoadingObject, isError: isErrorObject } = useFetchAllObjectQuery()
    // goi list department tu redux-toolkit
    const { data: listDepartmentApi, isError: isErrorDepartmenApi, isLoading: isLoadingDepartmentApi, isSuccess: isSuccessDepartmentApi } = useFetchAllDepartmentQuery()
    // goi list year ru Api 
    const { data: listYearApi, isError: errorYearApi, isLoading: loadingYearApi } = useFetchAllYearQuery()
    // fetchOne scoretemp
    const [triggerGetOneScoreTemp, { data: getOneScoreTemp, isError: errorScoreTempApi, isLoading: LoadingScoreTempApi, isSuccess: successScoreTempApi, isFetching: fetchingScoreTempApi }] = useLazyFetchOneScoreTempQuery()
    // fetch criteria By scoretempId
    const [triggerCriteria, { data: listCriteria, isError: errorCriteriaApi, isLoading: LoadingCriteriaApi, isSuccess: successCriteriaApi, isFetching: fetchingCriteriaApi }] = useLazyFetchAllCriteriaByScoreTempIdQuery()
    // fetch criteria detail By criteria
    const [triggerCriteriaDetail, { data: listCriteriaDetail, isError: errorCriteriaDetailApi, isFetching: fetchingCriteriaDetailApi, isLoading: LoadingCriteriaDetailApi }] = useLazyFetchAllCriteriaDetailByCriteriaQuery()
    // reducer object
    const fetchAllDepartmentReducer = useSelector((state: RootState) => state.departmentSlice.departments)
    if (isErrorObject || isErrorDepartmenApi || errorScoreTempApi || errorYearApi || errorCriteriaApi || errorCriteriaDetailApi) {
        navigate("/err500")
        return
    }
    // useEffect khi lay du lieu object thanh cong dispatch vao redux
    useEffect(() => {
        if (fetchAllObject) {
            dispatch(getAllObjectSlice(fetchAllObject))
        }
    }, [isSuccessObject, fetchAllObject, dispatch])
    // useEffect khi lay du lieu department thanh cong dispatch vao redux
    useEffect(() => {
        if (listDepartmentApi) {
            dispatch(fetchAllDepartmentSlice(listDepartmentApi))
        }
    }, [isSuccessDepartmentApi, dispatch])
    // getOne scoretemp theo id
    useEffect(() => {
        if (id) {
            triggerGetOneScoreTemp(Number(id))
            triggerCriteria(Number(id))
        }
    }, [id])
    // set dữ liệu vào form

    useEffect(() => {
        if (getOneScoreTemp) {
            form.setFieldsValue({
                Name: getOneScoreTemp.Name,
                ObjectId: getOneScoreTemp.ObjectId,
                Description: getOneScoreTemp.Description,
                YearId: getOneScoreTemp.YearId,
                Criteria: getOneScoreTemp.Criteria,
            })
        }
    }, [getOneScoreTemp])
    // goi ham set criteriaValue theo scoretemp
    useEffect(() => {
        listCriteria?.forEach((criteria) => {
            triggerCriteriaDetail(criteria._id)
        })

    }, [listCriteria])
    // Checked ty le %
    const toggleChecked = (key: number) => {
        setCheckedPercent(!checkedPercent);
    };
    // checked tong so
    const toggleCheckedTotal = () => {
        setCheckedTotal(!checkedTotal);
    };
    // checked trang thai hien tai
    const toggleCheckedStatus = () => {
        setCheckedCurrentStatus(!checkedCurrentStatus);
    };
    // submit add phiếu chấm
    const onFinish = async (values: any) => {
        try {
            // return
            if (id) {
                console.log(values)
                const results = await onUpdate({ _id: id, ...values })
                if (results.error) {
                    message.error(`Cập nhật thất bại , vui lòng thử lại!`);
                    return
                }
                message.success(`Đã cập nhật thành công phiếu chấm`);
                navigate("/scoretemp")
                form.resetFields()
            }
            // setOpen(false);
        } catch (error) {
            console.log(error)
        }
    }
    // object
    // const option Objects
    const optionObjects: SelectProps['options'] = fetchAllObject?.map((item) => ({
        label: item.NameObject, // Hoặc thuộc tính tương ứng từ item
        value: item._id, // Hoặc thuộc tính tương ứng từ item
        // disabled: !item.isActive
    }));
    // const option years
    const optionYears: SelectProps['options'] = listYearApi?.map((item) => ({
        label: item.Name, // Hoặc thuộc tính tương ứng từ item
        value: item._id, // Hoặc thuộc tính tương ứng từ item
        // disabled: !item.isActive
    }));
    return (
        <div>
            {isLoadingObject || LoadingScoreTempApi || isLoadingDepartmentApi || loadingYearApi || LoadingCriteriaApi || LoadingCriteriaDetailApi && <p> loading object....</p>}
            <div className="flex items-center justify-between gap-2">
                <h3 className='text-title mb-0'>Cập nhật phiếu chấm  </h3>
                {fetchingScoreTempApi || fetchingCriteriaApi || fetchingCriteriaDetailApi && <div><Spin indicator={<LoadingOutlined spin />} size="small" /> Update data ...</div>}
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
                className="mx-auto"
            >
                <Row gutter={24}>
                    {/* Tên phiếu chấm */}
                    <Col span={10}>
                        <Form.Item
                            name="Name"
                            label="Tên phiếu chấm"
                            rules={[
                                { required: true, message: '* Không được để trống' },
                                {
                                    validator: (_, value) => {
                                        if (value && value.trim() === '') {
                                            return Promise.reject('Không được để khoảng trắng');
                                        }
                                        return Promise.resolve();
                                    },
                                },
                                { min: 3, message: 'Tối thiểu 6 kí tự' },

                            ]}
                        >
                            <Input></Input>
                        </Form.Item>
                    </Col>
                    {/* Tên đối tượng */}
                    <Col span={10}>
                        <Form.Item
                            name="ObjectId"
                            label="Đối tượng"
                            rules={[
                                { required: true, message: '* Không được để trống' }
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="--"
                                optionFilterProp="children"
                                options={optionObjects}
                            >

                            </Select>
                        </Form.Item>
                    </Col>
                    {/* Kích hoạt */}
                    <Col span={4} className='flex items-center'>
                        <Form.Item label="Kích hoạt" name="IsActive" valuePropName="checked" initialValue={true}>
                            <Switch />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    {/* năm đánh giá */}
                    <Col span={4}>
                        <Form.Item
                            name="YearId"
                            label="Năm"
                            rules={[
                                { required: true, message: '* Không được để trống' }
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="--"
                                optionFilterProp="children"
                                options={optionYears}
                            >
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* mô tả */}
                    <Col span={20}>
                        <Form.Item name="Description" label="Mô tả">
                            <TextArea></TextArea>
                        </Form.Item>
                    </Col>
                </Row>
                {/* list tiêu chí */}
                <Form.List name="Criteria">
                    {(fields, { add, remove }) => (
                        <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
                            {fields?.map((field) => (
                                <Card
                                    size="small"
                                    title={`Tiêu chí ${field.name + 1}`}
                                    key={field.key}
                                    extra={
                                        <Tooltip title={`Xóa tiêu chí ${field.name + 1}`}>
                                            <CloseOutlined
                                                onClick={() => {
                                                    remove(field.name);
                                                }}
                                            />
                                        </Tooltip>
                                    }
                                >
                                    {/* <p>{fi}</p> */}
                                    <Row gutter={24}>
                                        {/* Tên tiêu chí */}
                                        <Col span={18}>
                                            <Form.Item
                                                label="Tên tiêu chí"
                                                name={[field.name, 'Name']}
                                                rules={[
                                                    { required: true, message: '* Không được để trống' },
                                                    {
                                                        validator: (_, value) => {
                                                            if (value && value.trim() === '') {
                                                                return Promise.reject('Không được để khoảng trắng');
                                                            }
                                                            return Promise.resolve();
                                                        },
                                                    },
                                                    { min: 3, message: 'Tối thiểu 6 kí tự' },

                                                ]}>
                                                <Input />
                                            </Form.Item>
                                        </Col>
                                        {/* Tên sở */}
                                        <Col span={6}>
                                            <Form.Item
                                                label="Lĩnh vực"
                                                name={[field.name, 'FieldId']}
                                                rules={[
                                                    { required: true, message: '* Không được để trống' }
                                                ]}>
                                                <Select
                                                    showSearch
                                                    placeholder="Tìm kiếm lĩnh vực"
                                                    optionFilterProp="children"
                                                >
                                                    {fetchAllDepartmentReducer?.map((department, index) => (
                                                        <Option value={department._id} key={`${index}`}>{department.Name}</Option>
                                                    ))}
                                                </Select>
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    {/* Tiêu chí chi tiết */}
                                    <Form.Item
                                        label="Tiêu chí chi tiết"
                                        name="criteriaDetailName"

                                    >
                                        <Form.List name={[field.name, 'listCriteria']}>
                                            {(subFields, subOpt) => (
                                                <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16, marginTop: "10px" }}>
                                                    {subFields.map((subField) => (
                                                        <Row gutter={24} key={subField.key}>
                                                            <p></p>
                                                            {/* Nội dung tiêu chí */}
                                                            <Col span={7}>
                                                                <Form.Item label="Nội dung tiêu chí" name={[subField.name, 'Name']}>
                                                                    <TextArea placeholder="Nội dung"></TextArea>
                                                                </Form.Item>
                                                            </Col>
                                                            {/* chỉ tiêu */}
                                                            <Col span={3}>
                                                                <Form.Item label="Chỉ tiêu" name={[subField.name, 'Target']}>
                                                                    <Input placeholder="Chỉ tiêu đạt" />
                                                                </Form.Item>
                                                            </Col>
                                                            {/* tỉ lệ % */}
                                                            <Col span={3}>
                                                                <Form.Item label="Tỉ lệ (%)" name={[subField.name, 'IsTypePercent']} valuePropName="checked" initialValue={false}>
                                                                    <Checkbox>Cho phép nhập</Checkbox>
                                                                </Form.Item>
                                                            </Col>
                                                            {/* Tổng số */}
                                                            <Col span={3}>
                                                                <Form.Item label="Tổng số" name={[subField.name, 'IsTypeTotal']} valuePropName="checked" initialValue={false}>
                                                                    <Checkbox>Cho phép nhập</Checkbox>
                                                                </Form.Item>
                                                            </Col>
                                                            {/* Hiện trạng */}
                                                            <Col span={3}>
                                                                <div className="pb-[8px]"> Hiện trạng <Tooltip title="Khi hiện trạng không cho phép nhập thì sẽ tích đạt hay không đạt" >
                                                                    <QuestionCircleOutlined style={{ cursor: "pointer", color: "#1677ff", fontSize: "18px", marginLeft: "8px" }} />
                                                                </Tooltip></div>
                                                                <Form.Item label="" name={[subField.name, 'IsCurrentStatusType']} valuePropName="checked" initialValue={false}>
                                                                    <Checkbox >Cho phép nhập</Checkbox>
                                                                </Form.Item>
                                                            </Col>

                                                            <Col span={3} className='flex items-center justify-center'>
                                                                <Button type="dashed" onClick={() => {
                                                                    subOpt.remove(subField.name);
                                                                }} danger>
                                                                    Xóa bỏ
                                                                </Button>
                                                            </Col>
                                                        </Row >
                                                    ))}
                                                    <Button type="dashed" onClick={() => subOpt.add()} block>
                                                        + Thêm chi tiết tiêu chí
                                                    </Button>
                                                </div>
                                            )}
                                        </Form.List>
                                    </Form.Item>
                                </Card>
                            ))}
                            <Button type="primary" onClick={() => add()} block>
                                + Thêm tiêu chí
                            </Button>
                        </div>
                    )}
                </Form.List>
                <Space style={{
                    marginTop: "10px",
                    display: "flex",
                    justifyContent: "flex-end"
                }}>
                    <SubmitButton form={form} />
                </Space>
            </Form>
        </div >
    )
}

export default ScoreTempUpdate
