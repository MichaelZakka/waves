import { emptyImage, type SiteContent, type SiteImage } from "./schema";

/*
 * Starting content. Used until the first save from the admin dashboard, and as
 * the fallback if the saved content file is ever missing or unreadable.
 */

function image(src: string, alt: string, blurDataURL: string, frame: Partial<SiteImage> = {}): SiteImage {
  return { ...emptyImage(), src, alt, blurDataURL, ...frame };
}

const BLUR = {
  homeHero:
    "data:image/webp;base64,UklGRmwAAABXRUJQVlA4IGAAAADwAQCdASoQAAwAA4BaJagCdAELhtwmaMAA/u+Sox3wzrd4CzC1pnV7nDViGZ2LVjqB8fHvucv7qCGWmKhuEEg9MR0mg3VgLDX+SL5y7my6ifPmwYQty6/fx1UbCUQcwAA=",
  homeAbout:
    "data:image/webp;base64,UklGRloAAABXRUJQVlA4IE4AAADwAQCdASoQAAwAA4BaJaAAAuNN535aSKAA/vhV4lGpIT4aPu3sd9OUoo2mWLDixPVfx/UD6BE52uceUATZa6ZGWqVerXciO6b+ZbTt5AA=",
  aboutHero:
    "data:image/webp;base64,UklGRmgAAABXRUJQVlA4IFwAAADwAQCdASoQAAwAA4BaJYgCdACny5EcKAAA/tze6ew83Y4ti8B0RuqV0UXb0tFHQCupatnUJRU27IgcuH4eWIA/7mcXH3IhhcCOOQzH6mLwfByd8IyZWUYOUYPgAA==",
  aboutWho:
    "data:image/webp;base64,UklGRmYAAABXRUJQVlA4IFoAAACwAQCdASoQAAwAA4BaJZwAAoid/7twAP71nr51KFRyboVHztes9dTXEi/Arvc6/TNE2xxraHuxqrABR42gQGNQ0S772kwqe2yGHHPQPIh7ISPG1V+J/cwoAAA=",
  audio:
    "data:image/webp;base64,UklGRnIAAABXRUJQVlA4IGYAAADwAQCdASoQAAwAA4BaJbACdADaWPkuzwAA/t25UpGhi2I90CLsUV6rPe1COap35sg8lfvGajR9kwCLZwZ0kgIVyEcvxcPt4buqnUJjQovnGk542PkWUNe7tzDrfFbNTqOco1JAAAA=",
  video:
    "data:image/webp;base64,UklGRmAAAABXRUJQVlA4IFQAAAAQAgCdASoQAAwAA4BaJbACdAEfzveSWIWAAP7xFlxjaf80Cb09nWEpLtwOSYoqPz9GsDdXv1LmoHHIHyK6s9paDSSjuAXu2CAhwB5RMKWSrVQAAAA=",
  lighting:
    "data:image/webp;base64,UklGRlwAAABXRUJQVlA4IFAAAAAQAgCdASoQAA0AA4BaJbACdAEOmfroFUAAAP72rfGxZBoRJ7MNHBrj/yzkpysR9xOvmozXn+OcxffWhKOQhA0tTbdmZpcs2YZ+NmtsNQAAAA==",
  support:
    "data:image/webp;base64,UklGRm4AAABXRUJQVlA4IGIAAACwAQCdASoQAAwAA4BaJbACdAEMrneQAP7u7zpYxBCJSR0KuTz/qL/kqidCEkVl+EXSqZeMuixOBHdE97EQFhEaIFAfuNg7G63V8z8vsJc/hWtFUFP247SAE6xPA9sUhSoAAA==",
};

const audioImage = image(
  "/images/services/audio.jpg",
  "DiGiCo Quantum mixing console at front of house facing an outdoor stage with LED screens",
  BLUR.audio,
);
const videoImage = image(
  "/images/services/video.jpg",
  "Conference hall with a large LED screen showing the speaker above a lit stage and audience",
  BLUR.video,
);
const lightingImage = image(
  "/images/services/lighting.jpg",
  "Outdoor concert stage lit with yellow and purple beams over a large crowd",
  BLUR.lighting,
);
const supportImage = image(
  "/images/services/support.jpg",
  "Technician at a Yamaha CL5 console and control laptops in an arena before a show",
  BLUR.support,
);

