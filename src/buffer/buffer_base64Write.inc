
#include <stdint.h>
#include <stdbool.h>
#include "types.h"
#include <errno.h>

#include "libb64-1.2/src/cdecode.c"

#define buffer_base64Write_min(a, b) ((a) < (b) ? (a) : (b))

static inline int64_t buffer_base64Write(
    array_buffer buf, string b64_str, 
    int64_t offset, int64_t length,
    bool is_url
){

    int b64_len = b64_str.length;
    int pad_count = 0;
    while (b64_len > 0 && b64_str.data[b64_len - 1] == '=') {
        b64_len--;
        pad_count++;
        if (pad_count > 2) {
            errno = EINVAL;
            return -1;
        }
    }

    int64_t max_b64_len = (length * 3 + 3) / 4;
    max_b64_len = buffer_base64Write_min(max_b64_len, b64_len);

    char* decoding = base64_decode_decoding;
    if(is_url){
		init_base64url_decode_decoding();
		decoding = base64url_decode_decoding;
    }
    for(int64_t i = 0; i < max_b64_len; i++){
        if(base64_decode_value(
            b64_str.data[i], decoding
        ) == -1){
            errno = EINVAL;
            return -1;
        }
    }

    base64_decodestate state;
    base64_init_decodestate(&state);

    int decoded_length = base64_decode_block(
        b64_str.data,
        max_b64_len,
        buf.data + offset,
        &state,
        is_url
    );

    return decoded_length;
}