import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title } = Typography;

interface UserInfo {
  lastName: string;
  firstName: string;
  phone: string;
  email: string;
  about?: string;
}

interface UserInfoFormProps {
  initialValues: UserInfo;
  onSave: (values: UserInfo) => void;
}

export const UserInfoForm: React.FC<UserInfoFormProps> = ({
  initialValues,
  onSave,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm<UserInfo>();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSave(values);
      setIsEditing(false);
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Card className="shadow-md">
      <div className="flex justify-between items-center mb-6">
        <Title level={4} className="!m-0">
          Хувийн мэдээлэл
        </Title>
        <Button
          type={isEditing ? 'primary' : 'default'}
          icon={<EditOutlined />}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Хадгалах' : 'Хувийн мэдээлэл засварлах'}
        </Button>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="lastName"
          label="Овог"
          rules={[{ required: true, message: 'Овог оруулна уу' }]}
        >
          <Input disabled={!isEditing} />
        </Form.Item>

        <Form.Item
          name="firstName"
          label="Нэр"
          rules={[{ required: true, message: 'Нэр оруулна уу' }]}
        >
          <Input disabled={!isEditing} />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Утасны дугаар"
          rules={[
            { required: true, message: 'Утасны дугаар оруулна уу' },
            { pattern: /^[0-9]{8}$/, message: 'Зөв утасны дугаар оруулна уу' },
          ]}
        >
          <Input disabled={!isEditing} />
        </Form.Item>

        <Form.Item
          name="email"
          label="Имэйл"
          rules={[
            { required: true, message: 'Имэйл оруулна уу' },
            { type: 'email', message: 'Зөв имэйл хаяг оруулна уу' },
          ]}
        >
          <Input disabled={!isEditing} />
        </Form.Item>

        <Form.Item name="about" label="Миний тухай">
          <TextArea
            rows={4}
            disabled={!isEditing}
            placeholder="Өөрийнхөө тухай товч танилцуулга бичнэ үү"
          />
        </Form.Item>

        {isEditing && (
          <Form.Item className="mb-0 text-right">
            <Button onClick={() => setIsEditing(false)} className="mr-2">
              Цуцлах
            </Button>
            <Button type="primary" htmlType="submit">
              Хадгалах
            </Button>
          </Form.Item>
        )}
      </Form>
    </Card>
  );
}; 