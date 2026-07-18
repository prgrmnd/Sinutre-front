import { useEffect, useState } from 'react';
// 1. Adicionamos os novos ícones na importação
import { Plus, Trash, PencilSimple, Fire, Lightning, Barbell, Drop } from '@phosphor-icons/react';import { SimpleHeader } from '@/components/layout/SimpleHeader';
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

                {/* 2. Área de métricas com os novos ícones */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-2 mt-3 bg-base-200/40 p-3 rounded-lg">
                  
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-base-content/50 tracking-wider">Calorias</span>
                    <span className="font-semibold text-primary text-xs mt-0.5 flex items-center gap-1">
                      <Fire size={14} weight="duotone" /> {food.caloriesPer100g} kcal
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-base-content/50 tracking-wider">Carboidratos</span>
                    <span className="text-xs mt-0.5 text-base-content/80 flex items-center gap-1">
                      <Lightning size={14} weight="duotone" /> {food.carbsPer100g}g
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-base-content/50 tracking-wider">Proteínas</span>
                    <span className="text-xs mt-0.5 text-base-content/80 flex items-center gap-1">
                      <Barbell size={14} weight="duotone" /> {food.proteinPer100g}g
                    </span>
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase font-bold text-base-content/50 tracking-wider">Gorduras</span>
                    <span className="text-xs mt-0.5 text-base-content/80 flex items-center gap-1">
                      <Drop size={14} weight="duotone" /> {food.fatPer100g}g
                    </span>
                  </div>

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