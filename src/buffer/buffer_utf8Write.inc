
#include <stdint.h>
#include <string.h>
#include "types.h"

static inline int64_t buffer_utf8Write(
    array_buffer buf, string utf8_str,
    int64_t offset, int64_t length
){
    length = length > utf8_str.length ? utf8_str.length : length;

    memcpy(
        (char*)buf.data + offset,
        utf8_str.data,
        length
    );

    return length;
}