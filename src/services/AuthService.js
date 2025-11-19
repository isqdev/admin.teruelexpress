import BaseService from "./BaseService";

class AuthService extends BaseService{

    constructor(){
        super("/auth");
    }

    async login(dados){
        const resposta = this.api.post(`${this.endPoint}/login/admin`, dados);
        return resposta;
    }
}

export default AuthService;