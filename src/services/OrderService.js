import BaseService from "./BaseService";

class OrderService extends BaseService {
    constructor() {
        super("/solicitacoes")
    }

    async findAllAdmin(page) {
        const response = await this.api.get(`${this.endPoint}/admin?size=20&page=${page}&sort=id,desc`);
        return response;
    }

    async update(id, aceito) {
        const response = await this.api.patch(`${this.endPoint}/admin/${id}?aceito=${aceito}`);
        return response;
    }

    async getDetalhes(id) {
        const response = await this.api.get(`${this.endPoint}/admin/${id}`);
        console.log(response);
        return response;
    }
}

export default OrderService;