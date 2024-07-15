import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate, Link } from 'react-router-dom'
const Error500 = () => {
    const navigate = useNavigate()
    return < Result
        status="500"
        title="500"

        subTitle="Xin lỗi , có lỗi xảy ra"
        extra={<Button type="primary"><Link to={`/`}>Quay về trang chủ</Link></Button>}
    />
}

export default Error500;