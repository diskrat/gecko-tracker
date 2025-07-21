import React, { useState } from 'react';
import { AuthProvider } from './auth/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import CryptoList from './components/CryptoList';
import Favorites from './components/Favorites';
import MarketSummary from './components/MarketSummary';
import CryptoHistory from './components/CryptoHistory';
import './App.css';

function App() {
    const [favoritesOpen, setFavoritesOpen] = useState(false);

    return (
        <AuthProvider>
            <div className="App">
                <ProtectedRoute>
                    <Header />

                    <main className="main-container">
                        {/* Seção 1: Resumo do Mercado */}
                        <section className="section-card animate-slide-up">
                            <h2 className="section-title">
                                📊 Resumo do Mercado
                            </h2>
                            <MarketSummary />
                        </section>

                        {/* Seção 2: Top Criptomoedas */}
                        <section className="section-card animate-slide-up" style={{ animationDelay: '0.2s' }}>
                            <h2 className="section-title">
                                🚀 Top Criptomoedas
                            </h2>
                            <CryptoList />
                        </section>

                        {/* Seção 3: Histórico de Preços */}
                        <section className="section-card animate-slide-up" style={{ animationDelay: '0.4s' }}>
                            <h2 className="section-title">
                                📈 Histórico de Preços
                            </h2>
                            <CryptoHistory />
                        </section>
                    </main>

                    {/* Botão Menu Sanduíche para Favoritos */}
                    <button
                        className={`favorites-toggle ${favoritesOpen ? 'active' : ''}`}
                        onClick={() => setFavoritesOpen(!favoritesOpen)}
                        title={favoritesOpen ? "Fechar Favoritos" : "Meus Favoritos"}
                    >
                        {favoritesOpen ? '✕' : '⭐'}
                    </button>

                    {/* Overlay para fechar favoritos */}
                    <div 
                        className={`favorites-overlay ${favoritesOpen ? 'open' : ''}`}
                        onClick={() => setFavoritesOpen(false)}
                    />

                    {/* Sidebar dos Favoritos */}
                    <div className={`favorites-sidebar ${favoritesOpen ? 'open' : ''}`}>
                        <div className="favorites-header">
                            <h3 className="section-title">⭐ Meus Favoritos</h3>
                            <button 
                                className="close-favorites"
                                onClick={() => setFavoritesOpen(false)}
                            >
                                ✕
                            </button>
                        </div>
                        <Favorites />
                    </div>
                </ProtectedRoute>
            </div>
        </AuthProvider>
    );
}

export default App;
