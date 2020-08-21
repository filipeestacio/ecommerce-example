import React, { useState } from "react"
import styled from "styled-components"
import { loadStripe } from "@stripe/stripe-js"

const Button = styled.button`
  font-size: 13px;
  text-align: center;
  color: #000;
  padding: 12px 60px;
  box-shadow: 2px 5px 10px rgba(0, 0, 0, 0.1);
  background-color: rgb(255, 178, 56);
  border-radius: 6px;
  letter-spacing: 1.5px;
`

const DisabledButton = styled(Button)`
  opacity: 0.5;
  cursor: not-allowed;
`

let stripePromise
const getStripe = () => {
  try {
    if (!stripePromise) {
      stripePromise = loadStripe(process.env.STRIPE_KEY)
    }
    return stripePromise
  } catch (error) {
    console.error(error)
  }
}

export const Checkout = () => {
  const [loading, setLoading] = useState(false)

  const redirectToCheckout = async event => {
    event.preventDefault()
    setLoading(true)

    const stripe = await getStripe()
    const { error } = await stripe.redirectToCheckout({
      mode: "payment",
      lineItems: [{ price: "price_1HIWrzDFUFAZTF8goSiBpezc", quantity: 1 }],
      successUrl: `http://localhost:8000/page-2`,
      cancelUrl: `http://localhost:8000`,
    })
    if (error) {
      console.warn("Error:", error)
      setLoading(false)
    }
  }

  return (
    <div>
      {loading ? (
        <DisabledButton>Loading...</DisabledButton>
      ) : (
        <Button onClick={redirectToCheckout}>Buy now!</Button>
      )}
    </div>
  )
}
