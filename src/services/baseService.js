import api from "../configs/axiosConfig"

class BaseService {

    constructor(endPoint) {
        this.endPoint = endPoint;
        this.api = api;
    }

    async insert(dados) {
        const resposta = await this.api.post(this.endPoint, dados)
        return resposta;
    }

    async alter(dados) {
        const resposta = await this.api.put(this.endPoint, dados);
        return resposta;
    }

    async delete(dados) {
        const resposta = await this.api.delete(`${this.endPoint}/${id}`)
        return resposta
    }

    async findAll() {
        const resposta = await this.api.get(this.endPoint)
        return resposta;
    }
}

export default BaseService