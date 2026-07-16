import { useEffect, useState } from 'react';
import { Plus, Trash } from '@phosphor-icons/react';
import { SimpleHeader } from '@/components/layout/SimpleHeader';
import { AddFoodModal } from '@/components/modal/AddFoodModal';
import { getFoods } from '@/services/foodService';
import type { Food } from '@/types/food';
import { api } from '@/lib/api';

const MODAL_ID = 'create-food-modal';

export function DietFoodPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadFoods() {
    try {
      const data = await getFoods();
      setFoods(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFoods();
  }, []);

  async function handleDeleteFood(id: number) {
    const confirmDelete = window.confirm('Tem certeza que deseja excluir este alimento?');
    if (!confirmDelete) return;

    try {
      await api.delete(`/foods/${id}`);
      
      setFoods((prevFoods) => prevFoods.filter((food) => food.id !== id));
      
    } catch (error) {
      console.error('Erro ao excluir alimento:', error);
      alert('Não foi possível excluir o alimento. Tente novamente.');
    }
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto">
      <SimpleHeader
        title="Dieta"
        subtitle="Gerencie seus alimentos"
      />

      {loading ? (
        <p>Carregando...</p>
      ) : (
        <div className="grid gap-4 mt-6">
          {foods.map((food) => (
            <div
              key={food.id}
              className="card bg-base-100 shadow-sm"
            >
              <div className="card-body">
                
                <div className="flex justify-between items-start mb-2">
                  <h2 className="card-title m-0">
                    {food.name}
                  </h2>
                  
                  <button
                    onClick={() => handleDeleteFood(food.id)}
                    className="btn btn-ghost btn-circle btn-sm text-error hover:bg-error/10"
                    title="Excluir alimento"
                  >
                    <Trash size={20} weight="bold" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <span>
                    🔥 {food.caloriesPer100g} kcal
                  </span>

                  <span>
                    🍞 {food.carbsPer100g} g
                  </span>

                  <span>
                    🍗 {food.proteinPer100g} g
                  </span>

                  <span>
                    🥑 {food.fatPer100g} g
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className="btn btn-primary btn-circle btn-lg fixed bottom-6 right-6 shadow-lg z-50"
        onClick={() =>
          (
            document.getElementById(
              MODAL_ID,
            ) as HTMLDialogElement
          )?.showModal()
        }
      >
        <Plus size={24} weight="bold" />
      </button>

      <AddFoodModal
        modalId={MODAL_ID}
        onCreated={loadFoods}
      />
    </div>
  );
}