import { useState, useEffect } from "react";
import Jumbotron from "../../components/cards/jumbotron";
import UserMenu from "../../components/nav/UserMenu";
import { useAuth } from "../../context/auth";
import { Form,Input,InputNumber,Button } from "antd";

const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
};

const CheckoutPage = ({totalPrice,cart}) => {
    const [auth,setAuth] = useAuth()

    useEffect(() => {
        console.log(totalPrice,cart,auth)
    },[])
    return (
        <>
        <Form
            {...layout}
            name="nest-messages"
            onFinish={console.log("Finish")}
            style={{
            maxWidth: 600,
            }}
            validateMessages={"Invalid"}
        >
            <Form.Item name="state/city">
                <Form.Item
                name="state"
                label="State"
                rules={[
                    {
                    required: true,
                    },
                ]}
                style={{
                    display: 'inline-block',
                    width: 'calc(50% - 8px)',
                }}
                >
                <Input />
                </Form.Item>
                <Form.Item
                name="city"
                label="City"
                rules={[
                    {
                    type: 'email',
                    required: true,
                    },
                ]}
                style={{
                    display: 'inline-block',
                    width: 'calc(50% - 8px)',
                    margin: '0 8px',
                }}
                >
                <Input />
                </Form.Item>
            </Form.Item>
            <Form.Item
            name="pincode"
            label="Pincode"
            rules={[
                {
                    required: true,
                },
            ]}
            >
            <Input/>
            </Form.Item>
            <Form.Item name={['user', 'website']} label="Website">
            <Input />
            </Form.Item>
            <Form.Item name={['user', 'introduction']} label="Introduction">
            <Input.TextArea />
            </Form.Item>
            <Form.Item
            wrapperCol={{
                ...layout.wrapperCol,
                offset: 8,
            }}
            >
            <Button type="primary" htmlType="submit">
                Submit
            </Button>
            </Form.Item>
        </Form>
        </>
    )
}

export default CheckoutPage;