import GooglePayButton from '@google-pay/button-react';
import React from 'react';

function GooglePayComponent() {
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
                        merchantName: 'Test Marchent',
                    },
                    transactionInfo: {
                        totalPriceStatus: 'FINAL',
                        totalPriceLabel: 'Total',
                        totalPrice: '1',
                        currencyCode: 'PLN',
                        countryCode: 'PL',
                    },
                    shippingAddressRequired: true,
                    callbackIntents: ['PAYMENT_AUTHORIZATION'],
                }}
                onLoadPaymentData = {paymentRequest => {
                    console.log('Success', paymentRequest);
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