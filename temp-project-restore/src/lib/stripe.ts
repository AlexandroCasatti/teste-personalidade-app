import { loadStripe } from '@stripe/stripe-js'

// Inicializar Stripe com a chave publicável
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default stripePromise