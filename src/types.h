
#ifndef CYRNEWIC_TYPES_H
#define CYRNEWIC_TYPES_H

#include <stdint.h>

typedef struct { size_t length; uint8_t *data; } string;

typedef struct { size_t length; uint16_t *data; } wstring;

typedef struct { size_t size; uint8_t* data; void* ref; } array_buffer;

typedef struct { int count; int32_t* data; } int32_array;

typedef struct { int count; int64_t* data; } int64_array;

typedef struct { int count; double* data; } float64_array;

typedef struct { int count; string *data; } string_array;

#endif // CYRNEWIC_TYPES_H