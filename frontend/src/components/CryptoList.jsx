import React, { useEffect, useState } from 'react';
import { cryptoService, favoriteService } from '../api';

export default function CryptoList() {
    const [cryptos, setCryptos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [currency, setCurrency] = useState('usd');
    const [addingFavorite, setAddingFavorite] = useState(null);

    const fetchCryptos = async (page = 1, curr = currency) => {
        try {
            setLoading(true);
            const response = await cryptoService.getCryptocurrencies({
                currency: curr,
                page: page,
                per_page: 10
            });

            // A estrutura correta é: { current_page, cryptocurrencies }
            setCryptos(response.cryptocurrencies || []);
            setCurrentPage(response.current_page || 1);
            setError('');
        } catch (err) {
            setError('Erro ao carregar criptomoedas: ' + (err.response?.data?.detail || err.message));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCryptos(1, currency);
    }, [currency]);

    const handleFavorite = async (cryptoSymbol) => {
        try {
            setAddingFavorite(cryptoSymbol);
            // O backend espera coin_id
            await favoriteService.addFavorite(cryptoSymbol.toLowerCase());
            alert('Adicionado aos favoritos!');
        } catch (err) {
            alert('Erro ao adicionar favorito: ' + (err.response?.data?.detail || err.message));
        } finally {
            setAddingFavorite(null);
        }
    };

    const formatPrice = (price) => {
        const symbol = currency === 'usd' ? '$' : '€';
        return `${symbol}${parseFloat(price).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const formatMarketCap = (marketCap) => {
        const symbol = currency === 'usd' ? '$' : '€';
        if (marketCap >= 1e12) {
            return `${symbol}${(marketCap / 1e12).toFixed(2)}T`;
        } else if (marketCap >= 1e9) {
            return `${symbol}${(marketCap / 1e9).toFixed(2)}B`;
        } else if (marketCap >= 1e6) {
            return `${symbol}${(marketCap / 1e6).toFixed(2)}M`;
        }
        return `${symbol}${marketCap.toLocaleString('pt-BR')}`;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                                    <div>
                                        <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                                        <div className="h-3 bg-gray-200 rounded w-16"></div>
                                    </div>
                                </div>
                                <div className="h-8 bg-gray-200 rounded w-20"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Top Criptomoedas</h2>

                    <div className="flex items-center space-x-2">
                        <label className="text-sm font-medium text-white">Moeda:</label>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="bg-white text-gray-800 border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white"
                        >
                            <option value="usd">USD ($)</option>
                            <option value="eur">EUR (€)</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {error && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="space-y-3">
                    {cryptos.map((crypto, index) => (
                        <div key={`${crypto.symbol}-${index}`} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white font-bold text-sm">
                                    {crypto.symbol?.substring(0, 2)}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <h3 className="font-semibold text-gray-900">{crypto.name}</h3>
                                        <span className="text-xs font-medium text-gray-500 bg-gray-200 px-2 py-1 rounded">
                                            {crypto.symbol?.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="flex items-center space-x-4 mt-1">
                                        <p className="text-lg font-bold text-gray-900">
                                            {formatPrice(crypto.price)}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Cap: {formatMarketCap(crypto.market_cap)}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${addingFavorite === crypto.symbol
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                                    }`}
                                onClick={() => handleFavorite(crypto.symbol)}
                                disabled={addingFavorite === crypto.symbol}
                            >
                                {addingFavorite === crypto.symbol ? (
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                                        <span>Adicionando...</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                        <span>Favoritar</span>
                                    </div>
                                )}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Controles de paginação */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <button
                        onClick={() => fetchCryptos(currentPage - 1, currency)}
                        disabled={currentPage === 1}
                        className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-medium text-gray-700 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        <span>Anterior</span>
                    </button>

                    <span className="text-sm font-medium text-gray-600">
                        Página {currentPage}
                    </span>

                    <button
                        onClick={() => fetchCryptos(currentPage + 1, currency)}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                    >
                        <span>Próxima</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
