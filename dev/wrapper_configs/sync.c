napi_value $wrapperFunction(napi_env env, napi_callback_info info) {
    size_t argc = $inputsCount;
    napi_value args[$inputsCount];
    napi_get_cb_info(env, info, &argc, args, NULL, NULL);

    $inputs

    errno = 0;
    $invoke

    $freeInputs

    if(errno != 0) {
        $freeOutput
        napi_cyrntest_throw_error(errno);
        return NULL; // 返回NULL表示抛出错误
    }

    $collectOutput
    $freeOutput
    $output
}