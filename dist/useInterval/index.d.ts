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
declare function useInterval(callback: (...args: any[]) => void, timeout?: number | null): void;
export default useInterval;
