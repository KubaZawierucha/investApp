import React from 'react';
import './Button.css';
import { Link } from 'react-router-dom';
import AuthNav from '../auth-nav';

export function Button() {
    return (
        // <Link to='sign-up'>
        //     <button className='btn'>
        //         Sign Out
        //     </button>
        // </Link>
        <AuthNav />
    );
}