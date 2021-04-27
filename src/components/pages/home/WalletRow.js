import React from 'react';
import { Grid, Button, Divider  } from "@material-ui/core";

export default function WalletRow(props) {
    const handleBuyOnClick = () => window.alert('You bought ' + props.wallet.name + '!');
    const handleSellOnClick = () => window.alert('You sold ' + props.wallet.name + '!');
    
    return (
        <>
            <div className='mainContainer'>
                <Grid item xs={ 2 }>
                    <p className='gridItem'>{props.wallet.name}</p>
                </Grid>
                <Grid item xs={ 2 }>
                    <p className='gridItem'>{props.wallet.quantity} {props.wallet.symbol}</p>
                </Grid>
                <Grid item xs={ 2 }>
                    <p className='gridItem'>111.20</p>
                </Grid>
                <Grid item xs={ 2 }>
                    <p className='gridItem'>+0.87%</p>
                </Grid>
                <Grid item xs={ 2 }>
                    <Button className='smallButton' onClick={handleBuyOnClick}>Buy</Button>
                    <Button className='smallButton' onClick={handleSellOnClick}>Sell</Button>
                </Grid>
            </div>
            <Divider />
        </>
    );
}