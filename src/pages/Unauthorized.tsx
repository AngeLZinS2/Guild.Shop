import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { Button } from '../components/UI/Button';

export const Unauthorized = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-red-600 mb-6">
          <Shield className="h-12 w-12 text-white" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4">Acesso Negado</h2>
        
        <p className="text-gray-400 mb-8">
          Você não tem permissão para acessar esta página. Entre em contato com um administrador se acredita que isso é um erro.
        </p>
        
        <div className="flex flex-col space-y-2">
          <Button
            variant="primary"
            onClick={() => navigate('/dashboard')}
          >
            Voltar para o Dashboard
          </Button>
          
          <Button
            variant="secondary"
            onClick={() => navigate('/login')}
          >
            Voltar para o Login
          </Button>
        </div>
      </div>
    </div>
  );
};