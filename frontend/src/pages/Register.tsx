import React from 'react';
import { App, Button, Form, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/api';
import { AuthLayout } from '../components/AuthLayout';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';

const phoneRegex = /^(\+976|0)?\d{8}$/;

export const Register: React.FC = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const onFinish = async (values: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => {
    try {
      setLoading(true);
      await register(values);
      message.success('Бүртгэл амжилттай үүслээ!');
      navigate('/login');
    } catch (error) {
      message.error('Бүртгэл үүсгэхэд алдаа гарлаа!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Бүртгүүлэх
        </h1>
        <p className="text-gray-600">
          Аль хэдийн бүртгүүлсэн?{' '}
          <Button
            onClick={() => navigate('/login')}
            type="link"
            className="p-0 font-medium hover:text-purple-600"
          >
            Нэвтрэх
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
            label="Хэрэглэгчийн нэр"
            name="username"
            rules={[{ required: true, message: 'Хэрэглэгчийн нэр оруулна уу!' }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="username123"
              className="rounded-lg"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-3">
            <Form.Item
              label="Нэр"
              name="firstName"
              rules={[{ required: true, message: 'Нэр оруулна уу!' }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Бат"
                className="rounded-lg"
              />
            </Form.Item>

            <Form.Item
              label="Овог"
              name="lastName"
              rules={[{ required: true, message: 'Овог оруулна уу!' }]}
            >
              <Input
                prefix={<UserOutlined className="text-gray-400" />}
                placeholder="Болд"
                className="rounded-lg"
              />
            </Form.Item>
          </div>

          <Form.Item
            label="Имэйл"
            name="email"
            rules={[
              { required: true, message: 'Имэйл оруулна уу!' },
              { type: 'email', message: 'Зөв имэйл хаяг оруулна уу!' },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="example@mail.com"
              className="rounded-lg"
            />
          </Form.Item>

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
              prefix={<PhoneOutlined className="text-gray-400" />}
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

        <Form.Item className="mb-0 mt-4">
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            className="h-11 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 border-0 hover:from-blue-600 hover:to-purple-700"
          >
            Бүртгүүлэх
          </Button>
        </Form.Item>
      </Form>
    </AuthLayout>
  );
}; 