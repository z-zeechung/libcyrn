
#include <stdint.h>
#include "types.h"
#include <errno.h>

static inline char buffer_hexWrite_decode(char c){
    if( c >= '0' && c <= '9' ){
        return c - '0';
    }else if( c >= 'a' && c <= 'f' ){
        return c - 'a' + 10;
    }else if( c >= 'A' && c <= 'F' ){
        return c - 'A' + 10;
    }else{
        return -1;
    }
}

#define buffer_hexWrite_min(a, b) ((a) < (b) ? (a) : (b))

static inline int64_t buffer_hexWrite(
    array_buffer buf, string hex_str, 
    int64_t offset, int64_t length
){

    length = buffer_hexWrite_min(length * 2, hex_str.length);
    length = length / 2;

    for(int64_t i = 0; i < length; i++){
        char c1 = buffer_hexWrite_decode(hex_str.data[offset + i * 2]);
        char c2 = buffer_hexWrite_decode(hex_str.data[offset + i * 2 + 1]);
        if( c1 == -1 || c2 == -1 ){
            errno = EINVAL;
            return -1;
        }
        buf.data[offset + i] = (c1 << 4) | c2;
    }

    return length;
}