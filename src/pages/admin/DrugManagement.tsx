import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, AlertTriangle } from 'lucide-react';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { ImageUpload } from '../../components/UI/ImageUpload';
import { Table, TableHead, TableBody, TableRow, TableCell, TableHeaderCell } from '../../components/UI/Table';
import { useData } from '../../context/DataContext';

export const DrugManagement = () => {
  const { drugs, addDrug, updateDrug, deleteDrug } = useData();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState('');
  const [error, setError] = useState('');
  
  const handleImageSelect = async (file: File) => {
    try {
      // Create a temporary URL for preview
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Erro ao fazer upload da imagem');
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!name) {
      setError('Nome da droga é obrigatório');
      return;
    }
    
    if (!value || isNaN(Number(value)) || Number(value) <= 0) {
      setError('Valor deve ser um número positivo');
      return;
    }
    
    if (isEditing) {
      updateDrug(editId, {
        name,
        description,
        value: Number(value),
        imageUrl
      });
      setIsEditing(false);
      setEditId('');
    } else {
      addDrug({
        name,
        description,
        value: Number(value),
        imageUrl
      });
    }
    
    // Clear form
    setName('');
    setDescription('');
    setValue('');
    setImageUrl('');
  };
  
  const handleEdit = (id: string) => {
    const drug = drugs.find(d => d.id === id);
    if (drug) {
      setName(drug.name);
      setDescription(drug.description);
      setValue(drug.value.toString());
      setImageUrl(drug.imageUrl || '');
      setIsEditing(true);
      setEditId(id);
    }
  };
  
  const handleCancel = () => {
    setName('');
    setDescription('');
    setValue('');
    setImageUrl('');
    setIsEditing(false);
    setEditId('');
    setError('');
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta droga?')) {
      deleteDrug(id);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Gerenciar Drogas</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card title={isEditing ? "Editar Droga" : "Adicionar Nova Droga"}>
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="bg-red-900/50 border border-red-700 text-white px-4 py-3 rounded-md mb-4">
                  <p>{error}</p>
                </div>
              )}
              
              <div className="mb-4">
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  currentImage={imageUrl}
                  onImageRemove={() => setImageUrl('')}
                />
              </div>
              
              <Input
                label="Nome da Droga"
                placeholder="Ex: Paiero, Dream, etc."
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
              />
              
              <Input
                label="Descrição (opcional)"
                placeholder="Descrição breve do produto"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                fullWidth
              />
              
              <Input
                label="Valor Unitário (R$)"
                type="number"
                placeholder="Ex: 80"
                value={value}
                onChange={(e) => setValue(e.target.value)}
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
            </form>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card title="Lista de Drogas">
            {drugs.length > 0 ? (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeaderCell>Imagem</TableHeaderCell>
                    <TableHeaderCell>Nome</TableHeaderCell>
                    <TableHeaderCell>Descrição</TableHeaderCell>
                    <TableHeaderCell>Valor</TableHeaderCell>
                    <TableHeaderCell>Ações</TableHeaderCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {drugs.map((drug) => (
                    <TableRow key={drug.id}>
                      <TableCell>
                        {drug.imageUrl ? (
                          <img
                            src={drug.imageUrl}
                            alt={drug.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                            <AlertTriangle size={20} className="text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{drug.name}</TableCell>
                      <TableCell>
                        {drug.description ? drug.description : <span className="text-gray-500">—</span>}
                      </TableCell>
                      <TableCell>R$ {drug.value.toLocaleString('pt-BR')}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleEdit(drug.id)}
                            leftIcon={<Edit size={14} />}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(drug.id)}
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
            ) : (
              <div className="text-center py-6 text-gray-400">
                <AlertTriangle size={32} className="mx-auto mb-2" />
                <p>Nenhuma droga cadastrada</p>
                <p className="text-sm mt-1">Adicione drogas utilizando o formulário ao lado</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};