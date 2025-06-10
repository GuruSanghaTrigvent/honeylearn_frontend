
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Starting create-checkout function");

    const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeSecretKey) {
      console.error("ERROR: STRIPE_SECRET_KEY is not set in environment variables");
      throw new Error("STRIPE_SECRET_KEY is not set in environment variables");
    }
    console.log("STRIPE_SECRET_KEY is configured properly");

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2023-10-16",
    });

    // Get the user information from the request
    const { parentId, email } = await req.json();
    if (!parentId || !email) {
      throw new Error("parentId and email are required");
    }

    console.log(`Creating checkout session for parent ${parentId} with email ${email}`);

    // Create or retrieve a Stripe customer
    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId;
    
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
      console.log(`Found existing customer: ${customerId}`);
    } else {
      const newCustomer = await stripe.customers.create({ email });
      customerId = newCustomer.id;
      console.log(`Created new customer: ${customerId}`);
    }

    const origin = req.headers.get("origin") || "http://localhost:3000";
    console.log(`Using origin: ${origin}`);
    
    // Create a checkout session with a 7-day free trial
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium Subscription",
              description: "Full access to all features",
            },
            unit_amount: 999, // $9.99
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        trial_period_days: 7, // Add a 7-day free trial
      },
      success_url: `${origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/signup`,
      client_reference_id: parentId,
      metadata: {
        parent_id: parentId,
      },
    });

    if (!session || !session.url) {
      throw new Error("Failed to create Stripe checkout session");
    }

    console.log(`Checkout session created: ${session.id}, URL: ${session.url}`);

    // Return the checkout URL to the client
    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
