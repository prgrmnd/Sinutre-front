import type { Meal } from "@/types/mealSummary";
import { PencilSimple, ListMagnifyingGlass, Trash } from '@phosphor-icons/react';
import { MEAL_CATEGORIES } from '@/constants/mealCategories';

interface MealsListProps {
  meals: Meal[];
  onActionClick?: (meal: Meal) => void;
  onEditMeal: (meal: Meal) => void;
  onDeleteMeal: (meal: Meal) => void;
}

export function MealsList({ meals, onActionClick, onEditMeal, onDeleteMeal }: MealsListProps) {
  if (meals.length === 0) {
    return <div className="text-center text-base-content/50 py-4 lg:hidden">Nenhuma refeição encontrada.</div>;
  }

  return (
    <div className="flex flex-col gap-4 lg:hidden w-full">
      {meals.map((meal) => {
        const formattedDate = new Intl.DateTimeFormat('pt-BR', {
          dateStyle: 'short',
          timeStyle: 'short',
        }).format(new Date(meal.eatTime));

        const categoryLabel = MEAL_CATEGORIES.find(
          (c) => c.id.toLowerCase() === meal.type.toLowerCase()
        )?.label || meal.type;

        return (
          <div key={meal.id} className="card bg-base-100 shadow-sm border border-base-200">
            <div className="card-body p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-lg">{meal.name}</h3>
                  <span className="text-xs text-base-content/60">{formattedDate}</span>
                </div>
                <div className="badge badge-primary badge-outline text-xs">{categoryLabel}</div>
              </div>
              
              <div className="text-sm font-semibold text-base-content/80 mb-4">
                🔥 {Math.round(meal.totals.calories)} kcal
              </div>

              <div className="flex flex-wrap justify-end gap-2 mt-auto">
                <button onClick={() => onEditMeal(meal)} className="btn btn-outline btn-info btn-sm">
                  <PencilSimple size={16} className="mr-1" /> Editar
                </button>
                
                <button onClick={() => onDeleteMeal(meal)} className="btn btn-outline btn-error btn-sm">
                  <Trash size={16} className="mr-1" /> Excluir
                </button>

                <button onClick={() => onActionClick && onActionClick(meal)} className="btn btn-outline btn-sm">
                  <ListMagnifyingGlass size={16} className="mr-1" /> Detalhes
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}