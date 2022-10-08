import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function PrivateComponent() {
  const accessToken = localStorage.getItem('accessToken');
  console.log('accessToken: ', accessToken);
  return accessToken ? <Outlet /> : <Navigate to="/" />;
}

export default PrivateComponent;
