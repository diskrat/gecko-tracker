import React, { useState } from 'react';
import { cryptoService } from '../api';

export default function CryptoHistory() {
  const [id, setId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [currency, setCurrency] = useState('usd');
  const [history, setHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Definir datas padrão (últimos 7 dias)
  React.useEffect(() => {
    const getDefaultDates = () => {
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);
      
      return {
        start: startDate.toISOString().split('T')[0],
        end: endDate.toISOString().split('T')[0]
      };
    };

    const defaultDates = getDefaultDates();
    setStartDate(defaultDates.start);
    setEndDate(defaultDates.end);
  }, []);

  const fetchHistory = async () => {
    if (!id.trim()) {
      setError('Digite o ID da criptomoeda');
      return;
    }

    if (!startDate || !endDate) {
      setError('Selecione as datas de início e fim');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const data = await cryptoService.getCryptocurrencyHistory(id, {
        currency,
        start_date: startDate,
        end_date: endDate
      });
      
      setHistory(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erro ao buscar histórico');
      setHistory(null);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    const symbol = currency === 'usd' ? '$' : '€';
    return `${symbol}${parseFloat(price).toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    })}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatistics = () => {
    if (!history?.history?.length) return null;

    const prices = history.history.map(item => item.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;
    
    return { minPrice, maxPrice, avgPrice };
  };

  const stats = getStatistics();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
        <h2 className="text-2xl font-bold text-white">Histórico de Preços</h2>
        <p className="text-purple-100 mt-1">Consulte o histórico detalhado de qualquer criptomoeda</p>
      </div>
      
      <div className="p-6">
        {/* Formulário de busca */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID da Criptomoeda
            </label>
            <input
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="ex: bitcoin, ethereum"
              value={id}
              onChange={e => setId(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">Use o ID da moeda (minúsculo)</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Início
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Data de Fim
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Moeda
            </label>
            <select
              value={currency}
              onChange={e => setCurrency(e.target.value)}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="usd">USD ($)</option>
              <option value="eur">EUR (€)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              &nbsp;
            </label>
            <button
              onClick={fetchHistory}
              disabled={loading}
              className={`w-full px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                loading 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transform hover:scale-105'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Buscando...</span>
                </div>
              ) : (
                'Buscar Histórico'
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
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

        {history && (
          <div className="mt-6">
            {/* Cabeçalho com informações */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-xl text-gray-900 mb-1">
                    {history.id?.toUpperCase()} - {history.symbol}
                  </h3>
                  <p className="text-sm text-gray-600">
                    📅 {formatDate(startDate)} até {formatDate(endDate)} | 
                    💰 {currency.toUpperCase()} | 
                    📊 {history.history?.length} registros
                  </p>
                </div>
              </div>
            </div>

            {/* Estatísticas */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                  <h4 className="text-sm font-medium text-green-800 mb-1">💹 Preço Máximo</h4>
                  <p className="text-lg font-bold text-green-900">{formatPrice(stats.maxPrice)}</p>
                </div>
                
                <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
                  <h4 className="text-sm font-medium text-red-800 mb-1">📉 Preço Mínimo</h4>
                  <p className="text-lg font-bold text-red-900">{formatPrice(stats.minPrice)}</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                  <h4 className="text-sm font-medium text-blue-800 mb-1">📊 Preço Médio</h4>
                  <p className="text-lg font-bold text-blue-900">{formatPrice(stats.avgPrice)}</p>
                </div>
              </div>
            )}

            {/* Tabela de dados */}
            {history.history && history.history.length > 0 ? (
              <div className="overflow-x-auto">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">📈 Dados do Histórico</h4>
                  <p className="text-sm text-gray-600">
                    Mostrando os primeiros 20 registros de {history.history.length} disponíveis
                  </p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Data/Hora
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Preço
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Variação
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {history.history.slice(0, 20).map((entry, index) => {
                        const prevPrice = index > 0 ? history.history[index - 1].price : entry.price;
                        const changePercent = ((entry.price - prevPrice) / prevPrice * 100);
                        const isPositive = changePercent >= 0;
                        
                        return (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(entry.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {formatPrice(entry.price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {index > 0 ? (
                                <span className={`font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                  {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                
                {history.history.length > 20 && (
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-500">
                      Exibindo 20 de {history.history.length} registros
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhum dado encontrado para o período selecionado.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
