import React from 'react';
import { ShortenUrlForm } from '../components/ShortenUrlForm/ShortenUrlForm';
import { ShortUrlInfoForm } from '../components/ShortUrlInfoForm/ShortUrlInfoForm';
import styles from './ShortenPage.module.css';

const ShortenPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <ShortenUrlForm />
      <ShortUrlInfoForm />
    </div>
  );
};

export default ShortenPage; 