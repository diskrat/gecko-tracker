import React, { useState } from 'react';
import { useAuth } from '../auth/useAuth';
import { FaUserCircle } from 'react-icons/fa';

export default function Header() {
    const { user, logout } = useAuth();
    const [showMenu, setShowMenu] = useState(false);

    return (
        <header className="bg-gradient-to-br from-indigo-800 via-purple-800 to-blue-800 shadow-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo & Title */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-inner">
                        <span className="text-white text-xl font-bold">₿</span>
                    </div>
                    <div className="flex flex-col leading-tight">
                        <h1 className="text-white text-xl md:text-2xl font-bold tracking-tight">CryptoDash</h1>
                        <span className="text-blue-100 text-xs md:text-sm">Monitor de Criptomoedas</span>
                    </div>
                </div>

                {/* User Info */}
                <div className="relative">
                    {user ? (
                        <div
                            className="flex items-center gap-2 cursor-pointer group"
                            onMouseEnter={() => setShowMenu(true)}
                            onMouseLeave={() => setShowMenu(false)}
                        >
                            <div className="hidden sm:flex flex-col text-right">
                                <span className="text-blue-100 text-xs">Bem-vindo,</span>
                                <span className="text-white text-sm font-medium">{user.name}</span>
                            </div>
                            <FaUserCircle className="text-white text-3xl" />

                            {/* Dropdown Menu */}
                            {showMenu && (
                                <div className="absolute right-0 mt-12 w-40 bg-white rounded-lg shadow-lg p-2 z-50">
                                    <button
                                        onClick={logout}
                                        className="block w-full text-left text-sm text-gray-700 px-3 py-2 rounded hover:bg-gray-100"
                                    >
                                        Sair
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <span className="text-blue-100 text-sm">Faça login para acessar</span>
                    )}
                </div>
            </div>
        </header>
    );
}
    