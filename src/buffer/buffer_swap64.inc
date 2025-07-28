
#include <stdint.h>
#include "types.h"

static inline void buffer_swap64(array_buffer buf) {    
    for (uint32_t i = 0; i < buf.size; i += 8) {
        uint64_t *p = (uint64_t *)(buf.data + i);
        *p = ((*p & 0x00000000000000FFULL) << 56) |
             ((*p & 0x000000000000FF00ULL) << 40) |
             ((*p & 0x0000000000FF0000ULL) << 24) |
             ((*p & 0x00000000FF000000ULL) << 8)  |
             ((*p & 0x000000FF00000000ULL) >> 8)  |
             ((*p & 0x0000FF0000000000ULL) >> 24) |
             ((*p & 0x00FF000000000000ULL) >> 40) |
             ((*p & 0xFF00000000000000ULL) >> 56);
    }
}