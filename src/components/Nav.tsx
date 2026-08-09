export default function Nav() {
  return (
    <nav class="border-b border-border">
      <div class="section-container flex items-center justify-between py-4">
        <a href="/" class="font-mono text-lg font-semibold text-text-em hover:text-accent">
          zafu<span class="text-accent">.</span>
        </a>
        <ul class="flex gap-6 list-none">
          <li><a href="#features" class="text-sm text-dim hover:text-text transition">Features</a></li>
          <li><a href="#cold-signing" class="text-sm text-dim hover:text-text transition">Cold Signing</a></li>
          <li><a href="https://github.com/rotkonetworks/zafu" class="text-sm text-dim hover:text-text transition">GitHub</a></li>
          <li><a href="https://docs.zafu.pro" class="text-sm text-dim hover:text-text transition">Docs</a></li>
        </ul>
      </div>
    </nav>
  );
}
