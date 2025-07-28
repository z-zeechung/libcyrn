
#include "types.h"

static inline void buffer_swap16(array_buffer buf){
    for (size_t i = 0; i < buf.size; i += 2) {
        uint16_t *p = (uint16_t *)(buf.data + i);
        *p = (*p >> 8) | (*p << 8);  
    }
}