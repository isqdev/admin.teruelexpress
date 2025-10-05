import BaseService from "./BaseService";

class ReviewService extends BaseService {
    constructor() {
        super("/avaliacoes")
    }

    async findAllReviews(page) {
        const response = await this.api.get(`${this.endPoint}?size=6&page=${page}&sort=id,asc`)
        return response;
    }
}


export default ReviewService;