import React, { useEffect, useState } from 'react';
import { marketService } from '../api';

export default function MarketSummary() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currency, setCurrency] = useState('usd');

  const fetchSummary = async (curr = currency) => {
    try {
      setLoading(true);
      const data = await marketService.getMarketSummary(curr);
      setSummary(data);
      setError('');
    } catch (err) {
      setError('Erro ao carregar resumo do mercado');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary(currency);
  }, [currency]);

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

  const formatPercentage = (percentage) => {
    if (!percentage) return 'N/A';
    const isPositive = percentage >= 0;
    return (
      <span className={`font-semibold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? '+' : ''}{percentage.toFixed(2)}%
      </span>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-50 p-4 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Erro</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button
                onClick={() => fetchSummary()}
                className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 text-center">Nenhum dado disponível</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-blue-600 p-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Resumo do Mercado</h2>
          
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
        {/* Top Performers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Top Gainer */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-green-800 mb-1">🚀 Maior Alta 24h</h3>
                <p className="text-lg font-bold text-green-900">{summary.top_gainer?.name}</p>
                <p className="text-sm text-green-700">{summary.top_gainer?.symbol?.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-green-600 mb-1">Market Cap</p>
                <p className="text-sm font-semibold text-green-800">
                  {formatMarketCap(summary.top_gainer?.market_cap)}
                </p>
                <div className="mt-1">
                  {formatPercentage(summary.top_gainer?.percentage_change_24h)}
                </div>
              </div>
            </div>
          </div>

          {/* Top Loser */}
          <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-red-800 mb-1">📉 Maior Queda 24h</h3>
                <p className="text-lg font-bold text-red-900">{summary.top_loser?.name}</p>
                <p className="text-sm text-red-700">{summary.top_loser?.symbol?.toUpperCase()}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-red-600 mb-1">Market Cap</p>
                <p className="text-sm font-semibold text-red-800">
                  {formatMarketCap(summary.top_loser?.market_cap)}
                </p>
                <div className="mt-1">
                  {formatPercentage(summary.top_loser?.percentage_change_24h)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Market Cap */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">💎 Top por Market Cap</h3>
          <div className="space-y-3">
            {summary.top_market_cap?.slice(0, 5).map((crypto, index) => (
              <div key={`${crypto.symbol}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full text-white font-bold text-xs">
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{crypto.name}</p>
                    <p className="text-sm text-gray-600">{crypto.symbol?.toUpperCase()}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatMarketCap(crypto.market_cap)}
                  </p>
                  <div className="text-sm">
                    {formatPercentage(crypto.percentage_change_24h)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
