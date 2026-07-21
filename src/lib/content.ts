// Placeholder content, sourced from the client's planning doc (not final copy).
// Swapping to a real CMS later means rewriting the bodies of these functions
// to fetch from Sanity/Payload — callers (pages) don't change.

export type CTA = { label: string; href: string };

export type Promise = { label: string; text: string };

export type FAQ = { question: string; answer: string };

export type Testimonial = {
  quote: string;
  quoteBefore?: string;
  highlight: string;
  quoteAfter?: string;
};

export type FeaturedInLogo = {
  name: string;
  src: string;
  width: number;
  height: number;
};

export type HomeContent = {
  headline: string;
  subheadline: string;
  ctas: CTA[];
  introHeadingPre: string;
  introHeadingEmphasis: string;
  introHeadingPost: string;
  introParagraphs: string[];
  founderName: string;
  founderTitle: string;
  promisesHeading: string;
  promises: Promise[];
  featuredInHeading: string;
  featuredIn: FeaturedInLogo[];
  testimonials: Testimonial[];
  faqs: FAQ[];
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
    founderName: "Joyce Reed",
    founderTitle: "Founder, Hurt 2 Heal",
    promisesHeading: "Your comfort comes first.",
    promises: [
      {
        label: "Absolute Privacy",
        text: "We strictly prohibit session recordings to protect your peace of mind.",
      },
      {
        label: "Zero Pressure",
        text: "There is no pressure to speak or turn on your camera. You are welcome to show up exactly as you are, even if that means just sitting back and listening.",
      },
      {
        label: "You belong here",
        text: "whether your experience happened yesterday or decades ago.",
      },
    ],
    featuredInHeading: "As Featured In",
    featuredIn: [
      { name: "rolling out", src: "/featured-in/rolling-out.svg", width: 1537, height: 622 },
      { name: "B.O.S.S. Magazine", src: "/featured-in/boss-magazine.svg", width: 1196, height: 622 },
      { name: "Bravo", src: "/featured-in/bravo.svg", width: 754, height: 622 },
      { name: "Reality Check", src: "/featured-in/reality-check.svg", width: 995, height: 622 },
      { name: "Stacks", src: "/featured-in/stacks.svg", width: 678, height: 622 },
      { name: "Atlanta Daily World", src: "/featured-in/atlanta-daily-world.svg", width: 1466, height: 517 },
    ],
    testimonials: [
      {
        quote:
          "I have had many opportunities to interact with Joyce, during book promotions and events in support of her great cause. Joyce is always willing to lend a helping hand. She has exhibited tremendous drive and a dedication to excellence through the work Hurt 2 Heal is doing. Joyce is a fighter...and has also shown me that she is willing to make the commitment to this world that we need for it to be a better place.",
        quoteBefore:
          "I have had many opportunities to interact with Joyce, during book promotions and events in support of her great cause. Joyce is always willing to lend a helping hand. ",
        highlight:
          "She has exhibited tremendous drive and a dedication to excellence through the work Hurt 2 Heal is doing.",
        quoteAfter:
          " Joyce is a fighter...and has also shown me that she is willing to make the commitment to this world that we need for it to be a better place.",
      },
      {
        quote:
          "Selecting Ms. Joyce Reed to share her testimony was one of the best decisions we could have made. Ms. Joyce spoke in great detail of her trivial journey, from rape to attempted suicide. Tears filled the eyes of everyone listening, for we either related to a component of her story or empathized with her. What touched me the most was that Ms. Joyce not only went through all of this, but she overcame all of it triumphantly. That inspires me tremendously. There was hope and transformation in her story, and that is beautiful to me.",
        quoteBefore:
          "Selecting Ms. Joyce Reed to share her testimony was one of the best decisions we could have made. Ms. Joyce spoke in great detail of her trivial journey, from rape to attempted suicide. Tears filled the eyes of everyone listening, for we either related to a component of her story or empathized with her. What touched me the most was that Ms. Joyce not only went through all of this, but she overcame all of it triumphantly. That inspires me tremendously. ",
        highlight:
          "There was hope and transformation in her story, and that is beautiful to me.",
        quoteAfter: "",
      },
      {
        quote:
          "Valdosta State University had the pleasure of having Joyce speak at the first annual Women's Empowerment Conference. She changed lives and left a lasting impression. Selecting Joyce to share her testimony was one of the best decisions we could have made. She inspires tremendously.",
        quoteBefore:
          "Valdosta State University had the pleasure of having Joyce speak at the first annual Women's Empowerment Conference. ",
        highlight: "She changed lives and left a lasting impression.",
        quoteAfter:
          " Selecting Joyce to share her testimony was one of the best decisions we could have made. She inspires tremendously.",
      },
      {
        quote:
          "I believe strongly in her ability to do this work because she approaches it with empathy, resilience, and a genuine understanding of what survivors face. Her experiences have not discouraged her; instead, they have strengthened her compassion and deepened her commitment to helping others. She has taken the time to grow, reflect, and develop a plan to make a meaningful impact. Supporting survivors is essential, as it provides safety, validation, and the opportunity to heal. Those who have experienced trauma need advocates who not only understand their struggles, but who are also willing to stand beside them with patience and care. Joyce embodies these qualities and is dedicated to creating a supportive and empowering environment for those in need.",
        quoteBefore: "I believe strongly in her ability to do this work because ",
        highlight:
          "she approaches it with empathy, resilience, and a genuine understanding of what survivors face.",
        quoteAfter:
          " Her experiences have not discouraged her; instead, they have strengthened her compassion and deepened her commitment to helping others. She has taken the time to grow, reflect, and develop a plan to make a meaningful impact. Supporting survivors is essential, as it provides safety, validation, and the opportunity to heal. Those who have experienced trauma need advocates who not only understand their struggles, but who are also willing to stand beside them with patience and care. Joyce embodies these qualities and is dedicated to creating a supportive and empowering environment for those in need.",
      },
      {
        quote:
          "I had the opportunity to hear Joyce, speak at a local Take Back the Night event and was absolutely moved by her words, as was the rest of the audience. Joyce talked about the multiple assaults that had occurred over her youth and how the trauma affected her life as an adult. While some of it was difficult to listen to, Joyce also showed how strong and resilient a survivor can be. She shared with us the story of her healing and the challenges she still faces. Joyce clearly believes that there can be life after victimization and is passionate about empowering other survivors. I believe that everyone who was present left with a sense of hope for survivors and with a desire to be part of the solution to end sexual violence in our communities.",
        quoteBefore:
          "I had the opportunity to hear Joyce, speak at a local Take Back the Night event and was absolutely moved by her words, as was the rest of the audience. Joyce talked about the multiple assaults that had occurred over her youth and how the trauma affected her life as an adult. While some of it was difficult to listen to, Joyce also showed how strong and resilient a survivor can be. She shared with us the story of her healing and the challenges she still faces. ",
        highlight:
          "Joyce clearly believes that there can be life after victimization and is passionate about empowering other survivors.",
        quoteAfter:
          " I believe that everyone who was present left with a sense of hope for survivors and with a desire to be part of the solution to end sexual violence in our communities.",
      },
    ],
    faqs: [
      {
        question: "What exactly is The Healing Lab?",
        answer:
          "It is a carefully structured, peer-led online space designed for community healing and education. Unlike a standard webinar where you just sit and watch, our spaces are interactive, supportive, and designed to let you engage safely at your own comfort level.",
      },
      {
        question: "Do I have to turn my camera on or speak during a workshop?",
        answer:
          "Not if you don't want to. We want you to show up exactly as you are. While we love to see your face and hear your voice, you are completely free to keep your camera off, stay on mute, and simply listen or use the chat function if that feels safest for you.",
      },
      {
        question: "Are these virtual sessions recorded?",
        answer:
          "No, we strictly prohibit the recording of our community sessions. Your privacy, safety, and emotional security are our absolute highest priorities. What is shared in our spaces stays in our spaces.",
      },
      {
        question: "Are these workshops group therapy or crisis counseling?",
        answer:
          "No. Our programs are peer-led community spaces focused on education, trauma-informed self-care, and collective healing. We do not provide clinical therapy, medical advice, or legal/crisis advocacy. We are here to walk alongside you as peers on the healing journey, and we can help connect you with professional crisis resources if you need them.",
      },
      {
        question: "How do I register for an upcoming workshop, and is there a cost?",
        answer:
          "Registration is completely free and can be done right here on our website. Simply click the \"Register\" button, fill out our quick form, and you will automatically receive an email with your unique Zoom access link.",
      },
    ],
  };
}

