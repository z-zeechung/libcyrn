
#include <stdint.h>
#include <stdbool.h>
#include <wchar.h>
#include "types.h"

static inline int64_t buffer_latin1Write(
    array_buffer buf, wstring str, 
    int64_t offset, int64_t length,
    bool is_ascii
){

    length = length > str.length ? str.length : length;

    if (is_ascii) {
        for (int64_t i = 0; i < length; i++) {
            if (str.data[i] <= 0x7F) {
                buf.data[offset + i] = (uint8_t)str.data[i];
            } else {
                buf.data[offset + i] = '?';
            }
        }
    } else {
        for (int64_t i = 0; i < length; i++) {
            buf.data[offset + i] = (uint8_t)(str.data[i] & 0xFF);
        }
    }

    return length;
}