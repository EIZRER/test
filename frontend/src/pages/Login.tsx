import React from 'react';
import { App, Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import { AuthLayout } from '../components/AuthLayout';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useUser } from '../contexts/UserContext';

const phoneRegex = /^(\+976|0)?\d{8}$/;

export const Login: React.FC = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const { refresh } = useUser();

  const onFinish = async (values: { phone: string; password: string }) => {
    try {
      setLoading(true);
      await login(values);
      await refresh();
      message.success('Амжилттай нэвтэрлээ!');
      navigate('/');
    } catch (error) {
      message.error('Утасны дугаар эсвэл нууц үг буруу байна!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Нэвтрэх
        </h1>
        <p className="text-gray-600">
          Бүртгэл байхгүй?{' '}
          <Button
            onClick={() => navigate('/register')}
            type="link"
            className="p-0 font-medium hover:text-purple-600"
          >
            Бүртгүүлэх
          </Button>
        </p>
      </div>

      <Form
        layout="vertical"
        onFinish={onFinish}
        disabled={loading}
        className="w-full"
        size="middle"
      >
        <div className="space-y-3">
          <Form.Item
            label="Утасны дугаар"
            name="phone"
            rules={[
              { required: true, message: 'Утасны дугаар оруулна уу!' },
              {
                pattern: phoneRegex,
                message: 'Утасны дугаар буруу байна!',
              },
            ]}
          >
            <Input 
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="+976 0000 0000"
              className="rounded-lg"
            />
          </Form.Item>

          <Form.Item
            label="Нууц үг"
            name="password"
            rules={[
              { required: true, message: 'Нууц үг оруулна уу!' },
              {
                min: 8,
                message: 'Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой!',
              },
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="******"
              className="rounded-lg"
            />
          </Form.Item>
        </div>

        <Form.Item className="mb-0 mt-6">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            className="h-11 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700"
          >
            Нэвтрэх
          </Button>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
}; 