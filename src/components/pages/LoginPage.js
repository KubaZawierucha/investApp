import { Grid } from '@material-ui/core';
import React from 'react';
import AuthenticationButton from '../authentication-button';
import LoginButton from '../login-button';
import SignupButton from '../signup-button';

class LoginPage extends React.Component {
    render() {
        return (
            <div className='mainContainer' style={{'textAlign': 'center'}}>
                <Grid container >
                    <Grid item xs={ 12 }>
                        <h1>INVEST APP</h1>
                    </Grid>
                    <Grid item xs={12} >
                        <br />
                    </Grid>
                    <Grid item xs={ 12 }>
                        <LoginButton />
                    </Grid>
                    <Grid item xs={12} >
                        <br />
                    </Grid>
                    <Grid item xs={ 12 }>
                        <SignupButton />
                    </Grid>
                </Grid>
            </div>
        )
    }
}

export default LoginPage;