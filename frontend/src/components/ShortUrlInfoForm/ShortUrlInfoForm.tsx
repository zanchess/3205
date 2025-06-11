import React, { useState } from 'react';
import { Form, Input, Button, Typography, Descriptions, message, Tooltip } from 'antd';
import { getShortUrlInfo, deleteShortUrl, getAnalytics } from '../../api/shortenApi.ts';
import { DeleteFilled } from '@ant-design/icons';
import styles from './ShortUrlInfoForm.module.css';
import { useShortenStore } from '../../store/shortenStore.ts';

const { Title } = Typography;

export const ShortUrlInfoForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const info = useShortenStore((state) => state.info);
  const setInfo = useShortenStore((state) => state.setInfo);
  const analytics = useShortenStore((state) => state.analytics);
  const setAnalytics = useShortenStore((state) => state.setAnalytics);
  const clearInfoAndAnalytics = useShortenStore((state) => state.clearInfoAndAnalytics);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: { shortUrl: string }) => {
    setLoading(true);
    clearInfoAndAnalytics();
    try {
      const encoded = encodeURIComponent(values.shortUrl);
      const data = await getShortUrlInfo(encoded);
      setInfo(data);
      const analyticsData = await getAnalytics(encoded);
      setAnalytics(analyticsData);
      messageApi.open({
        type: 'success',
        content: 'Short URL info received!',
      });
    } catch (e: any) {
      messageApi.open({
        type: 'error',
        content: e?.response?.data?.message || 'Error getting short URL info',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={styles['short-url-info-form']}
    >
      {contextHolder}
      <Title level={4} className="short-url-info-form__title">
        Short URL Information
      </Title>
      <Form form={form} layout="vertical" onFinish={onFinish} className="short-url-info-form__form">
        <Form.Item
          name="shortUrl"
          label="Enter short URL"
          rules={[{ required: true, message: 'Please enter a short URL' }]}
        >
          <Input placeholder="Short URL" size="large" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Get Information
          </Button>
        </Form.Item>
      </Form>
      {info && (
        <>
          <Descriptions title="Analytics:" bordered column={1} size="small" className={styles['short-url-info-form__desc']}>
            {Object.entries(info).map(([key, value]) => (
              <Descriptions.Item label={key} key={key}>
                {String(value)}
              </Descriptions.Item>
            ))}
          </Descriptions>
          {analytics && (
            <Descriptions title="Last IP adresses:" bordered column={1} size="small" className={styles['short-url-info-form__desc']}>
              {Object.entries(analytics).map(([key, value]) => {
                if (key !== 'clickCount') {
                  return (
                    <Descriptions.Item label={key} key={key}>
                      {String(value)}
                    </Descriptions.Item>
                  );
                }
              })}
            </Descriptions>
          )}
          <Tooltip title="Delete link">
            <Button
              danger
              type="text"
              icon={<DeleteFilled />}
              className={styles['short-url-info-form__delete-btn']}
              onClick={async () => {
                try {
                  setLoading(true);
                  const urlToDelete = form.getFieldValue('shortUrl');
                  const encodedUrl = encodeURIComponent(urlToDelete);
                  await deleteShortUrl(encodedUrl);
                  clearInfoAndAnalytics();
                  messageApi.open({
                    type: 'success',
                    content: 'Short URL deleted successfully',
                  });
                } catch (e: any) {
                  messageApi.open({
                    type: 'error',
                    content: e?.response?.data?.message || 'Error deleting link',
                  });
                } finally {
                  setLoading(false);
                }
              }}
            />
          </Tooltip>
        </>
      )}
    </div>
  );
}; 