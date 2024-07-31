import { useIndexQuery } from '../store/statistic/statistic.service';

import CheckoutFuntion from '../hooks/funtions/Checkout';



const HomePage = () => {
    const { data: StatisticData, isError: isErrorStatistic, isLoading: isLoadingStatistic } = useIndexQuery({})
    // funtion kiem tra xem nguoi dung dang nhap chua ?
    CheckoutFuntion()
    return (
        <>Hệ thống hiện đang trong quá trình phát triển</>
        // <Row gutter={16}>
        //     <Col span={6}>
        //         <Card bordered={true} style={{ backgroundColor: "#e6f4ff" }}>
        //             <Statistic
        //                 title="Tổng số tài khoản"
        //                 value={80}
        //                 // precision={2}
        //                 valueStyle={{ color: '#3f8600' }}
        //                 prefix={<UserOutlined />}
        //             // suffix="%"
        //             />
        //         </Card>
        //     </Col>
        //     <Col span={6}>
        //         <Card bordered={true}>
        //             <Statistic
        //                 title="Tỷ lệ giảm"
        //                 value={9.3}
        //                 precision={2}
        //                 valueStyle={{ color: '#cf1322' }}
        //                 prefix={<ArrowDownOutlined />}
        //                 suffix="%"
        //             />
        //         </Card>
        //     </Col>
        //     <Col span={6}>
        //         <Card bordered={true} style={{ backgroundColor: "#e6f4ff" }}>
        //             <Statistic
        //                 title="Tỷ lệ tăng"
        //                 value={11.28}
        //                 precision={2}
        //                 valueStyle={{ color: '#3f8600' }}
        //                 prefix={<ArrowUpOutlined />}
        //                 suffix="%"
        //             />
        //         </Card>
        //     </Col>
        //     <Col span={6}>
        //         <Card bordered={true}>
        //             <Statistic
        //                 title="Tỷ lệ giảm"
        //                 value={9.3}
        //                 precision={2}
        //                 valueStyle={{ color: '#cf1322' }}
        //                 prefix={<ArrowDownOutlined />}
        //                 suffix="%"
        //             />
        //         </Card>
        //     </Col>
        // </Row>
    )
}

export default HomePage
