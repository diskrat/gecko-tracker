import React, { useState } from 'react';
import { useAuth } from './useAuth';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSignup, setShowSignup] = useState(false);

    const { login, signup } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await login({ username, password });

        if (!result.success) {
            setError(result.error);
        }

        setIsLoading(false);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const result = await signup({ name: username, password });

        if (result.success) {
            setShowSignup(false);
            setError('');
            alert('Conta criada com sucesso! Faça login.');
        } else {
            setError(result.error);
        }

        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <span className="text-white font-bold text-2xl">₿</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-white">
                            {showSignup ? 'Criar Conta' : 'CryptoDash'}
                        </h2>
                        <p className="mt-2 text-purple-200">
                            {showSignup ? 'Junte-se à nossa comunidade' : 'Sua plataforma de criptomoedas'}
                        </p>
                    </div>

                    <form onSubmit={showSignup ? handleSignup : handleLogin} className="space-y-6">
                        {error && (
                            <div className="bg-red-500/20 border border-red-400/50 text-red-100 px-4 py-3 rounded-lg backdrop-blur-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 placeholder-purple-200 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Nome de usuário"
                                />
                            </div>
                            <div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 placeholder-purple-200 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="Senha"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 hover:shadow-lg transform hover:scale-[1.02]"
                            >
                                {isLoading ? 'Carregando...' : showSignup ? 'Criar Conta' : 'Entrar'}
                            </button>
                        </div>

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowSignup(!showSignup);
                                    setError('');
                                }}
                                className="text-purple-200 hover:text-white transition-colors duration-200"
                            >
                                {showSignup ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
