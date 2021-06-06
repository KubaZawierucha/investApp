import React from 'react';
import { Grid, Button, Divider, Paper, Link  } from "@material-ui/core";

export default function WalletRow(props) {
    return (
        <Grid>
            <Paper className='mainContainer' style={{margin: "20px auto"}}>
                <Grid item xs={ 4 }>
                    <p className='gridItem'>{props.wallet.name}</p>
                </Grid> 
                <Grid item xs={ 4 }>
                    <p className='gridItem'>{props.wallet.quantity} {props.wallet.symbol}</p>
                </Grid>
                <Grid item xs={ 4 }>
                    <Link href="/transactions" style={{textDecoration: 'none', color: "inherit"}}>
                        <Button className='smallButton' style={{padding: '10px 45px'}}>
                            Buy
                        </Button>
                    </Link>
                </Grid>
            </Paper>
        </Grid>
    );
}