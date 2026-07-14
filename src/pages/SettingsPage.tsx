import { useState } from 'react';
import { UpdateProfileModal } from '../components/modal/UpdateProfileModal';

export function SettingsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-6 md:p-8 w-full max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-base-content">Configurações</h1>

      <section className="card bg-base-100 shadow-sm border border-base-200">
        <div className="card-body">
          <h2 className="card-title text-lg border-b pb-2 mb-4 text-base-content/90">
            Perfil Físico
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-base-200 p-4 rounded-xl flex flex-col items-center justify-center">
              <span className="text-sm text-base-content/70 mb-1">Altura</span>
              <span className="text-xl font-bold text-base-content">-- cm</span>
            </div>
            
            <div className="bg-base-200 p-4 rounded-xl flex flex-col items-center justify-center">
              <span className="text-sm text-base-content/70 mb-1">Peso</span>
              <span className="text-xl font-bold text-base-content">-- kg</span>
            </div>
            
            <div className="bg-base-200 p-4 rounded-xl flex flex-col items-center justify-center">
              <span className="text-sm text-base-content/70 mb-1">Meta Calórica</span>
              <span className="text-xl font-bold text-base-content">-- kcal</span>
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
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}