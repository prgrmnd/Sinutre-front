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
  mealToEdit: any | null;
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
  const [isDataReady, setIsDataReady] = useState(false);

  useEffect(() => {
    if (mealToEdit && open) {
      // 1. Prepara a data removendo bugs de fuso horário
      let localTime = '';
      if (mealToEdit.eatTime) {
        try {
          const d = new Date(mealToEdit.eatTime);
          if (!isNaN(d.getTime())) {
            const tzOffset = d.getTimezoneOffset() * 60000;
            localTime = new Date(d.getTime() - tzOffset).toISOString().slice(0, 16);
          }
        } catch (error) {
          console.error("Erro ao converter data", error);
        }
      }

      // 2. Preenche os estados
      setMeal({
        description: mealToEdit.name || mealToEdit.description || '',
        type: mealToEdit.type || 'BREAKFAST', 
        eatTime: localTime,
      });

      if (mealToEdit.items) {
        setItems(mealToEdit.items.map((item: any) => ({
          id: item.id || Math.random().toString(), 
          foodId: item.foodId || item.food?.id,
          name: item.food?.name || 'Alimento',
          grams: item.foodG || item.grams || 0,
          calories: item.calories || 0,
          carbs: item.carbs || 0,
          protein: item.protein || 0,
          fat: item.fat || 0,
        })));
      }

      // 3. Sinaliza que o React já pode desenhar os formulários
      setIsDataReady(true);
    } else {
      setIsDataReady(false);
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

  // Se o modal estiver fechado ou os dados ainda não estiverem prontos, não renderiza o conteúdo para evitar inputs vazios
  if (!open || !mealToEdit || !isDataReady) return null;

  return (
    <div className="modal modal-open" role="dialog">
      <div className="modal-box max-w-6xl">
        <h2 className="text-3xl font-semibold mb-6">Editar Refeição</h2>
        
        <MealMacrosSummary macros={macros} />
        
        {/* A chave (key) obriga os inputs a recarregarem com a descrição e data certas! */}
        <MealMetadataForm key={`meta-${mealToEdit.id}`} meal={meal} setMeal={setMeal} />

        <div className="mb-4 mt-6">
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