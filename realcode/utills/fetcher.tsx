import axios from 'axios';
import React from 'react';

const fetcher = <Data,>(url: string): any => {
  const A = axios
    .get<Data>(url, {
      withCredentials: true,
    })
    .then((response) => response.data);

  return A;
};

export default fetcher;
