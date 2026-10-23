/**
 * EduKids — Custom Vector SVG Mascot Engine
 * Crisp, scalable, device-independent vector characters for kids.
 * Mascots: Cosmo (Robot), Zippy (Fox), Newton (Owl), AstroCat (Cat)
 */

(function () {
  'use strict';

  const MASCOT_SVGS = {
    cosmo: (size = 80) => `
      <svg class="edu-mascot-svg mascot-cosmo" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cosmo Robot">
        <defs>
          <linearGradient id="cosmoBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#E0F2FE"/>
            <stop offset="60%" stop-color="#BAE6FD"/>
            <stop offset="100%" stop-color="#38BDF8"/>
          </linearGradient>
          <linearGradient id="cosmoVisor" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0F172A"/>
            <stop offset="100%" stop-color="#1E293B"/>
          </linearGradient>
        </defs>
        <!-- Antenna -->
        <line x1="50" y1="20" x2="50" y2="8" stroke="#0284C7" stroke-width="4" stroke-linecap="round"/>
        <circle cx="50" cy="7" r="6" fill="#FBBF24" stroke="#D97706" stroke-width="1.5"/>
        <circle cx="50" cy="7" r="2.5" fill="#FFFFFF"/>
        <!-- Head / Helmet -->
        <rect x="16" y="18" width="68" height="62" rx="28" fill="url(#cosmoBodyGrad)" stroke="#0284C7" stroke-width="3"/>
        <!-- Ears -->
        <rect x="8" y="38" width="9" height="22" rx="4" fill="#38BDF8" stroke="#0284C7" stroke-width="2"/>
        <rect x="83" y="38" width="9" height="22" rx="4" fill="#38BDF8" stroke="#0284C7" stroke-width="2"/>
        <!-- Dark Visor Face -->
        <rect x="24" y="27" width="52" height="40" rx="18" fill="url(#cosmoVisor)" stroke="#0369A1" stroke-width="2"/>
        <!-- Reflection -->
        <path d="M 28 34 Q 50 29 72 34" stroke="rgba(255,255,255,0.4)" stroke-width="2" stroke-linecap="round"/>
        <!-- Glowing Anime Eyes -->
        <ellipse cx="38" cy="46" rx="6" ry="7" fill="#38BDF8"/>
        <circle cx="36" cy="43" r="2.5" fill="#FFFFFF"/>
        <ellipse cx="62" cy="46" rx="6" ry="7" fill="#38BDF8"/>
        <circle cx="60" cy="43" r="2.5" fill="#FFFFFF"/>
        <!-- Cheeks -->
        <ellipse cx="32" cy="55" rx="3" ry="1.5" fill="#FF8FA3" opacity="0.8"/>
        <ellipse cx="68" cy="55" rx="3" ry="1.5" fill="#FF8FA3" opacity="0.8"/>
        <!-- Robot Smile -->
        <path d="M 44 54 Q 50 59 56 54" stroke="#38BDF8" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <!-- Bowtie -->
        <path d="M 42 80 L 50 85 L 58 80 Z" fill="#F59E0B" stroke="#D97706" stroke-width="1.2"/>
      </svg>
    `,

    zippy: (size = 80) => `
      <svg class="edu-mascot-svg mascot-zippy" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Zippy the Fox">
        <defs>
          <linearGradient id="foxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#FF7A45"/>
            <stop offset="100%" stop-color="#FA541C"/>
          </linearGradient>
        </defs>
        <!-- Fox Ears -->
        <path d="M 20 40 L 28 14 L 44 32 Z" fill="#FA541C" stroke="#D4380D" stroke-width="2"/>
        <path d="M 25 36 L 30 20 L 40 32 Z" fill="#FFE7BA"/>
        <path d="M 80 40 L 72 14 L 56 32 Z" fill="#FA541C" stroke="#D4380D" stroke-width="2"/>
        <path d="M 75 36 L 70 20 L 60 32 Z" fill="#FFE7BA"/>
        <!-- Fox Head -->
        <circle cx="50" cy="52" r="34" fill="url(#foxGrad)" stroke="#D4380D" stroke-width="2.5"/>
        <!-- White Cheeks -->
        <path d="M 18 56 Q 30 76 50 78 Q 70 76 82 56 Q 68 64 50 64 Q 32 64 18 56 Z" fill="#FFFFFF"/>
        <!-- Fox Eyes -->
        <circle cx="36" cy="48" r="5" fill="#1F1F1F"/>
        <circle cx="34.5" cy="46" r="2" fill="#FFFFFF"/>
        <circle cx="64" cy="48" r="5" fill="#1F1F1F"/>
        <circle cx="62.5" cy="46" r="2" fill="#FFFFFF"/>
        <!-- Nose -->
        <ellipse cx="50" cy="62" rx="4.5" ry="3.5" fill="#262626"/>
        <circle cx="49" cy="61" r="1.2" fill="#FFFFFF"/>
        <!-- Smile -->
        <path d="M 45 68 Q 50 72 55 68" stroke="#262626" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- Cheerful Star on Forehead -->
        <polygon points="50,30 52,35 57,35 53,38 55,43 50,40 45,43 47,38 43,35 48,35" fill="#FFD666"/>
      </svg>
    `,

    newton: (size = 80) => `
      <svg class="edu-mascot-svg mascot-newton" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Newton the Owl">
        <defs>
          <linearGradient id="owlBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#8B5CF6"/>
            <stop offset="100%" stop-color="#6D28D9"/>
          </linearGradient>
        </defs>
        <!-- Owl Body / Head -->
        <ellipse cx="50" cy="54" rx="34" ry="36" fill="url(#owlBody)" stroke="#5B21B6" stroke-width="2.5"/>
        <!-- Ear Tufts -->
        <polygon points="26,28 32,16 40,28" fill="#6D28D9" stroke="#5B21B6" stroke-width="2"/>
        <polygon points="74,28 68,16 60,28" fill="#6D28D9" stroke="#5B21B6" stroke-width="2"/>
        <!-- White Belly -->
        <ellipse cx="50" cy="64" rx="20" ry="20" fill="#EDE9FE"/>
        <path d="M 44 60 Q 50 63 56 60 M 42 66 Q 50 69 58 66" stroke="#8B5CF6" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- Big Round Glasses -->
        <circle cx="37" cy="46" r="14" fill="#FFFFFF" stroke="#F59E0B" stroke-width="3.5"/>
        <circle cx="63" cy="46" r="14" fill="#FFFFFF" stroke="#F59E0B" stroke-width="3.5"/>
        <line x1="51" y1="46" x2="49" y2="46" stroke="#F59E0B" stroke-width="4"/>
        <!-- Owl Eyes -->
        <circle cx="37" cy="46" r="7" fill="#0F172A"/>
        <circle cx="35" cy="44" r="2.8" fill="#FFFFFF"/>
        <circle cx="63" cy="46" r="7" fill="#0F172A"/>
        <circle cx="61" cy="44" r="2.8" fill="#FFFFFF"/>
        <!-- Cute Orange Beak -->
        <polygon points="50,52 46,60 54,60" fill="#F97316"/>
        <!-- Graduation Cap (Academic Professor) -->
        <polygon points="50,14 74,24 50,30 26,24" fill="#1E293B"/>
        <rect x="42" y="26" width="16" height="5" rx="2" fill="#0F172A"/>
        <line x1="68" y1="24" x2="72" y2="34" stroke="#F59E0B" stroke-width="2"/>
        <circle cx="72" cy="35" r="2" fill="#F59E0B"/>
      </svg>
    `,

    astro_cat: (size = 80) => `
      <svg class="edu-mascot-svg mascot-astro-cat" width="${size}" height="${size}" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Astro Cat">
        <defs>
          <linearGradient id="catHelmet" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#EFF6FF" stop-opacity="0.85"/>
            <stop offset="100%" stop-color="#BFDBFE" stop-opacity="0.7"/>
          </linearGradient>
        </defs>
        <!-- Astronaut Glass Helmet Dome -->
        <circle cx="50" cy="50" r="42" fill="url(#catHelmet)" stroke="#3B82F6" stroke-width="3"/>
        <path d="M 24 35 Q 50 20 76 35" stroke="rgba(255,255,255,0.7)" stroke-width="3" stroke-linecap="round" fill="none"/>
        <!-- Cat Ears -->
        <polygon points="28,34 32,18 44,28" fill="#F472B6" stroke="#DB2777" stroke-width="2"/>
        <polygon points="72,34 68,18 56,28" fill="#F472B6" stroke="#DB2777" stroke-width="2"/>
        <polygon points="32,30 34,22 41,27" fill="#FCE7F3"/>
        <polygon points="68,30 66,22 59,27" fill="#FCE7F3"/>
        <!-- Cat Face -->
        <ellipse cx="50" cy="54" rx="26" ry="24" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5"/>
        <!-- Cat Eyes -->
        <ellipse cx="40" cy="50" rx="5" ry="6" fill="#10B981"/>
        <circle cx="39" cy="48" r="2" fill="#FFFFFF"/>
        <ellipse cx="60" cy="50" rx="5" ry="6" fill="#10B981"/>
        <circle cx="59" cy="48" r="2" fill="#FFFFFF"/>
        <!-- Pink Nose -->
        <polygon points="50,57 47,54 53,54" fill="#F472B6"/>
        <!-- Mouth -->
        <path d="M 46 60 Q 50 63 54 60" stroke="#64748B" stroke-width="1.8" stroke-linecap="round" fill="none"/>
        <!-- Whiskers -->
        <line x1="32" y1="56" x2="22" y2="54" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="32" y1="60" x2="23" y2="62" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="68" y1="56" x2="78" y2="54" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
        <line x1="68" y1="60" x2="77" y2="62" stroke="#94A3B8" stroke-width="1.5" stroke-linecap="round"/>
        <!-- Collar -->
        <rect x="36" y="74" width="28" height="6" rx="3" fill="#3B82F6"/>
        <circle cx="50" cy="80" r="3.5" fill="#F59E0B"/>
      </svg>
    `
  };

  window.EduMascots = {
    getSvg: function (name = 'cosmo', size = 80) {
      const fn = MASCOT_SVGS[name.toLowerCase()] || MASCOT_SVGS.cosmo;
      return fn(size);
    },
    inject: function (elementId, name = 'cosmo', size = 80) {
      const el = document.getElementById(elementId);
      if (el) {
        el.innerHTML = this.getSvg(name, size);
      }
    }
  };
})();
