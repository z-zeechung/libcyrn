#include "$bindingName.h"
#include "$bindingName.inc"

#include <stdint.h>
#include <string.h>
#include <stdlib.h>
#include "types.h"
#include <errno.h>

static void napi_cyrntest_throw_error(int errnum){
    napi_value error;
    napi_create_string_utf8(env, "Internal Error.", NAPI_AUTO_LENGTH, &error);
    napi_throw(env, error);
}


$wrapperDefinitions


$wrapperFunctions   // function array of wrappers

$wrapperNames   // array of wrapper names

/* $wrapperParamCounts */   // array of wrapper parameter counts

napi_value Init$bindingName(napi_env env, napi_value exports) {
    napi_property_descriptor * descs = (napi_property_descriptor *)malloc(sizeof(napi_property_descriptor) * $wrappersCount);
    for (int i = 0; i < $wrappersCount; i++) {
        napi_property_descriptor desc = {
            wrapperNames[i],
            NULL,
            wrapperFunctions[i],
            NULL,
            NULL, 
            NULL, 
            napi_default,
            NULL
        };
        descs[i] = desc;
    }

    napi_define_properties(env, exports, $wrappersCount, descs);

    free(descs);

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init$bindingName)