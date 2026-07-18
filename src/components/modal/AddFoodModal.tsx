import { useState, FormEvent } from 'react';
import { createFood } from '@/services/foodService';

interface AddFoodModalProps {
  modalId: string;
  onCreated: () => Promise<void> | void;
}

export function AddFoodModal({ modalId, onCreated }: AddFoodModalProps) {
  const [name, setName] = useState('');
  const [caloriesPer100g, setCaloriesPer100g] = useState('');
  const [carbsPer100g, setCarbsPer100g] = useState('');
  const [proteinPer100g, setProteinPer100g] = useState('');
  const [fatPer100g, setFatPer100g] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function closeModal() {
    setErrorMessage(null);
    (document.getElementById(modalId) as HTMLDialogElement)?.close();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setErrorMessage(null);

      if (!name.trim()) {
        setErrorMessage('O nome do alimento não pode estar vazio.');
        return;
      }

      if (caloriesPer100g === '' || carbsPer100g === '' || proteinPer100g === '' || fatPer100g === '') {
        setErrorMessage('Preencha todos os valores nutricionais.');
        return;
      }

      if (Number(caloriesPer100g) < 0 || Number(carbsPer100g) < 0 || Number(proteinPer100g) < 0 || Number(fatPer100g) < 0) {
        setErrorMessage('Os valores nutricionais não podem ser negativos.');
        return;
      }

      setLoading(true);

      await createFood({
        name,
        caloriesPer100g: Number(caloriesPer100g),
        carbsPer100g: Number(carbsPer100g),
        proteinPer100g: Number(proteinPer100g),
        fatPer100g: Number(fatPer100g),
      });

      setName('');
      setCaloriesPer100g('');
      setCarbsPer100g('');
      setProteinPer100g('');
      setFatPer100g('');
      setErrorMessage(null);

      await onCreated();
      closeModal();
    } catch (error: any) {
      console.error(error);
      if (error.response?.data?.error) {
        setErrorMessage(error.response.data.error);
      } else {
        setErrorMessage('Ocorreu um erro inesperado ao salvar. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button onClick={closeModal} type="button" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
        </form>

        <h3 className="font-bold text-lg mb-4">Novo Alimento</h3>

        {errorMessage && (
          <div role="alert" className="alert alert-error mb-4 py-2 rounded-lg text-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
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
                value={caloriesPer100g}
                onChange={(e) => setCaloriesPer100g(e.target.value)}
              />
            </div>
            
            <div className="form-control">
              <label className="label"><span className="label-text">Carboidratos (g)</span></label>
              <input
                type="number"
                step="0.01"
                required
                className="input input-bordered w-full"
                value={carbsPer100g}
                onChange={(e) => setCarbsPer100g(e.target.value)}
              />
            </div>
            
            <div className="form-control">
              <label className="label"><span className="label-text">Proteínas (g)</span></label>
              <input
                type="number"
                step="0.01"
                required
                className="input input-bordered w-full"
                value={proteinPer100g}
                onChange={(e) => setProteinPer100g(e.target.value)}
              />
            </div>
            
            <div className="form-control">
              <label className="label"><span className="label-text">Gorduras (g)</span></label>
              <input
                type="number"
                step="0.01"
                required
                className="input input-bordered w-full"
                value={fatPer100g}
                onChange={(e) => setFatPer100g(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary mt-2"
            disabled={loading}
          >
            {loading ? 'Salvando...' : 'Salvar Alimento'}
          </button>
        </form>
      </div>

      <form method="dialog" className="modal-backdrop">
        <button onClick={closeModal} type="button">fechar</button>
      </form>
    </dialog>
  );
}