import BaseService from "./BaseService";

class OrderService extends BaseService {
    constructor() {
        super("/solicitacoes")
    }

    async findAllAdmin(page) {
        const response = await this.api.get(`${this.endPoint}/admin?size=20&page=${page}&sort=id,desc`);
        return response;
    }
}


export default OrderService;