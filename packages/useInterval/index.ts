import { useEffect, useRef } from 'react';

/**
 * @description 定时执行回调函数
 * @param callback (...args: any[]) => void 定时需要执行的函数
 * @param timeout 定时器时间间隔，设为null以停止定时器
 * @example
    function Demo() {
        const [timeout, setTimeout] = useState<number | null>(null)
        const [no, setNo] = useState(0)

        useInterval(() => setNo(pre => pre + 1), timeout);

        return <div>
            here
            {no}
            <Button onClick={() => setTimeout(300)}>300</Button>
            <Button onClick={() => setTimeout(500)}>500</Button>
            <Button onClick={() => setTimeout(null)}>停止</Button>
        </div>
    }
 */
function useInterval(callback: (...args: any[]) => void, timeout?: number | null) {
    const timerRef = useRef<any>(null);
    const callbackRef = useRef<(...args: any[]) => void>(callback);

    useEffect(() => {
        // 初始化后上一个effect会将resetDep加一，会再次触发本effect，为防止重复设置定时器，判断resetDep不为0时才设定时器
        if (timeout !== null) {
            polling();

            return () => {
                if (timerRef.current) {
                    clearTimeout(timerRef.current);
                    timerRef.current = null;
                }
            };
        }

        return;

        function polling() {
            callbackRef.current();
            timerRef.current = setTimeout(polling, timeout || 0);
        }
    }, [timeout]);
}

export default useInterval;
