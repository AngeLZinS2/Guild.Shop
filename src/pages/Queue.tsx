import React from 'react';
import { Package, AlertTriangle } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Button } from '../components/UI/Button';
import { Badge } from '../components/UI/Badge';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { TransactionStatus } from '../types';

export const Queue = () => {
  const { user } = useAuth();
  const { drugs, queue, updateQueueStatus } = useData();
  
  if (!user) return null;
  
  // Get active queue items for the current user
  const userActiveItems = queue.filter(
    item => item.userId === user.id && !['completed', 'cancelled'].includes(item.status)
  );
  
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Aguardando Preparo</Badge>;
      case 'preparing':
        return <Badge variant="primary">Em Preparação</Badge>;
      case 'ready':
        return <Badge variant="success">Pronto para Retirada</Badge>;
      default:
        return null;
    }
  };
  
  const handleConfirm = (id: string) => {
    updateQueueStatus(id, 'completed');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Meus Pedidos</h1>
      </div>
      
      <Card>
        {userActiveItems.length > 0 ? (
          <div className="space-y-4">
            {userActiveItems.map(item => {
              const drug = drugs.find(d => d.id === item.drugId);
              const totalValue = drug ? drug.value * item.quantity : 0;
              
              return (
                <div key={item.id} className="p-6 bg-gray-700 rounded-lg">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-white">{drug?.name}</h3>
                        {getStatusBadge(item.status)}
                      </div>
                      <div className="flex items-center mt-2">
                        <Badge variant={item.queueType === 'internal' ? 'primary' : 'secondary'}>
                          {item.queueType === 'internal' ? 'Interno' : 'Externo'}
                        </Badge>
                        <span className="text-sm text-gray-400 ml-2">
                          Pedido em {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="md:text-right">
                      <p className="text-white">
                        <span className="text-gray-400">Quantidade:</span> {item.quantity}
                      </p>
                      <p className="text-white">
                        <span className="text-gray-400">Valor Unitário:</span> R$ {drug?.value.toLocaleString('pt-BR')}
                      </p>
                      <p className="text-lg font-medium text-white mt-1">
                        <span className="text-gray-400">Total:</span> R$ {totalValue.toLocaleString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  
                  {item.status === 'ready' && (
                    <div className="mt-6 pt-4 border-t border-gray-600 flex justify-end">
                      <Button
                        variant="success"
                        onClick={() => handleConfirm(item.id)}
                      >
                        Confirmar Recebimento
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertTriangle size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-white mb-2">Sem Pedidos Ativos</h3>
            <p className="text-gray-400">
              Você não possui pedidos em andamento no momento.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};