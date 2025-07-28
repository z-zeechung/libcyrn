
#include <stdint.h>
#include "types.h"
#include <string.h>
#include <errno.h>

static int32_t compareOffset(
    array_buffer source, array_buffer target,
    int64_t targetStart, int64_t sourceStart,
    int64_t targetEnd, int64_t sourceEnd
) {
    if (sourceStart > sourceEnd || targetStart > targetEnd) {
        errno = EINVAL;
        return -1;
    }

    if (sourceStart < 0 || targetStart < 0) {
        errno = EINVAL;
        return -1;
    }

    if (sourceEnd > source.size || targetEnd > target.size) {
        errno = EINVAL;
        return -1;
    }

    size_t src_length = sourceEnd - sourceStart;
    size_t tar_length = targetEnd - targetStart;
    size_t cmp_length = src_length < tar_length ? src_length : tar_length;

    if (cmp_length > 0) {
        int result = memcmp(
            source.data + sourceStart,
            target.data + targetStart,
            cmp_length);
        
        if (result != 0) {
            return result;
        }
    }

    if (src_length < tar_length) return -1;
    if (src_length > tar_length) return 1;
    return 0;
}