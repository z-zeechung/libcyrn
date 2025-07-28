
#include "types.h"
#include <stdbool.h>

#include "libb64-1.2/src/cdecode.c"

static inline bool buffer_isBase64String(string str) {
    for(int i = 0; i < str.length; i++) {
        if(base64_decode_value(
            str.data[i], base64_decode_decoding
        ) == -1){
            if(str.data[i] == '='){
                switch(str.length - i - 1){
                    case 0:  // '=' is the last character
                        if(i % 4 == 2 || i % 4 == 3) {
                            continue;  // valid padding position
                        }
                        return false;
                    case 1:  // '=' is the second last character
                        if(i % 4 == 3 && str.data[i+1] == '=') {
                            continue;  // valid double padding
                        }
                        return false;
                    default:
                        return false;  // '=' appears too early
                }
            }
            return false;
        }
    }
    return true;
}