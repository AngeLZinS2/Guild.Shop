import React, { useState } from 'react';
import { Search, Filter, Clock, AlertTriangle } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import { Select } from '../components/UI/Select';
import { Button } from '../components/UI/Button';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '../components/UI/Table';
import { Badge } from '../components/UI/Badge';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export const History = () => {
  const { user, isAdmin } = useAuth();
  const { drugs, users, transactions } = useData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [queueTypeFilter, setQueueTypeFilter] = useState('');
  
  if (!user) return null;
  
  // Get transactions based on user role
  const userTransactions = isAdmin 
    ? transactions 
    : transactions.filter(transaction => transaction.userId === user.id);
  
  // Apply filters
  let filteredTransactions = userTransactions;
  
  if (queueTypeFilter) {
    filteredTransactions = filteredTransactions.filter(
      transaction => transaction.queueType === queueTypeFilter
    );
  }
  
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filteredTransactions = filteredTransactions.filter(transaction => {
      const drug = drugs.find(d => d.id === transaction.drugId);
      const user = users.find(u => u.id === transaction.userId);
      
      return (
        drug?.name.toLowerCase().includes(term) ||
        user?.name.toLowerCase().includes(term) ||
        transaction.value.toString().includes(term) ||
        transaction.quantity.toString().includes(term)
      );
    });
  }
  
  // Sort by date (newest first)
  filteredTransactions.sort((a, b) => 
    new Date(b.confirmedAt).getTime() - new Date(a.confirmedAt).getTime()
  );
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">
          {isAdmin ? "Histórico de Transações" : "Meu Histórico"}
        </h1>
      </div>
      
      <Card>
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Input
              placeholder="Buscar por nome, valor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              fullWidth
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          </div>
          
          <div className="md:w-64">
            <Select
              value={queueTypeFilter}
              onChange={(e) => setQueueTypeFilter(e.target.value)}
              options={[
                { value: '', label: 'Todos os tipos' },
                { value: 'internal', label: 'Interno' },
                { value: 'external', label: 'Externo' }
              ]}
            />
          </div>
          
          <Button 
            variant="secondary"
            leftIcon={<Filter size={16} />}
            onClick={() => {
              setSearchTerm('');
              setQueueTypeFilter('');
            }}
          >
            Limpar
          </Button>
        </div>
        
        {filteredTransactions.length > 0 ? (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Data</TableHeaderCell>
                <TableHeaderCell>Droga</TableHeaderCell>
                {isAdmin && <TableHeaderCell>Usuário</TableHeaderCell>}
                <TableHeaderCell>Quantidade</TableHeaderCell>
                <TableHeaderCell>Valor</TableHeaderCell>
                <TableHeaderCell>Tipo</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions.map((transaction) => {
                const drug = drugs.find(d => d.id === transaction.drugId);
                const transactionUser = users.find(u => u.id === transaction.userId);
                
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock size={16} className="mr-2 text-gray-400" />
                        {new Date(transaction.confirmedAt).toLocaleDateString('pt-BR')}
                      </div>
                    </TableCell>
                    <TableCell>{drug?.name}</TableCell>
                    {isAdmin && <TableCell>{transactionUser?.name}</TableCell>}
                    <TableCell>{transaction.quantity}</TableCell>
                    <TableCell>R$ {transaction.value.toLocaleString('pt-BR')}</TableCell>
                    <TableCell>
                      <Badge variant={transaction.queueType === 'internal' ? 'primary' : 'secondary'}>
                        {transaction.queueType === 'internal' ? 'Interno' : 'Externo'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-12">
            <AlertTriangle size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-medium text-white mb-2">Nenhuma Transação Encontrada</h3>
            <p className="text-gray-400">
              {searchTerm || queueTypeFilter 
                ? "Tente ajustar seus filtros de busca"
                : "Não há transações registradas no histórico"
              }
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};