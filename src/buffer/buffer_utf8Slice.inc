
#include <stdint.h>
#include "types.h"
#include <string.h>
#include <errno.h>
#include <stdlib.h>

static inline string buffer_utf8Slice(
    array_buffer buf, int64_t start, int64_t end
){
    unsigned char *s = (unsigned char *)malloc(end - start + 1);

    if (s == NULL){
        errno = ENOMEM;
        string ret = { 0, NULL };
        return ret;
    }

    memcpy(
        s,
        (unsigned char *)buf.data + start,
        end - start
    );

    s[end - start] = '\0';

    string ret = { end - start, s };

    return ret;
}