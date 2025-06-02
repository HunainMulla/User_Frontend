import { loadStripe } from '@stripe/stripe-js';

// Replace with your publishable key
const stripePromise = loadStripe('pk_test_51Qki3JCTFACjR68uzZq4NRHk8iFMm0OHTmm2qG68n22Rw89QmPNa2tPuThN96AQpLO7puzEGuqJo5xVkGKVeaIL3008HZ3EOjv');

export default stripePromise; 