export const seedContent: SiteContent = {
  contact: {
    name: "Masoud Al Qaq",
    initials: "MA",
    role: "Managing Director",
    phone: "+971 55 179 1376",
    email: "Masoud@professionalwaves.com",
    website: "www.professionalwaves.com",
    websiteUrl: "https://www.professionalwaves.com",
    location: "Dubai & Abu Dhabi, United Arab Emirates",
    mapQuery: "Dubai, United Arab Emirates",
    socials: [
      { platform: "whatsapp", url: "https://wa.me/971551791376" },
      { platform: "instagram", url: "https://www.instagram.com/" },
    ],
  },

  home: {
    hero: {
      image: image(
        "/images/home/hero.jpg",
        "Outdoor concert at night with LED screens, stage lighting and a mixing console in the foreground",
        BLUR.homeHero,
        { focalY: 30 },
      ),
      height: 100,
      titleLine1: "Creating Extraordinary",
      titleLine2: "Event Experiences",
      subtitleLine1: "Professional Audio, Video & Lighting Solutions",
      subtitleLine2: "13+ Years of Excellence in the UAE",
      ctaLabel: "Let’s Plan Your Event",
    },
    infoItems: [
      { label: "Locations", value: "Dubai & Abu Dhabi" },
      { label: "Capability", value: "Arena, Stadium & Ballroom" },
      { label: "Deployment", value: "Turnkey AVL & Rigging" },
      { label: "Support", value: "24/7 Redundant Systems" },
    ],
    stats: [
      { value: "13+", label: "Years of Experience", caption: "Proven track record in GCC events" },
      { value: "UAE", label: "Based in the Emirates", caption: "Rapid deployment across all 7 Emirates" },
      { value: "AVL", label: "Audio, Video & Lighting", caption: "Comprehensive inventory from top brands" },
      { value: "360°", label: "Technical Event Support", caption: "From engineering design to live operation" },
    ],
    about: {
      title: "Professional Waves",
      lead: "is your trusted partner for Audio Visual & Lighting Solutions",
      body: "Professional Waves is a UAE-based company specializing in professional audio, video, and lighting equipment rental, backed by experienced technicians and dedicated technical support to deliver seamless event experiences.",
      ctaLabel: "Get in Touch",
      image: image(
        "/images/home/about.jpg",
        "Outdoor festival stage with green laser beams, truss lighting and LED screens at night",
        BLUR.homeAbout,
      ),
    },
    services: {
      title: "Our Services",
      subtitle: "Professional Solutions. Exceptional Experiences",
    },
    why: {
      eyebrow: "The Professional Advantage",
      title: "Why Choose Professional Waves?",
      subtitle:
        "We combine professional audio, video, and lighting equipment with experienced technical support to help deliver seamless and memorable event experiences across the UAE.",
      cards: [
        {
          title: "Professional Equipment",
          text: "Professional audio, video, and lighting equipment to meet the technical requirements of different events.",
          tag: "Quality Equipment",
        },
        {
          title: "Experienced Team",
          text: "Skilled technicians and operators providing on-site technical assistance and equipment operation.",
          tag: "Technical Expertise",
        },
        {
          title: "Tailored Solutions",
          text: "Flexible AVL rental solutions tailored to the needs, scale and technical requirements of each event.",
          tag: "Flexible Solutions",
        },
        {
          title: "Reliable Support",
          text: "Dedicated technical support to help ensure smooth equipment setup and reliable event operations.",
          tag: "On-Site Support",
        },
      ],
    },
    contact: {
      eyebrow: "Direct Production Inquiry",
      titleStart: "Let’s Create Something",
      titleHighlight: "Extraordinary",
      intro:
        "Tell us about your upcoming event and the audio, video, lighting, or technical support you need. Our team will be happy to discuss your requirements.",
      formTitle: "Request a Quote",
      formSubtitle: "Fill in your production details below for immediate technical feasibility review.",
      note: "Typical RFP & technical quote turnaround: within 4 hours",
      callLabel: "Call Us",
      quoteLabel: "Get in Touch",
    },
  },

  about: {
    hero: {
      image: image(
        "/images/about/hero.jpg",
        "Summit stage with a large LED wall and moving-head lighting above a seated audience",
        BLUR.aboutHero,
        { focalY: 35 },
      ),
      height: 100,
      title: "About Professional Waves",
      taglineBefore: "Powering",
      taglineHighlight: "Experiences",
      taglineAfter: ", Bringing Events to Life",
      paragraph:
        "For more than 13 years, Professional Waves has delivered audio, video and lighting production for conferences, concerts, sporting events and celebrations across the United Arab Emirates.",
    },
    whoWeAre: {
      eyebrow: "Who We Are?",
      title: "Expertise Behind Every Experience",
      paragraphs: [
        "Professional Waves specializes in professional audio, video, and lighting equipment rental, providing technical solutions and experienced operators for a diverse range of events.",
        "From elegant weddings and live music performances to sporting events and corporate productions, we support different event environments with audiovisual equipment and technical expertise tailored to each event’s requirements.",
      ],
      image: image(
        "/images/about/who-we-are.jpg",
        "Boxing ring in an arena under a truss lighting rig with large LED screens behind it",
        BLUR.aboutWho,
      ),
    },
    experience: {
      eyebrowHighlight: "One",
      eyebrowRest: "Technical Team. Diverse Event Experiences.",
      title: "Our Experience",
      intro:
        "Every event has its own atmosphere, audience, and technical requirements. Our work spans different event environments, from wedding celebrations and live entertainment to sporting events and large-scale stage productions.",
      items: [
        {
          tag: "Service 01",
          title: "Weddings & Celebrations",
          text: "Creating the right atmosphere through professional audiovisual solutions for special occasions.",
          image: emptyImage(),
        },
        {
          tag: "Service 02",
          title: "Live Entertainment",
          text: "Supporting live performances with professional sound, lighting, and visual equipment.",
          image: emptyImage(),
        },
        {
          tag: "Service 03",
          title: "Sports & Special Events",
          text: "Supporting event environments with audiovisual equipment and technical solutions tailored to the occasion.",
          image: emptyImage(),
        },
      ],
    },
    expertise: {
      eyebrow: "The Technology Behind the Show",
      title: "Our Expertise",
      items: [
        {
          title: "Audio Solutions",
          text: "Professional sound systems and portable speakers for a variety of event environments.",
        },
        {
          title: "Video & LED Solutions",
          text: "LED screens, projectors, and cameras for presentations and visual event experiences.",
        },
        {
          title: "Lighting Solutions",
          text: "Professional lighting equipment for concerts, weddings, conferences, and special events.",
        },
      ],
    },
    advantages: {
      eyebrow: "Built Around Your Event Requirements",
      title: "Why Professional Waves?",
      items: [
        {
          title: "Professional Equipment",
          text: "Audiovisual equipment suited to the technical requirements of different events.",
        },
        {
          title: "Technical Expertise",
          text: "Technical personnel and operators supporting equipment setup and operation.",
        },
        {
          title: "Tailored Solutions",
          text: "Equipment and technical support options based on the needs of each event.",
        },
      ],
    },
    cta: {
      title: "Planning Your Next Event?",
      text: "Tell us about your event and our team will put together the right audio, video and lighting solution.",
      buttonLabel: "Let’s Plan Your Event",
    },
  },

  servicesPage: {
    title: "Our Services",
    subtitle: "Professional Solutions. Exceptional Experiences",
    aside:
      "Precision-tested hardware calibrated by specialized audio, visual, and lighting technicians across luxury UAE venues.",
  },

  services: [
    {
      slug: "audio-solutions",
      title: "Professional Audio Solutions",
      description:
        "High-quality sound systems and professional audio equipment for events of every scale.",
      image: audioImage,
      badge: "UAE Sound Specialists",
      subtitle:
        "Professional sound equipment and audio solutions for concerts, weddings, conferences, and live events across the UAE.",
      overview:
        "Professional Waves provides audio equipment rental for events of all sizes, from private gatherings and weddings to corporate conferences and live performances. Our professional audio solutions are selected to meet the needs of each venue, helping deliver clear sound and a quality listening experience.",
      capabilitiesEyebrow: "Engineering & Fixtures",
      capabilities: [
        {
          title: "Professional Sound Systems",
          text: "Professional sound equipment designed to deliver clear, balanced audio for different event environments.",
        },
        {
          title: "Audio Mixing & Control",
          text: "Audio mixing equipment for managing sound levels during presentations, speeches, and live performances.",
        },
        {
          title: "Portable Audio Solutions",
          text: "Flexible audio equipment options for gatherings, presentations, and events with different sound requirements.",
        },
      ],
      gallery: [audioImage, emptyImage()],
    },
    {
      slug: "video-led-solutions",
      title: "Video & LED Solutions",
      description: "LED screens, projection, and professional video equipment for impactful visuals.",
      image: videoImage,
      badge: "Premium LED Display Solutions",
      subtitle:
        "LED screens, projectors, and professional video equipment to bring every event to life.",
      overview:
        "Professional Waves provides video equipment rental for conferences, exhibitions, weddings, corporate events, and live performances. From LED display screens to projection systems, our solutions help deliver clear visuals and engaging presentations tailored to each event’s requirements.",
      capabilitiesEyebrow: "Engineering & Fixtures",
      capabilities: [
        {
          title: "LED Display Screens",
          text: "High-quality LED screens for presentations, live events, visual branding, and high-impact displays.",
        },
        {
          title: "Projector Systems",
          text: "Professional projection solutions for conferences, presentations, and indoor events.",
        },
        {
          title: "Professional Video Equipment",
          text: "Video equipment to support event visuals, presentations, and on-screen content display.",
        },
      ],
      gallery: [videoImage, emptyImage()],
    },
    {
      slug: "professional-lighting",
      title: "Professional Lighting",
      description:
        "Dynamic stage lighting and creative lighting setups that transform every event atmosphere.",
      image: lightingImage,
      badge: "UAE Visual Creative",
      subtitle:
        "Professional stage and event lighting solutions to create the perfect atmosphere for every occasion.",
      overview:
        "Professional Waves provides lighting equipment rental for concerts, weddings, conferences, corporate events, and special celebrations. From dynamic stage lighting to elegant ambient lighting, our solutions help transform event spaces and create memorable visual experiences tailored to each occasion.",
      capabilitiesEyebrow: "Engineering & Fixtures",
      capabilities: [
        {
          title: "Stage & Concert Lighting",
          text: "Professional lighting equipment for stages, concerts, and live performances, creating dynamic and engaging visual effects.",
        },
        {
          title: "Ambient & Event Lighting",
          text: "Lighting solutions for weddings, gala dinners, exhibitions, and indoor events designed to complement the venue and atmosphere.",
        },
        {
          title: "Architectural & Decorative Lighting",
          text: "Lighting options that highlight venue features, enhance event design, and create an elegant atmosphere.",
        },
      ],
      gallery: [lightingImage, emptyImage()],
    },
    {
      slug: "technical-support",
      title: "Technical Support & Operators",
      description:
        "Experienced technicians and skilled operators ensuring smooth, reliable event production.",
      image: supportImage,
      badge: "UAE Production Crew",
      subtitle:
        "Experienced technicians and skilled operators delivering reliable technical support for professional event production",
      overview:
        "Professional Waves provides experienced technical personnel to support the setup and operation of audio, video, and lighting equipment at events across the UAE. Our team works to ensure smooth technical operations, coordinate equipment requirements, and help deliver a seamless event experience from setup to completion.",
      capabilitiesEyebrow: "Core Capabilities",
      capabilities: [
        {
          title: "Equipment Setup & Installation",
          text: "Technical assistance with setting up and preparing event equipment according to the venue and production requirements.",
        },
        {
          title: "Live Event Operations",
          text: "On-site technical operators supporting event equipment during conferences, concerts, weddings, and live productions.",
        },
        {
          title: "On-Site Technical Support",
          text: "Technical assistance throughout the event to help maintain smooth operations and address equipment-related issues.",
        },
      ],
      gallery: [supportImage, emptyImage()],
    },
  ],

  works: {
    intro: {
      eyebrow: "Our Work",
      title: "Events We Help Bring to Life",
      text: "Explore our work in professional sound, lighting, and screen solutions.",
    },
    projects: [
      {
        label: "Featured Production",
        title: "Game of the Future",
        location: "ADNEC Centre, Abu Dhabi",
        date: "December 2025",
        services: ["Sound", "Lighting", "Screens"],
        description:
          "Professional Waves supported Game of the Future at ADNEC Centre, Abu Dhabi, providing comprehensive sound, lighting, and screen solutions.",
        shots: [
          { caption: "Sound Engineering & Control", note: "ADNEC Abu Dhabi", image: emptyImage() },
          { caption: "Arena LED Displays & Lighting", note: "Tournament Stage", image: emptyImage() },
        ],
      },
    ],
    cta: {
      title: "Planning Your Next Event?",
      text: "From premier stadium spectacles to luxury summits, let Professional Waves engineer an unforgettable sensory environment with tailored sound, lighting, and visual solutions.",
      buttonLabel: "Contact Us",
    },
  },

  contactPage: {
    eyebrow: "Get in Touch",
    title: "Let’s Talk About Your Event",
    text: "Looking for professional sound, lighting, or video equipment for your next event? Get in touch with our team to discuss your requirements.",
  },
};
