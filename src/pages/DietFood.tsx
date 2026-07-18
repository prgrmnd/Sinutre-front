import { useEffect, useState } from 'react';
import { Plus, Trash, PencilSimple } from '@phosphor-icons/react';
import { SimpleHeader } from '@/components/layout/SimpleHeader';
import { AddFoodModal } from '@/components/modal/AddFoodModal';
import { UpdateFoodModal } from '@/components/modal/UpdateFoodModal'; 
import { getFoods } from '@/services/foodService';
import type { Food } from '@/types/food';
import { api } from '@/lib/api';

const MODAL_ID = 'create-food-modal';
const UPDATE_MODAL_ID = 'update-food-modal';

export function DietFoodPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [foodToEdit, setFoodToEdit] = useState<Food | null>(null);

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

  function openUpdateModal(food: Food) {
    setFoodToEdit(food); 
    (document.getElementById(UPDATE_MODAL_ID) as HTMLDialogElement)?.showModal();
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-24">
      <SimpleHeader
        title="Dieta"
        subtitle="Gerencie seus alimentos"
      />

      {loading ? (
        <p className="mt-6">Carregando...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {foods.map((food) => (
            <div
              key={food.id}
              className="card card-compact bg-base-100 shadow-sm border border-base-200 hover:shadow-md transition-all"
            >
              <div className="card-body">
                <div className="flex justify-between items-start mb-1">
                  <h2 className="card-title text-base m-0 line-clamp-1" title={food.name}>
                    {food.name}
                  </h2>
                  
                  <div className="flex gap-1 ml-2 shrink-0">
                    <button
                      onClick={() => openUpdateModal(food)}
                      className="btn btn-ghost btn-xs text-info hover:bg-info/10 px-2"
                      title="Atualizar alimento"
                    >
                      <PencilSimple size={16} weight="bold" />
                    </button>

                    <button
                      onClick={() => handleDeleteFood(food.id)}
                      className="btn btn-ghost btn-xs text-error hover:bg-error/10 px-2"
                      title="Excluir alimento"
                    >
                      <Trash size={16} weight="bold" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mt-2 bg-base-200/40 p-2 rounded-lg">
                  <span className="font-semibold text-primary">🔥 {food.caloriesPer100g} kcal</span>
                  <span>🍞 {food.carbsPer100g}g</span>
                  <span>🍗 {food.proteinPer100g}g</span>
                  <span>🥑 {food.fatPer100g}g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        className="btn btn-primary btn-circle btn-lg fixed bottom-6 right-6 shadow-lg z-50"
        onClick={() =>
          (document.getElementById(MODAL_ID) as HTMLDialogElement)?.showModal()
        }
      >
        <Plus size={24} weight="bold" />
      </button>

      <AddFoodModal
        modalId={MODAL_ID}
        onCreated={loadFoods}
      />
      
      <UpdateFoodModal
        modalId={UPDATE_MODAL_ID}
        food={foodToEdit}
        onUpdated={loadFoods}
      />
    </div>
  );
}