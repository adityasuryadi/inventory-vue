import api from "./api";

const postRequestItem = async(params) => {
    const response = await api.post('/api/requestitem', params)
    return response
}

const getRequestItems = async() => {
    const response = await api.get('/api/requestitems')
    return response
}

export {postRequestItem, getRequestItems}