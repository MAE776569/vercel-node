"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function ViewControllerMixin(BaseClass) {
    return class ViewController extends BaseClass {
        handleRequest() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const contextObject = yield this.getContextObject();
                    const locals = Object.assign({}, contextObject);
                    if (this.model) {
                        const queryResult = yield this.getQueryResult();
                        locals[this.queryObjectName] = queryResult;
                    }
                    return this.sendResponse({
                        type: "html",
                        body: locals
                    });
                }
                catch (err) {
                    return this.next(err);
                }
            });
        }
    };
}
module.exports = ViewControllerMixin;
