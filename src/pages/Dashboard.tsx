import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PackageOpen, 
  Users, 
  ArrowRight, 
  Clock, 
  Check, 
  AlertTriangle 
} from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const Dashboard = () => {
  const { user, isAdmin } = useAuth();
  const { drugs, users, queue, transactions } = useData();
  const navigate = useNavigate();
  
  // Calculate statistics
  const pendingItems = queue.filter(item => item.status === 'pending');
  const userPendingItems = pendingItems.filter(item => item.userId === user?.id);
  
  const totalValue = transactions.reduce((sum, transaction) => sum + transaction.value, 0);
  
  const userTransactions = transactions.filter(transaction => transaction.userId === user?.id);
  const userTotalValue = userTransactions.reduce((sum, transaction) => sum + transaction.value, 0);
  
  // Admin dashboard
  if (isAdmin) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-purple-900 to-purple-700">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Total de Drogas</h3>
                <p className="text-3xl font-bold text-white">{drugs.length}</p>
              </div>
              <div className="bg-purple-600 p-3 rounded-lg">
                <PackageOpen size={24} className="text-white" />
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 w-full"
              rightIcon={<ArrowRight size={16} />}
              onClick={() => navigate('/admin/drugs')}
            >
              Gerenciar Drogas
            </Button>
          </Card>

          <Card className="bg-gradient-to-br from-blue-900 to-blue-700">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Total de Usuários</h3>
                <p className="text-3xl font-bold text-white">{users.length}</p>
              </div>
              <div className="bg-blue-600 p-3 rounded-lg">
                <Users size={24} className="text-white" />
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 w-full"
              rightIcon={<ArrowRight size={16} />}
              onClick={() => navigate('/admin/users')}
            >
              Gerenciar Usuários
            </Button>
          </Card>

          <Card className="bg-gradient-to-br from-green-900 to-green-700">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-white mb-1">Valor Total</h3>
                <p className="text-3xl font-bold text-white">R$ {totalValue.toLocaleString('pt-BR')}</p>
              </div>
              <div className="bg-green-600 p-3 rounded-lg">
                <Clock size={24} className="text-white" />
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="mt-4 w-full"
              rightIcon={<ArrowRight size={16} />}
              onClick={() => navigate('/history')}
            >
              Ver Histórico
            </Button>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Fila Pendente">
            {pendingItems.length > 0 ? (
              <div className="space-y-4">
                {pendingItems.slice(0, 5).map(item => {
                  const drug = drugs.find(d => d.id === item.drugId);
                  const userItem = users.find(u => u.id === item.userId);
                  
                  return (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium">{drug?.name}</h4>
                        <p className="text-sm text-gray-400">
                          {userItem?.name} ({item.queueType === 'internal' ? 'Interno' : 'Externo'})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">Qtd: {item.quantity}</p>
                        <p className="text-sm text-gray-400">
                          R$ {drug ? (drug.value * item.quantity).toLocaleString('pt-BR') : 0}
                        </p>
                      </div>
                    </div>
                  );
                })}
                
                {pendingItems.length > 5 && (
                  <div className="text-center mt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate('/admin/queue')}
                    >
                      Ver todos ({pendingItems.length})
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                <AlertTriangle size={32} className="mx-auto mb-2" />
                <p>Nenhum item pendente na fila</p>
              </div>
            )}
          </Card>

          <Card title="Transações Recentes">
            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.slice(0, 5).map(transaction => {
                  const drug = drugs.find(d => d.id === transaction.drugId);
                  const userItem = users.find(u => u.id === transaction.userId);
                  
                  return (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <h4 className="font-medium">{drug?.name}</h4>
                        <p className="text-sm text-gray-400">
                          {userItem?.name} ({transaction.queueType === 'internal' ? 'Interno' : 'Externo'})
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">R$ {transaction.value.toLocaleString('pt-BR')}</p>
                        <p className="text-sm text-gray-400">
                          Qtd: {transaction.quantity}
                        </p>
                      </div>
                    </div>
                  );
                })}
                
                <div className="text-center mt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => navigate('/history')}
                  >
                    Ver histórico completo
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400">
                <AlertTriangle size={32} className="mx-auto mb-2" />
                <p>Nenhuma transação registrada</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }
  
  // User dashboard
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-gradient-to-br from-purple-900 to-purple-700">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-white mb-1">Meus Recebimentos</h3>
              <p className="text-3xl font-bold text-white">{userPendingItems.length}</p>
            </div>
            <div className="bg-purple-600 p-3 rounded-lg">
              <PackageOpen size={24} className="text-white" />
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4 w-full"
            rightIcon={<ArrowRight size={16} />}
            onClick={() => navigate('/queue')}
          >
            Ver Fila
          </Button>
        </Card>

        <Card className="bg-gradient-to-br from-green-900 to-green-700">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-medium text-white mb-1">Valor Total</h3>
              <p className="text-3xl font-bold text-white">R$ {userTotalValue.toLocaleString('pt-BR')}</p>
            </div>
            <div className="bg-green-600 p-3 rounded-lg">
              <Clock size={24} className="text-white" />
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4 w-full"
            rightIcon={<ArrowRight size={16} />}
            onClick={() => navigate('/history')}
          >
            Ver Histórico
          </Button>
        </Card>
      </div>

      <Card title="Minha Fila de Recebimento">
        {userPendingItems.length > 0 ? (
          <div className="space-y-4">
            {userPendingItems.map(item => {
              const drug = drugs.find(d => d.id === item.drugId);
              
              return (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium">{drug?.name}</h4>
                    <p className="text-sm text-gray-400">
                      Quantidade: {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">R$ {drug ? (drug.value * item.quantity).toLocaleString('pt-BR') : 0}</p>
                    <Button
                      variant="success"
                      size="sm"
                      leftIcon={<Check size={16} />}
                      onClick={() => navigate('/queue')}
                    >
                      Confirmar
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-400">
            <Check size={32} className="mx-auto mb-2" />
            <p>Você não tem recebimentos pendentes</p>
          </div>
        )}
      </Card>
    </div>
  );
};