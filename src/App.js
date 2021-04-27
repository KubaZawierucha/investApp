import './App.css';
import { store } from './actions/store';
import Users from './components/Users';
import { Provider } from 'react-redux'
import { Container } from '@material-ui/core';
import { ToastProvider } from 'react-toast-notifications';
import { Grid } from '@material-ui/core';
import Navbar from './components/menu/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Marketing from './components/pages/Marketing';
import SignUp from './components/pages/SignUp';
import ContactUs from './components/pages/ContactUs';
import Products from './components/pages/Products';
import Services from './components/pages/Services';
import Home from './components/pages/home/Home';
import Consulting from './components/pages/Consulting';
import { useAuth0 } from '@auth0/auth0-react';
import Profile from "./profile";
import ProtectedRoute from './auth/protected-route';
import LoginPage from './components/pages/loginPage/LoginPage';

function App() {
  const { isLoading, isAuthenticated, user } = useAuth0();

  if (isLoading) {
    return <Services />;
  }

  if  (!isAuthenticated) {
    return <LoginPage />;
  } else {
    sessionStorage.setItem('loggedUser', JSON.stringify(user));
    // console.log(localStorage.getItem('loggedUser'));
  }

  return (
    <Provider store = { store }>
      <Router>
        <Navbar />
        <Switch>
          <Route path='/' exact component={Home} />
          <Route path='/login' exact component={LoginPage} />
          <ProtectedRoute path='/profile' component={Profile} />
          <ProtectedRoute path='/services' exact component={Services} />
          <ProtectedRoute path='/products' exact component={Products} />
          <ProtectedRoute path='/contact-us' exact component={ContactUs} />
          <ProtectedRoute path='/sign-up' exact component={SignUp} />
          <ProtectedRoute path='/marketing' exact component={Marketing} />
          <ProtectedRoute path='/consulting' exact component={Consulting} />
          <ProtectedRoute path='/users' exact component={Users} />
        </Switch>
      </Router>
      <ToastProvider autoDissmiss={true}>
      </ToastProvider>
    </Provider>
  );
}

export default App;
