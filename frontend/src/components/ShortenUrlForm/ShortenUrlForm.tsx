import React, { useState } from 'react';
import { Form, Input, Button, Typography, message, Space } from 'antd';
import { createShortUrl } from '../../api/shortenApi.ts';
import { useShortenStore } from '../../store/shortenStore.ts';
import { CopyOutlined } from '@ant-design/icons';
import styles from './ShortenUrlForm.module.css';

const { Title } = Typography;

export const ShortenUrlForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const shortUrl = useShortenStore((state) => state.shortUrl);
  const setShortUrl = useShortenStore((state) => state.setShortUrl);
  const [copied, setCopied] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: { originalUrl: string; alias?: string }) => {
    setLoading(true);
    setShortUrl(null);
    try {
      const data = await createShortUrl(values);
      setShortUrl(data.shortUrl || '');
      messageApi.open({
        type: 'success',
        content: 'Short URL created!',
      });
    } catch (e: any) {
      messageApi.open({
        type: 'error',
        content: e?.response?.data?.message || 'Error creating short URL',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['shorten-url-form']}>
      {contextHolder}
      <Title level={4} className={styles['shorten-url-form__title']}>
        Shorten a long URL
      </Title>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="originalUrl"
          label="Enter long link here"
          rules={[{ required: true, message: 'Please enter a URL' }]}
        >
          <Input placeholder="Enter long link here" size="large" />
        </Form.Item>
        <div className={styles['shorten-url-form__customize-label']}>
          <span role="img" aria-label="customize">🛠️</span> Customize your link
        </div>
        <Space.Compact className={styles['shorten-url-form__compact']}>
          <Form.Item name="alias" noStyle>
            <Input placeholder="Enter alias" maxLength={20} style={{ width: '100%' }} />
          </Form.Item>
        </Space.Compact>
        <Form.Item className={styles['shorten-url-form__submit-item']}>
          <Button type="primary" htmlType="submit" block loading={loading}>
            Shorten URL
          </Button>
        </Form.Item>
      </Form>
      {shortUrl && (
        <div className={styles['shorten-url-form__short-url-row']}>
          <b>Short URL:</b>
          <span className={styles['shorten-url-form__short-url-value']}>{shortUrl}</span>
          <Button
            onClick={async (e) => {
              if (shortUrl) {
                await navigator.clipboard.writeText(shortUrl);
                messageApi.open({
                  type: 'info',
                  content: 'Message copied to clipboard',
                });
                setCopied(true);
                (e.currentTarget as HTMLButtonElement).blur();
                setTimeout(() => setCopied(false), 500);
              }
            }}
            type="text"
            icon={<CopyOutlined />}
            className={`${styles['shorten-url-form__copy-btn']} ${copied ? styles['copied'] : ''}`}
            tabIndex={0}
          />
        </div>
      )}
    </div>
  );
}; 