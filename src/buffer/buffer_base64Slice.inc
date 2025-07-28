
#include <stdint.h>
#include "types.h"
#include <stdbool.h>
#include <errno.h>
#include <stdlib.h>

#include "libb64-1.2/src/cencode.c"

static inline string buffer_base64Slice(
    array_buffer buf, int64_t start, int64_t end, bool is_url
){
    int64_t input_length = end - start;
    int64_t output_size = (input_length / 3 + 1) * 4 + 1;

    char *output_buffer = (char *)malloc(output_size);
    if(output_buffer == NULL){
        errno = ENOMEM;
        string ret = {0, NULL};
        return ret;
    }

    base64_encodestate state;
    base64_init_encodestate(&state);

    int encoded_length = base64_encode_block(
        buf.data + start, end - start, 
        output_buffer, &state, is_url
    );

    if(!is_url){
        encoded_length += base64_encode_blockend(
            output_buffer + encoded_length, &state, is_url
        );
    }

    output_buffer[encoded_length] = '\0';

    string ret = { encoded_length, output_buffer };
    return ret;
}