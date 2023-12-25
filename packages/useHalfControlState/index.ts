import { Dispatch, SetStateAction, useCallback, useMemo, useRef } from 'react';
import useForceUpdate from '../useForceUpdate';

/**
 * @description 在某些组件的状态需要支持受控和非受控两种情形时使用
 * @param parentState 传入的状态，会作为默认值维护，值变化也会导致当前维护状态直接变化
 * @param processer 对parentState进行加工处理的函数
 * @return [state, setState] 当前维护的值，修改值的函数
 * @example
    function Demo() {
        const [pNo, setPNo] = useState(1)

        return <div>
            <Button onClick={() => setPNo(pre => pre + 1)}>父控件增加</Button>
            <Son pNo={pNo} />
        </div>
    }

    function Son({ pNo }: { pNo: number }) {
        const [no, setNo] = useHalfControlState(pNo, state => state * 10);

        return <div>
            {no}
            <Button onClick={() => setNo(pre => pre + 1)}>
                子控件增加
            </Button>
        </div>
    }
 */
function useHalfControlState<T, S = T>(parentState: T, processer?: (p: T) => S): [S, Dispatch<SetStateAction<S>>] {
    const ref = useRef<S>();
    const update = useForceUpdate();
    const processerRef = useRef(processer);

    useMemo(() => {
        ref.current = (processerRef.current ? processerRef.current(parentState) : parentState) as S;
    }, [parentState]);

    const change: Dispatch<SetStateAction<S>> = useCallback(
        (preValue: SetStateAction<S>) => {
            const value = typeof preValue === 'function' ? (preValue as (val: S) => S)(ref.current!) : preValue;

            ref.current = value;
            update();
        },
        [update]
    );

    return [ref.current!, change];
}

export default useHalfControlState;
