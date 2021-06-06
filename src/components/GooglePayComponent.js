import GooglePayButton from '@google-pay/button-react';
import React from 'react';

const createWalletUpdateBody = (wallet, quantity) => {
    wallet.quantity += Number(quantity);
    return wallet;
  }

const updateWallet = (newWalletBody) => {
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
  }

const prepareWallet = (quantity) => {
    const userName = JSON.parse(sessionStorage.getItem("loggedUser"))?.nickname;
    fetch("http://localhost:5000/Wallets/User/" + userName)
      .then((res) => res.json())
      .then((walletsFromFetch) => {
        return walletsFromFetch.find(
            (wallet) => wallet.name === 'Polish Zloty'
          );
      })
      .then((wallet) => {
          return createWalletUpdateBody(wallet, quantity)
      })
      .then((wallet) => updateWallet(wallet))
      .then(() => window.location.reload());
}

function GooglePayComponent(props) {
    return(
        <>
            <GooglePayButton
                environment = 'TEST'
                paymentRequest = {{
                    apiVersion: 2,
                    apiVersionMinor: 0,
                    allowedPaymentMethods: [
                        {
                            type: 'CARD',
                            parameters: {
                                allowedAuthMethods: ['PAN_ONLY', 'CRYPTOGRAM_3DS'],
                                allowedCardNetworks: ['MASTERCARD', 'VISA'],
                            },
                            tokenizationSpecification: {
                                type: 'PAYMENT_GATEWAY',
                                parameters: {
                                    gateway: 'example',
                                    gatewayMerchantId: 'exampleGatewayMerchantId',
                                }
                            }
                        }
                    ],
                    merchantInfo: {
                        merchantId: '12345678901234567890',
                        merchantName: 'Investing App',
                    },
                    transactionInfo: {
                        totalPriceStatus: 'FINAL',
                        totalPriceLabel: 'Total',
                        totalPrice: props.amount || '1',
                        currencyCode: 'PLN',
                        countryCode: 'PL',
                    },
                    shippingAddressRequired: true,
                    callbackIntents: ['PAYMENT_AUTHORIZATION'],
                }}
                onLoadPaymentData = {paymentRequest => {
                    console.log('Success', paymentRequest);
                    prepareWallet(props.amount * 10);
                }}
                onPaymentAuthorized = {paymentData => {
                    console.log('Payment Authorised Success', paymentData);
                    return {transactionState: 'SUCCESS'};
                }}
                existingPaymentMethodRequired = 'false'
                buttonColor = 'black'
                buttonType = 'buy'
            >
            </GooglePayButton>
        </>
    );
}

export default GooglePayComponent;