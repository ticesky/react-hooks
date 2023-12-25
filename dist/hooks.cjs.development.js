'use strict';

var _toConsumableArray = require('@babel/runtime/helpers/toConsumableArray');
var _regeneratorRuntime = require('@babel/runtime/helpers/regeneratorRuntime');
var _objectSpread = require('@babel/runtime/helpers/objectSpread2');
var _asyncToGenerator = require('@babel/runtime/helpers/asyncToGenerator');
var _slicedToArray = require('@babel/runtime/helpers/slicedToArray');
var react = require('react');

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
function useAsyncBase(loader,
// 加载器函数
onChange) {
  var initialLoading = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  var _useState = react.useState({
      loading: initialLoading,
      error: null,
      data: null
    }),
    _useState2 = _slicedToArray(_useState, 2),
    state = _useState2[0],
    setState = _useState2[1];
  var mountRef = react.useRef(false);
  var argsRef = react.useRef([]);
  var runAsync = react.useCallback( /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
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
  react.useEffect(function () {
    if (mountRef.current || initialLoading) {
      if (typeof onChange === 'function') {
        onChange.apply(void 0, [state].concat(_toConsumableArray(argsRef.current)));
      }
    }
    // eslint-disable-next-line
  }, [state]);
  react.useEffect(function () {
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
  var _useState = react.useState(0),
    _useState2 = _slicedToArray(_useState, 2),
    setFlag = _useState2[1];
  return react.useCallback(function () {
    return setFlag(function (flag) {
      return flag + 1;
    });
  }, []);
}

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
function useHalfControlState(parentState, processer) {
  var ref = react.useRef();
  var update = useForceUpdate();
  var processerRef = react.useRef(processer);
  react.useMemo(function () {
    ref.current = processerRef.current ? processerRef.current(parentState) : parentState;
  }, [parentState]);
  var change = react.useCallback(function (preValue) {
    var value = typeof preValue === 'function' ? preValue(ref.current) : preValue;
    ref.current = value;
    update();
  }, [update]);
  return [ref.current, change];
}

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
function useInterval(callback, timeout) {
  var timerRef = react.useRef(null);
  var callbackRef = react.useRef(callback);
  react.useEffect(function () {
    // 初始化后上一个effect会将resetDep加一，会再次触发本effect，为防止重复设置定时器，判断resetDep不为0时才设定时器
    if (timeout !== null) {
      polling();
      return function () {
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

exports.useAsyncBase = useAsyncBase;
exports.useForceUpdate = useForceUpdate;
exports.useHalfControlState = useHalfControlState;
exports.useInterval = useInterval;
