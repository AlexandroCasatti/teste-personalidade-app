"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { CheckCircle, Brain, Heart, Shield, Star, Lock, CreditCard, ArrowRight, Clock, Users, Award, Smartphone } from 'lucide-react'

// Base de perguntas profissionais baseadas em escalas psicológicas reconhecidas
const questions = [
  // Escala de Ansiedade e Depressão
  { id: 1, text: "Sinto-me nervoso(a) e ansioso(a) na maior parte do tempo", category: "anxiety", scale: "GAD-7" },
  { id: 2, text: "Tenho dificuldade para relaxar e me acalmar", category: "anxiety", scale: "GAD-7" },
  { id: 3, text: "Preocupo-me excessivamente com diferentes situações", category: "anxiety", scale: "GAD-7" },
  { id: 4, text: "Sinto-me irritado(a) ou com raiva facilmente", category: "anxiety", scale: "GAD-7" },
  { id: 5, text: "Tenho medo de que algo terrível possa acontecer", category: "anxiety", scale: "GAD-7" },
  
  { id: 6, text: "Sinto pouco interesse ou prazer em fazer as coisas", category: "depression", scale: "PHQ-9" },
  { id: 7, text: "Sinto-me desanimado(a), deprimido(a) ou sem esperança", category: "depression", scale: "PHQ-9" },
  { id: 8, text: "Tenho problemas para adormecer ou permanecer dormindo", category: "depression", scale: "PHQ-9" },
  { id: 9, text: "Sinto-me cansado(a) ou com pouca energia", category: "depression", scale: "PHQ-9" },
  { id: 10, text: "Tenho pouco apetite ou como demais", category: "depression", scale: "PHQ-9" },
  
  // Escala de Autoestima (Rosenberg)
  { id: 11, text: "Sinto que sou uma pessoa de valor", category: "self_esteem", scale: "Rosenberg" },
  { id: 12, text: "Sinto que tenho várias qualidades boas", category: "self_esteem", scale: "Rosenberg" },
  { id: 13, text: "Sou capaz de fazer as coisas tão bem quanto outras pessoas", category: "self_esteem", scale: "Rosenberg" },
  { id: 14, text: "Tenho uma atitude positiva em relação a mim mesmo(a)", category: "self_esteem", scale: "Rosenberg" },
  { id: 15, text: "No geral, estou satisfeito(a) comigo mesmo(a)", category: "self_esteem", scale: "Rosenberg" },
  
  // Escala de Resiliência
  { id: 16, text: "Consigo me adaptar facilmente às mudanças", category: "resilience", scale: "Connor-Davidson" },
  { id: 17, text: "Tenho relacionamentos próximos e seguros", category: "resilience", scale: "Connor-Davidson" },
  { id: 18, text: "Às vezes o destino ou Deus pode me ajudar", category: "resilience", scale: "Connor-Davidson" },
  { id: 19, text: "Posso lidar com qualquer coisa que aparecer", category: "resilience", scale: "Connor-Davidson" },
  { id: 20, text: "Sucessos passados me dão confiança para novos desafios", category: "resilience", scale: "Connor-Davidson" },
  
  // Escala de Suporte Social
  { id: 21, text: "Tenho pessoas em quem posso confiar quando preciso", category: "social_support", scale: "MSPSS" },
  { id: 22, text: "Tenho pessoas que me apoiam emocionalmente", category: "social_support", scale: "MSPSS" },
  { id: 23, text: "Tenho uma pessoa especial que é uma fonte real de conforto", category: "social_support", scale: "MSPSS" },
  { id: 24, text: "Minha família realmente tenta me ajudar", category: "social_support", scale: "MSPSS" },
  { id: 25, text: "Recebo o apoio emocional que preciso da minha família", category: "social_support", scale: "MSPSS" },
  
  // Escala de Coping (Enfrentamento)
  { id: 26, text: "Quando enfrento problemas, busco soluções práticas", category: "coping", scale: "Brief COPE" },
  { id: 27, text: "Procuro apoio emocional de outras pessoas", category: "coping", scale: "Brief COPE" },
  { id: 28, text: "Tento ver o lado positivo das situações difíceis", category: "coping", scale: "Brief COPE" },
  { id: 29, text: "Aceito a realidade do que aconteceu", category: "coping", scale: "Brief COPE" },
  { id: 30, text: "Procuro crescer como pessoa através da experiência", category: "coping", scale: "Brief COPE" },
  
  // Escala de Mindfulness e Autoconsciência
  { id: 31, text: "Consigo observar meus pensamentos sem me identificar com eles", category: "mindfulness", scale: "MAAS" },
  { id: 32, text: "Presto atenção aos meus sentimentos sem me deixar levar por eles", category: "mindfulness", scale: "MAAS" },
  { id: 33, text: "Consigo me concentrar no momento presente", category: "mindfulness", scale: "MAAS" },
  { id: 34, text: "Noto quando minha mente está divagando", category: "mindfulness", scale: "MAAS" },
  { id: 35, text: "Sou consciente dos meus padrões de pensamento", category: "mindfulness", scale: "MAAS" },
  
  // Escala de Regulação Emocional
  { id: 36, text: "Consigo controlar minhas emoções quando necessário", category: "emotion_regulation", scale: "ERQ" },
  { id: 37, text: "Quando quero sentir menos emoções negativas, mudo meus pensamentos", category: "emotion_regulation", scale: "ERQ" },
  { id: 38, text: "Controlo minhas emoções não as expressando", category: "emotion_regulation", scale: "ERQ" },
  { id: 39, text: "Quando enfrento situações estressantes, penso de forma que me ajude a ficar calmo(a)", category: "emotion_regulation", scale: "ERQ" },
  { id: 40, text: "Consigo modificar a forma como me sinto sobre uma situação mudando meus pensamentos", category: "emotion_regulation", scale: "ERQ" },
  
  // Escala de Propósito de Vida
  { id: 41, text: "Tenho uma direção clara na minha vida", category: "life_purpose", scale: "PIL" },
  { id: 42, text: "Minha vida tem significado e propósito", category: "life_purpose", scale: "PIL" },
  { id: 43, text: "Tenho objetivos claros para o futuro", category: "life_purpose", scale: "PIL" },
  { id: 44, text: "Sinto que minha vida vale a pena", category: "life_purpose", scale: "PIL" },
  { id: 45, text: "Tenho responsabilidades que me dão sentido", category: "life_purpose", scale: "PIL" },
  
  // Escala de Perfeccionismo Adaptativo vs Mal-adaptativo
  { id: 46, text: "Estabeleço padrões muito altos para mim mesmo(a)", category: "perfectionism", scale: "MPS" },
  { id: 47, text: "Sou muito crítico(a) comigo mesmo(a) quando cometo erros", category: "perfectionism", scale: "MPS" },
  { id: 48, text: "Preocupo-me com o que os outros pensam sobre mim", category: "perfectionism", scale: "MPS" },
  { id: 49, text: "Tenho dificuldade em aceitar que 'bom o suficiente' é aceitável", category: "perfectionism", scale: "MPS" },
  { id: 50, text: "Sinto que devo ser perfeito(a) para ser aceito(a)", category: "perfectionism", scale: "MPS" }
]

