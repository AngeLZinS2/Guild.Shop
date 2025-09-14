import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Home, 
  PackageOpen, 
  Users, 
  Clock, 
  List, 
  FileText,
  Settings,
  ShoppingCart,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Sidebar = () => {
  const { isAdmin } = useAuth();

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden sidebar-open:block hidden" 
        onClick={() => document.documentElement.classList.remove('sidebar-open')}></div>
        
      <aside className="w-64 bg-gray-800 border-r border-gray-700 h-full overflow-y-auto fixed md:relative z-30 transform -translate-x-full md:translate-x-0 transition-transform duration-300 ease-in-out sidebar-open:translate-x-0">
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">Angels of Death</h2>
          <button 
            className="text-gray-400 hover:text-white md:hidden"
            onClick={() => document.documentElement.classList.remove('sidebar-open')}
          >
            <X size={20} />
          </button>
        </div>
        
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <NavLink 
                to="/dashboard" 
                className={({isActive}) => 
                  `flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors ${isActive ? 'bg-gray-700 text-white' : ''}`
                }
              >
                <Home size={18} className="mr-3" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            
            <li>
              <NavLink 
                to="/catalog" 
                className={({isActive}) => 
                  `flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors ${isActive ? 'bg-gray-700 text-white' : ''}`
                }
              >
                <ShoppingCart size={18} className="mr-3" />
                <span>Catálogo</span>
              </NavLink>
            </li>
            
            <li>
              <NavLink 
                to="/profile" 
                className={({isActive}) => 
                  `flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors ${isActive ? 'bg-gray-700 text-white' : ''}`
                }
              >
                <FileText size={18} className="mr-3" />
                <span>Meu Perfil</span>
              </NavLink>
            </li>

            <li>
              <NavLink 
                to="/queue" 
                className={({isActive}) => 
                  `flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors ${isActive ? 'bg-gray-700 text-white' : ''}`
                }
              >
                <List size={18} className="mr-3" />
                <span>Fila de Recebimento</span>
              </NavLink>
            </li>
            
            <li>
              <NavLink 
                to="/history" 
                className={({isActive}) => 
                  `flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors ${isActive ? 'bg-gray-700 text-white' : ''}`
                }
              >
                <Clock size={18} className="mr-3" />
                <span>Histórico</span>
              </NavLink>
            </li>

            {isAdmin && (
              <>
                <li className="pt-4 pb-2">
                  <div className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Administração
                  </div>
                </li>
                
                <li>
                  <NavLink 
                    to="/admin/drugs" 
                    className={({isActive}) => 
                      `flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors ${isActive ? 'bg-gray-700 text-white' : ''}`
                    }
                  >
                    <PackageOpen size={18} className="mr-3" />
                    <span>Gerenciar Drogas</span>
                  </NavLink>
                </li>
                
                <li>
                  <NavLink 
                    to="/admin/users" 
                    className={({isActive}) => 
                      `flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors ${isActive ? 'bg-gray-700 text-white' : ''}`
                    }
                  >
                    <Users size={18} className="mr-3" />
                    <span>Gerenciar Usuários</span>
                  </NavLink>
                </li>
                
                <li>
                  <NavLink 
                    to="/admin/queue" 
                    className={({isActive}) => 
                      `flex items-center px-4 py-2 text-gray-300 rounded-lg hover:bg-gray-700 hover:text-white transition-colors ${isActive ? 'bg-gray-700 text-white' : ''}`
                    }
                  >
                    <Settings size={18} className="mr-3" />
                    <span>Gerenciar Filas</span>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </aside>
    </>
  );
};