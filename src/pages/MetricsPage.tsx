import { useState, useEffect } from 'react';
import { SimpleHeader } from '@/components/layout/SimpleHeader';
import { Calculator, Fire } from '@phosphor-icons/react'; // Ícones para IMC e Calorias

export function MetricsPage() {
  const [loading, setLoading] = useState(true);
  const [imcData, setImcData] = useState<{ value: number; classification: string } | null>(null);
  const [averageCalories, setAverageCalories] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setImcData({ value: 23.5, classification: 'Peso Normal' });
      setAverageCalories(2150);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 pb-8">
      <SimpleHeader
        title="Métricas"
        subtitle="Acompanhe sua evolução e histórico"
      />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <Calculator size={24} weight="duotone" />
              </div>
              <h2 className="card-title text-lg">Índice de Massa Corporal (IMC)</h2>
            </div>

            {loading ? (
              <div className="flex flex-col gap-2">
                <div className="skeleton h-10 w-24"></div>
                <div className="skeleton h-4 w-32 mt-2"></div>
              </div>
            ) : (
              <div>
                <span className="text-4xl font-bold">{imcData?.value}</span>
                <p className="text-base-content/70 mt-2">
                  Classificação: <strong className="text-base-content">{imcData?.classification}</strong>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="card bg-base-100 shadow-sm border border-base-200">
          <div className="card-body">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500">
                <Fire size={24} weight="duotone" />
              </div>
              <h2 className="card-title text-lg">Média Calórica (7 dias)</h2>
            </div>

            {loading ? (
              <div className="flex flex-col gap-2">
                <div className="skeleton h-10 w-32"></div>
                <div className="skeleton h-4 w-48 mt-2"></div>
              </div>
            ) : (
              <div>
                <span className="text-4xl font-bold">{averageCalories}</span>
                <span className="text-lg text-base-content/60 ml-1">kcal/dia</span>
                <p className="text-base-content/70 mt-2">
                  Baseado no seu consumo recente.
                </p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}