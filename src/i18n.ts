import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      "hero": {
        "title": "Je construis des expériences web",
        "subtitle": "Développeur Web augmenté orchestrant l'IA pour créer des interfaces haute fidélité.",
        "description": "Fusionnant la rigueur technique et la puissance générative pour bâtir des produits numériques immersifs.",
        "cta_primary": "Explorer le processus",
        "cta_secondary": "Voir mes travaux",
        "status": "Disponible pour collaboration",
        "expertise": "Design d'expérience & Orchestration IA",
        "origin": "Côte d'Ivoire",
        "sound_off": "SON : OFF",
        "sound_on": "SON : ON"
      }
    }
  },
  en: {
    translation: {
      "hero": {
        "title": "I build web experiences",
        "subtitle": "Augmented Web Developer orchestrating AI to create high-fidelity interfaces.",
        "description": "Merging technical rigor and generative power to build immersive digital products.",
        "cta_primary": "Explore the Process",
        "cta_secondary": "View Work",
        "status": "Available for collaboration",
        "expertise": "Experience Design & AI Orchestration",
        "origin": "Ivory Coast",
        "sound_off": "SOUND: OFF",
        "sound_on": "SOUND: ON"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;