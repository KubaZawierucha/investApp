import { useAuth0 } from '@auth0/auth0-react';
import React from 'react';
import { Redirect } from 'react-router';

const createUserInTheDB = (user) => {
    fetch('http://localhost:5000/Users/Create/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "Id": user.nickname,
            "Login": user.name,
            "Email": user.email
        })
      }).then(
        console.log("user created")
      );
}

function AuthenticationConfirmation() {
    
        const { user } = useAuth0();
        const userFromSession = sessionStorage.getItem('loggedUser');

        if (!userFromSession) {
            fetch('http://localhost:5000/Users/Details/' + user?.nickname)
            .then(res => {
                if (res.ok) {
                    return res.json()
                } else if (res.status === 404) {
                    createUserInTheDB(user);
                } else {
                    return Promise.reject('something went wrong')
                }
            })
            .then(
                sessionStorage.setItem('loggedUser', JSON.stringify(user))
            );
        }

        return <Redirect to="/" push />;
}

export default AuthenticationConfirmation;