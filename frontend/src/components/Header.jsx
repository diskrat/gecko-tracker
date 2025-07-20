import React from 'react';
import { useAuth } from '../auth/useAuth';

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <span className="text-2xl">₿</span>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">CryptoDash</h1>
                            <p className="text-blue-100 text-sm">Monitor de Criptomoedas</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-6">
                        {user && (
                            <>
                                <div className="text-right">
                                    <p className="text-blue-100 text-sm">Bem-vindo,</p>
                                    <p className="text-white font-medium">{user.name}</p>
                                </div>
                                <button
                                    onClick={logout}
                                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
                                >
                                    Sair
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
