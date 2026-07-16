import { useNavigate } from 'react-router-dom';
import { SignOut } from '@phosphor-icons/react';
import { NAV_ITEMS } from '@/constants/navigation';
import { SidebarBrand } from './SidebarBrand';
import { SidebarItem } from './SidebarItem';
import { api } from '@/lib/api';

interface SidebarProps {
  drawerId: string;
}

export function Sidebar({ drawerId }: SidebarProps) {
  const expanded = true; 
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout'); 
      console.log('Sessão encerrada no backend com sucesso!');
      
      localStorage.removeItem('token');

      navigate('/login');
      
    } catch (error) {

      console.error('Erro ao comunicar logout ao backend:', error);
      
      alert('Não foi possível encerrar a sessão corretamente. Tente novamente.');
    }
  };

  return (
    <aside className="drawer-side z-50">
      <label
        htmlFor={drawerId}
        aria-label="Fechar menu"
        className="drawer-overlay"
      />
      <div
        className={`bg-base-100 flex flex-col min-h-full border-r border-base-200 shadow-sm transition-all duration-300 ${
          expanded ? 'w-64 items-start' : 'w-20 items-center'
        }`}
      >
        <SidebarBrand expanded={expanded} />
        
        <ul className="menu w-full grow pt-4 gap-2">
          {NAV_ITEMS.map(item => (
            <SidebarItem
              key={item.id}
              label={item.label}
              Icon={item.Icon}
              to={item.to}
              expanded={expanded}
            />
          ))}
        </ul>

        <div className="w-full p-4 border-t border-base-200 mt-auto">
          <button 
            onClick={handleLogout}
            className="btn btn-ghost w-full flex items-center justify-start gap-3 text-error hover:bg-error/10 hover:text-error transition-colors"
          >
            <SignOut size={24} weight="bold" />
            {expanded && <span>Sair</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}