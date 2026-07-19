import { useState, useMemo, useEffect } from 'react';
import type { FoodItem } from '@/types/meal';
import { MealItemForm } from './MealItemForm';
import { MealItemsTable } from './MealItemsTable';
import { MealMacrosSummary } from './MealMacrosSummary';
import { MealMetadataForm } from './MealMetadataForm';
import { api } from '@/lib/api';
import { MealState } from '@/types/meal';

interface UpdateMealModalProps {
  open: boolean;
  mealToEdit: any | null; // Refeição selecionada vinda da tabela
  onClose: () => void;
  onMealUpdated: () => Promise<void>;
}

export function UpdateMealModal({
  open,
  mealToEdit,
  onClose,
  onMealUpdated
}: UpdateMealModalProps) {
  const [meal, setMeal] = useState<MealState>({
    description: '',
    type: 'BREAKFAST', 
    eatTime: '',
  });

  const [items, setItems] = useState<FoodItem[]>([]);

  // Carrega os dados da refeição no modal assim que ele é aberto
  useEffect(() => {
    if (mealToEdit && open) {
      setMeal({
        description: mealToEdit.name || '',
        type: mealToEdit.type || 'BREAKFAST',
        // Ajusta a data para o formato aceito pelo input datetime-local
        eatTime: mealToEdit.eatTime ? new Date(mealToEdit.eatTime).toISOString().slice(0, 16) : '',
      });

      if (mealToEdit.items) {
        const mappedItems = mealToEdit.items.map((item: any) => ({
          id: item.id || Math.random().toString(), 
          foodId: item.foodId,
          name: item.food?.name || 'Alimento',
          grams: item.foodG,
          calories: item.calories,
          carbs: item.carbs,
          protein: item.protein,
          fat: item.fat,
        }));
        setItems(mappedItems);
      }
    }
  }, [mealToEdit, open]);

  function handleAddItem(item: FoodItem) {
    setItems((current) => [...current, item]);
  }

  function handleRemoveItem(item: FoodItem) {
    setItems((current) => current.filter((x) => x.id !== item.id));
  }

  async function handleSaveMeal() {
    if (!mealToEdit) return;

    try {
      await api.put(`/meals/${mealToEdit.id}`, {
        ...meal,
        items: items.map((item) => ({
          foodId: item.foodId,
          grams: item.grams,
        })),
      });

      await onMealUpdated();
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar refeição:", error);
      alert("Erro ao atualizar a refeição. Verifique os dados.");
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
        { carbs: 0, proteins: 0, fats: 0, calories: 0, caloriesGoal: 0 }
      ),
    [items]
  );

  if (!mealToEdit) return <></>;

  return (
    <div className={`modal ${open ? 'modal-open' : ''}`} role="dialog">
      <div className="modal-box max-w-6xl">
        <h2 className="text-3xl font-semibold mb-6">Editar Refeição</h2>
        
        <MealMacrosSummary macros={macros} />
        <MealMetadataForm meal={meal} setMeal={setMeal} />

        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-4">Itens da Refeição</h3>
          <MealItemForm onAdd={handleAddItem} />
        </div>

        <MealItemsTable items={items} onRemove={handleRemoveItem} />

        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancelar
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSaveMeal}>
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}