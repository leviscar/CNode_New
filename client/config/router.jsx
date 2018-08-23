import React from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
// import TestApi from '../view/test-api/index';

export default () => [
    <BrowserRouter>
        {/* <Route path="/" key="testApi" component={TestApi} />, */}
        <li><Link to="/about">About</Link></li>
        <li><Link to="/inbox">Inbox</Link></li>
    </BrowserRouter>,

];
