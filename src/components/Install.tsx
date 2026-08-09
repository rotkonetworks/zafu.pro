export default function Install() {
  return (
    <section class="section-container border-b border-border py-20">
      <h2 class="text-3xl font-bold text-text-em mb-12">Get Zafu</h2>

      <div class="flex flex-wrap gap-6 justify-center md:justify-start">
        {/* Chrome Web Store */}
        <a href="https://chromewebstore.google.com/detail/zafu" class="inline-block hover:opacity-90 transition">
          <img
            src="https://img.shields.io/badge/Chrome_Web_Store-informational?style=for-the-badge&logo=google-chrome&color=4285F4&logoColor=white"
            alt="Get on Chrome Web Store"
            class="h-14"
          />
        </a>

        {/* Google Play - Coming Soon */}
        <div class="inline-block opacity-40 blur-sm cursor-not-allowed">
          <img
            src="https://play.google.com/intl/en_us/badges/images/generic/en-play-badge.png"
            alt="Get on Google Play (Coming Soon)"
            class="h-14"
          />
        </div>

        {/* F-Droid - Coming Soon */}
        <div class="inline-block opacity-40 blur-sm cursor-not-allowed">
          <img
            src="https://fdroid.gitlab.io/artwork/badge/get-it-on.png"
            alt="Get on F-Droid (Coming Soon)"
            class="h-14"
          />
        </div>

        {/* Accrescent - Coming Soon */}
        <div class="inline-block opacity-40 blur-sm cursor-not-allowed">
          <img
            src="https://accrescent.app/badges/get-it-on.png"
            alt="Get on Accrescent (Coming Soon)"
            class="h-14"
          />
        </div>

        {/* GitHub */}
        <a href="https://github.com/rotkonetworks/zafu/releases" class="inline-block hover:opacity-90 transition">
          <img
            src="https://img.shields.io/badge/GitHub_Releases-informational?style=for-the-badge&logo=github&color=181717&logoColor=white"
            alt="Get on GitHub"
            class="h-14"
          />
        </a>
      </div>

      <div class="card mt-12">
        <h3 class="font-semibold text-text-em mb-2">Build from Source</h3>
        <p class="text-sm text-dim mb-4">Clone and build locally for development or verify signatures on GitHub releases.</p>
        <code class="text-sm text-accent block bg-surface2 p-3 rounded">
          git clone https://github.com/rotkonetworks/zafu
        </code>
      </div>
    </section>
  );
}
