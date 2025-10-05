"use client"

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CreditCard, Lock } from 'lucide-react'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface CheckoutFormProps {
  amount: number
  onSuccess: () => void
  onError: (error: string) => void
}

function CheckoutForm({ amount, onSuccess, onError }: CheckoutFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)

    try {
      // Criar Payment Intent no backend
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          currency: 'brl',
        }),
      })

      const { clientSecret } = await response.json()

      // Confirmar pagamento
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      })

      if (error) {
        onError(error.message || 'Erro no pagamento')
      } else if (paymentIntent.status === 'succeeded') {
        onSuccess()
      }
    } catch (err) {
      onError('Erro ao processar pagamento')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-lg">
            <CreditCard className="w-5 h-5 mr-2" />
            Informações do Cartão
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border rounded-lg bg-white">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#424770',
                    '::placeholder': {
                      color: '#aab7c4',
                    },
                  },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span>Teste de Personalidade Completo</span>
          <span className="font-semibold">R$ {amount.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between font-bold text-lg">
          <span>Total</span>
          <span>R$ {amount.toFixed(2)}</span>
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 text-lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processando...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5 mr-2" />
            Pagar R$ {amount.toFixed(2)}
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        ✓ Pagamento 100% seguro com Stripe • ✓ Dados criptografados • ✓ Acesso imediato
      </p>
    </form>
  )
}

interface StripeCheckoutProps {
  amount: number
  onSuccess: () => void
  onError: (error: string) => void
}

export default function StripeCheckout({ amount, onSuccess, onError }: StripeCheckoutProps) {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  )
}