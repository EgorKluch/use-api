"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.ApiStatus = void 0;
var react_1 = require("react");
var ApiStatus;
(function (ApiStatus) {
    ApiStatus["initial"] = "initial";
    ApiStatus["loading"] = "loading";
    ApiStatus["success"] = "success";
    ApiStatus["failed"] = "failed";
    ApiStatus["canceled"] = "canceled";
})(ApiStatus = exports.ApiStatus || (exports.ApiStatus = {}));
var useApi = function (asyncFunc, initialResult) {
    var _a = react_1.useState({
        result: initialResult,
        status: ApiStatus.initial,
        error: null
    }), state = _a[0], setState = _a[1];
    react_1.useEffect(function () {
        return function () { return setState(__assign(__assign({}, state), { status: ApiStatus.canceled, error: null })); };
    }, []);
    var request = function (payload) {
        setState(__assign(__assign({}, state), { status: ApiStatus.loading, error: null }));
        return asyncFunc(payload)
            .then(function (result) {
            // Was the validation request canceled at run time?
            if (state.status !== ApiStatus.canceled) {
                setState({ result: result, status: ApiStatus.success, error: null });
            }
        })["catch"](function (error) {
            // Was the validation request canceled at run time?
            if (state.status === ApiStatus.canceled) {
                return;
            }
            setState(__assign(__assign({}, state), { status: ApiStatus.failed, error: error }));
        });
    };
    var resultState = react_1.useMemo(function () {
        return {
            cancelRequest: function () { return setState(__assign(__assign({}, state), { status: ApiStatus.canceled, error: null })); },
            resetValue: function () { return setState({
                result: initialResult,
                status: ApiStatus.initial,
                error: null
            }); },
            error: state.error,
            status: state.status,
            isInitial: state.status === ApiStatus.initial,
            isLoading: state.status === ApiStatus.loading,
            isFailed: state.status === ApiStatus.failed,
            isCanceled: state.status === ApiStatus.canceled,
            isSuccess: state.status === ApiStatus.success
        };
    }, [state]);
    return [state.result, request, resultState];
};
exports["default"] = useApi;
