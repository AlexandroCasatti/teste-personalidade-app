import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    // Verificar se a chave secreta do Stripe está configurada
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY não está configurada')
      return NextResponse.json(
        { error: 'Configuração do Stripe não encontrada. Configure suas chaves de API.' },
        { status: 500 }
      )
    }

    // Inicializar Stripe com a chave secreta
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    })

    // Validar e extrair dados da requisição
    let requestData
    try {
      requestData = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Dados da requisição inválidos' },
        { status: 400 }
      )
    }

    const { amount, currency = 'brl', metadata = {} } = requestData

    // Validar amount
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Valor do pagamento inválido' },
        { status: 400 }
      )
    }

    // Criar Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe usa centavos
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    })
  } catch (error) {
    console.error('Erro ao criar Payment Intent:', error)
    
    // Tratamento específico para erros do Stripe
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: `Erro do Stripe: ${error.message}` },
        { status: 400 }
      )
    }

    // Erro genérico
    return NextResponse.json(
      { error: 'Erro interno do servidor. Verifique as configurações do Stripe.' },
      { status: 500 }
    )
  }
}