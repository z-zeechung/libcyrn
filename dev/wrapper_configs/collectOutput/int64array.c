napi_value arr;
napi_create_array(env, &arr);
for (int i = 0; i < retval.count; i++) {
    napi_value element;
    napi_create_int64(env, retval.data[i], &element);
    napi_set_element(env, arr, i, element);
}