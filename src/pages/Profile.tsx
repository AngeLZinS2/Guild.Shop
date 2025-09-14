import React, { useState } from 'react';
import { Card } from '../components/UI/Card';
import { Badge } from '../components/UI/Badge';
import { Input } from '../components/UI/Input';
import { Button } from '../components/UI/Button';
import { ShoppingCart, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const Profile = () => {
  const { user } = useAuth();
  const { drugs, getUserTransactions, addToQueue } = useData();
  const [selectedDrug, setSelectedDrug] = useState<string | null>(null);
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  
  if (!user) return null;
  
  const userTransactions = getUserTransactions(user.id);
  
  const handleRequestDrug = () => {
    setError('');
    
    if (!selectedDrug || !quantity) {
      setError('Selecione uma droga e quantidade');
      return;
    }
    
    if (isNaN(Number(quantity)) || Number(quantity) <= 0) {
      setError('Quantidade deve ser um número positivo');
      return;
    }
    
    addToQueue({
      drugId: selectedDrug,
      quantity: Number(quantity),
      userId: user.id,
      queueType: user.type
    });
    
    setSelectedDrug(null);
    setQuantity('');
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-purple-700 flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl font-bold text-white">{user.name.charAt(0)}</span>
              </div>
              
              <h2 className="text-xl font-bold text-white mb-2">{user.name}</h2>
              
              <div className="flex justify-center space-x-2 mb-4">
                <Badge variant={user.type === 'internal' ? 'primary' : 'secondary'}>
                  {user.type === 'internal' ? 'Interno' : 'Externo'}
                </Badge>
                
                <Badge variant={user.role === 'admin' ? 'warning' : 'success'}>
                  {user.role === 'admin' ? 'Admin' : 'Usuário'}
                </Badge>
              </div>
              
              <p className="text-gray-400">{user.email}</p>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-700">
              <div className="flex justify-between mb-2">
                <span className="text-gray-400">Total de Transações:</span>
                <span className="text-white font-medium">{userTransactions.length}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Valor Total:</span>
                <span className="text-white font-medium">
                  R$ {userTransactions.reduce((sum, t) => sum + t.value, 0).toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </Card>
        </div>
        
        <div className="md:col-span-2">
          <Card title="Catálogo de Drogas">
            {drugs.length > 0 ? (
              <div className="space-y-4">
                {drugs.map(drug => {
                  const isSelected = selectedDrug === drug.id;
                  
                  return (
                    <div 
                      key={drug.id} 
                      className={`p-4 rounded-lg transition-colors cursor-pointer ${
                        isSelected ? 'bg-purple-900/50 border border-purple-500' : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      onClick={() => setSelectedDrug(drug.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-medium text-white">{drug.name}</h3>
                          {drug.description && (
                            <p className="text-sm text-gray-400 mt-1">{drug.description}</p>
                          )}
                        </div>
                        <p className="text-xl font-bold text-white">
                          R$ {drug.value.toLocaleString('pt-BR')}
                        </p>
                      </div>
                      
                      {isSelected && (
                        <div className="mt-4 pt-4 border-t border-gray-600">
                          <div className="flex items-end gap-4">
                            <Input
                              label="Quantidade"
                              type="number"
                              value={quantity}
                              onChange={(e) => setQuantity(e.target.value)}
                              placeholder="Ex: 100"
                              className="flex-1"
                            />
                            <Button
                              variant="primary"
                              onClick={handleRequestDrug}
                              leftIcon={<ShoppingCart size={16} />}
                            >
                              Solicitar
                            </Button>
                          </div>
                          
                          {quantity && !isNaN(Number(quantity)) && Number(quantity) > 0 && (
                            <p className="mt-2 text-right text-sm text-gray-400">
                              Total: R$ {(drug.value * Number(quantity)).toLocaleString('pt-BR')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                <AlertTriangle size={32} className="mx-auto mb-2" />
                <p>Nenhuma droga disponível no momento</p>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-4 bg-red-900/50 border border-red-700 rounded-lg text-white">
                {error}
              </div>
            )}
          </Card>
          
          <Card title="Minhas Transações Recentes" className="mt-6">
            {userTransactions.length > 0 ? (
              <div className="space-y-4">
                {userTransactions.slice(0, 5).map(transaction => {
                  const drug = drugs.find(d => d.id === transaction.drugId);
                  
                  return (
                    <div key={transaction.id} className="p-4 bg-gray-700 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-white">
                            {drug?.name} - {transaction.quantity} unidades
                          </h4>
                          <p className="text-sm text-gray-400">
                            {new Date(transaction.confirmedAt).toLocaleDateString('pt-BR')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-white">
                            R$ {transaction.value.toLocaleString('pt-BR')}
                          </p>
                          <Badge variant={transaction.queueType === 'internal' ? 'primary' : 'secondary'}>
                            {transaction.queueType === 'internal' ? 'Interno' : 'Externo'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {userTransactions.length > 5 && (
                  <p className="text-center text-sm text-gray-400">
                    Mostrando 5 de {userTransactions.length} transações
                  </p>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-4">
                Você ainda não possui transações
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};