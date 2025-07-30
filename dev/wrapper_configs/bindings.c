#include "$bindingName.h"
#include "$bindingName.inc"

#include <stdint.h>
#include <string.h>
#include <stdlib.h>
#include "types.h"
#include <errno.h>
#include <stdbool.h>
#include <stdio.h>

static void napi_cyrntest_throw_error(napi_env env, int errnum){
    napi_value error;
    napi_create_string_utf8(env, "Internal Error.", NAPI_AUTO_LENGTH, &error);
    napi_throw(env, error);
}

#define napi_cyrntest_max(a, b) ((a) > (b) ? (a) : (b))


$wrapperDefinitions


$wrapperFunctions   // function array of wrappers

$wrapperNames   // array of wrapper names

/* $wrapperParamCounts */   // array of wrapper parameter counts

napi_value Init$bindingName(napi_env env, napi_value exports) {
    for (int i = 0; i < 21; i++) {
        napi_value fn;
        napi_create_function(env, wrapperNames[i], NAPI_AUTO_LENGTH, wrapperFunctions[i], NULL, &fn);
        napi_set_named_property(env, exports, wrapperNames[i], fn);
    }

    return exports;
}

NAPI_MODULE(NAPI_MODULE_$bindingName, Init$bindingName)