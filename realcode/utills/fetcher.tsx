import axios from 'axios';
import { config } from 'process';
import React from 'react';

const fetcher = (url: string) => {
  axios
    .get(url, {
      withCredentials: true,
    })
    .then((response) => response.data)
    .catch((error) => {
      error;
    });
};

export default fetcher;
