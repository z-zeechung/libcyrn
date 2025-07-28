isutf8 is a program and a c library to check if a given file (or stdin) contains only
valid utf-8 sequences.

# Compiling

    $ make

# Demo

    $ isutf8 * -v
    isutf8: line 1, char 97, byte 96: Expecting bytes in the following ranges: 00..7F C2..F4.
    40 00 40 00 00 00 00 00 C0 01 00 00 00 00 00 00  | @.@.............
                            ^^                       |         ^

    is_utf8.o: line 1, char 66, byte 65: Expecting bytes in the following ranges: 00..7F C2..F4.
    00 40 00 0E 00 0B 00 48 85 F6 48 C7 02 00 00 00  | .@.....H..H.....
                            ^^                       |         ^

    libisutf8.so: line 1, char 153, byte 152: After a first byte of F0, expecting 2nd byte between 90 and BF.
    68 12 20 00 00 00 00 00 F0 01 00 00 00 00 00 00  | h. .............
                            ^^^^^                    |         ^^

    main.o: line 1, char 76, byte 75: Expecting bytes in the following ranges: 00..7F C2..F4.
    56 41 55 41 54 55 53 48 83 EC 18 48 8B 5C 24 58  | VAUATUSH...H.\$X
                            ^^                       |         ^

# Test a file

`isutf8` returns 0 if the file is correctly encoded:

    $ isutf8 main.c
    $ echo $?
    0

Some files here only contain ASCII or correctly encoded UTF8:

    $ isutf8 README.md
    $ isutf8 test.sh

But an ELF is clearly not UTF8, a verbose error is printed:

    $ isutf8 isutf8
    isutf8: line 1, char 97, byte 96: Expecting bytes in the following ranges: 00..7F C2..F4.

`-v` adds some context:

    $ isutf8 -v isutf8
    isutf8: line 1, char 97, byte 96: Expecting bytes in the following ranges: 00..7F C2..F4.
    40 00 40 00 00 00 00 00 C0 01 00 00 00 00 00 00  | @.@.............
                            ^^                       |         ^

# Test stdin

`isutf8` reads on stdin if no file are given, also note that `bash`
helps a lot with the `$''` syntax allowing you to write and test hexadecimal:

    $ echo $'\xe9' | isutf8
    (standard input): line 1, char 0, byte 0: After a first byte between E1 and EC, expecting two following bytes.

    $ echo "Hellö world" | iconv -f utf8 -t latin1 | isutf8
    (standard input): line 1, char 4, byte 4: Expecting bytes in the following ranges: 00..7F C2..F4.

# Find UTF8 or non-UTF8 files

As `isutf8` can take multiple arguments it's easy classify
UTF8-compatible versus non UTF8-compatible files:

List non-UTF8 compatible files:

    $ isutf8 --list *
    isutf8
    is_utf8.o
    libisutf8.so
    main.o

List UTF8-compatible files:

    $ isutf8 --list --invert *
    COPYRIGHT
    is_utf8.c
    is_utf8.h
    main.c
    Makefile
    README.md
    test.sh
