
#include "types.h"
#include "libb64-1.2/src/cdecode.c"
#include <stdbool.h>
#include <wchar.h>
#include <errno.h>

static inline wstring buffer_atob(const string encoded, array_buffer errnum){

    wstring ret_on_err = { 0, NULL };

    if(encoded.length % 4 != 0){
        errnum.data[0] = -1;
        return ret_on_err;
    }

    for(int i=0;i<encoded.length;i++){
        if( base64_decode_decoding[encoded.data[i]] == -1 & 
            base64_decode_decoding[encoded.data[i]] != '=' ){
            errnum.data[0] = -2;
            return ret_on_err;
        }
    }

    int encoded_length = encoded.length;
    char* decoded_data = (char*)malloc(encoded_length);
    if(decoded_data == NULL){
        errno = ENOMEM;
        return ret_on_err;
    }

    base64_decodestate state;
    base64_init_decodestate(&state);

    int decoded_length = base64_decode_block(
        encoded.data,
        encoded_length,
        decoded_data,
        &state,
        false
    );

    wchar_t* decoded_wstring = (wchar_t*)malloc((decoded_length+1) * sizeof(wchar_t));
    if(decoded_wstring == NULL){
        free(decoded_data);
        errno = ENOMEM;
        return ret_on_err;
    }

    for(int i = 0; i < decoded_length; i++){
        decoded_wstring[i] = (wchar_t)((unsigned char)decoded_data[i]); // ensure plain char data is interpreted as positive code points
    }
    decoded_wstring[decoded_length] = 0;

    free(decoded_data);

    wstring ret = { decoded_length, decoded_wstring };

    return ret;
}