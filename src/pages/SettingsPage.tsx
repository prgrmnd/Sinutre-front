import { useState, useEffect } from 'react';
import { UpdateProfileModal } from '@/components/modal/UpdateProfileModal';
import { api } from '@/lib/api';

interface UserProfile {
  height?: number | null;
  weight?: number | null;
  targetCalories?: number | null;
}

export function SettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/auth/me'); 
      setProfile(response.data);
    } catch (error) {
      console.error('Erro ao buscar os dados do usuário:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return (
    <div className="p-6 md:p-8 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-base-content">Configurações</h1>

      <section className="card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body">
          <h2 className="card-title text-lg border-b pb-2 mb-4 text-base-content/90">
            Perfil Físico
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            
            {/* Altura */}
            <div className="bg-base-200 p-4 rounded-xl flex flex-col items-center justify-center">
              <span className="text-sm text-base-content/70 mb-1">Altura</span>
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <span className="text-xl font-bold text-base-content">
                  {profile?.height ? `${profile.height} cm` : '-- cm'}
                </span>
              )}
            </div>
            
            <div className="bg-base-200 p-4 rounded-xl flex flex-col items-center justify-center">
              <span className="text-sm text-base-content/70 mb-1">Peso</span>
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <span className="text-xl font-bold text-base-content">
                  {profile?.weight ? `${profile.weight} kg` : '-- kg'}
                </span>
              )}
            </div>
            
            <div className="bg-base-200 p-4 rounded-xl flex flex-col items-center justify-center">
              <span className="text-sm text-base-content/70 mb-1">Meta Calórica</span>
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                <span className="text-xl font-bold text-base-content">
                  {profile?.targetCalories ? `${profile.targetCalories} kcal` : '-- kcal'}
                </span>
              )}
            </div>

          </div>

          <div className="card-actions justify-end">
            <button 
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              Atualizar Dados
            </button>
          </div>
        </div>
      </section>

      <UpdateProfileModal 
        isOpen={isModalOpen} 
        initialData={profile}
        onClose={() => {
          setIsModalOpen(false);
          fetchProfile(); 
        }} 
      />
    </div>
  );
}

