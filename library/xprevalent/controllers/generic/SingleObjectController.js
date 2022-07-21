"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const validators_1 = require("../../validators");
const BaseController_1 = __importDefault(require("./BaseController"));
class SingleObjectController extends BaseController_1.default {
    constructor() {
        super(...arguments);
        // Params and validation
        this.idParam = "id";
    }
    get validationResult() {
        if (this.validation) {
            return this.validation;
        }
        this.validation = this.validationSchema.validate(this.req);
        return this.validation;
    }
    validateIdParam() {
        const validationSchema = new validators_1.ValidationSchema({
            params: validators_1.validator.object({
                [this.idParam]: validators_1.validator.string().mongoId()
            })
        });
        const validationResult = validationSchema.validate(this.req);
        return validationResult.hasError({
            name: this.idParam,
            location: "params"
        });
    }
    getQueryFilter() {
        return {};
    }
}
module.exports = SingleObjectController;
