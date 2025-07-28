
#include <stdint.h>
#include "types.h"
#include <string.h>

static inline int32_t buffer_memcmp(
    array_buffer buf1, array_buffer buf2, 
    int64_t buf1_start, int64_t buf2_start,
    int64_t len
){
    return memcmp(
        buf1.data + buf1_start, buf2.data + buf2_start, len
    );
}