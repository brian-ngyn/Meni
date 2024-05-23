import type { NextApiRequest, NextApiResponse } from "next";

// This is your test secret API key.
import { stripeHandler } from "~/server/api/REST/stripe-handler";

export type StripeHandlerResponseData = {
  received: boolean;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<StripeHandlerResponseData>,
) {
  if (req.method !== "POST") {
    res.status(405).end(); // Method Not Allowed
    return;
  }
  void stripeHandler(req, res);
}
