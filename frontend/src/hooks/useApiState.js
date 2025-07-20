import { useState, useCallback } from 'react';

export const useApiState = (initialData = null) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const execute = useCallback(async (apiCall) => {
        try {
            setLoading(true);
            setError('');
            const result = await apiCall();
            setData(result);
            return { success: true, data: result };
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.message || 'Erro desconhecido';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, []);

    const reset = useCallback(() => {
        setData(initialData);
        setError('');
        setLoading(false);
    }, [initialData]);

    return {
        data,
        loading,
        error,
        execute,
        reset,
        setData,
        setError
    };
};

export const usePagination = (initialPage = 1) => {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const updatePagination = useCallback((response) => {
        setCurrentPage(response.current_page || 1);
        setTotalPages(Math.ceil((response.total || 0) / (response.per_page || 10)));
        setTotalItems(response.total || 0);
        setItemsPerPage(response.per_page || 10);
    }, []);

    const goToPage = useCallback((page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            return true;
        }
        return false;
    }, [totalPages]);

    const nextPage = useCallback(() => {
        return goToPage(currentPage + 1);
    }, [currentPage, goToPage]);

    const prevPage = useCallback(() => {
        return goToPage(currentPage - 1);
    }, [currentPage, goToPage]);

    return {
        currentPage,
        totalPages,
        totalItems,
        itemsPerPage,
        updatePagination,
        goToPage,
        nextPage,
        prevPage,
        hasNext: currentPage < totalPages,
        hasPrev: currentPage > 1
    };
};
