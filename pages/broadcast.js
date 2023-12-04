import React from 'react';
import dynamic from 'next/dynamic';
import RouterContext from '../context/RouterContext';
const BroadcastPage = dynamic(() => import('../containers/live-stream-tabs/broadcastForm/brodcastPage'), { ssr: false });

const broadcast = (props) => {
  return (
    <RouterContext forLogin={true} forUser={false} forCreator={true} forAgency={true} {...props}>
      <BroadcastPage />
    </RouterContext>
  )
};

export default broadcast;
