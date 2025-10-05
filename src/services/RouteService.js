import BaseService from "./BaseService";

class RouteService extends BaseService {
    constructor() {
        super("/cidades")
    }

    async findAll(page) { 
        const response = await this.api.get(`${this.endPoint}?size=20&page=${page}`);
        return response;
    }

    async save(city) {
        const response = await this.api.post(this.endPoint, city);
        return response;
    }

    async softDelete(id) {
        const response = await this.api.delete(`${this.endPoint}/${id}`);
        return response;
    }

    async toggleActive(id) {
        const response = await this.api.patch(`${this.endPoint}/${id}`)
        return response;
    }
}


export default RouteService;