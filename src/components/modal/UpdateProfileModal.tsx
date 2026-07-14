import { useState, FormEvent } from 'react';

interface UpdateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UpdateProfileModal({ isOpen, onClose }: UpdateProfileModalProps) {
  const [height, setHeight] = useState<string | number>('');
  const [weight, setWeight] = useState<string | number>('');
  const [targetCalories, setTargetCalories] = useState<string | number>('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const payload = {
      height: Number(height),
      weight: Number(weight),
      targetCalories: Number(targetCalories),
    };

    try {
      console.log('Dados sendo enviados:', payload);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onClose();
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro ao salvar os dados. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-base-100">
        <h3 className="font-bold text-lg text-base-content mb-6">Atualizar Perfil Físico</h3>
        
        {error && (
          <div className="alert alert-error mb-4 rounded-lg p-3 text-sm">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          {/* Input Altura */}
          <div className="form-control w-full">
            <label className="label" htmlFor="height">
              <span className="label-text text-base-content/80">Altura (cm)</span>
            </label>
            <input
              type="number"
              id="height"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Ex: 175"
              required
            />
          </div>

          {/* Input Peso */}
          <div className="form-control w-full">
            <label className="label" htmlFor="weight">
              <span className="label-text text-base-content/80">Peso (kg)</span>
            </label>
            <input
              type="number"
              id="weight"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Ex: 70.5"
              required
            />
          </div>

          {/* Input Meta Calórica */}
          <div className="form-control w-full">
            <label className="label" htmlFor="targetCalories">
              <span className="label-text text-base-content/80">Meta Calórica Diária (kcal)</span>
            </label>
            <input
              type="number"
              id="targetCalories"
              value={targetCalories}
              onChange={(e) => setTargetCalories(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Ex: 2000"
              required
            />
          </div>

          <div className="modal-action mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                'Salvar Dados'
              )}
            </button>
          </div>
        </form>
      </div>
      
      <div className="modal-backdrop" onClick={onClose}>
        <button>Fechar</button>
      </div>
    </div>
  );
}