import { useState, useEffect } from 'react';
import { SimpleHeader } from '@/components/layout/SimpleHeader';
import { Calculator, Fire } from '@phosphor-icons/react';
import { api } from '@/lib/api';

export function MetricsPage() {
  const [loading, setLoading] = useState(true);
  const [imcData, setImcData] = useState<{ value: number; classification: string } | null>(null);
  
  const [caloriesData, setCaloriesData] = useState<{ average: number; target: number } | null>(null);

  useEffect(() => {
    async function loadMetrics() {
      try {
        const response = await api.get('/metrics');
        
        setImcData(response.data.imc);
        setCaloriesData({
          average: response.data.averageCalories,
          target: response.data.targetCalories,
        });
      } catch (error) {
        console.error('Erro ao carregar as métricas:', error);
      } finally {
        setLoading(false);
      }
    }

    loadMetrics();
  }, []);

  const isOverTarget = caloriesData ? caloriesData.average > caloriesData.target : false;
  const targetColorClass = isOverTarget ? 'text-error' : 'text-success';
  const progressColorClass = isOverTarget ? 'progress-error' : 'progress-success';
  
  const percentOfTarget = caloriesData && caloriesData.target > 0 
    ? Math.min((caloriesData.average / caloriesData.target) * 100, 100) 
    : 0;

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
            ) : imcData ? (
              <div>
                <span className="text-4xl font-bold">{imcData.value}</span>
                <p className="text-base-content/70 mt-2">
                  Classificação: <strong className="text-base-content">{imcData.classification}</strong>
                </p>
              </div>
            ) : (
              <p className="text-sm text-base-content/70">
                Dados insuficientes. Preencha seu peso e altura nas configurações.
              </p>
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
                <div className="skeleton h-4 w-full mt-4"></div>
                <div className="skeleton h-4 w-48 mt-2"></div>
              </div>
            ) : caloriesData ? (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className={`text-4xl font-bold ${isOverTarget ? 'text-error' : ''}`}>
                    {caloriesData.average}
                  </span>
                  <span className="text-lg text-base-content/60">
                    / {caloriesData.target} kcal
                  </span>
                </div>

                <div className="mt-4">
                  <progress 
                    className={`progress w-full ${progressColorClass}`} 
                    value={percentOfTarget} 
                    max="100"
                  ></progress>
                  
                  <div className="flex justify-between mt-2 text-sm">
                    <span className="text-base-content/70">
                      {isOverTarget 
                        ? 'Você está ultrapassando a meta' 
                        : 'Você está dentro da meta'}
                    </span>
                    <span className={`font-semibold ${targetColorClass}`}>
                      {isOverTarget 
                        ? `+${caloriesData.average - caloriesData.target} kcal/dia` 
                        : `-${caloriesData.target - caloriesData.average} kcal/dia`}
                    </span>
                  </div>
                </div>

              </div>
            ) : (
              <p className="text-sm text-base-content/70">Sem dados recentes.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}