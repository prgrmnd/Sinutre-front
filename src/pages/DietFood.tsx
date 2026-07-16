import { useEffect, useState } from 'react';
import { Plus, Trash, PencilSimple } from '@phosphor-icons/react';

import { SimpleHeader } from '@/components/layout/SimpleHeader';
import { AddFoodModal } from '@/components/modal/AddFoodModal';
// 1. Importar o novo Modal de Edição
import { EditFoodModal } from '@/components/modal/UpdateFoodModal'; 

import { getFoods } from '@/services/foodService';
import type { Food } from '@/types/food';
import { api } from '@/lib/api';

const MODAL_ID = 'create-food-modal';
const EDIT_MODAL_ID = 'edit-food-modal'; // 2. Novo ID para o modal de edição

export function DietFoodPage() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 3. Estado para controlar qual alimento foi selecionado para edição
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

  // 4. Nova função para abrir o modal de edição
  function openEditModal(food: Food) {
    setFoodToEdit(food); // Guarda os dados do alimento selecionado
    (document.getElementById(EDIT_MODAL_ID) as HTMLDialogElement)?.showModal();
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
                  
                  <div className="flex flex-col gap-2 ml-4">
                    {/* Botão Editar (Abre o Modal) */}
                    <button
                      onClick={() => openEditModal(food)}
                      className="btn btn-ghost btn-circle btn-sm text-info hover:bg-info/10"
                      title="Editar alimento"
                    >
                      <PencilSimple size={20} weight="bold" />
                    </button>

                    {/* Botão Excluir */}
                    <button
                      onClick={() => handleDeleteFood(food.id)}
                      className="btn btn-ghost btn-circle btn-sm text-error hover:bg-error/10"
                      title="Excluir alimento"
                    >
                      <Trash size={20} weight="bold" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <span>🔥 {food.caloriesPer100g} kcal</span>
                  <span>🍞 {food.carbsPer100g} g</span>
                  <span>🍗 {food.proteinPer100g} g</span>
                  <span>🥑 {food.fatPer100g} g</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Botão de Adicionar (Abre modal de criação) */}
      <button
        className="btn btn-primary btn-circle btn-lg fixed bottom-6 right-6 shadow-lg z-50"
        onClick={() =>
          (document.getElementById(MODAL_ID) as HTMLDialogElement)?.showModal()
        }
      >
        <Plus size={24} weight="bold" />
      </button>

      {/* Componentes dos Modais */}
      <AddFoodModal
        modalId={MODAL_ID}
        onCreated={loadFoods}
      />
      
      {/* 5. Renderizando o novo modal de edição */}
      <EditFoodModal
        modalId={EDIT_MODAL_ID}
        food={foodToEdit}
        onUpdated={loadFoods}
      />
    </div>
  );
}