import { ArrowLeftOutlined, EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Form, Input, message, Radio, Tooltip } from 'antd';
import React, { useState } from 'react';
import { IUser } from '../store/users/user.interface';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom"

const SendEmailPage = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate()
    const onFinish = async (values: IUser) => {
        try {
            console.log(values)
        } catch (error) {
            console.log(error)
        }
    };
    const handleSendMail = () => {
        return message.warning(`Tính năng hiện đang phát triển`);
    }
    return (
        <>
            <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
                <div className="relative py-3 w-[450px] sm:mx-auto">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
                    </div>
                    <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                        <p className='absolute top-4 left-5'>
                            <Tooltip title="Trở về đăng nhập">
                                <button onClick={() => navigate(-1)}>
                                    <ArrowLeftOutlined style={{
                                        color: '#1677ff',
                                        cursor: "pointer"
                                    }} />
                                </button>
                            </Tooltip>
                        </p>
                        <div className="max-w-md mx-auto">
                            <div>
                                <h1 className="text-xl font-semibold">Quên mật khẩu</h1>
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
                                <div className="divide-y divide-gray-200">
                                    <div className="text-base leading-6  text-gray-700 sm:text-lg sm:leading-7">
                                        <Form.Item
                                            name="email"
                                            label="Hãy nhập email của bạn"
                                            rules={[
                                                { required: true, message: '* Không được để trống' },
                                                { type: 'email', message: 'Địa chỉ email không hợp lệ' },
                                                {
                                                    validator: (_, value) => {
                                                        if (value && value.trim() === '') {
                                                            return Promise.reject('Không được để khoảng trắng');
                                                        }
                                                        return Promise.resolve();
                                                    },
                                                },
                                                { min: 3, message: 'Tối thiểu 3 kí tự' },

                                            ]}
                                        >
                                            <Input placeholder="abc@gmail.com" />
                                        </Form.Item>
                                        <div className="relative">
                                            <Button onClick={() => handleSendMail()} type='primary'>Gửi</Button>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default SendEmailPage
