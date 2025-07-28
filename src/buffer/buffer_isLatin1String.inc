
#include "types.h"
#include <stdbool.h>

static inline bool buffer_isLatin1String(wstring wstr) {
    for(int i = 0; i < wstr.length; i++) {
        if(wstr.data[i] > 0xFF) {
            return false;
        }
    }
    return true;
}