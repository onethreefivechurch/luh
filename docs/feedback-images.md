# Feedback images

The feedback journey retains its existing window and image editor. The Uploads domain integration in the host uses the library's unchanged image payload and the optional delivery-progress hook. OTF-358.

## Journey

1. Open Send feedback on the standalone demo and write a note. The draft window shows Add images and the screenshot choice.
2. Select several PNG, JPEG or WebP images with Add images. Each image has a preview, filename, Draw on it and Remove control. The same queue accepts page-wide file drops and image paste; normal text paste stays in the text field.
3. Open Draw on it, select Crop, draw the crop and choose Done. The queue contains the resulting image. Cancel retains the original; a replacement beyond the configured size limit also retains the original and shows the restriction message.
4. Choose Screenshot this page. The screenshot leads the list and shares the image limit. Send delivers it once as `screenshot`; the other pictures arrive as `images`.
5. Choose Send. Hosts with upload-progress reporting show the measured percentage. Other hosts show indeterminate progress. Sending remains visible after 100% until acceptance.
6. Return a delivery refusal. The draft and accepted images remain available for retry. Accept the retry. The note closes and the queue releases its files.
7. Cancel an unsent draft. Keep editing retains the queue; Discard clears it.

## Verification

- Existing public API and drawing suites: 28 tests pass. The existing callback assertion accepts the added progress argument; no new tests are added.
- TypeScript source/demo checks, package build and standalone demo build pass.
- Impeccable detector reports no findings for the changed window and styles.
- Chromium runs the standalone demo with invented blue image fixtures. A multiple-file drop adds two rows; image paste adds a third repeated image. A host drop listener receives no event while feedback owns the file action.
- The real browser editor renders and closes. Programmatic pointer events crop a 320 by 240 image to 160 by 120; the submitted queue contains the smaller PNG. This verifies browser raster output, not a physical pointer or touch gesture.
- Actual page capture adds a screenshot, and the submission callback receives `page.png` once in `screenshot`, never in `images`.
- A controlled host callback verifies initial indeterminate progress, a reported 47%, and 100% while Sending remains open. A refused callback retains the text and all queued rows.
- A later visible ARIA modal blocks feedback's file handling; removing it restores the queue's drop handling and clears the drop overlay.
- Chromium state fixtures verify sending, capture, drawing and discard confirmation each cancel foreground file-drop navigation without adding files. A later ARIA modal and text-only paste remain untouched; ready foreground feedback resumes accepting files.
- Light-mode Chromium presentation is inspected at 1440 pixels and with a 390-pixel, DPR 3 mobile viewport. Window sizing uses the document viewport so an overflowing host page cannot push feedback controls offscreen. Mobile viewport emulation verifies layout, not a physical iPhone.

## Limits

The controlled callback supplies progress; real authenticated host delivery and actual host transport progress remain untested end to end in this library checkout. App integration, production, physical iPhone/touch input, operating-system file selection and screen-reader behavior are outside this verification. Review images remain outside Git.
