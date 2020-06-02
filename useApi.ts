import {useEffect, useMemo, useState} from "react";

export enum ApiStatus {
  initial = 'initial',
  loading = 'loading',
  success = 'success',
  failed = 'failed',
  canceled = 'canceled',
}

export interface ApiState {
  resetValue(): void,
  cancelRequest(): void,
  status: ApiStatus,
  error: any | null, // Set error type isn't save. Response from failed api request may be have not expected format
  isInitial: boolean,
  isLoading: boolean,
  isCanceled: boolean,
  isSuccess: boolean,
  isFailed: boolean,
}

type State<TResult> = {
  result: TResult,
  status: ApiStatus,
  error: any | null
};

export type UseApi = <TResponse, TInitialValue, TRequest = void>(
    asyncFunc: (arg: TRequest) => Promise<TResponse>,
    initialValue: TInitialValue,
) => [TResponse | TInitialValue, (payload: TRequest) => void, ApiState];

const useApi: UseApi = <TResponse, TInitialValue, TRequest>(
    asyncFunc: (arg: TRequest) => Promise<TResponse>,
    initialResult: TInitialValue,
): [TResponse | TInitialValue, (payload: TRequest) => void, ApiState] => {
  const [state, setState] = useState<State<TResponse | TInitialValue>>({
    result: initialResult,
    status: ApiStatus.initial,
    error: null
  });

  useEffect(() => {
    return () => setState({ ...state, status: ApiStatus.canceled, error: null });
  }, []);

  const request = (payload: TRequest) => {
    setState({ ...state, status: ApiStatus.loading, error: null });

    return asyncFunc(payload)
        .then((result) => {
          // Was the validation request canceled at run time?
          if (state.status !== ApiStatus.canceled) {
            setState({ result, status: ApiStatus.success, error: null });
          }
        })
        .catch((error) => {
          // Was the validation request canceled at run time?
          if (state.status === ApiStatus.canceled) {
            return;
          }
          setState({ ...state, status: ApiStatus.failed, error });
        });
  };

  const resultState = useMemo((): ApiState => {
    return {
      cancelRequest: () => setState({
        ...state,
        status: ApiStatus.canceled,
        error: null
      }),
      resetValue: () => setState({
        result: initialResult,
        status: ApiStatus.initial,
        error: null
      }),
      error: state.error,
      status: state.status,
      isInitial: state.status === ApiStatus.initial,
      isLoading: state.status === ApiStatus.loading,
      isFailed: state.status === ApiStatus.failed,
      isCanceled: state.status === ApiStatus.canceled,
      isSuccess: state.status === ApiStatus.success,
    };
  }, [state]);

  return [state.result, request, resultState];
};

export default useApi;
