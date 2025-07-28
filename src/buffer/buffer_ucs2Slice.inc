
#include <stdint.h>
#include "types.h"
#include <wchar.h>
#include <string.h>
#include <errno.h>
#include <stdlib.h>

static inline wstring ucs2Slice(
    array_buffer buf, int64_t start, int64_t end
){

    int64_t len = (end - start) / 2;

    wchar_t *wstr = (wchar_t *)malloc(sizeof(wchar_t) * (len + 1));
    if(wstr == NULL){
        errno = ENOMEM;
        wstring w = {0, NULL};
        return w;
    }

    // if(sizeof(wchar_t) == 2){    // LE machine path
    //     memcpy(
    //         (unsigned char *)wstr,
    //         (unsigned char *)buf.data + start,
    //         len * sizeof(wchar_t)
    //     );
    // }else{
        for(int64_t i = 0; i < len; i++){
            unsigned char low = buf.data[start + i * 2];
            unsigned char high = buf.data[start + i * 2 + 1];
            wstr[i] = (high << 8) | low;
        }
    // }

    wstr[len] = 0;

    wstring ret = { len, wstr };

    return ret;
}