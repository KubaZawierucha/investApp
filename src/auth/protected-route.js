// src/auth/protected-route.js

import React from "react";
import { Route } from "react-router-dom";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import Services from "../components/pages/Services";

const ProtectedRoute = ({ component, ...args }) => {
    return (
        <Route
            component={withAuthenticationRequired(component, {
            onRedirecting: () => <Services />,
            })}
            {...args}
        />
    )
};

export default ProtectedRoute;