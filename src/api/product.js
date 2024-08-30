import api from './api';

const getProducts = async () => {
    const response = await api.get('/api/products')
    return response
}

export {getProducts}