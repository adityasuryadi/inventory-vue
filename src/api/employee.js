import api from "./api"

const getEmployees = async () => {
    const response = await api.get('/api/employees')
    return response
}

export {getEmployees}