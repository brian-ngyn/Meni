import type { NextApiRequest, NextApiResponse } from "next";
// This is your test secret API key.
import { Stripe } from "stripe";

import { StripeHandlerResponseData } from "~/pages/api/stripe";
import { db } from "~/server/db";

const stripe = new Stripe(
  "sk_test_51PCFTR07WFzCJDijv0QAqIfkqecETirz2QEdHCSn4KOB8TNNv9bUAATuw7IwYsv4oFjnYBwXU4sxFTBy6W2PUDzx00wAjrMFGd",
);

// Replace this endpoint secret with your endpoint's unique secret
// If you are testing with the CLI, find the secret by running 'stripe listen'
// If you are using an endpoint defined with the API or dashboard, look in your webhook settings
// at https://dashboard.stripe.com/webhooks
const endpointSecret = "whsec_...";

export const stripeHandler = (
  req: NextApiRequest,
  res: NextApiResponse<StripeHandlerResponseData>,
) => {
  let event: Stripe.Event = req.body;

  // Only verify the event if you have an endpoint secret defined.
  // Otherwise use the basic event deserialized with JSON.parse
  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = req.headers["stripe-signature"] as string;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret,
      );
    } catch (err: any) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      res.status(400);
    }
  }

  const meniTerminationOfPaymentProcess = () => {
    // TODO Update Clerk and DB tables to set isPaid to false
  };
  const meniSuccessfulPaymentProcess = () => {
    // TODO Update Clerk and DB tables with current active subscription and set isPaid to true
  };
  const menuPaymentMetaDataUpdateProcess = () => {
    // TODO Update Clerk and DB tables with relevant information from stripe
  };

  // IMPORTANT EVENTS WE CARE ABOUT @ MENI
  // NOTE: This is only a partial list picked by Ideen when he was sleep deprived. It may be missing more important events
  // Refer for full list and meaning: https://docs.stripe.com/api/events/types
  switch (event.type) {
    // GOOD SITUATION EVENTS
    case "customer.subscription.created":
    case "customer.subscription.resumed":
    case "customer.subscription.updated":
      meniSuccessfulPaymentProcess();
      menuPaymentMetaDataUpdateProcess();
      break;
    case "payment_intent.succeeded":
      meniSuccessfulPaymentProcess();
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      break;

    // NOT SURE WE CARE EVENTS!!!? Maybe we do
    case "payment_method.attached":
      menuPaymentMetaDataUpdateProcess();
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;

    // BAD SITUATION EVENTS
    case "customer.subscription.deleted":
    case "customer.subscription.paused":
      meniTerminationOfPaymentProcess();
      menuPaymentMetaDataUpdateProcess();
      break;
    case "payment_intent.payment_failed":
      meniTerminationOfPaymentProcess();
      const failed = event.data.object;
      console.log(`PaymentIntent for ${failed.amount} failed!`);

      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }

  // Return a response to acknowledge receipt of the event

  res.status(200).json({ received: true });
};
