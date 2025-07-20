import httpx
import time
from typing import Dict, Any, Optional
from fastapi import HTTPException
from src.config.config import settings

COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3'

# Cache simples para evitar muitas requisições
_cache: Dict[str, Dict[str, Any]] = {}
CACHE_DURATION = 300  # 5 minutos em segundos

def _get_cache_key(endpoint: str, params: dict) -> str:
    """Gera uma chave única para o cache baseada no endpoint e parâmetros."""
    params_str = '&'.join(f"{k}={v}" for k, v in sorted(params.items()))
    return f"{endpoint}?{params_str}"

def _is_cache_valid(cache_entry: Dict[str, Any]) -> bool:
    """Verifica se o cache ainda é válido."""
    return time.time() - cache_entry['timestamp'] < CACHE_DURATION

def _get_from_cache(cache_key: str) -> Optional[Any]:
    """Obtém dados do cache se válidos."""
    if cache_key in _cache and _is_cache_valid(_cache[cache_key]):
        return _cache[cache_key]['data']
    return None

def _set_cache(cache_key: str, data: Any) -> None:
    """Armazena dados no cache."""
    _cache[cache_key] = {
        'data': data,
        'timestamp': time.time()
    }


async def fetch_cryptocurrencies_from_api(
    currency: str, page: int, per_page: int
):
    """
    Faz a chamada para a API CoinGecko e retorna os dados brutos.
    Usa cache para evitar muitas requisições.
    """
    # Verifica o cache primeiro
    params = {
        'vs_currency': currency,
        'order': 'market_cap_desc',
        'per_page': per_page,
        'page': page,
        'sparkline': False,
    }
    
    cache_key = _get_cache_key('/coins/markets', params)
    cached_data = _get_from_cache(cache_key)
    
    if cached_data is not None:
        return cached_data
    
    url = f'{COINGECKO_BASE_URL}/coins/markets'

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, params=params)

        if response.status_code == 429:
            # Se hit rate limit, retorna dados em cache (mesmo que expirados) ou dados mock
            if cache_key in _cache:
                return _cache[cache_key]['data']
            else:
                # Retorna dados mock se não há cache
                return _get_mock_crypto_data()

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f'Erro ao acessar a CoinGecko API: {response.status_code}',
            )

        data = response.json()
        _set_cache(cache_key, data)
        return data
        
    except httpx.TimeoutException:
        # Em caso de timeout, retorna cache ou dados mock
        if cache_key in _cache:
            return _cache[cache_key]['data']
        else:
            return _get_mock_crypto_data()
    except Exception as e:
        # Em caso de erro, retorna cache ou dados mock
        if cache_key in _cache:
            return _cache[cache_key]['data']
        else:
            return _get_mock_crypto_data()

def _get_mock_crypto_data():
    """Retorna dados mock para quando a API não está disponível."""
    return [
        {
            "id": "bitcoin",
            "symbol": "btc",
            "name": "Bitcoin",
            "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
            "current_price": 67000,
            "market_cap": 1320000000000,
            "market_cap_rank": 1,
            "price_change_percentage_24h": 2.5
        },
        {
            "id": "ethereum",
            "symbol": "eth",
            "name": "Ethereum",
            "image": "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
            "current_price": 3500,
            "market_cap": 420000000000,
            "market_cap_rank": 2,
            "price_change_percentage_24h": 1.8
        },
        {
            "id": "tether",
            "symbol": "usdt",
            "name": "Tether",
            "image": "https://assets.coingecko.com/coins/images/325/large/Tether.png",
            "current_price": 1.0,
            "market_cap": 118000000000,
            "market_cap_rank": 3,
            "price_change_percentage_24h": 0.1
        }
    ]


async def fetch_cryptocurrency_history_from_api(
    crypto_id: str, currency: str, start_timestamp: int, end_timestamp: int
):
    """
    Obtém o histórico de preços de uma criptomoeda específica da API CoinGecko.
    Usa cache e fallback para lidar com rate limiting.
    """
    params = {
        'vs_currency': currency,
        'from': start_timestamp,
        'to': end_timestamp,
    }
    
    cache_key = _get_cache_key(f'/coins/{crypto_id}/market_chart/range', params)
    cached_data = _get_from_cache(cache_key)
    
    if cached_data is not None:
        return cached_data
    
    url = f'{COINGECKO_BASE_URL}/coins/{crypto_id}/market_chart/range'
    headers = {
        'accept': 'application/json',
        'x-cg-demo-api-key': settings.COINGECKO_API_KEY,
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(url, params=params, headers=headers)

        if response.status_code == 429:
            # Se hit rate limit, retorna dados mock
            return _get_mock_history_data(crypto_id)

        if response.status_code != 200:
            raise HTTPException(
                status_code=response.status_code,
                detail=f'Erro ao acessar a CoinGecko API: {response.status_code}',
            )

        data = response.json()
        history_data = [
            {'date': item[0] / 1000, 'price': item[1]}
            for item in data.get('prices', [])
        ]
        
        _set_cache(cache_key, history_data)
        return history_data
        
    except Exception as e:
        # Em caso de erro, retorna dados mock
        return _get_mock_history_data(crypto_id)

def _get_mock_history_data(crypto_id: str):
    """Retorna dados mock de histórico."""
    base_price = 50000 if crypto_id == 'bitcoin' else 3000 if crypto_id == 'ethereum' else 1
    current_time = int(time.time())
    
    return [
        {'date': current_time - 86400 * i, 'price': base_price + (i * 100)}
        for i in range(30, 0, -1)  # Últimos 30 dias
    ]
