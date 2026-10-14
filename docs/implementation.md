# Library implementation

The approved library Brief defines a framework-free core, host-owned delivery, configuration and independent adoption. The implementation keeps the existing picker, window, capture and drawing units; public settings are applied at their boundaries.

- The controller checks host permissions, selects labels and emits typed lifecycle events.
- The window owns draft name validation and feature visibility. Submission and editing retain their opening generation so older asynchronous work cannot modify a later draft.
- The editor accepts cancellation from the owning window and releases its dialog and temporary URLs.
- Vite compiles the ESM entries and lazy screenshot dependency. TypeScript emits declarations from `src/` into `dist/`.
- Public API tests verify the documented contract. The standalone demo and packed-package installation verify adoption without an app checkout.

The root integration plan addresses app-wide concerns. This library has no app permissions, database, service routing or storage dependencies.

## Feedback images

Uppy Core owns accepted files and enforces count, image type and per-image size restrictions. Its file metadata carries the preview URL, screenshot role and annotation state; the window derives image rows from the queue. Each addition has its own queue identity, preserving repeated selections. Capture screenshots and uploaded images share the same limits.

Annotation and capture re-marking validate replacement bytes against the queue before replacing the file state. Refused replacements retain the original. Removal, discard and disconnect release preview URLs; rebuilding or disconnecting destroys the old queue. Configuration changes retain an open draft and take effect when the window rebuilds after close.

The optional second delivery-hook argument reports actual host transport percentages. Uppy records the aggregate percentage while the window renders a native progress element. The library installs no uploader and performs no background delivery. The receiving host remains responsible for permissions and binary transport.

File paste/drop listeners run only while feedback owns the task. Opening feedback above an existing modal retains feedback ownership; a later visible native or ARIA modal suspends it. Closing that modal restores it. Text-only paste remains untouched. The host's own upload routing also excludes feedback surfaces.
