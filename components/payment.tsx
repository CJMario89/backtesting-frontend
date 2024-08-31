import {
  PayPalButtons,
  PayPalHostedField,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';

const Payment = () => {
  const [{ isPending }] = usePayPalScriptReducer();

  return (
    <>
      {isPending ? <div className="spinner" /> : null}
      <PayPalButtons
        createSubscription={(data, actions) => {
          console.log(data);
          return actions.subscription.create({
            plan_id: 'P-2UF78835GJ0895835M6VJ5NI',
          });
        }}
        onApprove={async (data) => {
          alert(`You have successfully subscribed to ${data.subscriptionID}`);
        }}
      />
      <PayPalHostedField
        id="card-number"
        hostedFieldType="number"
        options={{ selector: '#card-number' }}
      />
      <PayPalHostedField
        id="cvv"
        hostedFieldType="cvv"
        options={{ selector: '#cvv' }}
      />
      <PayPalHostedField
        id="expiration-date"
        hostedFieldType="expirationDate"
        options={{
          selector: '#expiration-date',
          placeholder: 'MM/YY',
        }}
      />
    </>
  );
};

export default Payment;
