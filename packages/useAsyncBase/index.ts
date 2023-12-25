import { useCallback, useEffect, useRef, useState } from 'react';

export interface LoaderState<T> {
    loading: boolean;
    error: any;
    data: T | null;
}

export interface RunAsync<T extends any[]> {
    (...args: T): void;
}

/**
 * @description
 * 用于生成异步请求，其返回值为包含state和runAsync的数组。需要注意的是，该hook需要用户主动执行返回的runAsync方法来调用加载器
 * 其中state为包含loading、error、data三个值的对象，runAsync则为触发本次异步请求，并且其接收的参数会全部传递给loader加载器
 * 你也可以利用第二个参数，它会在请求的开始、结束阶段分别回调这个参数，并且传递state以及你传递给runAsync方法的参数
 * @param loader (...args: any[]) => Promise<any> 异步加载器，例如axios或者fetch请求
 * @param onChange (state, ...args: any[]) => void 请求状态变化时的回调
 * @return [{ loading, error, data }, (...args: any[]) => void]
 * @example
    const [state, getUserInfo] = useAsyncBase(userId => http.get('/api/userinfo/' + userId), state => {
        if (state.loading) {
            Toast.loading(true);
        } else if (state.error) {
            Toast.show(state.error);
        }
    });

    const handleClick = () => {
        getUserInfo(user.userId);
    }
 */
function useAsyncBase<T = any, Args extends any[] = any[]>(
    loader: (...args: Args) => Promise<T>, // 加载器函数
    onChange?: (state: LoaderState<T>, ...args: Args) => void,
    initialLoading: boolean = false
): [LoaderState<T>, RunAsync<Args>] {
    const [state, setState] = useState<LoaderState<T>>({ loading: initialLoading, error: null, data: null });
    const mountRef = useRef(false);
    const argsRef = useRef<Args>([] as any);

    const runAsync: RunAsync<Args> = useCallback(
        async (...args) => {
            setState(preState => ({
                ...preState,
                loading: true,
                error: null
            }));

            argsRef.current = args;

            try {
                const data = await loader(...args);

                setState({ loading: false, error: null, data });
            } catch (error) {
                setState({ loading: false, error, data: null });
            }
        },
        // eslint-disable-next-line
        [loader]
    );

    useEffect(() => {
        if (mountRef.current || initialLoading) {
            if (typeof onChange === 'function') {
                onChange(state, ...argsRef.current);
            }
        }
        // eslint-disable-next-line
    }, [state]);

    useEffect(() => {
        mountRef.current = true;
        // eslint-disable-next-line
    }, []);

    return [state, runAsync];
}

export default useAsyncBase;
