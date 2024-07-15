import React, { useEffect, useState } from 'react';
import {
    CodeSandboxOutlined,
    DownOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PartitionOutlined,
    PieChartOutlined,
    PlusOutlined,
    SlidersOutlined,
    SolutionOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from '@ant-design/icons';
import { Avatar, Button, Col, Dropdown, Form, FormInstance, Image, Input, Layout, Menu, MenuProps, message, Modal, Popover, Row, Select, Space, Switch, theme, Upload } from 'antd';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import { IUser } from '../store/users/user.interface';

const { Header, Sider, Content } = Layout;
const { Option } = Select
type MenuItem = Required<MenuProps>["items"][number];


function getItem(
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
    } as MenuItem;
}



const SubmitButtonChangePass = ({ form }: { form: FormInstance }) => {
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
            Thêm
        </Button>
    );
};
const Aside = () => {
    // user state
    const [user, setUser] = useState<string>();
    const [color, setColor] = useState();
    const [gap, setGap] = useState();
    // form tai khoan cua toi
    const [form] = Form.useForm();
    // formChangePass
    const [formChangePass] = Form.useForm()


    // modal
    const [open, setOpen] = useState(false);
    // modal thay doi mat khau
    const [openChangePass, setOpenChangePass] = useState(false);
    // 
    const [collapsed, setCollapsed] = useState(false);
    // item nav
    const sideBaritems: MenuItem[] = [
        getItem(<Link to={"/"}>Dashboard</Link >, '1', <PieChartOutlined />),
        getItem('Lĩnh vực', 'sub3', <PartitionOutlined />, [
            getItem(<Link to={"/department"}>Quản lý lĩnh vực</Link >, '6'),
        ]),
        getItem('Đối tượng', 'sub4', <SolutionOutlined />, [
            getItem(<Link to={"/object"}>Quản lý đối tượng</Link >, '7'),
        ]),
        getItem('Phiếu chấm', 'sub1', <CodeSandboxOutlined />, [
            getItem(<Link to={"/scoretemp/add"}>Tạo mới phiếu chấm</Link >, '2'),
            getItem(<Link to={"/scoretemp"}>Quản lý phiếu chấm</Link >, '3'),
        ]),
        getItem('Cán bộ', 'sub2', <UserOutlined />, [
            getItem(<Link to={"/users"}>Quản lý tài khoản</Link >, '4'),
        ]),
        getItem('Vai trò', 'sub5', <SlidersOutlined />, [
            getItem(<Link to={"/roles"}>Quản lý vai trò</Link >, '5'),
        ]),
    ];
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    // users
    // modal user 
    const showModal = () => {
        setOpen(true);
    };
    const handleOk = () => {
        setOpen(false);
    };
    const handleCancel = () => {
        setOpen(false);
        formChangePass.resetFields()
    };
    // modal changePassword
    const showModalChangePassword = () => {
        setOpenChangePass(true);
    };
    const handleOkChangePass = () => {
        setOpenChangePass(false);
    };
    const handleCancelChangePass = () => {
        setOpenChangePass(false);
    };
    // item user
    const dropdownItems: MenuItem[] = [
        {
            label: <p>Thông tin của tôi</p>,
            key: '0',
            onClick: () => showModal()
        },
        {
            label: <p>Quên mật khẩu</p>,
            key: '2',
            onClick: () => showModalChangePassword()
        },
        {
            type: 'divider',
        },
        {
            label: <Link to={`login`}>Đăng xuất</Link>,
            danger: true,
            key: '3',
        },
    ];
    const userLocal = {
        fullName: "Quyền",
        colorList: '#f56a00',
        gapList: 4
    }
    // user
    useEffect(() => {
        if (userLocal) {
            const nameFirstCharacter: string = userLocal.fullName.charAt(0)
            if (nameFirstCharacter) {
                setUser(nameFirstCharacter)
            }
        }
    }, [userLocal])
    // onsubmit ChangPass
    const onFinish = async (values: IUser) => {
        try {
            console.log(values)
            message.success(`Đã thêm thành công người dùng`);
            // sau khi them xong thi reset value
            form.resetFields()
            setOpen(false);
        } catch (error) {
            console.log(error)
        }
        // let newImages;
        // if (values.images && values.images.file) {
        //     newImages = values.images.file.response[0];
        // } else {
        //     newImages = [];
        // }
        // const value = {
        //     ...values,
        //     images: newImages
        // };


    };
    return (
        <Layout >
            {/* tai khoan cua toi */}
            <Modal
                title="Thông tin người dùng"
                open={open}
                width={700}
                style={{
                    height: "100%"
                }}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form
                    name="validateOnly"
                    layout="vertical"
                    form={form}
                    style={{
                        width: "100%",
                        margin: 0,
                        padding: "20px"
                    }}
                    autoComplete="off"
                    className="mx-auto"
                >
                    <Row gutter={30}>
                        <Col span={8} className='flex justify-center text-center'>
                            {/* Upload Images */}
                            <Form.Item name="avatar">
                                <Image
                                    style={{
                                        borderRadius: "10px",
                                        height: "150px"
                                    }}
                                    src='https://www.rainforest-alliance.org/wp-content/uploads/2021/06/capybara-square-1.jpg.optimal.jpg'
                                />
                            </Form.Item>
                        </Col>
                        <Col span={16}>
                            <Row gutter={12}>
                                {/* Code */}
                                <Col span={6}>
                                    {/* Name Category */}
                                    <Form.Item
                                        name="code"
                                        label="code"
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                {/* username */}
                                <Col span={14}>
                                    <Form.Item
                                        name="username"
                                        label="Tên người dùng"
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                {/* active */}
                                <Col span={4} className='flex items-center'>
                                    {/* Name Category */}
                                    <Form.Item
                                        name="isActive"
                                        className='mb-0'
                                    >
                                        <Switch disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row gutter={12}>
                                {/* fullname */}
                                <Col span={12}>
                                    <Form.Item
                                        name="name"
                                        label="Họ và tên"
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                                {/* phong ban */}
                                <Col span={12}>
                                    <Form.Item
                                        name="Department"
                                        label="Phòng ban"
                                    >
                                        <Input disabled />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row gutter={30}>
                        <Col span={24}>
                            <Form.Item
                                name="address"
                                label="Địa chỉ"
                            >
                                <Input disabled />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Modal>
            {/* doi mat khau */}
            <Modal
                title="Đổi mật khẩu"
                open={openChangePass}
                width={700}
                footer={null}
                style={{
                    height: "100%"
                }}
                onOk={handleOkChangePass}
                onCancel={handleCancelChangePass}
            >
                <Form
                    name="validateOnly"
                    layout="vertical"
                    form={formChangePass}
                    onFinish={onFinish}
                    style={{
                        width: "100%",
                        margin: 0,
                        padding: "20px"
                    }}
                    autoComplete="off"
                    className="mx-auto"
                >
                    <Row gutter={30}>
                        {/* mat khau hien tai */}
                        <Col span={24} className='' >
                            <Form.Item
                                label="Mật khẩu hiện tại"
                                name="password"
                                style={{ width: "100%" }}
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
                                    { min: 6, message: 'Tối thiểu 6 kí tự' },

                                ]}
                            >
                                <Input />
                            </Form.Item>
                            <p className='cursor-pointer  text-[12px] font-semibold text-left mt-[-20px] ml-2 text-red-400'><Link className='hover:textBlueMain' to={`/sendEmail`}>Quên mật khẩu?</Link></p>
                        </Col>
                        <Col span={24} className='mt-2'>
                            <Row gutter={12}>
                                {/* mật khẩu mới */}
                                <Col span={12}>
                                    {/* Name Category */}
                                    <Form.Item
                                        name="newPassword"
                                        label="Mật khẩu mới"
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
                                            { min: 6, message: 'Tối thiểu 6 kí tự' },

                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                                {/* xác nhận mật khẩu mới */}
                                <Col span={12}>
                                    {/* Name Category */}
                                    <Form.Item
                                        name="ConfirmPassword"
                                        label="Xác nhận mật khẩu mới"
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
                                            { min: 6, message: 'Tối thiểu 6 kí tự' },

                                        ]}
                                    >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Space style={{
                        display: "flex",
                        justifyContent: "flex-end"
                    }}>
                        <Button htmlType="reset">Reset</Button>
                        <SubmitButtonChangePass form={form} />
                    </Space>
                </Form>
            </Modal>
            <Sider theme='light' style={{
                minHeight: "100vh"
            }} collapsible collapsed={collapsed}>
                <div className="w-full flex items-center justify-center">
                    <Link to={`/`}>
                        <img src="/public/images/logo-removebg-preview (2).png" alt="" className='h-[100px] w-[100px] object-cover' />
                    </Link>
                </div>
                <Menu
                    theme="light"
                    defaultSelectedKeys={["1"]}
                    mode="inline"

                    items={sideBaritems}
                />
            </Sider>
            <Layout>
                <Header className='flex justify-between items-center' style={{ padding: 0, background: colorBgContainer }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: '16px',
                            width: 64,
                            height: 64,
                        }}
                    />
                    <Dropdown className='mr-10' menu={{ items: dropdownItems }} trigger={['click']}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <Avatar style={{ backgroundColor: color, verticalAlign: 'middle' }} size="large" gap={gap}>
                                    {user}
                                </Avatar>
                            </Space>
                        </a>
                    </Dropdown>
                </Header>
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    <Outlet></Outlet>
                </Content>
            </Layout>
        </Layout >
    );
};

export default Aside;