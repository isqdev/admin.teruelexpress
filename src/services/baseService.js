import api from "../configs/axiosConfig"

class BaseService {

    constructor(endPoint) {
        this.endPoint = endPoint;
        this.api = api;
    }

    async insert(data) {
        const response = await this.api.post(this.endPoint, data)
        return response;
    }

    async alter(data) {
        const response = await this.api.put(this.endPoint, data);
        return response;
    }

    async delete(data) {
        const response = await this.api.delete(`${this.endPoint}/${id}`)
        return response
    }

    async findAll() {
        const response = await this.api.get(this.endPoint)
        return response;
    }
}

export default BaseService