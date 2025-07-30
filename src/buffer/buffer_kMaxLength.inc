#include <stdint.h>

static inline int64_t buffer_kMaxLength(void){
    return (SIZE_MAX > INT64_MAX) ? INT64_MAX : (int64_t)SIZE_MAX;
}