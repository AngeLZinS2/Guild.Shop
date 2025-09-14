import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/UI/Input';
import { Button } from '../components/UI/Button';

export const Login = () => {
  const [stateId, setStateId] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const { login, updatePassword, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading || isChangingPassword) return;

    setError('');
    setIsLoading(true);

    try {
      if (isFirstLogin) {
        if (newPassword !== confirmPassword) {
          setError('As senhas não coincidem');
          return;
        }

        if (newPassword.length < 6) {
          setError('A nova senha deve ter pelo menos 6 caracteres');
          return;
        }

        if (user) {
          setIsChangingPassword(true);
          await updatePassword(user.id, newPassword);
          navigate('/dashboard');
        }
        return;
      }

      if (!stateId || !password) {
        setError('Todos os campos são obrigatórios');
        return;
      }

      const success = await login(stateId, password);

      if (success) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const currentUser = users.find((u: any) => u.stateId === stateId);

        if (currentUser?.firstLogin) {
          setIsFirstLogin(true);
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Credenciais inválidas');
      }
    } catch (err) {
      console.error(err);
      setError('Ocorreu um erro. Tente novamente.');
    } finally {
      setIsLoading(false);
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-10 bg-gray-800 rounded-lg shadow-md">
        <div>
          <div className="mx-auto h-50 w-20.2 rounded-full overflow-hidden">
            <img
              src="/logo.jpeg"
              alt="Logo"
              className="object-cover h-full w-full"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Angels of Death Shop
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isFirstLogin ? 'Primeiro acesso - Altere sua senha' : ''}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-white px-4 py-3 rounded-md">
              <p>{error}</p>
            </div>
          )}

          {isFirstLogin ? (
            <div className="space-y-4">
              <Input
                type="password"
                label="Nova Senha"
                placeholder="******"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isChangingPassword}
                fullWidth
              />
              <Input
                type="password"
                label="Confirmar Nova Senha"
                placeholder="******"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isChangingPassword}
                fullWidth
              />
              <Button
                type="submit"
                variant="primary"
                isLoading={isChangingPassword}
                className="w-full"
              >
                {isChangingPassword ? 'Alterando Senha...' : 'Alterar Senha'}
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md -space-y-px">
                <Input
                  type="text"
                  placeholder="State ID"
                  value={stateId}
                  onChange={(e) => setStateId(e.target.value)}
                  disabled={isLoading}
                  className="rounded-t-md rounded-b-none"
                />
                <Input
                  type="password"
                  placeholder="Senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="rounded-t-none rounded-b-md"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                className="w-full"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>

              <div className="text-center text-sm">
                <p className="text-gray-400">
                  Entre com suas credenciais para acessar o sistema
                </p>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};
