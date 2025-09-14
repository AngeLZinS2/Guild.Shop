import React, { useEffect, useState } from 'react';
import { Check, X, Package } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableHeaderCell,
} from '../../components/UI/Table';
import { Badge } from '../../components/UI/Badge';
import { useData } from '../../context/DataContext';
import { TransactionStatus } from '../../types';

export const QueueManagement = () => {
  const { drugs, users, queue, updateQueueStatus, refreshQueue } = useData();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const interval = setInterval(() => {
      refreshQueue(); // Certifique-se que `refreshQueue` atualiza os dados
    }, 10000); // 10 segundos

    return () => clearInterval(interval);
  }, [refreshQueue]);

  const activeItems = queue.filter(
    (item) => !['completed', 'cancelled'].includes(item.status)
  );

  const paginatedItems = activeItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(activeItems.length / itemsPerPage);

  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'pending':
        return <Badge variant="warning">Pendente</Badge>;
      case 'preparing':
        return <Badge variant="primary">Preparando</Badge>;
      case 'ready':
        return <Badge variant="success">Pronto</Badge>;
      default:
        return null;
    }
  };

  const handleUpdateStatus = (id: string, currentStatus: TransactionStatus) => {
    let newStatus: TransactionStatus;

    switch (currentStatus) {
      case 'pending':
        newStatus = 'preparing';
        break;
      case 'preparing':
        newStatus = 'ready';
        break;
      case 'ready':
        newStatus = 'completed';
        break;
      default:
        return;
    }

    updateQueueStatus(id, newStatus);
  };

  const handleCancel = (id: string) => {
    if (window.confirm('Tem certeza que deseja cancelar este pedido?')) {
      updateQueueStatus(id, 'cancelled');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gerenciar Pedidos</h1>
      </div>

      <Card>
        {paginatedItems.length > 0 ? (
          <>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Droga</TableHeaderCell>
                  <TableHeaderCell>Solicitante</TableHeaderCell>
                  <TableHeaderCell>Qtd.</TableHeaderCell>
                  <TableHeaderCell>Valor</TableHeaderCell>
                  <TableHeaderCell>Tipo</TableHeaderCell>
                  <TableHeaderCell>Status</TableHeaderCell>
                  <TableHeaderCell>Ações</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedItems.map((item) => {
                  const drug = drugs.find((d) => d.id === item.drugId);
                  const user = users.find((u) => u.id === item.userId);
                  const totalValue = drug ? drug.value * item.quantity : 0;

                  return (
                    <TableRow key={item.id}>
                      <TableCell>{drug?.name}</TableCell>
                      <TableCell>{user?.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>
                        R$ {totalValue.toLocaleString('pt-BR')}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item.queueType === 'internal'
                              ? 'primary'
                              : 'secondary'
                          }
                        >
                          {item.queueType === 'internal' ? 'Interno' : 'Externo'}
                        </Badge>
                      </TableCell>
                      <TableCell>{getStatusBadge(item.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() =>
                              handleUpdateStatus(item.id, item.status)
                            }
                            leftIcon={<Check size={14} />}
                          >
                            {item.status === 'pending'
                              ? 'Preparar'
                              : item.status === 'preparing'
                              ? 'Pronto'
                              : 'Confirmar Entrega'}
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleCancel(item.id)}
                            leftIcon={<X size={14} />}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Paginação */}
            <div className="flex justify-center mt-4 space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-white mb-2">
              Nenhum Pedido Ativo
            </h3>
            <p className="text-gray-400">
              Não há pedidos pendentes ou em preparação no momento.
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
