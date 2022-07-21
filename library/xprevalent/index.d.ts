import BaseController from "./controllers/generic/BaseController";
import BaseListController from "./controllers/list/BaseListController";
import ApiDetailsController from "./controllers/details/ApiDetailsController";
import ApiCreateController from "./controllers/create/ApiCreateController";
import ApiEditController from "./controllers/edit/ApiEditController";
import ApiDeleteController from "./controllers/delete/ApiDeleteController";
export declare const ApiController: typeof BaseController;
export declare const ApiListController: typeof BaseListController;
export { ApiDetailsController, ApiCreateController, ApiEditController, ApiDeleteController };
