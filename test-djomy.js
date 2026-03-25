import CryptoJS from 'crypto-js';

const clientId = 'djomy-client-1772897922627-6eec';
const clientSecret = 's3cr3t-k9x_JotrndOpLJBWzpq_xXdhp0PwB5o_';
const apiUrl = 'https://sandbox-api.djomy.africa';

async function test() {
  const hash = CryptoJS.HmacSHA256(clientId, clientSecret);
  const signature = hash.toString(CryptoJS.enc.Hex);
  const apiKeyHeader = `${clientId}:${signature}`;

  // 1. Auth
  const authResponse = await fetch(`${apiUrl}/v1/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKeyHeader,
    },
    body: JSON.stringify({})
  });
  
  const authData = await authResponse.json();
  const token = authData.data?.accessToken || authData.accessToken || authData.token;

  // 2. Gateway Payload
  const payload = {
    amount: 6336000,
    countryCode: "GN",
    payerNumber: "00923165034481",
    description: "Order Payment",
    merchantPaymentReference: `ORD-${Date.now()}`,
    returnUrl: "https://lvh.me:5173/checkout/success",
    cancelUrl: "https://lvh.me:5173/checkout/cart",
  };

  const response = await fetch(`${apiUrl}/v1/payments/gateway`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKeyHeader,
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  const text = await response.text();
  console.log("Gateway Response:", text);
}

test();
