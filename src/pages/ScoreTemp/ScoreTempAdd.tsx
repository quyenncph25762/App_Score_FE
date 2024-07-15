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
    // scoretemptdetail
    const [checkedPercent, setCheckedPercent] = useState(true);
    const [checkedTotal, setCheckedTotal] = useState(true);
    const [checkedCurrentStatus, setCheckedCurrentStatus] = useState(true);
    const navigate = useNavigate()
    // api object
    const { data: fetchAllObject, isSuccess: isSuccessObject, isLoading: isLoadingObject, isError: isErrorObject } = useFetchAllObjectQuery()
    // goi list department tu redux-toolkit
    const { data: listDepartmentApi, isError: isErrorDepartmenApi, isLoading: isLoadingDepartmentApi, isSuccess: isSuccessDepartmentApi } = useFetchAllDepartmentQuery()
    // reducer object
    const fetchAllObjectReducer = useSelector((state: RootState) => state.objectSlice.objects)
    const fetchAllDepartmentReducer = useSelector((state: RootState) => state.departmentSlice.departments)
    if (isErrorObject || isErrorDepartmenApi) {
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
        form.setFieldsValue({
            isActive: true
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
    const onFinish = async (values: any) => {
        try {
            console.log(values)
            // const results = await onAdd(values)
            // if (results.error) {
            //     message.error(`Thêm thất bại , vui lòng thử lại!`);
            //     return
            // }
            message.success(`Đã thêm thành công phiếu chấm`);
            // form.resetFields()
            // setOpen(false);
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            {isLoadingObject && <p> loading object....</p>}
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
                            name="name"
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
                            name="Object"
                            label="Đối tượng"
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
                            ]}
                        >
                            <Select
                                showSearch
                                placeholder="--"
                                optionFilterProp="children"
                            >
                                {fetchAllObjectReducer?.map((object, index) => (
                                    <Option value={`${object.id}`} key={`${index}`} disabled={!object.isActive}>{object.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* Kích hoạt */}
                    <Col span={4} className='flex items-center'>
                        <Form.Item label="Kích hoạt" name="isActive" valuePropName="checked">
                            <Switch defaultChecked />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={24}>
                    {/* năm đánh giá */}
                    <Col span={4}>
                        <Form.Item
                            name="Year"
                            label="Năm"
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
                            <Select
                                showSearch
                                placeholder="--"
                                optionFilterProp="children"
                            >
                                <Option value="2014" >2014</Option>
                            </Select>
                        </Form.Item>
                    </Col>
                    {/* mô tả */}
                    <Col span={20}>
                        <Form.Item name="description" label="Mô tả">
                            <TextArea></TextArea>
                        </Form.Item>
                    </Col>
                </Row>
                {/* list tiêu chí */}
                <Form.List name="criteria">
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
                                                name={[field.name, 'CriterialName']}
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
                                                name={[field.name, 'DepartmentId']}
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
                                                <Select
                                                    showSearch
                                                    placeholder="Tìm kiếm phòng ban"
                                                    optionFilterProp="children"
                                                >
                                                    {fetchAllDepartmentReducer?.map((department, index) => (
                                                        <Option value={department.id} key={`${index}`} disabled={!department.isActive}>{department.name}</Option>
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
                                                                <Form.Item label="Nội dung tiêu chí" name={[subField.name, 'name']}>
                                                                    <TextArea placeholder="Nội dung"></TextArea>
                                                                </Form.Item>
                                                            </Col>
                                                            {/* chỉ tiêu */}
                                                            <Col span={3}>
                                                                <Form.Item label="Chỉ tiêu" name={[subField.name, 'target']}>
                                                                    <Input placeholder="Chỉ tiêu đạt" />
                                                                </Form.Item>
                                                            </Col>
                                                            {/* tỉ lệ % */}
                                                            <Col span={3}>
                                                                <Form.Item label="Tỉ lệ (%)" name={[subField.name, 'isTypePercent']} valuePropName="checked">
                                                                    <Checkbox>Cho phép nhập</Checkbox>
                                                                </Form.Item>
                                                            </Col>
                                                            {/* Tổng số */}
                                                            <Col span={3}>
                                                                <Form.Item label="Tổng số" name={[subField.name, 'isTypeTotal']} valuePropName="checked">
                                                                    <Checkbox>Cho phép nhập</Checkbox>
                                                                </Form.Item>
                                                            </Col>
                                                            {/* Hiện trạng */}
                                                            <Col span={3}>
                                                                <div className="pb-[8px]"> Hiện trạng <Tooltip title="Khi hiện trạng không cho phép nhập thì sẽ tích đạt hay không đạt" >
                                                                    <QuestionCircleOutlined style={{ cursor: "pointer", color: "#1677ff", fontSize: "18px", marginLeft: "8px" }} />
                                                                </Tooltip></div>
                                                                <Form.Item label="" name={[subField.name, 'isCurrentStatusType']} valuePropName="checked">
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

export default ScoreTempAdd
