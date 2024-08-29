import axios from 'axios';


const getEmployees = async () => {
    const response = await axios.get('http://inventory.test/api/employees');
    return response.data.data
}

export {getEmployees}