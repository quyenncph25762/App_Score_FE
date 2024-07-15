import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Form, Input, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import { IUser } from '../store/users/user.interface';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginApiMutation } from '../store/auth/auth.service';
import { toast } from 'react-toastify';


const LoginPage = () => {
    const [form] = Form.useForm();
    const [onLogin] = useLoginApiMutation()
    const navigate = useNavigate()
    const onFinish = async (values: IUser) => {
        try {
            const { UserName, Password } = values
            const NewValues = {
                UserName: UserName,
                Password: Password,
                DistrictId: 1
            }
            const results = await onLogin(NewValues)
            if (results.error) {
                toast.error("Tài khoản hoặc mật khẩu không chính xác")
                return
            }
            toast.success("Đăng nhập thành công!")
            navigate("/")
        } catch (error) {
            toast.error("Tài khoản hoặc mật khẩu không chính xác")
            console.log(error)
        }

    };
    useEffect(() => {
        form.setFieldsValue({
            password: "",
            email: ""
        })
    }, [])
    return (
        <div className='area'>
            <ul className="circles">
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
            </ul>
            <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
                <div className="relative py-3 w-[450px] sm:mx-auto">
                    <div
                        className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-sky-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
                    </div>
                    <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">

                        <div className="max-w-md mx-auto">
                            <div>
                                <h1 className="text-xl font-semibold ">Đăng nhập</h1>
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
                                            name="UserName"
                                            label="Tên đăng nhập"
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
                                            <Input placeholder="Tên đăng nhập" />
                                        </Form.Item>
                                        <Form.Item
                                            name="Password"
                                            label="Mật khẩu"
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
                                            <Input.Password
                                                placeholder="input password"
                                                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                                            />
                                        </Form.Item>
                                        <div className='text-[11px] mt-2 flex justify-start'>
                                            <strong className='cursor-pointer hover:text-blue-400'><Link to={`/sendEmail`}> Quên mật khẩu?</Link></strong>
                                        </div>
                                        <div className="relative">
                                            <Button type='primary' htmlType='submit'>Đăng nhập</Button>
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        </div>

                        <div className="w-full flex justify-center">
                            <button className="flex items-center bg-white border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium text-gray-800 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                                <svg className="h-6 w-6 mr-2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1"> <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)"> <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> </g> </g> </g> </svg>
                                <span>Continue with Google</span>
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginPage
