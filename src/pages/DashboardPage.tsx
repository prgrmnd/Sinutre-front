import { useState, useEffect, useMemo } from 'react';
import { AddMealCard } from '@/components/cards/AddMealCard';
import { TotalMealsCard } from '@/components/cards/TotalMealsCard';
import { Header } from '@/components/layout/Header';
import { MacroStatsBar } from '@/components/macros/MacroStatsBar';
import { MealFab } from '@/components/meals/MealFab';
import { MealsList } from '@/components/meals/MealsList';
import { MealsTable } from '@/components/meals/MealsTable';
import { AddMealModal } from '@/components/modal/AddMealModal';
import { UpdateMealModal } from '@/components/modal/UpdateMealModal';
import { useAuth } from '@/context/AuthContext';
import { Meal } from '@/types/mealSummary';
import { api } from '@/lib/api';
import { useMealModal } from '@/hooks/useMealModal';
import { WarningCircle } from '@phosphor-icons/react';
import { useToast } from '@/context/ToastContext';

interface DashboardPageProps {
  drawerId: string;
}

export function DashboardPage({ drawerId }: DashboardPageProps) {
  const { user } = useAuth();
  const { addToast } = useToast();

  if (!user) {
    return <></>;
  }

  const modal = useMealModal();

  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [caloricGoal, setCaloricGoal] = useState<number>(2000);
  const [goalExceeded, setGoalExceeded] = useState<boolean>(false);

  const [mealToEdit, setMealToEdit] = useState<Meal | null>(null);

  async function loadMeals() {
    try {
      const response = await api.get('/meals');
      setMeals(response.data);
    } finally {
      setLoading(false);
    }
  }

  async function loadUserConfig() {
    try {
      const response = await api.get('/auth/me');
      if (response.data?.targetCalories) {
        setCaloricGoal(response.data.targetCalories);
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    }
  }

  async function checkGoalStatus() {
    try {
      const response = await api.get('/meals/goal-status');
      setGoalExceeded(response.data.exceeded);
    } catch (error) {
      console.error('Erro ao verificar status da meta:', error);
    }
  }

  useEffect(() => {
    loadMeals();
    loadUserConfig();
    checkGoalStatus();
  }, []);

  async function handleMealCreated() {
    await loadMeals();
    await checkGoalStatus();
  }

  async function handleDeleteMeal(meal: Meal) {
    const confirm = window.confirm(`Tem certeza que deseja excluir a refeição "${meal.name}"?`);
    if (!confirm) return;

    try {
      await api.delete(`/meals/${meal.id}`);
      await handleMealCreated(); 
      addToast('success', 'Refeição excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir refeição:', error);
      addToast('error', 'Erro ao excluir a refeição. Tente novamente.');
    }
  }

  const mealsSummary = useMemo(() => {
    const today = new Date();
    const total = meals.length;
    const todayCount = meals.filter((meal) => {
      const date = new Date(meal.eatTime);
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }).length;

    const monthCount = meals.filter((meal) => {
      const date = new Date(meal.eatTime);
      return (
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }).length;

    return { total, thisMonth: monthCount, today: todayCount };
  }, [meals]);

  const macroSummary = useMemo(() => {
    const today = new Date();
    
    const rawTotals = meals.filter((meal) => {
      const date = new Date(meal.eatTime);
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }).reduce(
      (acc, meal) => {
        acc.carbs += meal.totals.carbs;
        acc.proteins += meal.totals.proteins;
        acc.fats += meal.totals.fats;
        acc.calories += meal.totals.calories;
        return acc;
      },
      { carbs: 0, proteins: 0, fats: 0, calories: 0 },
    );

    return {
      carbs: Math.round(rawTotals.carbs),
      proteins: Math.round(rawTotals.proteins),
      fats: Math.round(rawTotals.fats),
      calories: Math.round(rawTotals.calories),
      caloriesGoal: caloricGoal,
    };
  }, [meals, caloricGoal]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <span className="text-gray-500">Carregando...</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto mb-8">
        <Header
          drawerId={drawerId}
          userName={user.name}
          avatarUrl={user.avatarUrl}
        />

        {goalExceeded && (
          <div role="alert" className="alert alert-error shadow-sm flex items-center gap-3">
            <WarningCircle size={24} weight="fill" />
            <div>
              <h3 className="font-bold">Atenção!</h3>
              <div className="text-sm">Você ultrapassou sua meta calórica diária.</div>
            </div>
          </div>
        )}

        <MacroStatsBar summary={macroSummary} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6 items-stretch">
          <TotalMealsCard summary={mealsSummary} />
          <AddMealCard onSelectCategory={modal.openWith} />
        </div>

        <MealsTable 
          meals={meals} 
          onEditMeal={setMealToEdit} 
          onDeleteMeal={handleDeleteMeal} 
        />
        <MealsList 
          meals={meals} 
          onEditMeal={setMealToEdit} 
          onDeleteMeal={handleDeleteMeal} 
        />
      </div>

      <MealFab onSelectCategory={modal.openWith} />

      <AddMealModal
        open={modal.open}
        typeMeal={modal.selectedCategory}
        onClose={modal.close}
        onSave={modal.close}
        onMealCreated={handleMealCreated}
      />

      {mealToEdit && (
        <UpdateMealModal
          open={!!mealToEdit}
          mealToEdit={mealToEdit}
          onClose={() => setMealToEdit(null)}
          onMealUpdated={async () => {
            setMealToEdit(null);
            await handleMealCreated();
          }}
        />
      )}
    </>
  );
}