import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, AlertTriangle, Key, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { Select } from '../../components/UI/Select';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '../../components/UI/Table';
import { Badge } from '../../components/UI/Badge';
import { useData } from '../../context/DataContext';
import { User } from '../../types';

const USERS_PER_PAGE = 10;

export const UserManagement = () => {
  const { users, addUser, updateUser, deleteUser } = useData();

  const [name, setName] = useState('');
  const [stateId, setStateId] = useState('');
  const [type, setType] = useState<'internal' | 'external' | ''>('');
  const [role, setRole] = useState<'admin' | 'user' | ''>('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);
  const paginatedUsers = users.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !stateId || !type || !role) {
      setError('Todos os campos são obrigatórios');
      return;
    }

    if (!isEditing && users.some(user => user.stateId === stateId)) {
      setError('Este State ID já está em uso');
      return;
    }

    if (isEditing) {
      updateUser(editingId, {
        name,
        stateId,
        type: type as 'internal' | 'external',
        role: role as 'admin' | 'user'
      });
      setIsEditing(false);
      setEditingId('');
    } else {
      addUser({
        name,
        stateId,
        type: type as 'internal' | 'external',
        role: role as 'admin' | 'user',
        password: 'senha123'
      });
    }

    setName('');
    setStateId('');
    setType('');
    setRole('');
  };

  const handleEdit = (user: User) => {
    setName(user.name);
    setStateId(user.stateId);
    setType(user.type);
    setRole(user.role);
    setIsEditing(true);
    setEditingId(user.id);
  };

  const handleCancel = () => {
    setName('');
    setStateId('');
    setType('');
    setRole('');
    setIsEditing(false);
    setEditingId('');
    setError('');
  };

  const handleResetPassword = (userId: string) => {
    if (window.confirm('Tem certeza que deseja resetar a senha deste usuário?')) {
      updateUser(userId, {
        password: 'senha123',
        firstLogin: true
      });
      alert('Senha resetada com sucesso! Na próximo login o usuário deverá alterar a senha.');
    }
  };

  const handleDeleteUser = (user: User) => {
    if (window.confirm(`Tem certeza que deseja excluir o usuário ${user.name}?`)) {
      deleteUser(user.id);
    }
  };

  const changePage = (next: boolean) => {
    setCurrentPage(prev => {
      if (next) return Math.min(prev + 1, totalPages);
      return Math.max(prev - 1, 1);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gerenciar Usuários</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card title={isEditing ? "Editar Usuário" : "Adicionar Novo Usuário"}>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-900/50 border border-red-700 text-white px-4 py-3 rounded-md mb-4">
                  <p>{error}</p>
                </div>
              )}
              <Input
                label="Nome"
                placeholder="Nome completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              <Input
                label="State ID"
                placeholder="Ex: ABC123"
                value={stateId}
                onChange={(e) => setStateId(e.target.value)}
                disabled={isEditing}
                fullWidth
              />
              <Select
                label="Tipo de Usuário"
                value={type}
                onChange={(e) => setType(e.target.value as 'internal' | 'external' | '')}
                options={[
                  { value: 'internal', label: 'Interno' },
                  { value: 'external', label: 'Externo' }
                ]}
                fullWidth
              />
              <Select
                label="Tipo de Acesso"
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'user' | '')}
                options={[
                  { value: 'admin', label: 'Administrador' },
                  { value: 'user', label: 'Usuário Comum' }
                ]}
                fullWidth
              />
              <div className="flex space-x-2 mt-6">
                <Button
                  type="submit"
                  variant="primary"
                  leftIcon={isEditing ? <Edit size={16} /> : <PlusCircle size={16} />}
                  className="flex-1"
                >
                  {isEditing ? "Atualizar" : "Adicionar"}
                </Button>
                {isEditing && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCancel}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
              {!isEditing && (
                <p className="mt-4 text-sm text-gray-400 text-center">
                  Senha padrão: senha123
                </p>
              )}
            </form>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card title="Lista de Usuários">
            {paginatedUsers.length > 0 ? (
              <>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeaderCell>Nome</TableHeaderCell>
                      <TableHeaderCell>State ID</TableHeaderCell>
                      <TableHeaderCell>Tipo</TableHeaderCell>
                      <TableHeaderCell>Acesso</TableHeaderCell>
                      <TableHeaderCell>Status</TableHeaderCell>
                      <TableHeaderCell>Ações</TableHeaderCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {paginatedUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.stateId}</TableCell>
                        <TableCell>
                          <Badge variant={user.type === 'internal' ? 'primary' : 'secondary'}>
                            {user.type === 'internal' ? 'Interno' : 'Externo'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.role === 'admin' ? 'warning' : 'success'}>
                            {user.role === 'admin' ? 'Admin' : 'Usuário'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {user.firstLogin ? (
                            <Badge variant="warning">Senha Temporária</Badge>
                          ) : (
                            <Badge variant="success">Ativo</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleEdit(user)}
                              leftIcon={<Edit size={14} />}
                            >
                              Editar
                            </Button>
                            <Button
                              variant="warning"
                              size="sm"
                              onClick={() => handleResetPassword(user.id)}
                              leftIcon={<Key size={14} />}
                            >
                              Resetar Senha
                            </Button>
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => handleDeleteUser(user)}
                              leftIcon={<Trash2 size={14} />}
                            >
                              Excluir
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="flex justify-between items-center mt-4 text-white">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => changePage(false)}
                    disabled={currentPage === 1}
                    leftIcon={<ChevronLeft size={16} />}
                  >
                    Anterior
                  </Button>
                  <span>Página {currentPage} de {totalPages}</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => changePage(true)}
                    disabled={currentPage === totalPages}
                    rightIcon={<ChevronRight size={16} />}
                  >
                    Próxima
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-gray-400">
                <AlertTriangle size={32} className="mx-auto mb-2" />
                <p>Nenhum usuário cadastrado</p>
                <p className="text-sm mt-1">Adicione usuários utilizando o formulário ao lado</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
