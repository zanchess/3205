import React, { useState } from 'react';
import { Menu, Layout } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { LinkOutlined } from '@ant-design/icons';
import './Sidebar.module.css';

const { Sider } = Layout;

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const items = [
    {
      key: '/',
      icon: <LinkOutlined />,
      label: <Link to="/">Create Link</Link>,
    },
  ];

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={200}
      className="sidebar__sider"
    >
      <Menu
        mode="inline"
        theme="dark"
        selectedKeys={[location.pathname]}
        className="sidebar__menu"
        items={items}
      />
    </Sider>
  );
};

export default Sidebar;
