import React from 'react';
import { FormControl, FormHelperText, Grid, NativeSelect, TextField } from '@material-ui/core';
import InputMask from 'react-input-mask';

class TransactionComponent extends React.Component {
    constructor() {
        super();
        this.state = {
            inputCurrency: '',
            inputValue: 1,
            inputRatio: 1.0,
            outputCurrency: '',
            outputRatio: 1.0,
            shouldRatioBeRefreshed: true,
            finalRatio: 1.0,
            walletToSellValue: 0,
            walletToBuyValue: 0,
            loggedUser: null,
            currentWalletValue: 0
        };
        this.handleChange = this.handleChange.bind(this);
        this.refreshRatio = this.refreshRatio.bind(this);
        this.confirmTransaction = this.confirmTransaction.bind(this);

        this.prepareUserData();
    }

    handleChange(event) {
        const {name, value, type} = event.target;

        this.setState({
            [name]: value,
        });

        if (type === 'select-one') {
            this.setState({
                shouldRatioBeRefreshed: true,
            })
        }
    }

    prepareUserData() {
        const userName = JSON.parse(sessionStorage.getItem('loggedUser'))?.nickname;
        fetch('http://localhost:50666/Wallets/User/' + userName)
        .then(res => res.json())
        .then(walletsFromFetch => {
            this.setState({
                loggedUser: {
                    name: userName,
                    wallets: walletsFromFetch
                }
            })
        })
    }

    getInputCurrencyRatio() {
        return (
            fetch('http://localhost:50866/Values/Details/' + this.state.inputCurrency)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        inputRatio: result.rate,
                    });
                }
            )
        )
    }

    getOutputCurrencyRatio() {
        return (
            fetch('http://localhost:50866/Values/Details/' + this.state.outputCurrency)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        outputRatio: result.rate,
                    });
                }
            )
        );
    }

    getBothRatios() {
        return Promise.all([this.getInputCurrencyRatio(), this.getOutputCurrencyRatio()])
    }

    refreshRatio() {
        this.getBothRatios()
        .then(
            () => {
                const finalRatio = this.state.outputRatio / this.state.inputRatio;
                this.setState({
                    shouldRatioBeRefreshed: false,
                    finalRatio: finalRatio
                })
            }
        );
        this.setCurrentWalletValue();
    }

    setCurrentWalletValue() {
        const walletValue = this.state.loggedUser?.wallets.find(
            wallet => wallet.name === this.state.inputCurrency
        )

        this.setState({
            currentWalletValue: !walletValue?.quantity ? 0 : walletValue?.quantity
        });
    }

    confirmTransaction() {
        const finalRatio = this.state.outputRatio / this.state.inputRatio * 100
        const output = Math.round(this.state.inputValue * finalRatio * 100) / 100;

        if (Number(this.state.inputValue) <= this.state.walletToSellValue) {
            this.setState({
                walletToSellValue: Number(this.state.walletToSellValue) - Number(this.state.inputValue),
                walletToBuyValue: Number(this.state.walletToBuyValue) + Number(output),
            })
            window.alert('You sold ' + this.state.inputValue + ' ' + this.state.inputCurrency + ' for ' + output + ' ' + this.state.outputCurrency);
        } else {
            window.alert('Not enought money!');
        }

        }

    render() {
        return(
            <>
                <h1>You can sell: {this.state.currentWalletValue}</h1>
                <div className='mainContainer'>
                    <Grid item xs={ 2 }>
                        <p className='gridItem'>You sell</p>
                    </Grid>
                    <Grid item xs={ 4 }>
                    </Grid>
                    <Grid item xs={ 2 }>
                        <p className='gridItem'>You receive</p>
                    </Grid>
                </div>
                <div className='mainContainer'>
                    <Grid item xs={ 2 }>
                        <FormControl>
                            <NativeSelect
                                value={this.state.inputCurrency}
                                onChange={this.handleChange}
                                name="inputCurrency"
                                // className={classes.selectEmpty}
                                // inputProps={{ 'aria-label': 'age' }}
                            >
                            <option value='' disabled>To sell...</option>
                            <option value='Polish Zloty'>Polish Złoty</option>
                            <option value='US Dolar'>US Dolar</option>
                            <option value='Gold'>Gold</option>
                            <option value='Bitcoin'>Bitcoin</option>
                            </NativeSelect>
                        </FormControl>
                    </Grid>
                    <Grid item xs={ 4 }>
                    </Grid>
                    <Grid item xs={ 2 }>
                        <FormControl >
                            <NativeSelect
                                value={this.state.outputCurrency}
                                onChange={this.handleChange}
                                name="outputCurrency"
                                // className={classes.selectEmpty}
                                // inputProps={{ 'aria-label': 'age' }}
                            >
                            <option value='' disabled>To buy...</option>
                            <option value='Polish Zloty'>Polish Złoty</option>
                            <option value='US Dolar'>US Dolar</option>
                            <option value='Gold'>Gold</option>
                            <option value='Bitcoin'>Bitcoin</option>
                            </NativeSelect>
                        </FormControl>
                    </Grid>
                </div>
                <div className='mainContainer'>
                    <Grid item xs={ 2 }>
                    <InputMask 
                        mask="9999999999.99" 
                        maskChar={null} 
                        value={this.state.inputValue} 
                        onChange={this.handleChange} 
                        name='inputValue'
                    />
                    </Grid>
                    <Grid item xs={ 4 }>
                        <p className="gridItem">---------------------{'>'}</p>
                    </Grid>
                    <Grid item xs={ 2 }>
                        {this.state.shouldRatioBeRefreshed ? 
                            <button onClick={this.refreshRatio} disabled={this.state.inputCurrency === '' || this.state.outputCurrency === ''} style={{padding: '15px', marginLeft: '15px'}} >REFRESH RATIO</button> :
                            <p className='gridItem'>{Math.round(this.state.inputValue * this.state.finalRatio * 100) / 100}</p>
                        }
                    </Grid>
                </div>
                <div className='mainContainer' style={{textAlign: "center"}}>
                    <Grid items xs={ 12 }>
                        <button 
                            disabled={this.state.shouldRatioBeRefreshed} 
                            style={{padding: '15px'}} 
                            onClick={this.confirmTransaction}    
                        >CONFIRM</button>
                    </Grid> 
                </div>
                <h1>{this.state.inputCurrency} FOR {this.state.inputRatio}</h1>
                <h1>{this.state.outputCurrency} FOR {this.state.outputRatio}</h1>
                <h1>Final ratio: {this.state.finalRatio}</h1>
            </>
        )
    }
}

export default TransactionComponent;