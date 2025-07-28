
#include "types.h"
#include <stdbool.h>

#include "is_utf8-master/is_utf8.c"

static inline bool buffer_isUtf8(array_buffer buf) {
    char *message;
    int faulty_bytes;
    return (cyrnewic_is_utf8(
        buf.data, 
        buf.size, 
        &message, 
        &faulty_bytes
    ) == 0);
}