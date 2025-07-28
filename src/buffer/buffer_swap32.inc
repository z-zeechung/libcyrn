
#include <stdint.h>
#include "types.h"

static inline void buffer_swap32(array_buffer buf) {
    for (uint32_t i = 0; i < buf.size; i += 4) {
        uint32_t *p = (uint32_t *)(buf.data + i);
        uint32_t val = *p;
        *p = ((val >> 24) & 0x000000FF) |
             ((val >> 8)  & 0x0000FF00) |
             ((val << 8)  & 0x00FF0000) |
             ((val << 24) & 0xFF000000);
    }
}