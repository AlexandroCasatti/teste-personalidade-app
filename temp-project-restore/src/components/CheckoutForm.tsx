"use client"

import { useState } from 'react'
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react'

export default function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()

  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
        receipt_email: email,
      },
      redirect: 'if_required',
    })

    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setMessage(error.message || 'Erro no pagamento')
      } else {
        setMessage('Erro inesperado. Tente novamente.')
      }
    } else {
      setPaymentSuccess(true)
      setMessage('Pagamento realizado com sucesso!')
    }

    setIsLoading(false)
  }

  if (paymentSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-green-800 mb-2">
          Pagamento Confirmado!
        </h3>
        <p className="text-green-600 mb-4">
          Seu pagamento foi processado com sucesso.
        </p>
        <Button 
          onClick={() => window.location.reload()}
          className="bg-green-600 hover:bg-green-700"
        >
          Fazer Novo Pagamento
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email */}
      <div>
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email para recibo *
        </Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@email.com"
          required
          className="mt-1"
        />
      </div>

      {/* Stripe Payment Element */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Informações de Pagamento *
        </Label>
        <div className="border rounded-lg p-4 bg-white">
          <PaymentElement />
        </div>
      </div>

      {/* Stripe Address Element */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-2 block">
          Endereço de Cobrança *
        </Label>
        <div className="border rounded-lg p-4 bg-white">
          <AddressElement 
            options={{
              mode: 'billing',
              allowedCountries: ['BR'],
            }}
          />
        </div>
      </div>

      {/* Mensagem de erro */}
      {message && !paymentSuccess && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {message}
          </p>
        </div>
      )}

      {/* Botão de pagamento */}
      <Button
        type="submit"
        disabled={isLoading || !stripe || !elements}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processando...
          </>
        ) : (
          'Confirmar Pagamento'
        )}
      </Button>

      {/* Informações de segurança */}
      <div className="text-center text-sm text-gray-500">
        <p>🔒 Seus dados são protegidos com criptografia SSL</p>
        <p>💳 Processamento seguro via Stripe</p>
      </div>
    </form>
  )
}