import { createSignal, onCleanup, onMount, Show } from "solid-js";

/**
 * Camera QR scanner for the key ceremony.
 *
 * Reads the QR a zigner shows on its Release key / signature screen, so a
 * holder can point a phone at the device instead of transcribing 64 hex
 * characters by hand - transcription being the step where a slot silently
 * becomes the wrong key.
 *
 * Uses the platform `BarcodeDetector`, which is native in Chromium (the
 * ceremony is run by a maintainer, not the public, so a single well-supported
 * path beats shipping a wasm decoder). Where it is missing - Firefox, older
 * Safari - the component says so and the paste field remains the way in; the
 * scanner is a convenience over a channel that already works, never the only
 * one.
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
  const [supported, setSupported] = createSignal(true);
  let stream: MediaStream | null = null;
  let raf = 0;
  let done = false;

  onMount(async () => {
    // @ts-expect-error - BarcodeDetector is not in the TS DOM lib yet.
    if (typeof window.BarcodeDetector === "undefined") {
      setSupported(false);
      return;
    }
    // @ts-expect-error - see above.
    const detector = new window.BarcodeDetector({ formats: ["qr_code"] });
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
    } catch (e) {
      setError(
        `camera unavailable: ${e instanceof Error ? e.message : String(e)}. Paste the code instead.`,
      );
      return;
    }
    if (!video) return;
    video.srcObject = stream;
    await video.play().catch(() => {});

    const tick = async () => {
      if (done || !video) return;
      try {
        const codes = await detector.detect(video);
        if (codes.length > 0 && codes[0].rawValue) {
          done = true;
          const value = codes[0].rawValue as string;
          stop();
          props.onScan(value);
          return;
        }
      } catch {
        // Detect throws on frames with no data - keep scanning.
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
  });

  function stop() {
    done = true;
    if (raf) cancelAnimationFrame(raf);
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
      <Show
        when={supported()}
        fallback={
          <p class="text-xs text-[var(--color-text-muted)]">
            This browser has no <code>BarcodeDetector</code> (try Chromium). Paste the{" "}
            <code>index:hex</code> code by hand instead.
          </p>
        }
      >
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
      </Show>
    </div>
  );
}
