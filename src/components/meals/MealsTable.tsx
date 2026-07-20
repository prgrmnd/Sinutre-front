import type { Meal } from "@/types/mealSummary";
import { MealsTableRow } from './MealsTableRow';

interface MealsTableProps {
  meals: Meal[];
  onActionClick?: (meal: Meal) => void;
  onEditMeal: (meal: Meal) => void; // <-- 1. Adicionamos a propriedade aqui
}

export function MealsTable({ meals, onActionClick, onEditMeal }: MealsTableProps) {
  
  return (
    <section className="card bg-base-100 shadow-sm w-full hidden lg:block">
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full text-base-content">
          <thead className="bg-base-200/70 text-base-content/60 uppercase text-xs">
            <tr>
              <th className="w-16 text-center">ID</th>
              <th>Descrição</th>
              <th>Data</th>
              <th>Categoria</th>
              <th>Total de Calorias</th>
              <th className="text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {meals.map(meal => (
              <MealsTableRow
                key={meal.id}
                meal={meal}
                onActionClick={onActionClick}
                onEditMeal={onEditMeal} // <-- 2. Repassamos a função para a linha
              />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}