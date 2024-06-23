"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReviewDTO = void 0;
const baseDTO_1 = require("./baseDTO");
class ReviewDTO extends baseDTO_1.BaseDTO {
    constructor(dto) {
        super({
            _id: dto._id,
            idNumber: dto.idNumber,
            createdAt: dto.createdAt,
            updatedAt: dto.updatedAt,
        });
        this._storeId = dto.storeId;
        this.rate = dto.rate;
    }
    toDetailDTO() {
        return {
            idNumber: this.idNumber,
            storeId: this._storeId,
            rate: this.rate,
            content: this.content,
        };
    }
}
exports.ReviewDTO = ReviewDTO;
//# sourceMappingURL=reviewDTO.js.map