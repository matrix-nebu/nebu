# Nebu SDK Roadmap

Nebu is a Matrix SDK for TypeScript that aims to provide a highly structured, event-driven wrapper
around the Matrix Client-Server API. The project's primary focus is for writing bots that will run
under Node.js, but this does not mean sacrificing the ability to write browser clients either.

The end goal of the project is to create a fully featured piece-based bot framework with DX similar
to [Sapphire](https://sapphirejs.dev/).

## SDK layer

Primary package: `@matrix-nebu/sdk`

### Phase 1: MVP

The objective of this phase is to establish solid foundations to build off of, including the basic
REST client, sync loop, and event sending.

- [x] Configure further infra for contributors: CI, ESLint, precommit hooks, whatever is needed.
- [ ] Determine how endpoint-level tests will be written (js-sdk uses a set of request/response
      pairs which must match, that feels messy)
- [ ] Get rid of the mess LogN started working on
- [ ] Support policy for unstable features/MSCs
- [ ] REST client with error handling, and a clean way to define endpoints
- [ ] Initial batch of key endpoints: `/versions`, `/capabilities`, `/account/whoami`, v3 `/sync`,
      `/rooms/.../send`, `/rooms/.../state` and `/rooms/.../redact`.
- [ ] Initial `Client` event emitter, and abstractions around it for receiving and sending events
- [ ] Basic legacy UIAA auth (password login)

### Phase 2: Core

The objective of this phase is to gain stateful awareness of the room and be usable in more advanced
situations.

- [ ] Legacy UIAA login, and OAuth 2.0 device authorisation grants
- [ ] TypeScript definitions of standard room events
- [ ] Timeline and state persistence from sync
- [ ] Pagination endpoints
- [ ] Ephemeral events (read receipts, typing, preence)
- [ ] Major [Required](https://spec.matrix.org/v1.19/client-server-api/#summary) modules.

### Phase 3: E2EE

This likely requires binding against the Vodozemac WASM bundle.

### Phase 4: Compliance

Further work to gain full compliance with the C2S spec.
