#ifndef BINDINGS_$bindingName_H
#define BINDINGS_$bindingName_H

#include <node_api.h>

// 声明模块初始化函数
napi_value Init$bindingName(napi_env env, napi_value exports);

#endif   // BINDINGS_$bindingName_H