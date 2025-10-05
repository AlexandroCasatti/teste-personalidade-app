"use client"

import { useState } from 'react'
import { Elements } from '@stripe/react-stripe-js'
import stripePromise from '@/lib/stripe'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Lock, Shield, AlertCircle } from 'lucide-react'
import CheckoutForm from './CheckoutForm'

interface StripePaymentProps {
  amount: number
  currency?: string
  metadata?: Record<string, string>
}

export default function StripePayment({ 
  amount, 
  currency = 'brl', 
  metadata = {} 
}: StripePaymentProps) {
  const [clientSecret, setClientSecret] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')

  const createPaymentIntent = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          metadata,
        }),
      })

      // Verificar se a resposta é JSON válido
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Resposta inválida do servidor. Verifique as configurações.')
      }

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao processar pagamento')
      }

      if (data.clientSecret) {
        setClientSecret(data.clientSecret)
      } else {
        throw new Error('Client secret não recebido')
      }
    } catch (error) {
      console.error('Erro ao criar Payment Intent:', error)
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#2563eb',
      colorBackground: '#ffffff',
      colorText: '#374151',
      colorDanger: '#ef4444',
      fontFamily: 'Inter, system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '8px',
    },
  }

  const options = {
    clientSecret,
    appearance,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Pagamento Seguro
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Processamento seguro via Stripe. Seus dados são protegidos com criptografia de nível bancário.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Formulário de Pagamento */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center">
                  <Lock className="w-5 h-5 mr-2" />
                  Pagamento via Stripe
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Processamento seguro e confiável
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-600 flex items-center">
                      <AlertCircle className="w-5 h-5 mr-2" />
                      {error}
                    </p>
                    {error.includes('configurações') && (
                      <p className="text-red-500 text-sm mt-2">
                        💡 Clique em "Configurar" no banner laranja acima para adicionar suas chaves do Stripe
                      </p>
                    )}
                  </div>
                )}

                {!clientSecret ? (
                  <div className="text-center py-8">
                    <button
                      onClick={createPaymentIntent}
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-lg font-semibold disabled:opacity-50"
                    >
                      {loading ? 'Preparando...' : 'Iniciar Pagamento'}
                    </button>
                  </div>
                ) : (
                  <Elements options={options} stripe={stripePromise}>
                    <CheckoutForm />
                  </Elements>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Resumo do Pedido */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 sticky top-8">
              <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                <CardTitle>Resumo do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Produto/Serviço</span>
                    <span className="font-semibold">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: currency.toUpperCase(),
                      }).format(amount)}
                    </span>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span className="text-green-600">
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: currency.toUpperCase(),
                        }).format(amount)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-green-800 text-sm font-medium mb-2">
                      ✅ Incluído no seu pedido:
                    </p>
                    <ul className="text-green-700 text-sm space-y-1">
                      <li>• Acesso imediato</li>
                      <li>• Suporte técnico</li>
                      <li>• Garantia de satisfação</li>
                      <li>• Atualizações gratuitas</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selos de Segurança */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <Shield className="w-4 h-4 mr-1" />
                  SSL Seguro
                </Badge>
                <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                  <Lock className="w-4 h-4 mr-1" />
                  Stripe Secure
                </Badge>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  🛡️ Processado via Stripe<br />
                  💳 Dados criptografados<br />
                  ⚡ Confirmação instantânea
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}