/*
cencoder.c - c source to a base64 encoding algorithm implementation

This is part of the libb64 project, and has been placed in the public domain.
For details, see http://sourceforge.net/projects/libb64
*/

#ifndef CYRNEWIC_BASE64_CENCODE_C
#define CYRNEWIC_BASE64_CENCODE_C

#include <libb64-1.2/include/b64/cencode.h>

// const int CHARS_PER_LINE = 72;

static inline void base64_init_encodestate(base64_encodestate* state_in)
{
	state_in->step = step_A;
	state_in->result = 0;
	state_in->stepcount = 0;
}

static const char*    base64_encode_encoding = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
static const char* base64url_encode_encoding = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
static inline char base64_encode_value(char value_in, char* encoding)
{
	if (value_in > 63) return '=';
	return encoding[(int)value_in];
}

static inline int base64_encode_block(const char* plaintext_in, int length_in, char* code_out, base64_encodestate* state_in, int is_url)
{
	const char* plainchar = plaintext_in;
	const char* const plaintextend = plaintext_in + length_in;
	char* codechar = code_out;
	char result;
	char fragment;

	char* encoding = is_url ? base64url_encode_encoding : base64_encode_encoding;
	
	result = state_in->result;
	
	switch (state_in->step)
	{
		while (1)
		{
	case step_A:
			if (plainchar == plaintextend)
			{
				state_in->result = result;
				state_in->step = step_A;
				return codechar - code_out;
			}
			fragment = *plainchar++;
			result = (fragment & 0x0fc) >> 2;
			*codechar++ = base64_encode_value(result, encoding);
			result = (fragment & 0x003) << 4;
	case step_B:
			if (plainchar == plaintextend)
			{
				state_in->result = result;
				state_in->step = step_B;
				return codechar - code_out;
			}
			fragment = *plainchar++;
			result |= (fragment & 0x0f0) >> 4;
			*codechar++ = base64_encode_value(result, encoding);
			result = (fragment & 0x00f) << 2;
	case step_C:
			if (plainchar == plaintextend)
			{
				state_in->result = result;
				state_in->step = step_C;
				return codechar - code_out;
			}
			fragment = *plainchar++;
			result |= (fragment & 0x0c0) >> 6;
			*codechar++ = base64_encode_value(result, encoding);
			result  = (fragment & 0x03f) >> 0;
			*codechar++ = base64_encode_value(result, encoding);
			
			++(state_in->stepcount);
			// if (state_in->stepcount == CHARS_PER_LINE/4)
			// {
			// 	*codechar++ = '\n';
			// 	state_in->stepcount = 0;
			// }
		}
	}
	/* control should not reach here */
	return codechar - code_out;
}

static inline int base64_encode_blockend(char* code_out, base64_encodestate* state_in, int is_url)
{

	if(is_url){	// this makes no sense. just don't invoke this func when it's b64url
		return 0;
	}

	char* codechar = code_out;
	
	switch (state_in->step)
	{
	case step_B:
		*codechar++ = base64_encode_value(state_in->result, base64_encode_encoding);
		*codechar++ = '=';
		*codechar++ = '=';
		break;
	case step_C:
		*codechar++ = base64_encode_value(state_in->result, base64_encode_encoding);
		*codechar++ = '=';
		break;
	case step_A:
		break;
	}
	*codechar++ = '\n';
	
	return codechar - code_out;
}

#endif // CYRNEWIC_BASE64_CENCODE_C