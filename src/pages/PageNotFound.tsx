import { Button, Result } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
const PageNotFound = () => {
    const navigate = useNavigate()
    return <Result
        status="404"
        title="404"
        subTitle="Xin lỗi , trang bạn không tồn tại."
        extra={<Button type="primary" onClick={() => navigate(-1)}>
            Trở về
        </Button>}
    />
}

export default PageNotFound;