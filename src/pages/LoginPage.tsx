import type { ReactNode } from 'react';
import { GithubLogo, Sparkle } from '@phosphor-icons/react';
import { API_URL } from '@/lib/api';

function startGithubLogin() {
  window.location.href = `${API_URL}/auth/github`;
}

export function LoginPage() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row antialiased bg-base-100 text-base-content selection:bg-primary selection:text-primary-content">
      <div className="relative w-full md:w-[48%] lg:w-[45%] bg-primary text-primary-content p-8 lg:p-12 flex flex-col justify-between overflow-hidden shadow-2xl">
        
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-base-100/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-neutral/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex items-center gap-2">
          <div className="w-10 h-10 rounded-box bg-base-100/20 backdrop-blur-md flex items-center justify-center border border-base-100/30 text-primary-content font-extrabold text-xl shadow-inner">
            S
          </div>
          <span className="text-3xl font-black tracking-tight drop-shadow-sm">
            SiNutre
          </span>
        </div>

        <div className="relative z-10 my-auto py-8 flex flex-col items-center justify-center">
          <div className="relative w-full max-w-[420px] aspect-[596/419] transition-transform duration-500 hover:scale-[1.02]">
            <img
              src="/plate.png"
              alt="Prato nutritivo com balanço de macros"
              className="w-full h-full object-contain filter drop-shadow-2xl"
            />
            
            <Pill className="top-[12%] left-[18%]">
              Vitaminas
            </Pill>
            <Pill className="top-[12%] left-[82%]">
              Proteínas
            </Pill>
            <Pill className="top-[80%] left-[15%]">
              Carboidratos
            </Pill>
            <Pill className="top-[84%] left-[83%]">
              Gorduras
            </Pill>
          </div>
        </div>

        <div className="relative z-10 hidden md:flex items-center justify-between text-primary-content/90 text-xs tracking-wide">
          <span className="flex items-center gap-1.5 font-medium">
            <Sparkle size={14} weight="fill" /> 
            Nutrição Inteligente
          </span>
          <span>© {new Date().getFullYear()} SiNutre</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-16 relative">
        <div className="w-full max-w-md flex flex-col items-center text-center">
          
          <div className="inline-flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Plataforma para Nutricionistas
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-base-content tracking-tight leading-tight mb-3">
            Sua saúde sob <br className="hidden md:block" />
            <span className="text-primary">medida e controle.</span>
          </h1>

          <p className="text-base text-base-content/70 mb-8 max-w-sm leading-relaxed mx-auto">
            Acesse seu painel para gerenciar suas dietas, refeições e métricas com praticidade.
          </p>

          <div className="w-full bg-base-100 p-6 md:p-8 rounded-box border border-base-200 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
            <button
              type="button"
              onClick={startGithubLogin}
              className="btn btn-neutral btn-block h-14 rounded-box shadow-lg group hover:scale-[1.02] transition-transform duration-200"
            >
              <GithubLogo size={22} weight="fill" className="transition-transform group-hover:scale-110 text-neutral-content" />
              <span className="text-neutral-content font-semibold">Entrar com GitHub</span>
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

function Pill({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`absolute -translate-x-1/2 -translate-y-1/2 bg-base-100/90 backdrop-blur-md text-base-content font-bold rounded-full shadow-lg border border-base-200 px-3.5 py-1.5 md:px-4 md:py-1.5 text-xs md:text-sm whitespace-nowrap transition-transform duration-300 hover:scale-110 ${className}`}
    >
      {children}
    </span>
  );
}