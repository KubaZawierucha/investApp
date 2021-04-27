import React from 'react';
import { Grid, Divider, FormControl, Select, MenuItem  } from "@material-ui/core";
import './Home.css';
import WalletRow from './WalletRow';
import { useAuth0 } from '@auth0/auth0-react';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(sessionStorage.getItem('loggedUser')),
            error: null,
            isLoaded: false,
            wallets: [],
        };
      }
    
    componentDidMount() {
        fetch('http://localhost:50666/Wallets/User/' + this.state.user?.nickname)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        wallets: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            );
    }

    render() {
        const { error, isLoaded, wallets } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            const walletRowComponents = wallets.map(wallet => {
                return(
                    <WalletRow key={wallet.id} wallet={wallet} />
                );
            });

            return (
                <div className='mainMainContianer'>
                    <div className='mainContainer'>
                        <Grid item xs={ 2 }>
                            <FormControl>
                                <Select defaultValue={0}>
                                    <MenuItem className='menuItemHeader' value={0}>favourite only</MenuItem>
                                </Select>
                        </FormControl>
                        </Grid>
                        <Grid item xs={ 2 }>
                            <FormControl>
                                <Select defaultValue={0}>
                                    <MenuItem className='menuItemHeader' value={0}>amount owned</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={ 2 }>
                            <FormControl>
                                <Select defaultValue={0}>
                                    <MenuItem className='menuItemHeader' value={0}>latest price</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={ 2 }>
                            <FormControl>
                                <Select defaultValue={0}>
                                    <MenuItem className='menuItemHeader' value={0}>price increase</MenuItem>
                                </Select>
                        </FormControl>
                        </Grid>
                        <Grid item xs={ 2 }>
                        </Grid>
                    </div>
                    <Divider  />
                    {walletRowComponents}
                </div>
            )
        }
    }
}

export default Home;