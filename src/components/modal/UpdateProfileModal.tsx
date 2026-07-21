import { useState, useEffect, FormEvent } from 'react';
import { updateProfile } from '@/services/userService';
import { useToast } from '@/context/ToastContext';

interface UserProfile {
  height?: number | null;
  weight?: number | null;
  targetCalories?: number | null;
}

interface UpdateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: UserProfile | null; 
}

export function UpdateProfileModal({ isOpen, onClose, initialData }: UpdateProfileModalProps) {
  const { addToast } = useToast();
  const [height, setHeight] = useState<string | number>('');
  const [weight, setWeight] = useState<string | number>('');
  const [targetCalories, setTargetCalories] = useState<string | number>('');

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setHeight(initialData.height || '');
      setWeight(initialData.weight || '');
      setTargetCalories(initialData.targetCalories || '');
    } else if (!isOpen) {
      setHeight('');
      setWeight('');
      setTargetCalories('');
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = {
      height: Number(height),
      weight: Number(weight),
      targetCalories: Number(targetCalories),
    };

    try {
      console.log('Dados sendo enviados:', payload);
      
      await updateProfile(payload);
      
      addToast('success', 'Perfil físico atualizado com sucesso!');
      onClose();
    } catch (err) {
      console.error(err);
      addToast('error', 'Ocorreu um erro ao salvar os dados. Verifique as informações e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-base-100">
        <h3 className="font-bold text-lg text-base-content mb-6">Atualizar Perfil Físico</h3>
        
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