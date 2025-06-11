import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Layout } from 'antd';
import Sidebar from './components/Sidebar/Sidebar.tsx';
import ShortenPage from './pages/ShortenPage';

function App() {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh'}}>
        <Sidebar />
        <Layout style={{ width: '100%', padding: '32px'}}>
          <Routes>
            <Route path="/" element={<ShortenPage />} />
          </Routes>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App; 