export type FAQSection = {
  id: string;
  title: string;
  faqs: FAQ[];
};

export function getFAQSections(): FAQSection[] {
  return [
    {
      id: "getting-started",
      title: "Getting Started",
      faqs: [
        {
          question: "What exactly is The Healing Lab?",
          answer:
            "It is a carefully structured, peer-led online space designed for community healing and education. Unlike a standard webinar where you just sit and watch, our spaces are interactive, supportive, and designed to let you engage safely at your own comfort level.",
        },
        {
          question: "How do I register for an upcoming workshop, and is there a cost?",
          answer:
            "Registration is completely free and can be done right here on our website. Simply click the \"Register\" button, fill out our quick form, and you will automatically receive an email with your unique Zoom access link.",
        },
        {
          question: "Is your organization a registered nonprofit?",
          answer:
            "Yes, Hurt 2 Heal is a dedicated nonprofit organization focused on community education and trauma-informed peer support.",
        },
      ],
    },
    {
      id: "privacy-safety-boundaries",
      title: "Privacy, Safety & Boundaries",
      faqs: [
        {
          question: "Are these virtual sessions recorded?",
          answer:
            "No, we strictly prohibit the recording of our community sessions. Your privacy, safety, and emotional security are our absolute highest priorities. What is shared in our spaces stays in our spaces.",
        },
        {
          question: "Do I have to turn my camera on or speak during a workshop?",
          answer:
            "Not if you don't want to. We want you to show up exactly as you are. While we love to see your face and hear your voice, you are completely free to keep your camera off, stay on mute, and simply listen or use the chat function if that feels safest for you.",
        },
        {
          question: "How do I know it is safe to share in your virtual spaces?",
          answer:
            "We work hard to create a secure \"digital container.\" This means we do not allow sessions to be recorded under any circumstances. We also have a designated safety host in every session to monitor the space, and we establish mutual guidelines of confidentiality and deep respect at the very beginning of every single workshop.",
        },
        {
          question: "What should I do if I get overwhelmed or triggered during a session?",
          answer:
            "Your emotional safety is paramount. We actively practice and encourage self-care during our workshops. If a topic feels too heavy, you are entirely free to step away from your screen, mute the audio, or leave the session early. Our tech hosts and safety moderators are also available via private Zoom chat during the session if you need a moment of grounding or support.",
        },
      ],
    },
    {
      id: "what-to-expect",
      title: "What to Expect",
      faqs: [
        {
          question: "Are these workshops group therapy or crisis counseling?",
          answer:
            "No. Our programs are peer-led community spaces focused on education, trauma-informed self-care, and collective healing. We do not provide clinical therapy, medical advice, or legal/crisis advocacy. We are here to walk alongside you as peers on the healing journey, and we can help connect you with professional crisis resources if you need them.",
        },
        {
          question: "I have never spoken out loud about my experience. Is it okay if I just sit and listen?",
          answer:
            "Absolutely. There is immense healing in just realizing you are not alone in the room. You have total control over your experience here. You are never forced to share, your camera can remain off, and you can engage entirely on your own terms when—and if—you feel ready.",
        },
        {
          question: "Can I join a workshop if my abuse happened years ago?",
          answer:
            "Trauma does not have an expiration date, and neither does healing. Whether your experience happened yesterday or decades ago, your story is valid, and you are welcome in our spaces.",
        },
      ],
    },
    {
      id: "for-friends-family-allies",
      title: "For Friends, Family & Allies",
      faqs: [
        {
          question: "I suspect a loved one is experiencing domestic violence or dealing with trauma. How can I help them?",
          answer:
            "The most powerful thing you can do is listen without judgment, believe them, and let them know they are not alone. Avoid judging their choices or pressuring them to leave a situation before they are ready, as this can sometimes increase isolation. You are welcome to attend our educational workshops to learn more about trauma-informed support, or share our resources with them safely.",
        },
      ],
    },
  ];
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
      "Whether you are here to attend our monthly sessions, access educational resources, or learn how to support a loved one, we are honored to walk alongside you.",
    ],
    signoff: "Hurt 2 Heal",
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
