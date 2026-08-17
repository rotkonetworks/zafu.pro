import { createSignal, onCleanup, onMount, Show } from "solid-js";

/**
 * Camera QR scanner for the key ceremony.
 *
 * Reads the QR a zigner shows on its Release key / signature screen, so a
 * holder can point a phone at the device instead of transcribing 64 hex
 * characters by hand - transcription being the step where a slot silently
 * becomes the wrong key.
 *
 * Uses the platform `BarcodeDetector` where present (native in Chromium) as a
 * fast path. Where it is missing - desktop Chromium/Linux, Firefox, older
 * Safari - it falls back to a pure-JS decoder (`jsqr`) that reads the camera
 * frames off an offscreen canvas, so the scanner works anywhere the camera
 * does. The paste field above remains the way in when the camera itself is
 * unavailable; the scanner is a convenience over a channel that already works.
 *
 * Nothing scanned is trusted: the value flows into the same `parseReleaseKey` /
 * `parseSignature` the pasted text does, and the device is still the authority
 * on what it signed. A malicious QR can at worst fill a field with something
 * the parser rejects or the independence check catches.
 */
export default function QrScanner(props: {
  onScan: (text: string) => void;
  onClose: () => void;
  label?: string;
}) {
  let video: HTMLVideoElement | undefined;
  const [error, setError] = createSignal("");
  let stream: MediaStream | null = null;
  let raf = 0;
  let timer = 0;
  let done = false;

  onMount(async () => {
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
    } catch (e) {
      setError(
        `camera unavailable: ${e instanceof Error ? e.message : String(e)}. Paste the code by hand instead.`,
      );
      return;
    }
    if (!video) return;
    video.srcObject = stream;
    await video.play().catch(() => {});

    // Fast path: native BarcodeDetector (Chromium). Falls through to jsQR if it
    // is missing or the constructor throws.
    let detector: { detect: (src: CanvasImageSource) => Promise<{ rawValue?: string }[]> } | null =
      null;
    try {
      // @ts-expect-error - BarcodeDetector is not in the TS DOM lib yet.
      if (typeof window.BarcodeDetector !== "undefined") {
        // @ts-expect-error - see above.
        detector = new window.BarcodeDetector({ formats: ["qr_code"] });
      }
    } catch {
      detector = null;
    }

    const hit = (value: string) => {
      done = true;
      stop();
      props.onScan(value);
    };

    if (detector) {
      const tick = async () => {
        if (done || !video) return;
        try {
          const codes = await detector.detect(video);
          if (codes.length > 0 && codes[0].rawValue) {
            hit(codes[0].rawValue);
            return;
          }
        } catch {
          // Detect throws on frames with no data - keep scanning.
        }
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return;
    }

    // Fallback path: decode camera frames with jsQR. Loaded lazily so the
    // Chromium fast path never pays for the decoder.
    const { default: jsQR } = await import("jsqr");
    if (done) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      setError("canvas unavailable - paste the code by hand instead.");
      return;
    }

    const scan = () => {
      if (done || !video) return;
      if (video.readyState >= 2 && video.videoWidth > 0) {
        const w = video.videoWidth;
        const h = video.videoHeight;
        canvas.width = w;
        canvas.height = h;
        ctx.drawImage(video, 0, 0, w, h);
        const image = ctx.getImageData(0, 0, w, h);
        const code = jsQR(image.data, w, h, { inversionAttempts: "dontInvert" });
        if (code && code.data) {
          hit(code.data);
          return;
        }
      }
      // jsQR full-res decode is heavy; throttle rather than run every frame.
      timer = window.setTimeout(scan, 200);
    };
    scan();
  });

  function stop() {
    done = true;
    if (raf) cancelAnimationFrame(raf);
    if (timer) clearTimeout(timer);
    raf = 0;
    timer = 0;
    if (stream) {
      for (const t of stream.getTracks()) t.stop();
      stream = null;
    }
  }

  onCleanup(stop);

  return (
    <div class="flex flex-col gap-3 border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm font-semibold">{props.label ?? "Scan QR"}</span>
        <button
          class="border border-[var(--color-border)] px-3 py-1 text-xs"
          onClick={() => {
            stop();
            props.onClose();
          }}
        >
          Close
        </button>
      </div>
      <Show when={!error()} fallback={<p class="text-xs text-red-500">{error()}</p>}>
        <video
          ref={video}
          class="w-full max-w-xs border border-[var(--color-border)]"
          playsinline
          muted
        />
        <p class="text-xs text-[var(--color-text-muted)]">
          Point at the device's QR. Fills the field automatically; still verify the
          hex against the device screen.
        </p>
      </Show>
    </div>
  );
}
