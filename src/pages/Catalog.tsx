import React, { useState } from 'react';
import { ShoppingCart, AlertTriangle, Package } from 'lucide-react';
import { Card } from '../components/UI/Card';
import { Input } from '../components/UI/Input';
import { Button } from '../components/UI/Button';
import { Badge } from '../components/UI/Badge';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
// Assuming your Drug type is available or implicitly defined in useData
// interface Drug { id: string; name: string; value: number; description?: string; imageUrl?: string; }


export const Catalog = () => {
  const { user } = useAuth();
  const { drugs, addToQueue } = useData();
  const [selectedDrug, setSelectedDrug] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(''); // Quantity will be stored as a string
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!user) return null;

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    // Remove any non-digit characters
    const numericString = rawValue.replace(/[^\d]/g, '');
    // Limit to 4 digits
    setQuantity(numericString.slice(0, 4));
  };

  const handleRequestDrug = async () => {
    setError('');
    setSuccess('');

    if (!selectedDrug) {
      setError('Por favor, selecione uma droga.');
      return;
    }

    if (!quantity) {
      setError('Por favor, informe a quantidade desejada.');
      return;
    }

    const numericQuantity = Number(quantity);

    if (!Number.isInteger(numericQuantity) || numericQuantity <= 0) {
      setError('Quantidade deve ser um número inteiro positivo.');
      return;
    }

    if (numericQuantity > 9999) {
      setError('Quantidade máxima permitida é 9999.');
      return;
    }

    try {
      await addToQueue({
        drugId: selectedDrug,
        quantity: numericQuantity,
        userId: user.id,
        queueType: user.type
      });

      const drugDetails = drugs.find(d => d.id === selectedDrug);
      setSuccess(`Pedido de ${numericQuantity}x ${drugDetails?.name || 'droga selecionada'} adicionado à fila com sucesso!`);
      setSelectedDrug(null);
      setQuantity('');
    } catch (err) {
      console.error("Failed to add drug to queue:", err);
      setError('Falha ao adicionar o pedido à fila. Tente novamente mais tarde.');
      // You could inspect `err` to provide a more specific message if needed
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Catálogo de Drogas</h1>
        <Badge variant={user.type === 'internal' ? 'primary' : 'secondary'} className="text-sm">
          {user.type === 'internal' ? 'Membro Interno' : 'Membro Externo'}
        </Badge>
      </div>

      {success && (
        <div className="bg-green-900/50 border border-green-700 text-white px-6 py-4 rounded-lg flex items-center">
          <Package className="mr-2 h-5 w-5" />
          {success}
        </div>
      )}

      {error && ( // Moved error display to be more prominent and consistent
        <div className="bg-red-900/50 border border-red-700 text-white px-6 py-4 rounded-lg flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5" />
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {drugs.length > 0 ? (
          drugs.map(drug => {
            const isSelected = selectedDrug === drug.id;

            return (
              <Card key={drug.id} className={`transition-all ${
                isSelected ? 'ring-2 ring-purple-500 bg-gray-800' : 'hover:bg-gray-800/60'
              }`}>
                {drug.imageUrl && (
                  <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                    <img
                      src={drug.imageUrl}
                      alt={drug.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedDrug(isSelected ? null : drug.id);
                    setQuantity(''); // Reset quantity when selecting a new drug
                    setError(''); // Clear previous errors
                    setSuccess(''); // Clear previous success messages
                  }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white">{drug.name}</h3>
                    <Badge variant="warning">
                      R$ {drug.value.toLocaleString('pt-BR')}
                    </Badge>
                  </div>

                  {drug.description && (
                    <p className="text-gray-400 text-sm mb-4">{drug.description}</p>
                  )}
                </div>

                {isSelected && (
                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="space-y-4">
                      <Input
                        label="Quantidade Desejada"
                        type="text" // Keep as text to control input via JS
                        inputMode="numeric" // Hint for mobile keyboards
                        pattern="[0-9]*"    // Hint for validation (though JS handles it)
                        value={quantity}
                        onChange={handleQuantityChange}
                        placeholder="Ex: 100" // Updated placeholder
                        fullWidth
                      />

                      {quantity && !isNaN(Number(quantity)) && Number(quantity) > 0 && Number(quantity) <= 9999 && (
                        <div className="bg-gray-700 p-4 rounded-lg">
                          <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                            <span>Valor Unitário:</span>
                            <span>R$ {drug.value.toLocaleString('pt-BR')}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-400 mb-2">
                            <span>Quantidade:</span>
                            <span>{Number(quantity).toLocaleString('pt-BR')}</span>
                          </div>
                          <div className="flex justify-between items-center font-bold text-white pt-2 border-t border-gray-600">
                            <span>Total:</span>
                            <span>R$ {(drug.value * Number(quantity)).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                          </div>
                        </div>
                      )}

                      <Button
                        variant="primary"
                        onClick={handleRequestDrug}
                        leftIcon={<ShoppingCart size={16} />}
                        className="w-full"
                        // Disable button if quantity is invalid (optional, but good UX)
                        // disabled={!quantity || Number(quantity) <= 0 || Number(quantity) > 9999}
                      >
                        Solicitar Agora
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })
        ) : (
          <div className="col-span-full">
            <Card>
              <div className="text-center py-12">
                <AlertTriangle size={48} className="mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-medium text-white mb-2">Catálogo Vazio</h3>
                <p className="text-gray-400">
                  Não há drogas disponíveis no momento.
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Error display was here, I moved it up for better visibility during interaction */}
    </div>
  );
};