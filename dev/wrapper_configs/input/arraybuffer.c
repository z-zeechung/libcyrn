array_buffer var$idx;
// napi_create_reference(env, args[$idx], 1, var$idx.ref);  // TODO: fix this
napi_get_arraybuffer_info(env, args[$idx], &var$idx.data, &var$idx.size);