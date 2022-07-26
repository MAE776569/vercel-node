"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiDeleteController = exports.ApiEditController = exports.ApiCreateController = exports.ApiDetailsController = exports.ApiListController = exports.ApiController = void 0;
const BaseController_1 = __importDefault(require("./controllers/generic/BaseController"));
const BaseListController_1 = __importDefault(require("./controllers/list/BaseListController"));
const ApiControllerMixin_1 = __importDefault(require("./mixins/generic/ApiControllerMixin"));
const ApiDetailsController_1 = __importDefault(require("./controllers/details/ApiDetailsController"));
exports.ApiDetailsController = ApiDetailsController_1.default;
const ApiCreateController_1 = __importDefault(require("./controllers/create/ApiCreateController"));
exports.ApiCreateController = ApiCreateController_1.default;
const ApiEditController_1 = __importDefault(require("./controllers/edit/ApiEditController"));
exports.ApiEditController = ApiEditController_1.default;
const ApiDeleteController_1 = __importDefault(require("./controllers/delete/ApiDeleteController"));
exports.ApiDeleteController = ApiDeleteController_1.default;
exports.ApiController = ApiControllerMixin_1.default(BaseController_1.default);
exports.ApiListController = ApiControllerMixin_1.default(BaseListController_1.default);
