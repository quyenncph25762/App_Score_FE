import React from 'react';
import { ArrowDownOutlined, ArrowUpOutlined, UserOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
const HomePage = () => {
    return (
        <Row gutter={16}>
            <Col span={6}>
                <Card bordered={true} style={{ backgroundColor: "#e6f4ff" }}>
                    <Statistic
                        title="Tổng số tài khoản"
                        value={80}
                        // precision={2}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<UserOutlined />}
                    // suffix="%"
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card bordered={true}>
                    <Statistic
                        title="Tỷ lệ giảm"
                        value={9.3}
                        precision={2}
                        valueStyle={{ color: '#cf1322' }}
                        prefix={<ArrowDownOutlined />}
                        suffix="%"
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card bordered={true} style={{ backgroundColor: "#e6f4ff" }}>
                    <Statistic
                        title="Tỷ lệ tăng"
                        value={11.28}
                        precision={2}
                        valueStyle={{ color: '#3f8600' }}
                        prefix={<ArrowUpOutlined />}
                        suffix="%"
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card bordered={true}>
                    <Statistic
                        title="Tỷ lệ giảm"
                        value={9.3}
                        precision={2}
                        valueStyle={{ color: '#cf1322' }}
                        prefix={<ArrowDownOutlined />}
                        suffix="%"
                    />
                </Card>
            </Col>
        </Row>
    )
}

export default HomePage
