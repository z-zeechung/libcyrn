
#include <stdint.h>
#include "types.h"
#include <stdbool.h>

static inline bool buffer_isAscii(array_buffer buf){
    unsigned char *data = (unsigned char *)buf.data;
    for(int64_t i = 0; i < buf.size; i++){
        if(data[i] > 127){
            return false;
        }
    }
    return true;
}