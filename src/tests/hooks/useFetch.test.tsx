import { renderHook, act, waitFor } from "@testing-library/react";
import useFetch from "../../hooks/useFetch";

describe("useFetch", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it("fetches data successfully", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ message: "ok" }),
            headers: new Headers({ "content-type": "application/json" })
        });

        const { result } = renderHook(() => useFetch("/api/test"));

        expect(result.current.isLoading).toBe(true);

        await waitFor(() => {
            expect(result.current.status).toBe("success");
        });

        expect(result.current.data).toEqual({ message: "ok" });
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it("handles HTTP error responses", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: false,
            status: 404,
            statusText: "Not Found",
            headers: new Headers({ "content-type": "application/json" })
        });

        const { result } = renderHook(() => useFetch("/api/fail"));

        await waitFor(() => {
            expect(result.current.status).toBe("error");
        });

        expect(result.current.data).toBe(null);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeInstanceOf(Error);
        // @ts-ignore
        expect(result.current.error.message).toContain("HTTP 404");
    });

    it("respects cache-only policy when cache is present", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ cached: true }),
            headers: new Headers({ "content-type": "application/json" })
        });

        const { result, rerender } = renderHook(() => useFetch("/api/cache", { cachePolicy: "cache-first" }));
        await waitFor(() => expect(result.current.status).toBe("success"));

        const { result: cachedResult } = renderHook(() => useFetch("/api/cache", { cachePolicy: "cache-only" }));
        expect(cachedResult.current.data).toEqual({ cached: true });
        expect(cachedResult.current.status).toBe("success");
    });

    it("errors on cache-only when no cache is present", async () => {
        const { result } = renderHook(() => useFetch("/api/miss", { cachePolicy: "cache-only" }));
        await waitFor(() => expect(result.current.status).toBe("error"));
        expect(result.current.error).toBeInstanceOf(Error);
    });

    it("dedupes cache-first if recent enough", async () => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: async () => ({ once: true }),
            headers: new Headers({ "content-type": "application/json" })
        });

        const { result } = renderHook(() => useFetch("/api/dedupe", { cachePolicy: "cache-first", dedupingInterval: 10000 }));
        await waitFor(() => expect(result.current.status).toBe("success"));

        global.fetch = jest.fn(); // reset mock

        const { result: dedupedResult } = renderHook(() => useFetch("/api/dedupe", { cachePolicy: "cache-first" }));
        expect(dedupedResult.current.data).toEqual({ once: true });
        expect(global.fetch).not.toHaveBeenCalled();
    });

    it("retries failed request up to specified count", async () => {
        global.fetch = jest
            .fn()
            .mockRejectedValueOnce(new Error("fail"))
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                json: async () => ({ retried: true }),
                headers: new Headers({ "content-type": "application/json" })
            });

        const { result } = renderHook(() =>
            useFetch("/api/retry", { retries: 1, retryDelay: 500 })
        );

        // fast-forward retry delay
        await act(async () => {
            jest.advanceTimersByTime(500);
        });

        await waitFor(() => expect(result.current.status).toBe("success"));
        expect(result.current.data).toEqual({ retried: true });
    });

    it("can be aborted manually and prevents state update", async () => {
        let resolve: (arg0: { ok: boolean; status: number; json: () => Promise<{ aborted: boolean; }>; headers: Headers; }) => void;
        global.fetch = jest.fn().mockImplementation(
            () =>
                new Promise((_resolve) => {
                    resolve = _resolve;
                })
        );

        const { result } = renderHook(() => useFetch("/api/abort"));

        act(() => {
            result.current.abort();
        });

        act(() => {
            resolve({
                ok: true,
                status: 200,
                json: async () => ({ aborted: false }),
                headers: new Headers({ "content-type": "application/json" })
            });
        });

        expect(result.current.isLoading).toBe(false);
        expect(result.current.status).not.toBe("success");
    });
});
