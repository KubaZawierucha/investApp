import './App.css';
import Navbar from './components/menu/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Marketing from './components/pages/Marketing';
import SignUp from './components/pages/SignUp';
import Home from './components/pages/home/Home';
import { useAuth0 } from '@auth0/auth0-react';
import Profile from "./profile";
import ProtectedRoute from './auth/protected-route';
import LoginPage from './components/pages/loginPage/LoginPage';
import AuthenticationConfirmation from './auth/authenticationConfirmation';
import TransactionComponent from './components/pages/TransactionComponent';
import LoadingComponent from './components/pages/LoadingComponent';

function App() {
  const { isLoading, isAuthenticated, user } = useAuth0();

  if (isLoading) {
    return <LoadingComponent />;
  }

  if  (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/login' exact component={LoginPage} />
          <ProtectedRoute path='/profile' component={Profile} />
          <ProtectedRoute path='/loading' exact component={LoadingComponent} />
          <ProtectedRoute path='/sign-up' exact component={SignUp} />
          <ProtectedRoute path='/my-profile' exact component={Marketing} />
          <ProtectedRoute path='/auth-confirm' component={AuthenticationConfirmation} />
          <ProtectedRoute path='/transactions' component={TransactionComponent} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
