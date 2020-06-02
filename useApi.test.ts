import useApi, {ApiState, ApiStatus} from "./useApi";
import {renderHook} from '@testing-library/react-hooks';

jest.useFakeTimers();

const testApiState = (state: ApiState, status: ApiStatus, error: any) => {
  expect(state.error).toBe(error);
  expect(state.status).toBe(status);
  expect(state.isInitial).toBe(status === ApiStatus.initial);
  expect(state.isLoading).toBe(status === ApiStatus.loading);
  expect(state.isSuccess).toBe(status === ApiStatus.success);
  expect(state.isCanceled).toBe(status === ApiStatus.canceled);
  expect(state.isFailed).toBe(status === ApiStatus.initial);
};

describe('useApi', () => {
  it('initial values', () => {
    const api = jest.fn() as () => Promise<number | null>;

    const { result } = renderHook(() => {
      return useApi(api, null);
    });

    expect(api).not.toBeCalled();

    const [value, , state] = result.current;

    expect(value).toBe(null);
    testApiState(state, ApiStatus.initial, null);
  });
});