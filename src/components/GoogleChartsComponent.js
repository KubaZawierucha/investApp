import { FormControl, Grid, NativeSelect } from "@material-ui/core";
import NativeSelectInput from "@material-ui/core/NativeSelect/NativeSelectInput";
import React from "react";
import Chart from "react-google-charts";
import "./pages/home/Home.css";

class GoogleChartsComponent extends React.Component {
  constructor() {
    super();
    this.state = {
      currencies: null,
      selectedCurrency: "Polish Zloty",
      currenciesMappings: null,
    };
    this.getOnlyOneCurrencySorted = this.getOnlyOneCurrencySorted.bind(this);
    this.prepareDataToChart = this.prepareDataToChart.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:5000/Currencies")
      .then((res) => res.json())
      .then((result) => {
        this.setState({
          currenciesMappings: result,
        });
      });

    fetch("http://localhost:5000/Values")
      .then((res) => res.json())
      .then((result) => {
        this.setState({
          currencies: result,
        });
      });
  }

  getOnlyOneCurrencySorted(name) {
    const currencyId = this.state.currenciesMappings?.find(
      currency => currency.name === name
    );

    const toReturn = this.state.currencies?.filter(
      (currency) => currency.currencyID === currencyId.currencyID
    );
    toReturn?.sort((a, b) =>
      a.timestamp > b.timestamp
        ? 1
        : a.timestamp === b.timestamp
        ? a.timestamp > b.timestamp
          ? 1
          : -1
        : -1
    );
    return toReturn;
  }

  handleChange(event) {
    const { name, value } = event.target;

    this.setState({
      [name]: value,
    });
  }

  prepareDataToChart(currency) {
    const currencies = this.getOnlyOneCurrencySorted(currency);
    const data = currencies?.map((currency) => [
      currency.timestamp.substring(),
      currency.rate,
    ]);
    data?.unshift(["x", currency]);
    console.log(data);
    return data;
  }

  render() {
    const selectOptions = this.state.currenciesMappings?.map(
      currency => <option value={currency.name}>{currency.name}</option>
    )

    return (
      <>
        <Grid
          className="mainContainer"
          style={{ width: "80%", margin: "10px auto" }}
          item
          xs={12}
        >
          <FormControl>
            <NativeSelect
              value={this.state.selectedCurrency}
              onChange={this.handleChange}
              name="selectedCurrency"
            >
              <option value="" disabled>
                Currency
              </option>
              {selectOptions}
            </NativeSelect>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <div
            className="mainContainer"
            style={{ width: "80%", margin: "10px auto" }}
          >
            <Chart
              width={"1000px"}
              height={"600px"}
              chartType="LineChart"
              loader={<div>Loading Chart</div>}
              data={this.prepareDataToChart(this.state.selectedCurrency)}
              options={{
                hAxis: {
                  title: "Time",
                },
                vAxis: {
                  title: "Ratio",
                },
                curveType: "function",
              }}
            />
          </div>
        </Grid>
      </>
    );
  }
}

export default GoogleChartsComponent;
