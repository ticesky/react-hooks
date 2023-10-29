import _toConsumableArray from '@babel/runtime/helpers/esm/toConsumableArray';
import _regeneratorRuntime from '@babel/runtime/helpers/esm/regeneratorRuntime';
import _objectSpread from '@babel/runtime/helpers/esm/objectSpread2';
import _asyncToGenerator from '@babel/runtime/helpers/esm/asyncToGenerator';
import _slicedToArray from '@babel/runtime/helpers/esm/slicedToArray';
import { useState, useRef, useCallback, useEffect } from 'react';

/**
 * @description
 * 用于生成异步请求，其返回值为包含state和runAsync的数组。需要注意的是，该hook需要用户主动执行返回的runAsync方法来调用加载器
 * 其中state为包含loading、error、data三个值的对象，runAsync则为触发本次异步请求，并且其接收的参数会全部传递给loader加载器
 * 你也可以利用第二个参数，它会在请求的开始、结束阶段分别回调这个参数，并且传递state以及你传递给runAsync方法的参数
 * @params {(...args: any[]) => Promise<any>} loader 异步加载器，例如axios或者fetch请求
 * @params {(state, ...args: any[]) => void} onChange 请求状态变化时的回调
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
function useAsyncBase(loader,
// 加载器函数
onChange) {
  var initialLoading = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var _useState = useState({
      loading: initialLoading,
      error: null,
      data: null
    }),
    _useState2 = _slicedToArray(_useState, 2),
    state = _useState2[0],
    setState = _useState2[1];
  var mountRef = useRef(false);
  var argsRef = useRef([]);
  var runAsync = useCallback( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    var _len,
      args,
      _key,
      data,
      _args = arguments;
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          setState(function (preState) {
            return _objectSpread(_objectSpread({}, preState), {}, {
              loading: true,
              error: null
            });
          });
          for (_len = _args.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = _args[_key];
          }
          argsRef.current = args;
          _context.prev = 3;
          _context.next = 6;
          return loader.apply(void 0, args);
        case 6:
          data = _context.sent;
          setState({
            loading: false,
            error: null,
            data: data
          });
          _context.next = 13;
          break;
        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](3);
          setState({
            loading: false,
            error: _context.t0,
            data: null
          });
        case 13:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[3, 10]]);
  })),
  // eslint-disable-next-line
  [loader]);
  useEffect(function () {
    if (mountRef.current || initialLoading) {
      if (typeof onChange === 'function') {
        onChange.apply(void 0, [state].concat(_toConsumableArray(argsRef.current)));
      }
    }
    // eslint-disable-next-line
  }, [state]);
  useEffect(function () {
    mountRef.current = true;
    // eslint-disable-next-line
  }, []);
  return [state, runAsync];
}

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

function useForceUpdate() {
  var _useState = useState(0),
    _useState2 = _slicedToArray(_useState, 2),
    setFlag = _useState2[1];
  return useCallback(function () {
    return setFlag(function (flag) {
      return flag + 1;
    });
  }, []);
}

export { useAsyncBase, useForceUpdate };
