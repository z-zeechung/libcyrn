string var$idx;
napi_get_value_string_utf8(env, args[$idx], NULL, 0, &var$idx.length);
var$idx.data = (char*)malloc(var$idx.length + 1);
size_t napi_new_str_copied_$idx;
napi_get_value_string_utf8(env, args[$idx], var$idx.data, var$idx.length + 1, &napi_new_str_copied_$idx);