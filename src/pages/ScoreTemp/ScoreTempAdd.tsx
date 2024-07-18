import { CloseOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Col, Form, FormInstance, Input, message, Row, Select, Space, Switch, Tooltip, Typography } from 'antd'
import TextArea from 'antd/es/input/TextArea';
import { Option } from 'antd/es/mentions';
import React, { Dispatch, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFetchAllObjectQuery } from '../../store/object/object.service';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { getAllObjectSlice } from '../../store/object/objectSlice';
import { useFetchAllDepartmentQuery } from '../../store/department/department.service';
import { fetchAllDepartmentSlice } from '../../store/department/departmentSlice';
import { IDepartment } from '../../store/department/department.interface';
import { useAddScoreTempMutation } from '../../store/scoretemp/scoretemp.service';
import { IScoreTemp } from '../../store/scoretemp/scoretemp.interface';
import { useFetchAllYearQuery } from '../../store/year/year.service';


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
            Thêm phiếu chấm
        </Button>
    );
};


const ScoreTempAdd = () => {
    // truyen props tu app
    const dispatch: Dispatch<any> = useDispatch()
    const [form] = Form.useForm();
    // nut them phieu cham
    const [onAddScoreTemp] = useAddScoreTempMutation()
    // scoretemptdetail
    const [checkedPercent, setCheckedPercent] = useState(true);
    const [checkedTotal, setCheckedTotal] = useState(true);
    const [checkedCurrentStatus, setCheckedCurrentStatus] = useState(true);
    const navigate = useNavigate()
    // api object
    const { data: fetchAllObject, isSuccess: isSuccessObject, isLoading: isLoadingObject, isError: isErrorObject } = useFetchAllObjectQuery()
    // goi list department tu redux-toolkit
    const { data: listDepartmentApi, isError: isErrorDepartmenApi, isLoading: isLoadingDepartmentApi, isSuccess: isSuccessDepartmentApi } = useFetchAllDepartmentQuery()
    // goi list year API
    const { data: listYearApi, isError: errorYearApi, isLoading: loadingYearApi } = useFetchAllYearQuery()
    // reducer object
    const fetchAllObjectReducer = useSelector((state: RootState) => state.objectSlice.objects)
    const fetchAllDepartmentReducer = useSelector((state: RootState) => state.departmentSlice.departments)
    if (isErrorObject || isErrorDepartmenApi || errorYearApi) {
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
    // form scoretemp
    useEffect(() => {
        // console.log(1)
        form.setFieldsValue({
            IsActive: true,
        })
    }, [])
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
    const onFinish = async (values: IScoreTemp) => {
        try {

            const results = await onAddScoreTemp(values)
            if (results.error) {
                message.error(`Thêm thất bại , vui lòng thử lại!`);
                return
            }
            navigate("/scoretemp")
            message.success(`Đã thêm thành công phiếu chấm`);
            form.resetFields()
            // setOpen(false);
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            {isLoadingObject || loadingYearApi && <p> loading object....</p>}
            <div className="flex items-center justify-between gap-2">
                <h3 className='text-title mb-0'>Thêm mới phiếu chấm</h3>
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

                            ]}>
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
                            >
                                {fetchAllObjectReducer?.map((object, index) => (
                                    <Option value={`${object._id}`} key={`${index}`}>{object.NameObject}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* Kích hoạt */}
                    <Col span={4} className='flex items-center'>
                        <Form.Item label="Kích hoạt" name="IsActive" valuePropName="checked">
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
                            >
                                {listYearApi?.map((year, index) => (
                                    <Option value={`${year._id}`} key={`${index}`}>{year.Name}</Option>
                                ))}
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
                            {fields.map((field) => (
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
                                        name="CriteriaDetailName"

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
                                                                <Form.Item label="Tỉ lệ (%)" name={[subField.name, 'IsTypePercent']} initialValue={false} valuePropName="checked">
                                                                    <Checkbox>Cho phép nhập</Checkbox>
                                                                </Form.Item>
                                                            </Col>
                                                            {/* Tổng số */}
                                                            <Col span={3}>
                                                                <Form.Item label="Tổng số" name={[subField.name, 'IsTypeTotal']} initialValue={false} valuePropName="checked">
                                                                    <Checkbox>Cho phép nhập</Checkbox>
                                                                </Form.Item>
                                                            </Col>
                                                            {/* Hiện trạng */}
                                                            <Col span={3}>
                                                                <div className="pb-[8px]"> Hiện trạng <Tooltip title="Khi hiện trạng không cho phép nhập thì sẽ tích đạt hay không đạt" >
                                                                    <QuestionCircleOutlined style={{ cursor: "pointer", color: "#1677ff", fontSize: "18px", marginLeft: "8px" }} />
                                                                </Tooltip></div>
                                                                <Form.Item label="" name={[subField.name, 'IsCurrentStatusType']} valuePropName="checked" initialValue={false}>
                                                                    <Checkbox>Cho phép nhập</Checkbox>
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

export default ScoreTempAdd
