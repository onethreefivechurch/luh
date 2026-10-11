# Library implementation

The approved library Brief defines a framework-free core, host-owned delivery, configuration and independent adoption. The implementation keeps the existing picker, window, capture and drawing units; public settings are applied at their boundaries.

- The controller checks host permissions, selects labels and emits typed lifecycle events.
- The window owns draft name validation and feature visibility. Submission and editing retain their opening generation so older asynchronous work cannot modify a later draft.
- The editor accepts cancellation from the owning window and releases its dialog and temporary URLs.
- Vite compiles the ESM entries and lazy screenshot dependency. TypeScript emits declarations from `src/` into `dist/`.
- Public API tests verify the documented contract. The standalone demo and packed-package installation verify adoption without an app checkout.

The root integration plan addresses app-wide concerns. This library has no app permissions, database, service routing or storage dependencies.
