import { useCallback, useState } from 'react';

/**
 * @description 用于强制渲染页面hook
 * @return {fn} 一个刷新函数
 * @example
    function Demo() {
        const forceUpdate = useForceUpdate();
        const numberRef = useRef(0)
        const add = () => {
            numberRef.current =+ 1
            forceUpdate()
        }

        return (
            <>
                <button onclick={add}>增加</button>
                {numberRef.current}
            </>
        )
    }
 */

export default function useForceUpdate() {
    const [, setFlag] = useState(0);

    return useCallback(() => setFlag(flag => flag + 1), []);
}
