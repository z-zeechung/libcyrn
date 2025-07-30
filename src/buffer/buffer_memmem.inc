
#include <stdint.h>
#include "types.h"
#include <stdbool.h>

#include "memmem/memmem.c"
#include "memmem/memrmem.c"

static inline int64_t buffer_memmem(
    array_buffer haystack, array_buffer needle,
    int64_t offset, bool is_forward
){
    if(is_forward){
        void *result = cyrnewic_memmem(
            haystack.data + offset, haystack.size - offset,
            needle.data, needle.size
        );
        if(result){
            return (int64_t)((uint8_t *)result - (haystack.data + offset));
        }
        return -1;
    }else{
        void *result = cyrnewic_memrmem(
            haystack.data + offset, haystack.size - offset,
            needle.data, needle.size
        );
        if(result){
            return (int64_t)((uint8_t *)result - (haystack.data + offset));
        }
        return -1;
    }
}