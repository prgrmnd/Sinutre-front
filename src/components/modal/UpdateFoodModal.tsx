import { useEffect, useState, FormEvent } from 'react';
import { api } from '@/lib/api';
import type { Food } from '@/types/food';
import { useToast } from '@/context/ToastContext';

interface UpdateFoodModalProps {
  modalId: string;
  food: Food | null;
  onUpdated: () => void;
}

export function UpdateFoodModal({ modalId, food, onUpdated }: UpdateFoodModalProps) {
  const { addToast } = useToast();
  const [name, setName] = useState('');
  const [calories, setCalories] = useState<number | ''>('');
  const [carbs, setCarbs] = useState<number | ''>('');
  const [protein, setProtein] = useState<number | ''>('');
  const [fat, setFat] = useState<number | ''>('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (food) {
      setName(food.name);
      setCalories(food.caloriesPer100g);
      setCarbs(food.carbsPer100g);
      setProtein(food.proteinPer100g);
      setFat(food.fatPer100g);
    }
  }, [food]);

  function closeModal() {
    (document.getElementById(modalId) as HTMLDialogElement)?.close();
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!food) return;

    if (!name.trim()) {
      addToast('error', 'O nome do alimento não pode estar vazio.');
      return;
    }

    if (calories === '' || carbs === '' || protein === '' || fat === '') {
      addToast('error', 'Preencha todos os valores nutricionais.');
      return;
    }

    if (Number(calories) < 0 || Number(carbs) < 0 || Number(protein) < 0 || Number(fat) < 0) {
      addToast('error', 'Os valores nutricionais não podem ser negativos.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/foods/${food.id}`, {
        name,
        caloriesPer100g: Number(calories),
        carbsPer100g: Number(carbs),
        proteinPer100g: Number(protein),
        fatPer100g: Number(fat),
      });
      
      onUpdated();
      addToast('success', 'Alimento atualizado com sucesso!');
      closeModal();
    } catch (error: any) {
      console.error('Erro ao atualizar alimento:', error);
      if (error.response?.data?.error) {
        addToast('error', error.response.data.error);
      } else {
        addToast('error', 'Ocorreu um erro inesperado ao salvar o alimento. Tente novamente.');
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
        
        <h3 className="font-bold text-lg mb-4">Atualizar Alimento</h3>
        
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
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </div>
      
      <form method="dialog" className="modal-backdrop">
        <button onClick={closeModal} type="button">fechar</button>
      </form>
    </dialog>
  );
}