import { useState, useMemo, useEffect } from 'react';
import type { FoodItem } from '@/types/meal';
import { MealItemForm } from './MealItemForm';
import { MealItemsTable } from './MealItemsTable';
import { MealMacrosSummary } from './MealMacrosSummary';
import { MealMetadataForm } from './MealMetadataForm';
import { MealCategory } from '@/types/meal';
import { MEAL_CATEGORY_BY_ID } from '@/constants/mealCategories';
import { createMeal } from '@/services/mealService';

import { MealState } from '@/types/meal';

interface AddMealModalProps {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
  typeMeal: MealCategory | null;
  onMealCreated: () => Promise<void>;
}

export function AddMealModal({
  open,
  typeMeal,
  onClose,
  onMealCreated
}: AddMealModalProps) {
  if(!typeMeal){
    return <></>
  }

  const category = MEAL_CATEGORY_BY_ID[typeMeal];
  
  const [meal, setMeal] = useState<MealState>({
    description: '',
    type: category.id,
    eatTime: '',
  });

  const [items, setItems] = useState<FoodItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success', message: string } | null>(null);

  useEffect(() => {
    if (!open) {
      setFeedback(null);
    }
  }, [open]);

  function handleAddItem(item: FoodItem) {
    setItems((current) => [...current, item]);
    setFeedback(null);
  }

  function handleRemoveItem(item: FoodItem) {
    setItems((current) => current.filter((x) => x.id !== item.id));
  }

  async function handleSaveMeal() {
    setFeedback(null);

    if (!meal.description || meal.description.trim() === '') {
      setFeedback({ type: 'error', message: 'Por favor, preencha a descrição da refeição.' });
      return;
    }

    if (!meal.eatTime) {
      setFeedback({ type: 'error', message: 'Por favor, informe a data e o horário da refeição.' });
      return;
    }

    if (items.length === 0) {
      setFeedback({ type: 'error', message: 'Por favor, adicione pelo menos um alimento à refeição.' });
      return;
    }

    try {
      setIsSaving(true);
      await createMeal({
        ...meal,
        items: items.map((item) => ({
          foodId: item.foodId,
          grams: item.grams,
        })),
      });

      await onMealCreated();

      setFeedback({ type: 'success', message: 'Refeição cadastrada com sucesso!' });
      
      setTimeout(() => {
        setMeal({ description: '', type: category.id, eatTime: '' });
        setItems([]);
        setIsSaving(false);
        onClose();
      }, 1500);

    } catch (error) {
      console.error("Erro ao salvar refeição:", error);
      setFeedback({ type: 'error', message: 'Ocorreu um erro no servidor ao salvar a refeição. Tente novamente.' });
      setIsSaving(false);
    }
  }

  const macros = useMemo(
    () =>
      items.reduce(
        (acc, item) => {
          acc.carbs += item.carbs;
          acc.proteins += item.protein;
          acc.fats += item.fat;
          acc.calories += item.calories;

          return acc;
        },
        {
          carbs: 0,
          proteins: 0,
          fats: 0,
          calories: 0,
          caloriesGoal: 0,
        },
      ),
    [items],
  );

  return (
    <div className={`modal ${open ? 'modal-open' : ''}`} role="dialog">
      <div className="modal-box max-w-6xl">
        <h2 className="text-3xl font-semibold mb-6">Adicionar Refeição</h2>
        
        {feedback && (
          <div className={`alert ${feedback.type === 'error' ? 'alert-error' : 'alert-success'} shadow-sm mb-6 rounded-lg`}>
            <span>{feedback.message}</span>
          </div>
        )}

        <MealMacrosSummary macros={macros} />
        <MealMetadataForm meal={meal} setMeal={setMeal} />

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-4">Itens da Refeição</h3>
          <MealItemForm onAdd={handleAddItem} />
        </div>

        <MealItemsTable items={items} onRemove={handleRemoveItem} />

        <div className="modal-action">
          <button 
            type="button" 
            className="btn btn-ghost" 
            onClick={onClose}
            disabled={isSaving || feedback?.type === 'success'}
          >
            Cancelar
          </button>
          
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleSaveMeal}
            disabled={isSaving || feedback?.type === 'success'}
          >
            {isSaving ? (
              <span className="loading loading-spinner"></span>
            ) : (
              'Salvar refeição'
            )}
          </button>
        </div>
      </div>
      
      <div className="modal-backdrop" onClick={() => !isSaving && onClose()}>
        <button>Fechar</button>
      </div>
    </div>
  );
}