const personalityTypes = {
  "resiliente_adaptativo": {
    title: "Personalidade Resiliente-Adaptativa",
    description: "Você demonstra uma capacidade notável de se adaptar às adversidades e encontrar significado mesmo em situações desafiadoras.",
    diagnosis: "Sua personalidade revela uma estrutura psicológica sólida e bem desenvolvida. Você possui recursos internos robustos que lhe permitem navegar pelas dificuldades da vida com equilíbrio e sabedoria. Sua capacidade de regulação emocional e sua rede de suporte social são pontos fortes que contribuem significativamente para seu bem-estar mental.",
    characteristics: [
      "Alta capacidade de regulação emocional",
      "Boa rede de suporte social",
      "Estratégias de enfrentamento saudáveis",
      "Autoestima equilibrada",
      "Mindfulness e autoconsciência desenvolvidas"
    ],
    recommendations: [
      "Continue cultivando suas práticas de mindfulness",
      "Mantenha e fortaleça suas conexões sociais",
      "Use sua resiliência para ajudar outros",
      "Considere atividades de liderança ou mentoria"
    ],
    motivationalPhrase: "🌟 Você é uma fonte de inspiração! Sua força interior e capacidade de superação são extraordinárias. Continue sendo essa luz que ilumina não apenas seu caminho, mas também o de outras pessoas. O mundo precisa de mais pessoas como você!",
    color: "from-emerald-500 to-teal-600"
  },
  "ansioso_perfeccionista": {
    title: "Personalidade Ansiosa-Perfeccionista",
    description: "Você tende a estabelecer padrões muito altos e pode experimentar ansiedade quando as coisas não saem como planejado.",
    diagnosis: "Seu perfil indica uma mente brilhante e detalhista, mas que às vezes se torna sua própria crítica mais severa. A ansiedade que você sente é resultado da pressão que coloca sobre si mesmo(a) para alcançar a perfeição. Essa característica, embora possa gerar desconforto, também demonstra seu comprometimento com a excelência e seu desejo genuíno de fazer o melhor.",
    characteristics: [
      "Padrões elevados de desempenho",
      "Tendência à preocupação excessiva",
      "Autocrítica intensa",
      "Dificuldade em aceitar imperfeições",
      "Busca constante por aprovação"
    ],
    recommendations: [
      "Pratique a autocompaixão diariamente",
      "Estabeleça metas realistas e flexíveis",
      "Considere terapia cognitivo-comportamental",
      "Desenvolva técnicas de relaxamento",
      "Celebre pequenas conquistas"
    ],
    motivationalPhrase: "💎 Sua busca pela excelência é admirável, mas lembre-se: você já é valioso(a) exatamente como é! Permita-se ser humano, cometer erros e aprender. A perfeição não existe, mas sua dedicação e esforço são reais e merecem reconhecimento. Seja gentil consigo mesmo(a)!",
    color: "from-amber-500 to-orange-600"
  },
  "depressivo_retraido": {
    title: "Personalidade Depressiva-Retraída",
    description: "Você pode estar passando por um período difícil, com baixa energia e interesse reduzido em atividades.",
    diagnosis: "O que você está vivenciando é mais comum do que imagina, e é importante reconhecer que buscar ajuda é um ato de coragem, não de fraqueza. Sua sensibilidade e profundidade emocional, embora possam parecer um fardo agora, também são qualidades que podem se tornar grandes forças quando você receber o suporte adequado. Este momento difícil não define quem você é.",
    characteristics: [
      "Baixo interesse em atividades prazerosas",
      "Sentimentos de desesperança",
      "Fadiga e baixa energia",
      "Isolamento social",
      "Autocrítica e baixa autoestima"
    ],
    recommendations: [
      "Busque apoio profissional imediatamente",
      "Estabeleça uma rotina diária simples",
      "Pratique atividades físicas leves",
      "Reconecte-se gradualmente com pessoas queridas",
      "Considere grupos de apoio"
    ],
    motivationalPhrase: "🌅 Mesmo nas noites mais escuras, o sol sempre nasce novamente. Você é mais forte do que imagina e merece toda a felicidade do mundo. Este momento difícil vai passar, e você emergirá dessa experiência com uma sabedoria e compaixão únicas. Não desista - sua vida tem valor imenso!",
    color: "from-slate-500 to-gray-600"
  },
  "equilibrado_consciente": {
    title: "Personalidade Equilibrada-Consciente",
    description: "Você demonstra um bom equilíbrio emocional e consciência de seus padrões mentais e emocionais.",
    diagnosis: "Você alcançou um estado psicológico invejável de equilíbrio e autoconsciência. Sua capacidade de reconhecer e regular suas emoções, combinada com relacionamentos saudáveis e um senso claro de propósito, indica uma maturidade emocional significativa. Você possui as ferramentas necessárias para navegar pela vida com sabedoria e serenidade.",
    characteristics: [
      "Boa regulação emocional",
      "Autoconsciência desenvolvida",
      "Relacionamentos saudáveis",
      "Propósito de vida claro",
      "Estratégias de enfrentamento eficazes"
    ],
    recommendations: [
      "Continue desenvolvendo sua inteligência emocional",
      "Explore práticas de crescimento pessoal",
      "Considere ajudar outros em seu desenvolvimento",
      "Mantenha o equilíbrio entre trabalho e vida pessoal"
    ],
    motivationalPhrase: "🧘‍♀️ Você encontrou algo precioso: o equilíbrio interior. Sua consciência e sabedoria emocional são dons raros que não apenas beneficiam você, mas também inspiram todos ao seu redor. Continue crescendo e compartilhando sua luz com o mundo!",
    color: "from-blue-500 to-indigo-600"
  },
  "vulneravel_necessitado": {
    title: "Personalidade Vulnerável-Necessitada",
    description: "Você pode estar passando por um momento de maior vulnerabilidade emocional e necessidade de suporte.",
    diagnosis: "Sua vulnerabilidade atual não é uma fraqueza, mas sim um sinal de que você está passando por um período de transição ou desafio significativo. Reconhecer que precisa de ajuda demonstra autoconsciência e coragem. Muitas pessoas passam por fases similares, e com o suporte adequado, você pode desenvolver ferramentas poderosas para lidar com as dificuldades da vida.",
    characteristics: [
      "Alta necessidade de suporte emocional",
      "Dificuldades na regulação emocional",
      "Baixa autoestima",
      "Padrões de pensamento negativos",
      "Isolamento ou dependência excessiva"
    ],
    recommendations: [
      "Procure apoio profissional qualificado",
      "Desenvolva uma rede de suporte confiável",
      "Pratique técnicas de autocuidado",
      "Considere terapia em grupo",
      "Estabeleça limites saudáveis nos relacionamentos"
    ],
    motivationalPhrase: "🤗 Sua sensibilidade e capacidade de sentir profundamente são dons, mesmo que agora pareçam pesados. Você não está sozinho(a) nesta jornada. Cada passo que dá em direção à cura é um ato de bravura. Acredite: dias melhores estão chegando, e você merece todo o amor e cuidado do mundo!",
    color: "from-rose-500 to-pink-600"
  }
}

