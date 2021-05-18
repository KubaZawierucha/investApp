import { Grid } from '@material-ui/core';
import React from 'react';
import LoginButton from '../../../auth/login-button';
import SignupButton from '../../../auth/signup-button';
import './LoginPage.css';

class LoginPage extends React.Component {
    render() {
        return (
            <div className='main-container'>
                <Grid container className='grid-container'>
                    <Grid item className='grid-row' xs={ 12 }>
                        <h1>Welcome<br />to<br />INVEST APP</h1>
                    </Grid>
                    <Grid item className='grid-row' xs={ 6 }>
                        <LoginButton />
                    </Grid>
                    <Grid item className='grid-row' xs={ 6 }>
                        <SignupButton />
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default LoginPage;