import { A } from "@solidjs/router";

export default function Footer() {
  return (
    <footer class="border-t border-border py-12">
      <div class="max-w-5xl mx-auto px-6">
        <div class="flex flex-col sm:flex-row justify-between gap-8">
          <div>
            <p class="text-sm text-muted mb-3">
              Zafu &amp; Zigner by{" "}
              <a href="https://rotko.net" class="accent-link">
                Rotko Networks
              </a>
            </p>
            <p class="text-xs text-dim2">
              <a
                href="https://github.com/rotkonetworks/zafu"
                class="accent-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
              <span class="mx-2">•</span>
              <a
                href="https://github.com/rotkonetworks/zafu/blob/main/LICENSE"
                class="accent-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                MIT License
              </a>
            </p>
          </div>
          <div class="flex gap-12 text-xs">
            <div>
              <p class="text-text mb-2 font-semibold">zafu</p>
              <ul class="list-none space-y-1">
                <li><A href="/zafu" class="text-muted hover:text-text transition-colors">overview</A></li>
                <li><A href="/zafu/security" class="text-muted hover:text-text transition-colors">security</A></li>
                <li><A href="/zafu/specs" class="text-muted hover:text-text transition-colors">specs</A></li>
                <li><A href="/zafu/docs" class="text-muted hover:text-text transition-colors">docs</A></li>
                <li><A href="/zafu/roadmap" class="text-muted hover:text-text transition-colors">roadmap</A></li>
              </ul>
            </div>
            <div>
              <p class="text-text mb-2 font-semibold">zigner</p>
              <ul class="list-none space-y-1">
                <li><A href="/zigner" class="text-muted hover:text-text transition-colors">overview</A></li>
                <li><A href="/zigner/security" class="text-muted hover:text-text transition-colors">security</A></li>
                <li><A href="/zigner/specs" class="text-muted hover:text-text transition-colors">specs</A></li>
                <li><A href="/zigner/docs" class="text-muted hover:text-text transition-colors">docs</A></li>
                <li><A href="/zigner/roadmap" class="text-muted hover:text-text transition-colors">roadmap</A></li>
              </ul>
            </div>
          </div>
        </div>
        <p class="text-xs text-dim2 mt-8 break-all">
          Donate:
          u153khs43zxz6hcnlwnut77knyqmursnutmungxjxd7khruunhj77ea6tmpzxct9wzlgen66jxwc93ea053j22afkktu7hrs9rmsz003h3
        </p>
      </div>
    </footer>
  );
}
