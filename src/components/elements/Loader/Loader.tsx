import React from 'react';
import './Loader.scss';

interface Props {
  loading: boolean;
}

const Loader: React.FC<Props> = ({ loading }) => {
  return (
    <div className={`loader ${loading ? '-loading' : ''}`}>
      <div className="ldio">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loader;
