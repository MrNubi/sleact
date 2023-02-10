import { IUser } from '@typings/db';
import axios from 'axios';
import { config } from 'process';
import React from 'react';
import { Fetcher } from 'swr';

const fetcher = <Data,>(url: string): any => {
  axios.get<Data>(url, { withCredentials: true }).then((response) => response.data);
};

export default fetcher;
