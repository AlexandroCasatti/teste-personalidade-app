"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const paymentIntent = searchParams.get('payment_intent')
    const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret')
    const redirectStatus = searchParams.get('redirect_status')

    if (redirectStatus === 'succeeded') {
      setStatus('success')
      setMessage('Seu pagamento foi processado com sucesso!')
    } else if (redirectStatus === 'processing') {
      setStatus('loading')
      setMessage('Seu pagamento está sendo processado...')
    } else if (redirectStatus === 'requires_payment_method') {
      setStatus('error')
      setMessage('Seu pagamento não foi processado. Tente novamente.')
    } else {
      setStatus('error')
      setMessage('Algo deu errado com seu pagamento.')
    }
  }, [searchParams])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-8 text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-white animate-spin" />
              </div>
              <h2 className="text-2xl font-bold text-blue-800 mb-2">
                Processando...
              </h2>
              <p className="text-blue-600 mb-6">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-green-800 mb-2">
                Pagamento Confirmado!
              </h2>
              <p className="text-green-600 mb-6">
                {message} Você receberá um email de confirmação em breve.
              </p>
              <div className="space-y-3">
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  Voltar ao Início
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full"
                >
                  Acessar Minha Conta
                </Button>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-red-800 mb-2">
                Erro no Pagamento
              </h2>
              <p className="text-red-600 mb-6">{message}</p>
              <div className="space-y-3">
                <Button 
                  onClick={() => window.location.href = '/'}
                  className="w-full bg-red-600 hover:bg-red-700"
                >
                  Tentar Novamente
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => window.location.href = '/support'}
                  className="w-full"
                >
                  Contatar Suporte
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}