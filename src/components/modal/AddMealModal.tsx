import { useState, useMemo } from 'react';
import type { FoodItem } from '@/types/meal';
import { MealItemForm } from './MealItemForm';
import { MealItemsTable } from './MealItemsTable';
import { MealMacrosSummary } from './MealMacrosSummary';
import { MealMetadataForm } from './MealMetadataForm';
import { MealCategory } from '@/types/meal';
import { MEAL_CATEGORY_BY_ID } from '@/constants/mealCategories';
import { createMeal } from '@/services/mealService';
import { useToast } from '@/context/ToastContext';
import { MealState } from '@/types/meal';

interface AddMealModalProps {
  open: boolean;
  onClose: () => void;
  typeMeal: MealCategory | null;
  onMealCreated: () => Promise<void>;
}

export function AddMealModal({
  open,
  typeMeal,
  onClose,
  onMealCreated
}: AddMealModalProps) {
  if (!typeMeal) {
    return <></>;
  }

  const category = MEAL_CATEGORY_BY_ID[typeMeal];
  const { addToast } = useToast();

  const [meal, setMeal] = useState<MealState>({
    description: '',
    type: category.id,
    eatTime: '',
  });

  const [items, setItems] = useState<FoodItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  function handleAddItem(item: FoodItem) {
    setItems((current) => [...current, item]);
  }

  function handleRemoveItem(item: FoodItem) {
    setItems((current) => current.filter((x) => x.id !== item.id));
  }

  async function handleSaveMeal() {
    if (!meal.description || meal.description.trim() === '') {
      addToast('error', 'Por favor, preencha a descrição da refeição.');
      return;
    }

    if (!meal.eatTime) {
      addToast('error', 'Por favor, informe a data e o horário da refeição.');
      return;
    }

    if (items.length === 0) {
      addToast('error', 'Por favor, adicione pelo menos um alimento à refeição.');
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

      addToast('success', 'Refeição cadastrada com sucesso!');
      
      setMeal({ description: '', type: category.id, eatTime: '' });
      setItems([]);
      onClose();

    } catch (error) {
      console.error("Erro ao salvar refeição:", error);
      addToast('error', 'Ocorreu um erro no servidor ao salvar a refeição. Tente novamente.');
    } finally {
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
            disabled={isSaving}
          >
            Cancelar
          </button>
          
          <button 
            type="button" 
            className="btn btn-primary" 
            onClick={handleSaveMeal}
            disabled={isSaving}
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