
#ifndef CYRNEWIC_TYPES_H
#define CYRNEWIC_TYPES_H

#include <stdint.h>
#include <wchar.h>

typedef struct { int64_t length; char *data; } string;

typedef struct { int64_t length; wchar_t *data; } wstring;

typedef struct { int64_t size; char* data; } array_buffer;

typedef struct { int count; int32_t* data; } int32_array;

typedef struct { int count; int64_t* data; } int64_array;

typedef struct { int count; double* data; } float64_array;

typedef struct { int count; string *data; } string_array;

#endif // CYRNEWIC_TYPES_H