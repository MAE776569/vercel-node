import BaseController from "../../controllers/generic/BaseController";
import { Constructor } from "../../types/controllers/generic";
declare function ViewControllerMixin<T extends Constructor<BaseController>>(BaseClass: T): T;
export = ViewControllerMixin;
