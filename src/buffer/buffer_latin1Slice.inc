
#include <stdint.h>
#include "types.h"
#include <stdbool.h>
#include <wchar.h>
#include <errno.h>
#include <stdlib.h>

static inline wstring buffer_latin1Slice(
    array_buffer buf, int64_t start, int64_t end,
    bool is_ascii
){
    int64_t len = end - start;
    
    wchar_t *str = malloc(sizeof(wchar_t) * (len + 1));
    if(str == NULL){
        errno = ENOMEM;
        wstring ret = {0, NULL};
        return ret;
    }

    if(is_ascii){
        for(int64_t i = 0; i < len; i++){
            str[i] = (wchar_t)(buf.data[start + i] & 0x7F); 
        }
    }else{
        for(int64_t i = 0; i < len; i++){
            str[i] = (wchar_t)(unsigned char)buf.data[start + i];
        }
    }

    str[len] = '\0';

    wstring ret = { len, str };
    return ret;
}