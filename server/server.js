require('dotenv').config({ path: './.env' });

const express = require('express');
const app = express();
const { resolve } = require('path');
const db = require('./database');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-08-01',
});

app.use(express.json());
app.use(express.static(process.env.STATIC_DIR));

app.get('/', (req, res) => {
  const path = resolve(process.env.STATIC_DIR + '/index.html');
  res.sendFile(path);
});

app.get('/config', (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.post('/payments', async (req, res) => {
  try {
    db.getInstance().addPayment(req.body.id, { ...req.body });
    res.sendStatus(202);
  } catch(e) {
    return res.status(400).send({
      error: { message: e.message }
    });
  }
});

app.post('/webhook', async (req, res) => {
  const event = req.body;

  switch (event.type) {
    case 'payment_intent.succeeded':
      db.getInstance().updatePayment(event.data.object.id, event.data.object)
      break;
    default: console.debug(`Unsupported event received, type ${event.type}`);
  }

  res.status(200).send({ received: true });
});

app.post('/create-payment-intent', async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      currency: 'EUR',
      amount: req.body.amount,
      automatic_payment_methods: { enabled: true },
    });

    // Send publishable key and PaymentIntent details to client
    res.send({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id
    });
  } catch (e) {
    return res.status(400).send({
      error: { message: e.message }
    });
  }
});

app.listen(5252, () =>
  console.log(`Node server listening at http://localhost:5252`)
);
