import React from 'react';
import { Grid, Divider, FormControl, Select, MenuItem, FormControlLabel, NativeSelect  } from "@material-ui/core";
import '../pages/home/Home.css';
import GooglePayComponent from '../GooglePayComponent';
import WalletRow from './home/WalletRow';

class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: JSON.parse(sessionStorage.getItem('loggedUser')),
            error: null,
            isLoaded: false,
            wallets: [],
            topUpAmount: '1'
        };

        this.handleChange = this.handleChange.bind(this);
      }
    
    componentDidMount() {
        fetch('http://localhost:5000/Wallets/User/' + this.state.user?.nickname)
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

    handleChange(event) {
        const { name, value } = event.target;
    
        this.setState({
          [name]: value,
        });
      }

    render() {
        const { error, isLoaded, wallets } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else if (wallets.length === 0) {
            return (
                <div className='mainContainer'>
                    <h1 style={{backgroundColor: '#fff6e6'}}>You do not have any savings!</h1>
                </div>
            )
        } else {
            const walletRowComponents = wallets.filter(
                wallet => wallet.quantity !== 0
            ).map(wallet => {
                return(
                    <WalletRow key={wallet.id} wallet={wallet} />
                );
            });

            return (
                <div className='mainContianer'>
                    <div className='mainContainer' style={{margin: "10px auto"}}>
                        Account top-up &nbsp;
                        <FormControl>
                            <NativeSelect
                                value={this.state.topUpAmount}
                                onChange={this.handleChange}
                                name="topUpAmount"
                            >
                                <option value="" disabled>
                                    Amount
                                </option>
                                <option value="1">10 zł</option>
                                <option value="5">50 zł</option>
                                <option value="10">100 zł</option>
                            </NativeSelect>
                        </FormControl>
                    </div>
                    <div className='mainContainer' style={{margin: "10px auto"}}>
                        <GooglePayComponent amount={this.state.topUpAmount}></GooglePayComponent>
                    </div>
                    <div>
                        {walletRowComponents}
                    </div>
                </div>
            )
        }
    }
}

export default Home;