export default function PersonalityTest() {
  const [currentStep, setCurrentStep] = useState('intro')
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [personalityResult, setPersonalityResult] = useState<string | null>(null)
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'card' | 'apple' | null>(null)
  const [isPaid, setIsPaid] = useState(false)

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      calculatePersonality()
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const calculatePersonality = () => {
    const scores = {
      anxiety: 0,
      depression: 0,
      self_esteem: 0,
      resilience: 0,
      social_support: 0,
      coping: 0,
      mindfulness: 0,
      emotion_regulation: 0,
      life_purpose: 0,
      perfectionism: 0
    }

    // Calcular pontuações por categoria
    questions.forEach(question => {
      const answer = answers[question.id] || 0
      const category = question.category as keyof typeof scores
      
      // Inverter pontuação para categorias positivas quando necessário
      if (['self_esteem', 'resilience', 'social_support', 'coping', 'mindfulness', 'emotion_regulation', 'life_purpose'].includes(category)) {
        scores[category] += answer
      } else {
        scores[category] += answer
      }
    })

    // Determinar tipo de personalidade baseado nas pontuações
    let personalityType = 'equilibrado_consciente'

    if (scores.depression > 15 && scores.anxiety > 12) {
      personalityType = 'vulneravel_necessitado'
    } else if (scores.depression > 12) {
      personalityType = 'depressivo_retraido'
    } else if (scores.anxiety > 10 && scores.perfectionism > 15) {
      personalityType = 'ansioso_perfeccionista'
    } else if (scores.resilience > 15 && scores.self_esteem > 15 && scores.social_support > 15) {
      personalityType = 'resiliente_adaptativo'
    }

    setPersonalityResult(personalityType)
    setCurrentStep('payment')
  }

  const handlePayment = () => {
    // Simular processamento de pagamento
    setTimeout(() => {
      setIsPaid(true)
      setCurrentStep('result')
    }, 2000)
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (currentStep === 'intro') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-800/20 to-pink-800/20" />
          <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-24">
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 leading-tight">
                Você está <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">sofrendo em silêncio?</span>
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto leading-relaxed">
                Milhões de pessoas enfrentam ansiedade, depressão e momentos difíceis sozinhas. 
                <strong className="text-white"> Você não precisa mais fingir que está tudo bem.</strong>
              </p>
              
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl mb-3">😔</div>
                  <h3 className="text-white font-semibold mb-2">Depressão</h3>
                  <p className="text-gray-300 text-sm">Sentindo-se vazio, sem energia ou esperança?</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl mb-3">😰</div>
                  <h3 className="text-white font-semibold mb-2">Ansiedade</h3>
                  <p className="text-gray-300 text-sm">Preocupações constantes te impedem de viver?</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl mb-3">💔</div>
                  <h3 className="text-white font-semibold mb-2">Relacionamentos</h3>
                  <p className="text-gray-300 text-sm">Divórcio, término ou solidão te machucaram?</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="text-3xl mb-3">😞</div>
                  <h3 className="text-white font-semibold mb-2">Perdas</h3>
                  <p className="text-gray-300 text-sm">Perdeu emprego, ente querido ou sonhos?</p>
                </div>
              </div>

              <Button 
                onClick={() => setCurrentStep('test')} 
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-12 py-6 text-xl rounded-full shadow-2xl hover:shadow-pink-500/25 transition-all duration-300 hover:scale-105"
              >
                Descobrir Minha Personalidade Agora
                <ArrowRight className="ml-3 w-6 h-6" />
              </Button>
              
              <p className="text-gray-400 mt-6 text-lg">
                ✨ <strong className="text-white">Teste completo</strong> • 🔒 Totalmente anônimo • ⚡ Resultado em 10 minutos
              </p>
            </div>
          </div>
        </div>

        {/* Social Proof Section */}
        <div className="bg-white/5 backdrop-blur-sm border-y border-white/10 py-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid sm:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <Users className="w-12 h-12 text-pink-400 mb-4" />
                <div className="text-3xl font-bold text-white mb-2">+127.000</div>
                <p className="text-gray-300">pessoas já descobriram sua personalidade</p>
              </div>
              <div className="flex flex-col items-center">
                <Award className="w-12 h-12 text-purple-400 mb-4" />
                <div className="text-3xl font-bold text-white mb-2">98%</div>
                <p className="text-gray-300">se sentiram mais autoconscientes</p>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="w-12 h-12 text-pink-400 mb-4" />
                <div className="text-3xl font-bold text-white mb-2">10 min</div>
                <p className="text-gray-300">para transformar sua vida</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pain Points Section */}
        <div className="py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
              Pare de se sentir <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400">perdido(a) e confuso(a)</span>
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-8 mb-12">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-4 text-red-400">❌ Sem este teste, você continuará:</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li>• Se sentindo perdido(a) sobre quem realmente é</li>
                    <li>• Repetindo os mesmos padrões destrutivos</li>
                    <li>• Sofrendo sozinho(a) sem entender o porquê</li>
                    <li>• Tomando decisões que te machucam</li>
                    <li>• Vivendo no piloto automático, sem propósito</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardContent className="p-8">
                  <h3 className="text-xl font-bold mb-4 text-green-400">✅ Com seu resultado, você vai:</h3>
                  <ul className="space-y-3 text-gray-300">
                    <li>• Entender finalmente quem você é de verdade</li>
                    <li>• Descobrir por que age de certas formas</li>
                    <li>• Receber estratégias personalizadas para sua cura</li>
                    <li>• Saber exatamente como melhorar sua vida</li>
                    <li>• Ter clareza sobre seus próximos passos</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <p className="text-2xl text-gray-300 mb-8">
                <strong className="text-white">Você merece se conhecer e ser feliz.</strong><br />
                Não deixe mais um dia passar sem respostas.
              </p>
              
              <Button 
                onClick={() => setCurrentStep('test')} 
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-6 text-xl rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-105"
              >
                Começar Minha Transformação Agora
                <Heart className="ml-3 w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>

        {/* Scientific Credibility */}
        <div className="bg-white/5 backdrop-blur-sm border-t border-white/10 py-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <Shield className="w-16 h-16 text-blue-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Baseado em Ciência Real</h3>
            <p className="text-gray-300 text-lg mb-6">
              Este teste utiliza as mesmas escalas psicológicas usadas por profissionais em consultórios: 
              <strong className="text-white"> GAD-7, PHQ-9, Escala de Rosenberg</strong> e outras ferramentas científicas validadas.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 px-4 py-2">GAD-7 (Ansiedade)</Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 px-4 py-2">PHQ-9 (Depressão)</Badge>
              <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30 px-4 py-2">Escala Rosenberg</Badge>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 px-4 py-2">Connor-Davidson</Badge>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'test') {
    const question = questions[currentQuestion]
    const currentAnswer = answers[question.id]

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-3xl mx-auto py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="text-sm">
                {question.scale} • Pergunta {currentQuestion + 1} de {questions.length}
              </Badge>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {Math.round(progress)}% concluído
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl">
                {question.text}
              </CardTitle>
              <CardDescription>
                Selecione a opção que melhor descreve como você se sente ou pensa:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { value: 0, label: "Nunca ou quase nunca", color: "bg-green-100 hover:bg-green-200 border-green-300" },
                  { value: 1, label: "Raramente", color: "bg-yellow-100 hover:bg-yellow-200 border-yellow-300" },
                  { value: 2, label: "Às vezes", color: "bg-orange-100 hover:bg-orange-200 border-orange-300" },
                  { value: 3, label: "Frequentemente", color: "bg-red-100 hover:bg-red-200 border-red-300" },
                  { value: 4, label: "Sempre ou quase sempre", color: "bg-red-200 hover:bg-red-300 border-red-400" }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleAnswer(question.id, option.value)}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      currentAnswer === option.value 
                        ? `${option.color} ring-2 ring-blue-500` 
                        : `${option.color} opacity-70`
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-4 h-4 rounded-full border-2 mr-3 ${
                        currentAnswer === option.value ? 'bg-blue-600 border-blue-600' : 'border-gray-400'
                      }`} />
                      <span className="font-medium">{option.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button 
              onClick={prevQuestion} 
              disabled={currentQuestion === 0}
              variant="outline"
              className="px-6"
            >
              Anterior
            </Button>
            <Button 
              onClick={nextQuestion}
              disabled={currentAnswer === undefined}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6"
            >
              {currentQuestion === questions.length - 1 ? 'Finalizar Teste' : 'Próxima'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === 'payment') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-2xl mx-auto py-8">
          <div className="text-center mb-8">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Teste Concluído com Sucesso!
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Seu perfil de personalidade está pronto. Acesse agora seu resultado completo e personalizado.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center text-2xl">
                <Star className="w-6 h-6 mr-2 text-yellow-500" />
                Seu Relatório Completo Inclui:
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>Análise detalhada do seu tipo de personalidade</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>Diagnóstico personalizado com explicação científica</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>Características principais da sua personalidade</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>Recomendações personalizadas para seu bem-estar</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
                  <span>Frase motivacional específica para seu perfil</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">R$ 5,99</div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Pagamento único • Acesso imediato • Resultado completo
                </p>
                
                {!showPayment ? (
                  <Button 
                    onClick={() => setShowPayment(true)}
                    size="lg"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-4 text-lg"
                  >
                    <CreditCard className="w-5 h-5 mr-2" />
                    Acessar Meu Resultado
                  </Button>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border">
                      <h3 className="font-semibold mb-4">Escolha sua forma de pagamento:</h3>
                      
                      {/* Opções de Pagamento */}
                      <div className="grid gap-3 mb-6">
                        <button
                          onClick={() => setSelectedPaymentMethod('card')}
                          className={`p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                            selectedPaymentMethod === 'card' 
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center">
                            <CreditCard className="w-5 h-5 mr-3 text-blue-600" />
                            <div className="text-left">
                              <div className="font-medium">Cartão de Crédito</div>
                              <div className="text-sm text-gray-500">Visa, Mastercard, Elo</div>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedPaymentMethod === 'card' ? 'bg-blue-600 border-blue-600' : 'border-gray-400'
                          }`} />
                        </button>

                        <button
                          onClick={() => setSelectedPaymentMethod('apple')}
                          className={`p-4 rounded-lg border-2 transition-all flex items-center justify-between ${
                            selectedPaymentMethod === 'apple' 
                              ? 'border-gray-800 bg-gray-50 dark:bg-gray-900/20' 
                              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center">
                            <Smartphone className="w-5 h-5 mr-3 text-gray-800" />
                            <div className="text-left">
                              <div className="font-medium">Apple Pay</div>
                              <div className="text-sm text-gray-500">Pagamento rápido e seguro</div>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border-2 ${
                            selectedPaymentMethod === 'apple' ? 'bg-gray-800 border-gray-800' : 'border-gray-400'
                          }`} />
                        </button>
                      </div>

                      {/* Resumo do Pedido */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded">
                          <span>Teste de Personalidade Completo</span>
                          <span className="font-semibold">R$ 5,99</span>
                        </div>
                        <Separator />
                        <div className="flex items-center justify-between font-bold">
                          <span>Total</span>
                          <span>R$ 5,99</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handlePayment}
                      disabled={!selectedPaymentMethod}
                      size="lg"
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {selectedPaymentMethod === 'apple' ? (
                        <>
                          <Smartphone className="w-5 h-5 mr-2" />
                          Pagar com Apple Pay
                        </>
                      ) : selectedPaymentMethod === 'card' ? (
                        <>
                          <CreditCard className="w-5 h-5 mr-2" />
                          Pagar com Cartão
                        </>
                      ) : (
                        'Selecione uma forma de pagamento'
                      )}
                    </Button>
                    
                    <p className="text-xs text-gray-500 text-center">
                      ✓ Pagamento 100% seguro • ✓ Dados protegidos • ✓ Acesso imediato
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (currentStep === 'result' && personalityResult && isPaid) {
    const result = personalityTypes[personalityResult as keyof typeof personalityTypes]
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="text-center mb-8">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r ${result.color} text-white mb-4`}>
              <Brain className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Seu Resultado
            </h1>
            <Badge className={`text-lg px-4 py-2 bg-gradient-to-r ${result.color} text-white border-0`}>
              {result.title}
            </Badge>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Análise da Sua Personalidade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                {result.description}
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">📋 Diagnóstico Personalizado:</h3>
                <p className="text-blue-800 dark:text-blue-200 leading-relaxed">
                  {result.diagnosis}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Características Principais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.characteristics.map((char, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{char}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-red-500" />
                  Recomendações Personalizadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {result.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Frase Motivacional Específica */}
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className={`bg-gradient-to-r ${result.color} text-white rounded-2xl p-8 text-center`}>
                <h3 className="text-2xl font-bold mb-4">💫 Sua Mensagem de Superação</h3>
                <p className="text-lg leading-relaxed font-medium">
                  {result.motivationalPhrase}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Importante: Busque Apoio Profissional</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-gray-700 dark:text-gray-300">
                  <strong>Este teste é uma ferramenta de autoconhecimento</strong> e não substitui uma avaliação profissional. 
                  Se você está enfrentando dificuldades emocionais significativas, ansiedade intensa ou sintomas depressivos, 
                  é fundamental buscar ajuda de um psicólogo ou psiquiatra qualificado.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button 
              onClick={() => {
                setCurrentStep('intro')
                setCurrentQuestion(0)
                setAnswers({})
                setPersonalityResult(null)
                setShowPayment(false)
                setSelectedPaymentMethod(null)
                setIsPaid(false)
              }}
              variant="outline"
              className="px-8"
            >
              Fazer Novo Teste
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return null
}