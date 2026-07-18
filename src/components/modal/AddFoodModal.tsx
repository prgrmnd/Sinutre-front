import { useState, FormEvent } from 'react';
import { api } from '@/lib/api';

interface AddFoodModalProps {
  modalId: string;
  onCreated: () => void | Promise<void>;
}

export function AddFoodModal({ modalId, onCreated }: AddFoodModalProps) {
  const [name, setName] = useState('');
  const [calories, setCalories] = useState<number | ''>('');
  const [carbs, setCarbs] = useState<number | ''>('');
  const [protein, setProtein] = useState<number | ''>('');
  const [fat, setFat] = useState<number | ''>('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function resetForm() {
    setName('');
    setCalories('');
    setCarbs('');
    setProtein('');
    setFat('');
    setErrorMessage(null);
  }

  function closeModal() {
    resetForm();
    (document.getElementById(modalId) as HTMLDialogElement)?.close();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('O nome do alimento não pode estar vazio.');
      return;
    }

    if (calories === '' || carbs === '' || protein === '' || fat === '') {
      setErrorMessage('Preencha todos os valores nutricionais.');
      return;
    }

    if (Number(calories) < 0 || Number(carbs) < 0 || Number(protein) < 0 || Number(fat) < 0) {
      setErrorMessage('Os valores nutricionais não podem ser negativos.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/foods', {
        name,
        caloriesPer100g: Number(calories),
        carbsPer100g: Number(carbs),
        proteinPer100g: Number(protein),
        fatPer100g: Number(fat),
      });
      
      await onCreated();
      closeModal();
    } catch (error: any) {
      console.error('Erro ao criar alimento:', error);
      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Ocorreu um erro inesperado ao salvar o alimento. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button onClick={closeModal} type="button" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>
        
        <h3 className="font-bold text-lg mb-4">Adicionar Alimento</h3>
        
        {errorMessage && (
          <div role="alert" className="alert alert-error mb-4 py-2 rounded-lg text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="form-control">
            <label className="label"><span className="label-text">Nome</span></label>
            <input 
              type="text" 
              required 
              className="input input-bordered w-full" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Ex: Arroz branco cozido"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label"><span className="label-text">Calorias (kcal)</span></label>
              <input 
                type="number" 
                step="0.01" 
                required 
                className="input input-bordered w-full" 
                value={calories} 
                onChange={(e) => setCalories(Number(e.target.value))} 
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Carboidratos (g)</span></label>
              <input 
                type="number" 
                step="0.01" 
                required 
                className="input input-bordered w-full" 
                value={carbs} 
                onChange={(e) => setCarbs(Number(e.target.value))} 
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Proteínas (g)</span></label>
              <input 
                type="number" 
                step="0.01" 
                required 
                className="input input-bordered w-full" 
                value={protein} 
                onChange={(e) => setProtein(Number(e.target.value))} 
              />
            </div>
            <div className="form-control">
              <label className="label"><span className="label-text">Gorduras (g)</span></label>
              <input 
                type="number" 
                step="0.01" 
                required 
                className="input input-bordered w-full" 
                value={fat} 
                onChange={(e) => setFat(Number(e.target.value))} 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary mt-2" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Salvando...' : 'Adicionar Alimento'}
          </button>
        </form>
      </div>
      
      <form method="dialog" className="modal-backdrop">
        <button onClick={closeModal} type="button">fechar</button>
      </form>
    </dialog>
  );
}