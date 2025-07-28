napi_value arr;
napi_create_array(env, &arr);
for (int i = 0; i < retval.count; i++) {
    napi_value str;
    napi_create_string_utf8(env, retval.data[i].data, retval.data[i].length, &str);
    napi_set_element(env, arr, i, str);
}