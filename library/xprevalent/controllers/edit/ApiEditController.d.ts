/// <reference types="express" />
import BaseEditController from "./BaseEditController";
declare class ApiEditController extends BaseEditController {
    protected handleRequest(): Promise<void | import("express").Response<any>>;
}
export = ApiEditController;
