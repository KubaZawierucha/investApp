import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  Grid,
  NativeSelect,
  Paper,
} from "@material-ui/core";
import FacebookShareComponent from "../FacebookShareComponent";
import "../pages/home/Home.css"

class TransactionComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      inputCurrency: "",
      inputValue: "",
      inputRatio: 1.0,
      outputCurrency: "",
      outputRatio: 1.0,
      shouldRatioBeRefreshed: true,
      finalRatio: 1.0,
      walletToSellValue: 0,
      walletToBuyValue: 0,
      loggedUser: null,
      currentWalletValue: 0,
      openDialog: false,
      currenciesMappings: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.refreshRatio = this.refreshRatio.bind(this);
    this.confirmTransaction = this.confirmTransaction.bind(this);
    this.mapCurrency = this.mapCurrency.bind(this);

    this.start = 0;

    this.prepareUserData();
  }

  componentDidMount() {
    fetch("http://localhost:5000/Currencies")
    .then((res) => res.json())
    .then((result) => {
      this.setState({
        currenciesMappings: result,
      });
    });
  }

  handleClickOpen = () => {
    this.setState({
      openDialog: true,
    });
  };

  handleClose = () => {
    this.setState({
      openDialog: false,
    });
  };

  handleFloatValueChange = (e) => {
    this.start = e.target.selectionStart;
    let val = e.target.value;
    val = val.replace(/([^0-9.]+)/, "");
    val = val.replace(/^(0|\.)/, "");
    const match = /(\d{0,7})[^.]*((?:\.\d{0,2})?)/g.exec(val);
    const value = match[1] + match[2];
    e.target.value = value;
    this.setState({ inputValue: value });
    if (val.length > 0) {
      e.target.value = Number(value).toFixed(2);
      e.target.setSelectionRange(this.start, this.start);
      this.setState({ inputValue: Number(value).toFixed(2) });
    }
  };

  handleChange(event) {
    const { name, value, type } = event.target;

    this.setState({
      [name]: value,
    });

    if (type === "select-one") {
      this.setState({
        shouldRatioBeRefreshed: true,
      });
    }
  }

  prepareUserData() {
    const userName = JSON.parse(sessionStorage.getItem("loggedUser"))?.nickname;
    fetch("http://localhost:5000/Wallets/User/" + userName)
      .then((res) => res.json())
      .then((walletsFromFetch) => {
        this.setState({
          loggedUser: {
            name: userName,
            wallets: walletsFromFetch,
          },
        });
      });
  }

  getInputCurrencyRatio() {
    return fetch(
      "http://localhost:5000/Values/Details/" + this.state.inputCurrency
    )
      .then((res) => res.json())
      .then((result) => {
        this.setState({
          inputRatio: result.rate,
        });
      });
  }

  getOutputCurrencyRatio() {
    return fetch(
      "http://localhost:5000/Values/Details/" + this.state.outputCurrency
    )
      .then((res) => res.json())
      .then((result) => {
        this.setState({
          outputRatio: result.rate,
        });
      });
  }

  getBothRatios() {
    return Promise.all([
      this.getInputCurrencyRatio(),
      this.getOutputCurrencyRatio(),
    ]);
  }

  refreshRatio() {
    this.getBothRatios().then(() => {
      const finalRatio = this.state.outputRatio / this.state.inputRatio;
      this.setState({
        shouldRatioBeRefreshed: false,
        finalRatio: finalRatio,
      });
    });
    this.setCurrentWalletValue();
  }

  setCurrentWalletValue() {
    const walletValue = this.state.loggedUser?.wallets.find(
      (wallet) => wallet.currencyID === this.state.inputCurrency
    );

    this.setState({
      currentWalletValue: !walletValue?.quantity ? 0 : walletValue?.quantity,
    });
  }

  confirmTransaction() {
    const inputValue = Number(this.state.inputValue);
    const outputValue =
      Math.round(inputValue * this.state.finalRatio * 100) / 100;

    const currentWalletValue = Number(this.state.currentWalletValue);
    const valueToBuy = Number(this.state.walletToBuyValue);

    if (inputValue <= currentWalletValue) {
      const transactionBody = this.createTransactionBody(outputValue);
      this.saveTransactionInTheDb(transactionBody);
      const decreaseWalletValue = this.createWalletUpdateBody(
        this.state.inputCurrency,
        -inputValue
      );
      const increaseWalletValue = this.createWalletUpdateBody(
        this.state.outputCurrency,
        outputValue
      );
      this.updateWallet(decreaseWalletValue);
      this.updateWallet(increaseWalletValue);

      this.setState({
        walletToBuyValue: outputValue
      })

      this.handleClickOpen();
    } else {
      console.log("not enough money");
      alert("not enough money")
    }
  }

  createTransactionBody(outputValue) {
    return {
      userId: this.state.loggedUser?.name,
      boughtCurrencyId: this.state.outputCurrency,
      boughtCurrencyQuantity: outputValue,
      soldCurrencyId: this.state.inputCurrency,
      soldCurrencyQuantity: Number(this.state.inputValue),
    };
  }

  createWalletUpdateBody(currencyId, quantity) {
    const walletToUpdate = this.state.loggedUser?.wallets.find(
      (wallet) => wallet.currencyID === currencyId
    );
    walletToUpdate.quantity += Number(quantity);
    walletToUpdate.quantity = Math.round(walletToUpdate?.quantity * 100) / 100;

    return walletToUpdate;
  }

  saveTransactionInTheDb(transactionBody) {
    fetch("http://localhost:5000/Transactions/Create", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionBody),
    }).then(console.log("transaction saved"));
  }

  updateWallet(newWalletBody) {
    console.log(newWalletBody);
    fetch("http://localhost:5000/Wallets/Edit", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(newWalletBody),
    })
      .then(console.log("wallet updated"))
      .then(this.refreshRatio());
  }

  mapCurrency(id) {
    const currencyObject = this.state.currenciesMappings?.find(
      currency => currency.currencyID === id
    )

    return currencyObject?.name;
  }

  render() {
    const selectOptions = this.state.currenciesMappings?.map(
      currency => <option value={currency.currencyID}>{currency.name}</option>
    )

    return (
      <>
        <p className="gridItem">
          You can sell: {this.state.currentWalletValue}
        </p>

        <Paper style={{width: "80%", margin: "10px auto"}}>
          <div className="mainContainer" style={{width: "80%", margin: "10px auto"}}>
            <Grid item xs={3}>
              <p className="gridItem">You sell</p>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={3}>
              <p className="gridItem">You receive</p>
            </Grid>
          </div>

          <div className="mainContainer" style={{width: "80%", margin: "10px auto"}}>
            <Grid item xs={3}>
              <FormControl>
                <NativeSelect
                  value={this.state.inputCurrency}
                  onChange={this.handleChange}
                  name="inputCurrency"
                >
                  <option value="" disabled>
                    To sell...
                  </option>
                  {/* <option value="Polish Zloty">Polish Złoty</option>
                  <option value="US Dolar">US Dolar</option>
                  <option value="Gold">Gold</option>
                  <option value="Bitcoin">Bitcoin</option> */}
                  {selectOptions}
                </NativeSelect>
              </FormControl>
            </Grid>
            <Grid item xs={4}></Grid>
            <Grid item xs={3}>
              <FormControl>
                <NativeSelect
                  value={this.state.outputCurrency}
                  onChange={this.handleChange}
                  name="outputCurrency"
                >
                  <option value="" disabled>
                    To buy...
                  </option>
                  {/* <option value="Polish Zloty">Polish Złoty</option>
                  <option value="US Dolar">US Dolar</option>
                  <option value="Gold">Gold</option>
                  <option value="Bitcoin">Bitcoin</option> */}
                  {selectOptions}
                </NativeSelect>
              </FormControl>
            </Grid>
          </div>
          <div className="mainContainer" style={{width: "80%", margin: "10px auto"}}>
            <Grid item xs={3}>
              <input
                type="text"
                onChange={this.handleFloatValueChange}
                value={this.state.inputValue}
                placeholder="0.00"
              ></input>
            </Grid>
            <Grid item xs={4}>
              <p className="gridItem">---------------------{">"}</p>
            </Grid>
            <Grid item xs={3}>
              {this.state.shouldRatioBeRefreshed ? (
                <button
                  onClick={this.refreshRatio}
                  disabled={
                    this.state.inputCurrency === "" ||
                    this.state.outputCurrency === ""
                  }
                  style={{ padding: "15px", marginLeft: "15px" }}
                >
                  REFRESH RATIO
                </button>
              ) : (
                <p className="gridItem">
                  {Math.round(
                    this.state.inputValue * this.state.finalRatio * 100
                  ) / 100}
                </p>
              )}
            </Grid>
          </div>
          <div className="mainContainer" style={{ textAlign: "center", width: "80%", margin: "40px auto" }}>
            <Grid items xs={12}>
              <button
                disabled={this.state.shouldRatioBeRefreshed}
                style={{ padding: "15px" }}
                onClick={this.confirmTransaction}
              >
                CONFIRM
              </button>
            </Grid>
          </div>
        </Paper>

        <Dialog
          open={this.state.openDialog}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Success!"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              You bought {this.state.walletToBuyValue} {this.mapCurrency(this.state.outputCurrency)} for{" "}
              {this.state.inputValue} {this.mapCurrency(this.state.inputCurrency)}! Do you
              want to share it?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <FacebookShareComponent
              soldValue={this.state.inputValue}
              soldCurrency={this.mapCurrency(this.state.inputCurrency)}
              boughtValue={this.state.walletToBuyValue}
              boughtCurrency={this.mapCurrency(this.state.outputCurrency)}
            />
            <br />
          </DialogActions>
        </Dialog>
      </>
    );
  }
}

export default TransactionComponent;
