# Contributing to Nebu

Thanks for taking the time to contribute to Nebu!

## Looking for help?

Join our Matrix room, [#nebu:zirco.dev](https://matrix.to/#/#nebu:zirco.dev)
([URI](matrix:r/nebu:zirco.dev))!

## Reporting issues

If you find any bugs, inconsistencies, or other problems, feel free to submit a GitHub
[issue](https://github.com/matrix-nebu/nebu/issues/new). If you have a question, it may be easier
to ask us in our Matrix room listed above.

## Submitting code

### Code style

Please try to follow the style of adjacent code, and use repository provided code formatters and
linting tools.

### Commit messages

Nebu uses [Scoped Commits](https://scopedcommits.com/), so your commit messages should roughly
follow the following format:

```
<scope>: <description>

[optional body]

[optional trailer(s)]
```

For example: `i2c: virtio: mark device ready before registering the adapter`

### DCO/Sign-Off

The DCO provides a lightweight alternative to a CLA which protects the project, contributors,
and downstream users from copyright disputes.

All commits must have the `Signed-off-by` trailer indicating you accept the DCO text below.

Git can do this for you with the `-s` flag on `git commit`.

```
Developer Certificate of Origin
Version 1.1

Copyright (C) 2004, 2006 The Linux Foundation and its contributors.

Everyone is permitted to copy and distribute verbatim copies of this
license document, but changing it is not allowed.


Developer's Certificate of Origin 1.1

By making a contribution to this project, I certify that:

(a) The contribution was created in whole or in part by me and I
    have the right to submit it under the open source license
    indicated in the file; or

(b) The contribution is based upon previous work that, to the best
    of my knowledge, is covered under an appropriate open source
    license and I have the right under that license to submit that
    work with modifications, whether created in whole or in part
    by me, under the same open source license (unless I am
    permitted to submit under a different license), as indicated
    in the file; or

(c) The contribution was provided directly to me by some other
    person who certified (a), (b) or (c) and I have not modified
    it.

(d) I understand and agree that this project and the contribution
    are public and that a record of the contribution (including all
    personal information I submit with it, including my sign-off) is
    maintained indefinitely and may be redistributed consistent with
    this project or the open source license(s) involved.
```
