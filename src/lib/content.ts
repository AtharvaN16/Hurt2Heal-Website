// Placeholder content, sourced from the client's planning doc (not final copy).
// Swapping to a real CMS later means rewriting the bodies of these functions
// to fetch from Sanity/Payload — callers (pages) don't change.

export type CTA = { label: string; href: string };

export type Promise = { label: string; text: string };

export type HomeContent = {
  headline: string;
  subheadline: string;
  ctas: CTA[];
  introHeadingPre: string;
  introHeadingEmphasis: string;
  introHeadingPost: string;
  introParagraphs: string[];
  promises: Promise[];
};

export function getHomeContent(): HomeContent {
  return {
    headline: "Your Hurt Used to Live Here. Your Healing Begins Now.",
    subheadline:
      "Welcome to a safe, peer-led digital sanctuary dedicated to trauma-informed education, support, and community healing for survivors of sexual assault and domestic violence.",
    ctas: [
      { label: "Join a Session", href: "/get-involved" },
      { label: "Learn About Our Mission", href: "/about" },
    ],
    introHeadingPre: "You are ",
    introHeadingEmphasis: "not alone",
    introHeadingPost: ". You are safe here.",
    introParagraphs: [
      "Welcome to Hurt 2 Heal. While trauma can deeply alter our lives, community education and peer-led support can completely transform our healing journey.",
      "Taking the first step takes immense courage. Because of that, we treat your trust as sacred. Our virtual workshops and community spaces are designed to be secure, supportive environments where you have complete control over your experience.",
    ],
    promises: [
      {
        label: "Absolute Privacy:",
        text: "We strictly prohibit session recordings to protect your peace of mind.",
      },
      {
        label: "Zero Pressure:",
        text: "There is no pressure to speak or turn on your camera. You are welcome to show up exactly as you are, even if that means just sitting back and listening.",
      },
      {
        label: "You belong here:",
        text: "whether your experience happened yesterday or decades ago.",
      },
    ],
  };
}

export type AboutContent = {
  welcomeTitle: string;
  welcomeBody: string[];
  signoff: string;
};

export function getAboutContent(): AboutContent {
  return {
    welcomeTitle: "Welcome to Hurt 2 Heal",
    welcomeBody: [
      "If you are visiting this space today, please take a deep breath and know one thing for certain: You are not alone, and you are entirely safe here.",
      "Hurt 2 Heal was founded on the belief that while trauma can deeply alter our lives, community education and peer-led support can completely transform our healing journey. We understand that taking the first step—or even clicking onto a website like this—takes immense courage. Because of that, we treat your trust as sacred.",
      "Our virtual workshops and community spaces are designed to be “digital containers”—secure, supportive environments where you have complete control over your experience.",
      "We strictly prohibit session recordings to protect your absolute privacy.",
      "There is no pressure to speak or turn on your camera. You are welcome to show up exactly as you are, even if that means just sitting back and listening.",
      "You belong here, whether your experience happened yesterday or decades ago.",
      "Whether you are here to attend our sessions, access educational resources, or learn how to support a loved one, we are honored to walk alongside you.",
    ],
    signoff: "With deep respect and hope,\nHurt 2 Heal",
  };
}

export type ProgramsContent = {
  intro: string;
  privacyNote: string;
};

export function getProgramsContent(): ProgramsContent {
  return {
    intro:
      "Our Healing Spaces: monthly workshops, digital containers, and peer-led sessions designed for survivors of sexual assault and domestic violence.",
    privacyNote:
      "We strictly prohibit session recordings to protect participant privacy — every session is a safe, confidential space.",
  };
}

export type ResourcesContent = {
  intro: string;
};

export function getResourcesContent(): ResourcesContent {
  return {
    intro:
      "Educational content, crisis hotlines, downloadable materials, and links to our published books and media — available whether or not you've registered for a live session.",
  };
}

export type GetInvolvedContent = {
  intro: string;
};

export function getGetInvolvedContent(): GetInvolvedContent {
  return {
    intro: "Join the movement — ways to support and build this community.",
  };
}

export type ContactContent = {
  intro: string;
};

export function getContactContent(): ContactContent {
  return {
    intro: "A straightforward, secure way to reach out.",
  };
}
