
#include "types.h"
#include "libb64-1.2/src/cencode.c"
#include <stdlib.h>
#include <stdbool.h>

static inline string buffer_btoa(const wstring binary, array_buffer errnum){

    string ret_on_err = { 0, NULL };

    int input_length = binary.length;

    char *input_buffer = (char *)malloc(input_length+1);
    if(input_buffer == NULL){
        errno = ENOMEM;
        return ret_on_err;
    }

    for(int i=0;i<input_length;i++){
        if(binary.data[i] > 255){
            free(input_buffer);
            errnum.data[0] = -1;
            return ret_on_err;
        }
        // be cautious with type casting
        input_buffer[i] = (char)(unsigned char)binary.data[i];
    }

    input_buffer[input_length] = '\0';

    int output_size = (input_length / 3 + 1) * 4 + 10;
    char *output_buffer = (char *)malloc(output_size);
    if(output_buffer == NULL){
        errno = ENOMEM;
        return ret_on_err;
    }

    base64_encodestate state;
    base64_init_encodestate(&state);

    int encoded_length = base64_encode_block(input_buffer, input_length, output_buffer, &state, false);

    free(input_buffer);

    encoded_length += base64_encode_blockend(output_buffer + encoded_length, &state, false);

    output_buffer[encoded_length] = '\0';

    string ret = { encoded_length, output_buffer };

    return ret;
}