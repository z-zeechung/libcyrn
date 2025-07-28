
#include <stdint.h>
#include "types.h"
#include <errno.h>
#include <stdlib.h>

static inline string buffer_hexSlice(
    array_buffer buf, int64_t start, int64_t end
){

    const static char map[] = "0123456789abcdef";

    char* hex_str = (char*)malloc(2 * (end - start) + 1);
    if (hex_str == NULL) {
        errno = ENOMEM;
        string ret = { 0, NULL };
        return ret;
    }

    for (int64_t i = start; i < end; i++) {
        hex_str[2 * (i - start)] = map[(buf.data[i] >> 4) & 0xf];
        hex_str[2 * (i - start) + 1] = map[buf.data[i] & 0xf];
    }

    hex_str[2 * (end - start)] = '\0';

    string ret = { 2 * (end - start), hex_str };
    return ret;
}