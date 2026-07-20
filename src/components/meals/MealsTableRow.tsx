import type { Meal } from "@/types/mealSummary";
import { PencilSimple, ListMagnifyingGlass, Trash } from '@phosphor-icons/react';
import { MEAL_CATEGORIES } from '@/constants/mealCategories';

interface MealsTableRowProps {
  meal: Meal;
  onActionClick?: (meal: Meal) => void;
  onEditMeal: (meal: Meal) => void; 
  onDeleteMeal: (meal: Meal) => void;
}

export function MealsTableRow({ meal, onActionClick, onEditMeal, onDeleteMeal }: MealsTableRowProps) {
  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(meal.eatTime));

  const categoryLabel = MEAL_CATEGORIES.find(
    (c) => c.id.toLowerCase() === meal.type.toLowerCase()
  )?.label || meal.type;

  return (
    <tr className="hover">
      <td className="text-center font-medium">{meal.id}</td>
      <td>{meal.name}</td>
      <td>{formattedDate}</td>
      <td>{categoryLabel}</td>
      <td>{Math.round(meal.totals.calories)} kcal</td>
      <td className="text-center">
        <div className="flex justify-center gap-2">
          <button onClick={() => onEditMeal(meal)} className="btn btn-ghost btn-xs text-info hover:bg-info/10" title="Editar">
             <PencilSimple size={16} weight="bold" />
          </button>
          
          <button onClick={() => onDeleteMeal(meal)} className="btn btn-ghost btn-xs text-error hover:bg-error/10" title="Excluir">
             <Trash size={16} weight="bold" />
          </button>

          <button onClick={() => onActionClick && onActionClick(meal)} className="btn btn-ghost btn-xs" title="Detalhes">
            <ListMagnifyingGlass size={16} weight="bold" />
          </button>
        </div>
      </td>
    </tr>
  );
}