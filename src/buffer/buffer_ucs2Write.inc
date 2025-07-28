
#include <stdint.h>
#include "types.h"
#include <wchar.h>

#define buffer_ucs2Write_min(a, b) ((a) < (b) ? (a) : (b))

static inline int64_t buffer_ucs2Write(
    array_buffer buf, wstring wstr, 
    int64_t offset, int64_t length
){
    int64_t bytes_len = buffer_ucs2Write_min(length, wstr.length * 2);

    unsigned char* data = buf.data;

    for(int64_t i=0;i<bytes_len/2;i++){
        unsigned char high = (wstr.data[i] >> 8) & 0xFF;
        unsigned char low = wstr.data[i] & 0xFF;
        data[offset++] = high;
        data[offset++] = low;
    }
    if(bytes_len % 2 == 1){
        data[offset] = (wstr.data[bytes_len/2] >> 8) & 0xFF;
    }

    return bytes_len;
}