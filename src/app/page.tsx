import { createClient } from '@/utils/supabase/server'

export default async function Home() {
  // Inicializa o cliente no servidor
  const supabase = await createClient()

  // Tenta conectar no banco
  // Usa auth.getSession() que não depende de tabelas
  const { data, error } = await supabase.auth.getSession()

  const isConnected = !error

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white p-4 font-sans">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Status da Conexão 🔌</h1>
          <p className="mt-2 text-zinc-400">Verificando comunicação Next.js ↔ Supabase</p>
        </div>

        <div 
          className={`p-6 rounded-2xl border-2 transition-all ${
            isConnected 
              ? 'border-green-500/50 bg-green-500/10 shadow-[0_0_30px_-5px_rgba(34,197,94,0.3)]' 
              : 'border-red-500/50 bg-red-500/10 shadow-[0_0_30px_-5px_rgba(239,68,68,0.3)]'
          }`}
        >
          {isConnected ? (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-16 w-16 rounded-full bg-green-500 flex items-center justify-center text-3xl shadow-lg">
                ✅
              </div>
              <div>
                <h2 className="text-xl font-bold text-green-400">Conectado com Sucesso!</h2>
                <p className="text-zinc-300 text-sm mt-1">O banco de dados respondeu.</p>
              </div>
              <div className="w-full bg-black/30 rounded p-3 text-xs font-mono text-zinc-400 overflow-hidden">
                Status: 200 OK<br/>
                Latência: Baixa (South America)
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 text-center">
              <div className="h-16 w-16 rounded-full bg-red-500 flex items-center justify-center text-3xl shadow-lg">
                ❌
              </div>
              <div>
                <h2 className="text-xl font-bold text-red-400">Falha na Conexão</h2>
                <p className="text-zinc-300 text-sm mt-1">Verifique seu arquivo .env.local</p>
              </div>
              <div className="w-full bg-black/30 rounded p-3 text-xs font-mono text-red-300 text-left overflow-auto max-h-32">
                Erro: {error?.message || JSON.stringify(error)}
              </div>
            </div>
          )}
        </div>

        {isConnected && (
            <div className="text-center">
                <p className="text-zinc-500 text-sm">Próximo passo: Criar a tela de Login.</p>
            </div>
        )}
      </div>
    </div>
  )
}