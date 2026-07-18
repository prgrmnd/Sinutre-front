import { SimpleHeader } from '@/components/layout/SimpleHeader';
import { ChartLineUp } from '@phosphor-icons/react'; // Ícone legal para métricas

export function MetricsPage() {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 pb-8">
      <SimpleHeader
        title="Métricas"
        subtitle="Acompanhe sua evolução e histórico"
      />

      <div className="mt-6 flex flex-col items-center justify-center p-12 bg-base-100 rounded-xl shadow-sm text-center border border-base-200">
        
        <div className="bg-primary/10 p-4 rounded-full mb-4 text-primary">
          <ChartLineUp size={48} weight="duotone" />
        </div>
        
        <h2 className="text-xl font-bold mb-2">Área de Métricas</h2>
        <p className="text-base-content/70 max-w-md">
          Em breve você poderá ver gráficos do seu consumo calórico diário, evolução de peso e muito mais aqui.
        </p>
      </div>
    </div>
  );
}