import { useEffect, useState, FormEvent } from 'react';
import { api } from '@/lib/api';
import type { Food } from '@/types/food';

interface UpdateFoodModalProps {
  modalId: string;
  food: Food | null;
  onUpdated: () => void;
}

export function UpdateFoodModal({ modalId, food, onUpdated }: UpdateFoodModalProps) {
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
      closeModal();
    } catch (error) {
      console.error('Erro ao atualizar alimento:', error);
      alert('Não foi possível atualizar o alimento.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <dialog id={modalId} className="modal">
      <div className="modal-box">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
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
        <button>fechar</button>
      </form>
    </dialog>
  );
}