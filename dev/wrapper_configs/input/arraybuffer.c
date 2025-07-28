array_buffer var$idx;
var$idx.ref = malloc(sizeof(napi_ref));
napi_create_reference(env, args[$idx], 1, var$idx.ref);
napi_get_arraybuffer_info(env, args[$idx], &var$idx.data, &var$idx.size);