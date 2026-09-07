import { createHotContext as __vite__createHotContext } from "/@vite/client";import.meta.hot = __vite__createHotContext("/src/components/About.tsx");import __vite__cjsImport0_react_jsxDevRuntime from "/node_modules/.vite/deps/react_jsx-dev-runtime.js?v=79a43bf7"; const jsxDEV = __vite__cjsImport0_react_jsxDevRuntime["jsxDEV"];
import * as RefreshRuntime from "/@react-refresh";
const inWebWorker = typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
let prevRefreshReg;
let prevRefreshSig;
if (import.meta.hot && !inWebWorker) {
  if (!window.$RefreshReg$) {
    throw new Error(
      "@vitejs/plugin-react can't detect preamble. Something is wrong."
    );
  }
  prevRefreshReg = window.$RefreshReg$;
  prevRefreshSig = window.$RefreshSig$;
  window.$RefreshReg$ = RefreshRuntime.getRefreshReg("C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx");
  window.$RefreshSig$ = RefreshRuntime.createSignatureFunctionForTransform;
}
var _s = $RefreshSig$();
import __vite__cjsImport3_react from "/node_modules/.vite/deps/react.js?v=79a43bf7"; const useRef = __vite__cjsImport3_react["useRef"]; const useState = __vite__cjsImport3_react["useState"];
import { Play, ChevronLeft, ChevronRight, Leaf, Check } from "/node_modules/.vite/deps/lucide-react.js?v=6bc953cc";
import { FaLinkedin } from "/node_modules/.vite/deps/react-icons_fa.js?v=1ca53f63";
import { WaitlistModal } from "/src/components/WaitlistModal.tsx";
import heroBg from "/src/assets/about/hero-bg.jpg?import";
import storyVideo from "/src/assets/about/story-video.jpg?import";
import missionHand from "/src/assets/about/mission-hand.jpg?import";
import visionCocoa from "/src/assets/about/vision-cocoa.jpg?import";
import portrait1 from "/src/assets/about/portrait-1.jpg?import";
import portrait2 from "/src/assets/about/portrait-2.jpg?import";
import portrait3 from "/src/assets/about/portrait-3.jpg?import";
import portrait4 from "/src/assets/about/portrait-4.jpg?import";
const MISSION_BULLETS = [
  "Empower Farmers with technology, markets, fair pricing, and new income opportunities from coconuts and their by-products.",
  "Generate decent employment and entrepreneurship opportunities across the coconut value chain.",
  "Turn coconut waste into valuable, eco-friendly products while reducing pollution and landfill waste."
];
const VISION_BULLETS = [
  "Farmers Prosper by benefiting from fair prices, modern technology, and improved market access.",
  "Local communities benefit from job creation, entrepreneurship, and sustainable economic development.",
  "Coconut waste becomes Wealth and by-products are transformed into valuable resources and innovative products."
];
const WHAT_WE_DO = [
  {
    n: "01",
    title: "Coco-Tech",
    desc: "We design, fabricate, and sell innovative coconut processing machines for the entire value chain. Our Machines:",
    bullets: [
      "Dehusking Machine (500–900 nuts/hr)",
      "Deshelling Machine (240–400 nuts/hr)",
      "Decorticator (Separates cocopeat from husk)",
      "Coconut Milk Extractor (Automatic & Manual)"
    ]
  },
  {
    n: "02",
    title: "Coco-Connect",
    desc: "Our digital marketplace is a B2B2C platform that connects farmers, processors, suppliers, and buyers creating a one-stop ecosystem for everything coconut. We Act as a Facilitator:",
    bullets: [
      "Enable direct buyer-seller partnerships",
      "Ensure direct seller relationships",
      "Provide verified business network"
    ]
  },
  {
    n: "03",
    title: "Cocycle Hub",
    desc: "We convert coconut waste into valuable products, empowering women and men while promoting sustainable agriculture.",
    bullets: [
      "Cocopeat for soilless farming",
      "Coconut fiber for crafts",
      "Cocopot for homes & offices",
      "Briquette charcoal"
    ]
  },
  {
    n: "04",
    title: "Coco DrinkEat",
    desc: "We bring the ultimate coconut experience to your events fresh pre-cut coconuts ready to drink and eat on the spot. Event Services:",
    bullets: [
      "Fresh-cut coconuts at your venue",
      "Drink coconut water on the spot",
      "Custom branded serving stations"
    ]
  }
];
const TEAM = [
  { name: "Adesuwa Ojo", role: "Operations Lead", img: portrait1 },
  { name: "ENOCH Bamigboye", role: "Software Engineer", img: portrait2 },
  {
    name: "Jacob O. Abiodun",
    role: "Founder / CEO",
    img: portrait3,
    featured: true,
    email: "Bongoeq@example.com",
    phone: "+233 45 678 0972"
  },
  { name: "Kehinde Omotoyin", role: "Finance Manager", img: portrait4 },
  { name: "Tunde Bakare", role: "Agronomist", img: portrait3 }
];
const SDG = [
  {
    code: "5",
    title: "Gender Equality",
    bullets: [
      "Employ more women",
      "Integrate women into value chain",
      "Improve performance of men in the industry"
    ]
  },
  {
    code: "8",
    title: "Decent Work",
    bullets: [
      "Create more decent jobs",
      "Contribute to coconut industry growth",
      "Access to digital marketplace"
    ]
  },
  {
    code: "12",
    title: "Responsible production",
    bullets: [
      "Improve production to reduce waste",
      "Promote circularity",
      "Increase revenue by 20%"
    ]
  }
];
function CoconutIcon({ className }) {
  return /* @__PURE__ */ jsxDEV(
    "svg",
    {
      viewBox: "0 0 24 24",
      className,
      "aria-hidden": "true",
      role: "img",
      children: [
        /* @__PURE__ */ jsxDEV("circle", { cx: "12", cy: "13", r: "8.5", fill: "#5d3a1f" }, void 0, false, {
          fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
          lineNumber: 153,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV("ellipse", { cx: "12", cy: "13", rx: "5.5", ry: "4.5", fill: "#f8efe1" }, void 0, false, {
          fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
          lineNumber: 154,
          columnNumber: 7
        }, this),
        /* @__PURE__ */ jsxDEV("ellipse", { cx: "12", cy: "13", rx: "4.5", ry: "3.5", fill: "#fff7ea" }, void 0, false, {
          fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
          lineNumber: 155,
          columnNumber: 7
        }, this)
      ]
    },
    void 0,
    true,
    {
      fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
      lineNumber: 147,
      columnNumber: 5
    },
    this
  );
}
_c = CoconutIcon;
export function About() {
  _s();
  const [waitlistOpen, setWaitlistOpen] = useState(false);
  const carouselRef = useRef(null);
  const scrollBy = (dir) => {
    carouselRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };
  return /* @__PURE__ */ jsxDEV("div", { className: "bg-white", children: [
    /* @__PURE__ */ jsxDEV(
      "section",
      {
        "aria-labelledby": "about-hero-heading",
        className: "relative bg-cover bg-center",
        style: {
          backgroundImage: `linear-gradient(rgba(0,0,0,0.30), rgba(0,0,0,0.30)), url(${heroBg})`
        },
        children: /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 sm:px-6 pt-36 pb-32 text-center text-white", children: [
          /* @__PURE__ */ jsxDEV(
            "h1",
            {
              id: "about-hero-heading",
              className: "text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight",
              children: "About Us"
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
              lineNumber: 179,
              columnNumber: 11
            },
            this
          ),
          /* @__PURE__ */ jsxDEV("p", { className: "max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-8", children: "Coconoto is a Smart Agritech company focused on creating technology, accessibility, and sustainability across the coconut value chain. We leverage innovative digital solutions to address challenges in coconut production, processing, distribution, and market access, while empowering farmers with better information, tools, and opportunities." }, void 0, false, {
            fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
            lineNumber: 185,
            columnNumber: 11
          }, this),
          /* @__PURE__ */ jsxDEV(
            "button",
            {
              type: "button",
              onClick: () => setWaitlistOpen(true),
              className: "bg-green-600 hover:bg-green-700 text-white font-medium px-8 py-3 rounded-lg transition focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2",
              children: "Register now"
            },
            void 0,
            false,
            {
              fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
              lineNumber: 192,
              columnNumber: 11
            },
            this
          )
        ] }, void 0, true, {
          fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
          lineNumber: 178,
          columnNumber: 9
        }, this)
      },
      void 0,
      false,
      {
        fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
        lineNumber: 171,
        columnNumber: 7
      },
      this
    ),
    /* @__PURE__ */ jsxDEV("section", { "aria-labelledby": "our-story", className: "bg-white py-16 md:py-24", children: /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
        /* @__PURE__ */ jsxDEV(
          "img",
          {
            src: storyVideo,
            alt: "Coconoto team recording the company story",
            className: "w-full rounded-lg object-cover aspect-[4/3]"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
            lineNumber: 206,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            "aria-label": "Play story video",
            className: "absolute inset-0 flex items-center justify-center group",
            children: /* @__PURE__ */ jsxDEV("span", { className: "bg-white/90 group-hover:bg-white rounded-full p-4 shadow-lg transition", children: /* @__PURE__ */ jsxDEV(Play, { className: "h-8 w-8 text-green-700 fill-current" }, void 0, false, {
              fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
              lineNumber: 217,
              columnNumber: 17
            }, this) }, void 0, false, {
              fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
              lineNumber: 216,
              columnNumber: 15
            }, this)
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
            lineNumber: 211,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
        lineNumber: 205,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV(
          "h2",
          {
            id: "our-story",
            className: "text-3xl md:text-4xl font-bold mb-4 tracking-tight",
            children: "Our STORY"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
            lineNumber: 222,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("p", { className: "text-gray-700 leading-relaxed", children: "Born out of the need to tackle waste and inefficiency in the coconut industry, Coconoto began as a vision to merge sustainability with technology. What started as a simple observation seeing tons of coconut waste ending up in landfills and releasing harmful carbon became a mission to transform the entire coconut value chain." }, void 0, false, {
          fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
          lineNumber: 228,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
        lineNumber: 221,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
      lineNumber: 204,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
      lineNumber: 203,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("section", { "aria-labelledby": "our-mission", className: "bg-gray-50 py-16 md:py-24", children: /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "order-2 md:order-1", children: [
        /* @__PURE__ */ jsxDEV(
          "h2",
          {
            id: "our-mission",
            className: "text-3xl md:text-4xl font-bold mb-4 tracking-tight",
            children: "Our Mission"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
            lineNumber: 243,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("p", { className: "text-gray-700 leading-relaxed mb-6", children: "We are committed to building a technology-enabled coconut economy that improves livelihoods, environmental sustainability & creates opportunities. Through innovation and inclusive solutions, we aim to:" }, void 0, false, {
          fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
          lineNumber: 249,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("ul", { className: "space-y-3", children: MISSION_BULLETS.map(
          (b, i) => /* @__PURE__ */ jsxDEV("li", { className: "flex gap-3 text-gray-700", children: [
            /* @__PURE__ */ jsxDEV(
              Leaf,
              {
                className: "h-5 w-5 text-green-600 shrink-0 mt-0.5",
                "aria-hidden": "true"
              },
              void 0,
              false,
              {
                fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                lineNumber: 257,
                columnNumber: 19
              },
              this
            ),
            /* @__PURE__ */ jsxDEV("span", { children: b }, void 0, false, {
              fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
              lineNumber: 261,
              columnNumber: 19
            }, this)
          ] }, i, true, {
            fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
            lineNumber: 256,
            columnNumber: 15
          }, this)
        ) }, void 0, false, {
          fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
          lineNumber: 254,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
        lineNumber: 242,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "order-1 md:order-2", children: /* @__PURE__ */ jsxDEV(
        "img",
        {
          src: missionHand,
          alt: "Farmer tending to coconut seedlings",
          className: "w-full rounded-lg object-cover aspect-[4/3]"
        },
        void 0,
        false,
        {
          fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
          lineNumber: 267,
          columnNumber: 13
        },
        this
      ) }, void 0, false, {
        fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
        lineNumber: 266,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
      lineNumber: 241,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
      lineNumber: 240,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("section", { "aria-labelledby": "our-vision", className: "bg-white py-16 md:py-24", children: /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-10 md:gap-16 items-center", children: [
      /* @__PURE__ */ jsxDEV("div", { children: /* @__PURE__ */ jsxDEV(
        "img",
        {
          src: visionCocoa,
          alt: "Hands holding cocoa beans",
          className: "w-full rounded-lg object-cover aspect-[4/3]"
        },
        void 0,
        false,
        {
          fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
          lineNumber: 280,
          columnNumber: 13
        },
        this
      ) }, void 0, false, {
        fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
        lineNumber: 279,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { children: [
        /* @__PURE__ */ jsxDEV(
          "h2",
          {
            id: "our-vision",
            className: "text-3xl md:text-4xl font-bold mb-4 tracking-tight",
            children: "Our Vision"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
            lineNumber: 287,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("p", { className: "text-gray-700 leading-relaxed mb-6", children: "Our vision is to create a sustainable, profitable, and inclusive coconut ecosystem that drives economic growth and environmental impact across Africa. We envision a future where:" }, void 0, false, {
          fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
          lineNumber: 293,
          columnNumber: 13
        }, this),
        /* @__PURE__ */ jsxDEV("ul", { className: "space-y-3", children: VISION_BULLETS.map(
          (b, i) => /* @__PURE__ */ jsxDEV("li", { className: "flex gap-3 text-gray-700", children: [
            /* @__PURE__ */ jsxDEV(CoconutIcon, { className: "h-5 w-5 shrink-0 mt-0.5" }, void 0, false, {
              fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
              lineNumber: 301,
              columnNumber: 19
            }, this),
            /* @__PURE__ */ jsxDEV("span", { children: b }, void 0, false, {
              fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
              lineNumber: 302,
              columnNumber: 19
            }, this)
          ] }, i, true, {
            fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
            lineNumber: 300,
            columnNumber: 15
          }, this)
        ) }, void 0, false, {
          fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
          lineNumber: 298,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
        lineNumber: 286,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
      lineNumber: 278,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
      lineNumber: 277,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("section", { "aria-labelledby": "what-we-do", className: "bg-gray-50 py-16 md:py-24", children: /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 sm:px-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "text-center mb-12", children: [
        /* @__PURE__ */ jsxDEV(
          "h2",
          {
            id: "what-we-do",
            className: "text-3xl md:text-4xl font-bold mb-3 tracking-tight",
            children: "What we do"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
            lineNumber: 314,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("p", { className: "max-w-2xl mx-auto text-gray-700", children: "We leverage technology and sustainable practices to transform the coconut value chain from production and processing to distribution and market access." }, void 0, false, {
          fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
          lineNumber: 320,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
        lineNumber: 313,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-2 gap-6 md:gap-8", children: WHAT_WE_DO.map(
        (card) => /* @__PURE__ */ jsxDEV(
          "article",
          {
            className: "relative bg-amber-900 text-white rounded-2xl p-8 shadow-md",
            children: [
              /* @__PURE__ */ jsxDEV("div", { className: "absolute -top-5 left-8 bg-white text-amber-900 font-bold rounded-full w-12 h-12 flex items-center justify-center text-lg shadow", children: card.n }, void 0, false, {
                fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                lineNumber: 332,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-bold mb-3 mt-2", children: card.title }, void 0, false, {
                fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                lineNumber: 335,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "text-amber-100 mb-4 leading-relaxed", children: card.desc }, void 0, false, {
                fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                lineNumber: 336,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("ul", { className: "space-y-2 text-amber-50", children: card.bullets.map(
                (b, i) => /* @__PURE__ */ jsxDEV("li", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxDEV(
                    Check,
                    {
                      className: "h-4 w-4 mt-1 shrink-0",
                      "aria-hidden": "true"
                    },
                    void 0,
                    false,
                    {
                      fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                      lineNumber: 342,
                      columnNumber: 23
                    },
                    this
                  ),
                  /* @__PURE__ */ jsxDEV("span", { children: b }, void 0, false, {
                    fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                    lineNumber: 346,
                    columnNumber: 23
                  }, this)
                ] }, i, true, {
                  fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                  lineNumber: 341,
                  columnNumber: 17
                }, this)
              ) }, void 0, false, {
                fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                lineNumber: 339,
                columnNumber: 17
              }, this)
            ]
          },
          card.n,
          true,
          {
            fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
            lineNumber: 328,
            columnNumber: 13
          },
          this
        )
      ) }, void 0, false, {
        fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
        lineNumber: 326,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
      lineNumber: 312,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
      lineNumber: 311,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("section", { "aria-labelledby": "meet-the-team", className: "bg-white py-16 md:py-24", children: /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 sm:px-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsxDEV(
          "h2",
          {
            id: "meet-the-team",
            className: "text-3xl md:text-4xl font-bold mb-3 tracking-tight",
            children: "Meet the Team"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
            lineNumber: 360,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("p", { className: "max-w-2xl mx-auto text-gray-700", children: "Meet our team of dedicated members who are committed to driving the development of Coconoto." }, void 0, false, {
          fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
          lineNumber: 366,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
        lineNumber: 359,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "relative", children: [
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            onClick: () => scrollBy(-1),
            "aria-label": "Previous team member",
            className: "hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 items-center justify-center hover:bg-gray-100 transition",
            children: /* @__PURE__ */ jsxDEV(ChevronLeft, { className: "h-5 w-5", "aria-hidden": "true" }, void 0, false, {
              fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
              lineNumber: 378,
              columnNumber: 15
            }, this)
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
            lineNumber: 372,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "div",
          {
            ref: carouselRef,
            role: "region",
            "aria-label": "Team carousel",
            className: "flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory",
            style: { scrollbarWidth: "none" },
            children: TEAM.map(
              (m, i) => /* @__PURE__ */ jsxDEV(
                "article",
                {
                  className: [
                    "shrink-0 snap-center bg-white rounded-xl border border-gray-200 p-4 text-center",
                    m.featured ? "w-72 md:w-80" : "w-64"
                  ].join(" "),
                  children: [
                    /* @__PURE__ */ jsxDEV(
                      "div",
                      {
                        className: [
                          "mx-auto rounded-lg overflow-hidden bg-gray-100",
                          m.featured ? "h-80" : "h-72"
                        ].join(" "),
                        children: /* @__PURE__ */ jsxDEV(
                          "img",
                          {
                            src: m.img,
                            alt: `Portrait of ${m.name}`,
                            className: "w-full h-full object-cover"
                          },
                          void 0,
                          false,
                          {
                            fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                            lineNumber: 401,
                            columnNumber: 21
                          },
                          this
                        )
                      },
                      void 0,
                      false,
                      {
                        fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                        lineNumber: 395,
                        columnNumber: 19
                      },
                      this
                    ),
                    /* @__PURE__ */ jsxDEV("h3", { className: "font-bold mt-4", children: m.name }, void 0, false, {
                      fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                      lineNumber: 407,
                      columnNumber: 19
                    }, this),
                    /* @__PURE__ */ jsxDEV("p", { className: "text-sm text-gray-600", children: m.role }, void 0, false, {
                      fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                      lineNumber: 408,
                      columnNumber: 19
                    }, this),
                    m.featured && /* @__PURE__ */ jsxDEV("div", { className: "mt-3 text-left text-sm space-y-1", children: [
                      m.email && /* @__PURE__ */ jsxDEV(
                        "a",
                        {
                          href: `mailto:${m.email}`,
                          className: "block text-green-700 hover:underline truncate",
                          children: m.email
                        },
                        void 0,
                        false,
                        {
                          fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                          lineNumber: 412,
                          columnNumber: 19
                        },
                        this
                      ),
                      m.phone && /* @__PURE__ */ jsxDEV(
                        "a",
                        {
                          href: `tel:${m.phone.replace(/\s/g, "")}`,
                          className: "block text-gray-700",
                          children: m.phone
                        },
                        void 0,
                        false,
                        {
                          fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                          lineNumber: 420,
                          columnNumber: 19
                        },
                        this
                      ),
                      /* @__PURE__ */ jsxDEV(
                        "a",
                        {
                          href: "#",
                          "aria-label": `${m.name} on LinkedIn`,
                          className: "inline-flex items-center gap-1 mt-2 text-blue-600 hover:text-blue-700",
                          children: [
                            /* @__PURE__ */ jsxDEV(FaLinkedin, { className: "h-5 w-5", "aria-hidden": "true" }, void 0, false, {
                              fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                              lineNumber: 432,
                              columnNumber: 25
                            }, this),
                            /* @__PURE__ */ jsxDEV("span", { className: "text-xs", children: "LinkedIn" }, void 0, false, {
                              fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                              lineNumber: 433,
                              columnNumber: 25
                            }, this)
                          ]
                        },
                        void 0,
                        true,
                        {
                          fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                          lineNumber: 427,
                          columnNumber: 23
                        },
                        this
                      )
                    ] }, void 0, true, {
                      fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                      lineNumber: 410,
                      columnNumber: 17
                    }, this)
                  ]
                },
                i,
                true,
                {
                  fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                  lineNumber: 388,
                  columnNumber: 15
                },
                this
              )
            )
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
            lineNumber: 380,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV(
          "button",
          {
            type: "button",
            onClick: () => scrollBy(1),
            "aria-label": "Next team member",
            className: "hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full w-10 h-10 items-center justify-center hover:bg-gray-100 transition",
            children: /* @__PURE__ */ jsxDEV(ChevronRight, { className: "h-5 w-5", "aria-hidden": "true" }, void 0, false, {
              fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
              lineNumber: 446,
              columnNumber: 15
            }, this)
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
            lineNumber: 440,
            columnNumber: 13
          },
          this
        )
      ] }, void 0, true, {
        fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
        lineNumber: 371,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
      lineNumber: 358,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
      lineNumber: 357,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV("section", { "aria-labelledby": "social-impact", className: "bg-gray-50 py-16 md:py-24", children: /* @__PURE__ */ jsxDEV("div", { className: "container mx-auto px-4 sm:px-6", children: [
      /* @__PURE__ */ jsxDEV("div", { className: "text-center mb-10", children: [
        /* @__PURE__ */ jsxDEV(
          "h2",
          {
            id: "social-impact",
            className: "text-3xl md:text-4xl font-bold mb-3 tracking-tight",
            children: "Our Social Impact"
          },
          void 0,
          false,
          {
            fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
            lineNumber: 456,
            columnNumber: 13
          },
          this
        ),
        /* @__PURE__ */ jsxDEV("p", { className: "max-w-2xl mx-auto text-gray-700", children: "Coconoto aligns with the UN Sustainable Development Goals (SDGs 5, 8 & 12), promoting gender equality, decent work, and responsible production." }, void 0, false, {
          fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
          lineNumber: 462,
          columnNumber: 13
        }, this)
      ] }, void 0, true, {
        fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
        lineNumber: 455,
        columnNumber: 11
      }, this),
      /* @__PURE__ */ jsxDEV("div", { className: "grid md:grid-cols-3 gap-6", children: SDG.map(
        (s) => /* @__PURE__ */ jsxDEV(
          "article",
          {
            className: "relative bg-white rounded-xl border border-gray-200 p-6",
            children: [
              /* @__PURE__ */ jsxDEV(CoconutIcon, { className: "absolute top-6 right-6 h-6 w-6" }, void 0, false, {
                fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                lineNumber: 474,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("h3", { className: "text-2xl font-bold mb-2", children: [
                "SDG ",
                s.code
              ] }, void 0, true, {
                fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                lineNumber: 475,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("p", { className: "font-semibold mb-4", children: s.title }, void 0, false, {
                fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                lineNumber: 476,
                columnNumber: 17
              }, this),
              /* @__PURE__ */ jsxDEV("ul", { className: "space-y-2 text-sm text-gray-700", children: s.bullets.map(
                (b, i) => /* @__PURE__ */ jsxDEV("li", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxDEV("span", { "aria-hidden": "true", className: "text-gray-400", children: "·" }, void 0, false, {
                    fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                    lineNumber: 480,
                    columnNumber: 23
                  }, this),
                  /* @__PURE__ */ jsxDEV("span", { children: b }, void 0, false, {
                    fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                    lineNumber: 483,
                    columnNumber: 23
                  }, this)
                ] }, i, true, {
                  fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                  lineNumber: 479,
                  columnNumber: 17
                }, this)
              ) }, void 0, false, {
                fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
                lineNumber: 477,
                columnNumber: 17
              }, this)
            ]
          },
          s.code,
          true,
          {
            fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
            lineNumber: 470,
            columnNumber: 13
          },
          this
        )
      ) }, void 0, false, {
        fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
        lineNumber: 468,
        columnNumber: 11
      }, this)
    ] }, void 0, true, {
      fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
      lineNumber: 454,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
      lineNumber: 453,
      columnNumber: 7
    }, this),
    /* @__PURE__ */ jsxDEV(
      WaitlistModal,
      {
        isOpen: waitlistOpen,
        onClose: () => setWaitlistOpen(false)
      },
      void 0,
      false,
      {
        fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
        lineNumber: 493,
        columnNumber: 7
      },
      this
    )
  ] }, void 0, true, {
    fileName: "C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx",
    lineNumber: 169,
    columnNumber: 5
  }, this);
}
_s(About, "+IqCP9c+1F558nMCaOP1Isz3Tx4=");
_c2 = About;
var _c, _c2;
$RefreshReg$(_c, "CoconutIcon");
$RefreshReg$(_c2, "About");
if (import.meta.hot && !inWebWorker) {
  window.$RefreshReg$ = prevRefreshReg;
  window.$RefreshSig$ = prevRefreshSig;
}
if (import.meta.hot && !inWebWorker) {
  RefreshRuntime.__hmr_import(import.meta.url).then((currentExports) => {
    RefreshRuntime.registerExportsForReactRefresh("C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx", currentExports);
    import.meta.hot.accept((nextExports) => {
      if (!nextExports) return;
      const invalidateMessage = RefreshRuntime.validateRefreshBoundaryAndEnqueueUpdate("C:/Users/ENOCH/Documents/GitHub/coconoto_b2b2c/src/components/About.tsx", currentExports, nextExports);
      if (invalidateMessage) import.meta.hot.invalidate(invalidateMessage);
    });
  });
}

//# sourceMappingURL=data:application/json;base64,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aHQiLCJMZWFmIiwiQ2hlY2siLCJGYUxpbmtlZGluIiwiV2FpdGxpc3RNb2RhbCIsImhlcm9CZyIsInN0b3J5VmlkZW8iLCJtaXNzaW9uSGFuZCIsInZpc2lvbkNvY29hIiwicG9ydHJhaXQxIiwicG9ydHJhaXQyIiwicG9ydHJhaXQzIiwicG9ydHJhaXQ0IiwiTUlTU0lPTl9CVUxMRVRTIiwiVklTSU9OX0JVTExFVFMiLCJXSEFUX1dFX0RPIiwibiIsInRpdGxlIiwiZGVzYyIsImJ1bGxldHMiLCJURUFNIiwibmFtZSIsInJvbGUiLCJpbWciLCJmZWF0dXJlZCIsImVtYWlsIiwicGhvbmUiLCJTREciLCJjb2RlIiwiQ29jb251dEljb24iLCJjbGFzc05hbWUiLCJfYyIsIkFib3V0IiwiX3MiLCJ3YWl0bGlzdE9wZW4iLCJzZXRXYWl0bGlzdE9wZW4iLCJjYXJvdXNlbFJlZiIsInNjcm9sbEJ5IiwiZGlyIiwiY3VycmVudCIsImxlZnQiLCJiZWhhdmlvciIsImJhY2tncm91bmRJbWFnZSIsIm1hcCIsImIiLCJpIiwiY2FyZCIsInNjcm9sbGJhcldpZHRoIiwibSIsImpvaW4iLCJyZXBsYWNlIiwicyIsIl9jMiIsIiRSZWZyZXNoUmVnJCJdLCJpZ25vcmVMaXN0IjpbXSwic291cmNlcyI6WyJBYm91dC50c3giXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0LCB7IHVzZVJlZiwgdXNlU3RhdGUgfSBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IFBsYXksIENoZXZyb25MZWZ0LCBDaGV2cm9uUmlnaHQsIExlYWYsIENoZWNrIH0gZnJvbSAnbHVjaWRlLXJlYWN0JztcclxuaW1wb3J0IHsgRmFMaW5rZWRpbiB9IGZyb20gJ3JlYWN0LWljb25zL2ZhJztcclxuaW1wb3J0IHsgV2FpdGxpc3RNb2RhbCB9IGZyb20gJy4vV2FpdGxpc3RNb2RhbCc7XHJcblxyXG5pbXBvcnQgaGVyb0JnIGZyb20gJy4uL2Fzc2V0cy9hYm91dC9oZXJvLWJnLmpwZyc7XHJcbmltcG9ydCBzdG9yeVZpZGVvIGZyb20gJy4uL2Fzc2V0cy9hYm91dC9zdG9yeS12aWRlby5qcGcnO1xyXG5pbXBvcnQgbWlzc2lvbkhhbmQgZnJvbSAnLi4vYXNzZXRzL2Fib3V0L21pc3Npb24taGFuZC5qcGcnO1xyXG5pbXBvcnQgdmlzaW9uQ29jb2EgZnJvbSAnLi4vYXNzZXRzL2Fib3V0L3Zpc2lvbi1jb2NvYS5qcGcnO1xyXG5pbXBvcnQgcG9ydHJhaXQxIGZyb20gJy4uL2Fzc2V0cy9hYm91dC9wb3J0cmFpdC0xLmpwZyc7XHJcbmltcG9ydCBwb3J0cmFpdDIgZnJvbSAnLi4vYXNzZXRzL2Fib3V0L3BvcnRyYWl0LTIuanBnJztcclxuaW1wb3J0IHBvcnRyYWl0MyBmcm9tICcuLi9hc3NldHMvYWJvdXQvcG9ydHJhaXQtMy5qcGcnO1xyXG5pbXBvcnQgcG9ydHJhaXQ0IGZyb20gJy4uL2Fzc2V0cy9hYm91dC9wb3J0cmFpdC00LmpwZyc7XHJcblxyXG5jb25zdCBNSVNTSU9OX0JVTExFVFMgPSBbXHJcbiAgJ0VtcG93ZXIgRmFybWVycyB3aXRoIHRlY2hub2xvZ3ksIG1hcmtldHMsIGZhaXIgcHJpY2luZywgYW5kIG5ldyBpbmNvbWUgb3Bwb3J0dW5pdGllcyBmcm9tIGNvY29udXRzIGFuZCB0aGVpciBieS1wcm9kdWN0cy4nLFxyXG4gICdHZW5lcmF0ZSBkZWNlbnQgZW1wbG95bWVudCBhbmQgZW50cmVwcmVuZXVyc2hpcCBvcHBvcnR1bml0aWVzIGFjcm9zcyB0aGUgY29jb251dCB2YWx1ZSBjaGFpbi4nLFxyXG4gICdUdXJuIGNvY29udXQgd2FzdGUgaW50byB2YWx1YWJsZSwgZWNvLWZyaWVuZGx5IHByb2R1Y3RzIHdoaWxlIHJlZHVjaW5nIHBvbGx1dGlvbiBhbmQgbGFuZGZpbGwgd2FzdGUuJyxcclxuXTtcclxuXHJcbmNvbnN0IFZJU0lPTl9CVUxMRVRTID0gW1xyXG4gICdGYXJtZXJzIFByb3NwZXIgYnkgYmVuZWZpdGluZyBmcm9tIGZhaXIgcHJpY2VzLCBtb2Rlcm4gdGVjaG5vbG9neSwgYW5kIGltcHJvdmVkIG1hcmtldCBhY2Nlc3MuJyxcclxuICAnTG9jYWwgY29tbXVuaXRpZXMgYmVuZWZpdCBmcm9tIGpvYiBjcmVhdGlvbiwgZW50cmVwcmVuZXVyc2hpcCwgYW5kIHN1c3RhaW5hYmxlIGVjb25vbWljIGRldmVsb3BtZW50LicsXHJcbiAgJ0NvY29udXQgd2FzdGUgYmVjb21lcyBXZWFsdGggYW5kIGJ5LXByb2R1Y3RzIGFyZSB0cmFuc2Zvcm1lZCBpbnRvIHZhbHVhYmxlIHJlc291cmNlcyBhbmQgaW5ub3ZhdGl2ZSBwcm9kdWN0cy4nLFxyXG5dO1xyXG5cclxuY29uc3QgV0hBVF9XRV9ETyA9IFtcclxuICB7XHJcbiAgICBuOiAnMDEnLFxyXG4gICAgdGl0bGU6ICdDb2NvLVRlY2gnLFxyXG4gICAgZGVzYzogJ1dlIGRlc2lnbiwgZmFicmljYXRlLCBhbmQgc2VsbCBpbm5vdmF0aXZlIGNvY29udXQgcHJvY2Vzc2luZyBtYWNoaW5lcyBmb3IgdGhlIGVudGlyZSB2YWx1ZSBjaGFpbi4gT3VyIE1hY2hpbmVzOicsXHJcbiAgICBidWxsZXRzOiBbXHJcbiAgICAgICdEZWh1c2tpbmcgTWFjaGluZSAoNTAw4oCTOTAwIG51dHMvaHIpJyxcclxuICAgICAgJ0Rlc2hlbGxpbmcgTWFjaGluZSAoMjQw4oCTNDAwIG51dHMvaHIpJyxcclxuICAgICAgJ0RlY29ydGljYXRvciAoU2VwYXJhdGVzIGNvY29wZWF0IGZyb20gaHVzayknLFxyXG4gICAgICAnQ29jb251dCBNaWxrIEV4dHJhY3RvciAoQXV0b21hdGljICYgTWFudWFsKScsXHJcbiAgICBdLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgbjogJzAyJyxcclxuICAgIHRpdGxlOiAnQ29jby1Db25uZWN0JyxcclxuICAgIGRlc2M6ICdPdXIgZGlnaXRhbCBtYXJrZXRwbGFjZSBpcyBhIEIyQjJDIHBsYXRmb3JtIHRoYXQgY29ubmVjdHMgZmFybWVycywgcHJvY2Vzc29ycywgc3VwcGxpZXJzLCBhbmQgYnV5ZXJzIGNyZWF0aW5nIGEgb25lLXN0b3AgZWNvc3lzdGVtIGZvciBldmVyeXRoaW5nIGNvY29udXQuIFdlIEFjdCBhcyBhIEZhY2lsaXRhdG9yOicsXHJcbiAgICBidWxsZXRzOiBbXHJcbiAgICAgICdFbmFibGUgZGlyZWN0IGJ1eWVyLXNlbGxlciBwYXJ0bmVyc2hpcHMnLFxyXG4gICAgICAnRW5zdXJlIGRpcmVjdCBzZWxsZXIgcmVsYXRpb25zaGlwcycsXHJcbiAgICAgICdQcm92aWRlIHZlcmlmaWVkIGJ1c2luZXNzIG5ldHdvcmsnLFxyXG4gICAgXSxcclxuICB9LFxyXG4gIHtcclxuICAgIG46ICcwMycsXHJcbiAgICB0aXRsZTogJ0NvY3ljbGUgSHViJyxcclxuICAgIGRlc2M6ICdXZSBjb252ZXJ0IGNvY29udXQgd2FzdGUgaW50byB2YWx1YWJsZSBwcm9kdWN0cywgZW1wb3dlcmluZyB3b21lbiBhbmQgbWVuIHdoaWxlIHByb21vdGluZyBzdXN0YWluYWJsZSBhZ3JpY3VsdHVyZS4nLFxyXG4gICAgYnVsbGV0czogW1xyXG4gICAgICAnQ29jb3BlYXQgZm9yIHNvaWxsZXNzIGZhcm1pbmcnLFxyXG4gICAgICAnQ29jb251dCBmaWJlciBmb3IgY3JhZnRzJyxcclxuICAgICAgJ0NvY29wb3QgZm9yIGhvbWVzICYgb2ZmaWNlcycsXHJcbiAgICAgICdCcmlxdWV0dGUgY2hhcmNvYWwnLFxyXG4gICAgXSxcclxuICB9LFxyXG4gIHtcclxuICAgIG46ICcwNCcsXHJcbiAgICB0aXRsZTogJ0NvY28gRHJpbmtFYXQnLFxyXG4gICAgZGVzYzogJ1dlIGJyaW5nIHRoZSB1bHRpbWF0ZSBjb2NvbnV0IGV4cGVyaWVuY2UgdG8geW91ciBldmVudHMgZnJlc2ggcHJlLWN1dCBjb2NvbnV0cyByZWFkeSB0byBkcmluayBhbmQgZWF0IG9uIHRoZSBzcG90LiBFdmVudCBTZXJ2aWNlczonLFxyXG4gICAgYnVsbGV0czogW1xyXG4gICAgICAnRnJlc2gtY3V0IGNvY29udXRzIGF0IHlvdXIgdmVudWUnLFxyXG4gICAgICAnRHJpbmsgY29jb251dCB3YXRlciBvbiB0aGUgc3BvdCcsXHJcbiAgICAgICdDdXN0b20gYnJhbmRlZCBzZXJ2aW5nIHN0YXRpb25zJyxcclxuICAgIF0sXHJcbiAgfSxcclxuXTtcclxuXHJcbmludGVyZmFjZSBUZWFtTWVtYmVyIHtcclxuICBuYW1lOiBzdHJpbmc7XHJcbiAgcm9sZTogc3RyaW5nO1xyXG4gIGltZzogc3RyaW5nO1xyXG4gIGZlYXR1cmVkPzogYm9vbGVhbjtcclxuICBlbWFpbD86IHN0cmluZztcclxuICBwaG9uZT86IHN0cmluZztcclxufVxyXG5cclxuY29uc3QgVEVBTTogVGVhbU1lbWJlcltdID0gW1xyXG4gIHsgbmFtZTogJ0FkZXN1d2EgT2pvJywgcm9sZTogJ09wZXJhdGlvbnMgTGVhZCcsIGltZzogcG9ydHJhaXQxIH0sXHJcbiAgeyBuYW1lOiAnRU5PQ0ggQmFtaWdib3llJywgcm9sZTogJ1NvZnR3YXJlIEVuZ2luZWVyJywgaW1nOiBwb3J0cmFpdDIgfSxcclxuICB7XHJcbiAgICBuYW1lOiAnSmFjb2IgTy4gQWJpb2R1bicsXHJcbiAgICByb2xlOiAnRm91bmRlciAvIENFTycsXHJcbiAgICBpbWc6IHBvcnRyYWl0MyxcclxuICAgIGZlYXR1cmVkOiB0cnVlLFxyXG4gICAgZW1haWw6ICdCb25nb2VxQGV4YW1wbGUuY29tJyxcclxuICAgIHBob25lOiAnKzIzMyA0NSA2NzggMDk3MicsXHJcbiAgfSxcclxuICB7IG5hbWU6ICdLZWhpbmRlIE9tb3RveWluJywgcm9sZTogJ0ZpbmFuY2UgTWFuYWdlcicsIGltZzogcG9ydHJhaXQ0IH0sXHJcbiAgeyBuYW1lOiAnVHVuZGUgQmFrYXJlJywgcm9sZTogJ0Fncm9ub21pc3QnLCBpbWc6IHBvcnRyYWl0MyB9LFxyXG5dO1xyXG5cclxuY29uc3QgU0RHID0gW1xyXG4gIHtcclxuICAgIGNvZGU6ICc1JyxcclxuICAgIHRpdGxlOiAnR2VuZGVyIEVxdWFsaXR5JyxcclxuICAgIGJ1bGxldHM6IFtcclxuICAgICAgJ0VtcGxveSBtb3JlIHdvbWVuJyxcclxuICAgICAgJ0ludGVncmF0ZSB3b21lbiBpbnRvIHZhbHVlIGNoYWluJyxcclxuICAgICAgJ0ltcHJvdmUgcGVyZm9ybWFuY2Ugb2YgbWVuIGluIHRoZSBpbmR1c3RyeScsXHJcbiAgICBdLFxyXG4gIH0sXHJcbiAge1xyXG4gICAgY29kZTogJzgnLFxyXG4gICAgdGl0bGU6ICdEZWNlbnQgV29yaycsXHJcbiAgICBidWxsZXRzOiBbXHJcbiAgICAgICdDcmVhdGUgbW9yZSBkZWNlbnQgam9icycsXHJcbiAgICAgICdDb250cmlidXRlIHRvIGNvY29udXQgaW5kdXN0cnkgZ3Jvd3RoJyxcclxuICAgICAgJ0FjY2VzcyB0byBkaWdpdGFsIG1hcmtldHBsYWNlJyxcclxuICAgIF0sXHJcbiAgfSxcclxuICB7XHJcbiAgICBjb2RlOiAnMTInLFxyXG4gICAgdGl0bGU6ICdSZXNwb25zaWJsZSBwcm9kdWN0aW9uJyxcclxuICAgIGJ1bGxldHM6IFtcclxuICAgICAgJ0ltcHJvdmUgcHJvZHVjdGlvbiB0byByZWR1Y2Ugd2FzdGUnLFxyXG4gICAgICAnUHJvbW90ZSBjaXJjdWxhcml0eScsXHJcbiAgICAgICdJbmNyZWFzZSByZXZlbnVlIGJ5IDIwJScsXHJcbiAgICBdLFxyXG4gIH0sXHJcbl07XHJcblxyXG5mdW5jdGlvbiBDb2NvbnV0SWNvbih7IGNsYXNzTmFtZSB9OiB7IGNsYXNzTmFtZT86IHN0cmluZyB9KSB7XHJcbiAgcmV0dXJuIChcclxuICAgIDxzdmdcclxuICAgICAgdmlld0JveD1cIjAgMCAyNCAyNFwiXHJcbiAgICAgIGNsYXNzTmFtZT17Y2xhc3NOYW1lfVxyXG4gICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxyXG4gICAgICByb2xlPVwiaW1nXCJcclxuICAgID5cclxuICAgICAgPGNpcmNsZSBjeD1cIjEyXCIgY3k9XCIxM1wiIHI9XCI4LjVcIiBmaWxsPVwiIzVkM2ExZlwiIC8+XHJcbiAgICAgIDxlbGxpcHNlIGN4PVwiMTJcIiBjeT1cIjEzXCIgcng9XCI1LjVcIiByeT1cIjQuNVwiIGZpbGw9XCIjZjhlZmUxXCIgLz5cclxuICAgICAgPGVsbGlwc2UgY3g9XCIxMlwiIGN5PVwiMTNcIiByeD1cIjQuNVwiIHJ5PVwiMy41XCIgZmlsbD1cIiNmZmY3ZWFcIiAvPlxyXG4gICAgPC9zdmc+XHJcbiAgKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIEFib3V0KCkge1xyXG4gIGNvbnN0IFt3YWl0bGlzdE9wZW4sIHNldFdhaXRsaXN0T3Blbl0gPSB1c2VTdGF0ZShmYWxzZSk7XHJcbiAgY29uc3QgY2Fyb3VzZWxSZWYgPSB1c2VSZWY8SFRNTERpdkVsZW1lbnQ+KG51bGwpO1xyXG5cclxuICBjb25zdCBzY3JvbGxCeSA9IChkaXI6IG51bWJlcikgPT4ge1xyXG4gICAgY2Fyb3VzZWxSZWYuY3VycmVudD8uc2Nyb2xsQnkoeyBsZWZ0OiBkaXIgKiAzMjAsIGJlaGF2aW9yOiAnc21vb3RoJyB9KTtcclxuICB9O1xyXG5cclxuICByZXR1cm4gKFxyXG4gICAgPGRpdiBjbGFzc05hbWU9XCJiZy13aGl0ZVwiPlxyXG4gICAgICB7LyogSEVSTyAqL31cclxuICAgICAgPHNlY3Rpb25cclxuICAgICAgICBhcmlhLWxhYmVsbGVkYnk9XCJhYm91dC1oZXJvLWhlYWRpbmdcIlxyXG4gICAgICAgIGNsYXNzTmFtZT1cInJlbGF0aXZlIGJnLWNvdmVyIGJnLWNlbnRlclwiXHJcbiAgICAgICAgc3R5bGU9e3tcclxuICAgICAgICAgIGJhY2tncm91bmRJbWFnZTogYGxpbmVhci1ncmFkaWVudChyZ2JhKDAsMCwwLDAuMzApLCByZ2JhKDAsMCwwLDAuMzApKSwgdXJsKCR7aGVyb0JnfSlgLFxyXG4gICAgICAgIH19XHJcbiAgICAgID5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lciBteC1hdXRvIHB4LTQgc206cHgtNiBwdC0zNiBwYi0zMiB0ZXh0LWNlbnRlciB0ZXh0LXdoaXRlXCI+XHJcbiAgICAgICAgICA8aDFcclxuICAgICAgICAgICAgaWQ9XCJhYm91dC1oZXJvLWhlYWRpbmdcIlxyXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LTR4bCBtZDp0ZXh0LTV4bCBsZzp0ZXh0LTZ4bCBmb250LWJvbGQgbWItNiB0cmFja2luZy10aWdodFwiXHJcbiAgICAgICAgICA+XHJcbiAgICAgICAgICAgIEFib3V0IFVzXHJcbiAgICAgICAgICA8L2gxPlxyXG4gICAgICAgICAgPHAgY2xhc3NOYW1lPVwibWF4LXctMnhsIG14LWF1dG8gdGV4dC1iYXNlIG1kOnRleHQtbGcgbGVhZGluZy1yZWxheGVkIG1iLThcIj5cclxuICAgICAgICAgICAgQ29jb25vdG8gaXMgYSBTbWFydCBBZ3JpdGVjaCBjb21wYW55IGZvY3VzZWQgb24gY3JlYXRpbmcgdGVjaG5vbG9neSxcclxuICAgICAgICAgICAgYWNjZXNzaWJpbGl0eSwgYW5kIHN1c3RhaW5hYmlsaXR5IGFjcm9zcyB0aGUgY29jb251dCB2YWx1ZSBjaGFpbi4gV2VcclxuICAgICAgICAgICAgbGV2ZXJhZ2UgaW5ub3ZhdGl2ZSBkaWdpdGFsIHNvbHV0aW9ucyB0byBhZGRyZXNzIGNoYWxsZW5nZXMgaW4gY29jb251dFxyXG4gICAgICAgICAgICBwcm9kdWN0aW9uLCBwcm9jZXNzaW5nLCBkaXN0cmlidXRpb24sIGFuZCBtYXJrZXQgYWNjZXNzLCB3aGlsZVxyXG4gICAgICAgICAgICBlbXBvd2VyaW5nIGZhcm1lcnMgd2l0aCBiZXR0ZXIgaW5mb3JtYXRpb24sIHRvb2xzLCBhbmQgb3Bwb3J0dW5pdGllcy5cclxuICAgICAgICAgIDwvcD5cclxuICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHNldFdhaXRsaXN0T3Blbih0cnVlKX1cclxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiYmctZ3JlZW4tNjAwIGhvdmVyOmJnLWdyZWVuLTcwMCB0ZXh0LXdoaXRlIGZvbnQtbWVkaXVtIHB4LTggcHktMyByb3VuZGVkLWxnIHRyYW5zaXRpb24gZm9jdXM6b3V0bGluZS1ub25lIGZvY3VzOnJpbmctMiBmb2N1czpyaW5nLWdyZWVuLTUwMCBmb2N1czpyaW5nLW9mZnNldC0yXCJcclxuICAgICAgICAgID5cclxuICAgICAgICAgICAgUmVnaXN0ZXIgbm93XHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9zZWN0aW9uPlxyXG5cclxuICAgICAgey8qIE9VUiBTVE9SWSAqL31cclxuICAgICAgPHNlY3Rpb24gYXJpYS1sYWJlbGxlZGJ5PVwib3VyLXN0b3J5XCIgY2xhc3NOYW1lPVwiYmctd2hpdGUgcHktMTYgbWQ6cHktMjRcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lciBteC1hdXRvIHB4LTQgc206cHgtNiBncmlkIG1kOmdyaWQtY29scy0yIGdhcC0xMCBtZDpnYXAtMTYgaXRlbXMtY2VudGVyXCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJlbGF0aXZlXCI+XHJcbiAgICAgICAgICAgIDxpbWdcclxuICAgICAgICAgICAgICBzcmM9e3N0b3J5VmlkZW99XHJcbiAgICAgICAgICAgICAgYWx0PVwiQ29jb25vdG8gdGVhbSByZWNvcmRpbmcgdGhlIGNvbXBhbnkgc3RvcnlcIlxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCByb3VuZGVkLWxnIG9iamVjdC1jb3ZlciBhc3BlY3QtWzQvM11cIlxyXG4gICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIlBsYXkgc3RvcnkgdmlkZW9cIlxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImFic29sdXRlIGluc2V0LTAgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgZ3JvdXBcIlxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiYmctd2hpdGUvOTAgZ3JvdXAtaG92ZXI6Ymctd2hpdGUgcm91bmRlZC1mdWxsIHAtNCBzaGFkb3ctbGcgdHJhbnNpdGlvblwiPlxyXG4gICAgICAgICAgICAgICAgPFBsYXkgY2xhc3NOYW1lPVwiaC04IHctOCB0ZXh0LWdyZWVuLTcwMCBmaWxsLWN1cnJlbnRcIiAvPlxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxoMlxyXG4gICAgICAgICAgICAgIGlkPVwib3VyLXN0b3J5XCJcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LTN4bCBtZDp0ZXh0LTR4bCBmb250LWJvbGQgbWItNCB0cmFja2luZy10aWdodFwiXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICBPdXIgU1RPUllcclxuICAgICAgICAgICAgPC9oMj5cclxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1ncmF5LTcwMCBsZWFkaW5nLXJlbGF4ZWRcIj5cclxuICAgICAgICAgICAgICBCb3JuIG91dCBvZiB0aGUgbmVlZCB0byB0YWNrbGUgd2FzdGUgYW5kIGluZWZmaWNpZW5jeSBpbiB0aGUgY29jb251dFxyXG4gICAgICAgICAgICAgIGluZHVzdHJ5LCBDb2Nvbm90byBiZWdhbiBhcyBhIHZpc2lvbiB0byBtZXJnZSBzdXN0YWluYWJpbGl0eSB3aXRoXHJcbiAgICAgICAgICAgICAgdGVjaG5vbG9neS4gV2hhdCBzdGFydGVkIGFzIGEgc2ltcGxlIG9ic2VydmF0aW9uIHNlZWluZyB0b25zIG9mXHJcbiAgICAgICAgICAgICAgY29jb251dCB3YXN0ZSBlbmRpbmcgdXAgaW4gbGFuZGZpbGxzIGFuZCByZWxlYXNpbmcgaGFybWZ1bCBjYXJib25cclxuICAgICAgICAgICAgICBiZWNhbWUgYSBtaXNzaW9uIHRvIHRyYW5zZm9ybSB0aGUgZW50aXJlIGNvY29udXQgdmFsdWUgY2hhaW4uXHJcbiAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L3NlY3Rpb24+XHJcblxyXG4gICAgICB7LyogT1VSIE1JU1NJT04gKi99XHJcbiAgICAgIDxzZWN0aW9uIGFyaWEtbGFiZWxsZWRieT1cIm91ci1taXNzaW9uXCIgY2xhc3NOYW1lPVwiYmctZ3JheS01MCBweS0xNiBtZDpweS0yNFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyIG14LWF1dG8gcHgtNCBzbTpweC02IGdyaWQgbWQ6Z3JpZC1jb2xzLTIgZ2FwLTEwIG1kOmdhcC0xNiBpdGVtcy1jZW50ZXJcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItMiBtZDpvcmRlci0xXCI+XHJcbiAgICAgICAgICAgIDxoMlxyXG4gICAgICAgICAgICAgIGlkPVwib3VyLW1pc3Npb25cIlxyXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cInRleHQtM3hsIG1kOnRleHQtNHhsIGZvbnQtYm9sZCBtYi00IHRyYWNraW5nLXRpZ2h0XCJcclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIE91ciBNaXNzaW9uXHJcbiAgICAgICAgICAgIDwvaDI+XHJcbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtZ3JheS03MDAgbGVhZGluZy1yZWxheGVkIG1iLTZcIj5cclxuICAgICAgICAgICAgICBXZSBhcmUgY29tbWl0dGVkIHRvIGJ1aWxkaW5nIGEgdGVjaG5vbG9neS1lbmFibGVkIGNvY29udXQgZWNvbm9teSB0aGF0XHJcbiAgICAgICAgICAgICAgaW1wcm92ZXMgbGl2ZWxpaG9vZHMsIGVudmlyb25tZW50YWwgc3VzdGFpbmFiaWxpdHkgJmFtcDsgY3JlYXRlc1xyXG4gICAgICAgICAgICAgIG9wcG9ydHVuaXRpZXMuIFRocm91Z2ggaW5ub3ZhdGlvbiBhbmQgaW5jbHVzaXZlIHNvbHV0aW9ucywgd2UgYWltIHRvOlxyXG4gICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJzcGFjZS15LTNcIj5cclxuICAgICAgICAgICAgICB7TUlTU0lPTl9CVUxMRVRTLm1hcCgoYiwgaSkgPT4gKFxyXG4gICAgICAgICAgICAgICAgPGxpIGtleT17aX0gY2xhc3NOYW1lPVwiZmxleCBnYXAtMyB0ZXh0LWdyYXktNzAwXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxMZWFmXHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaC01IHctNSB0ZXh0LWdyZWVuLTYwMCBzaHJpbmstMCBtdC0wLjVcIlxyXG4gICAgICAgICAgICAgICAgICAgIGFyaWEtaGlkZGVuPVwidHJ1ZVwiXHJcbiAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuPntifTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwib3JkZXItMSBtZDpvcmRlci0yXCI+XHJcbiAgICAgICAgICAgIDxpbWdcclxuICAgICAgICAgICAgICBzcmM9e21pc3Npb25IYW5kfVxyXG4gICAgICAgICAgICAgIGFsdD1cIkZhcm1lciB0ZW5kaW5nIHRvIGNvY29udXQgc2VlZGxpbmdzXCJcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ3LWZ1bGwgcm91bmRlZC1sZyBvYmplY3QtY292ZXIgYXNwZWN0LVs0LzNdXCJcclxuICAgICAgICAgICAgLz5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L3NlY3Rpb24+XHJcblxyXG4gICAgICB7LyogT1VSIFZJU0lPTiAqL31cclxuICAgICAgPHNlY3Rpb24gYXJpYS1sYWJlbGxlZGJ5PVwib3VyLXZpc2lvblwiIGNsYXNzTmFtZT1cImJnLXdoaXRlIHB5LTE2IG1kOnB5LTI0XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXIgbXgtYXV0byBweC00IHNtOnB4LTYgZ3JpZCBtZDpncmlkLWNvbHMtMiBnYXAtMTAgbWQ6Z2FwLTE2IGl0ZW1zLWNlbnRlclwiPlxyXG4gICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPGltZ1xyXG4gICAgICAgICAgICAgIHNyYz17dmlzaW9uQ29jb2F9XHJcbiAgICAgICAgICAgICAgYWx0PVwiSGFuZHMgaG9sZGluZyBjb2NvYSBiZWFuc1wiXHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIHJvdW5kZWQtbGcgb2JqZWN0LWNvdmVyIGFzcGVjdC1bNC8zXVwiXHJcbiAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxoMlxyXG4gICAgICAgICAgICAgIGlkPVwib3VyLXZpc2lvblwiXHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC0zeGwgbWQ6dGV4dC00eGwgZm9udC1ib2xkIG1iLTQgdHJhY2tpbmctdGlnaHRcIlxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgT3VyIFZpc2lvblxyXG4gICAgICAgICAgICA8L2gyPlxyXG4gICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJ0ZXh0LWdyYXktNzAwIGxlYWRpbmctcmVsYXhlZCBtYi02XCI+XHJcbiAgICAgICAgICAgICAgT3VyIHZpc2lvbiBpcyB0byBjcmVhdGUgYSBzdXN0YWluYWJsZSwgcHJvZml0YWJsZSwgYW5kIGluY2x1c2l2ZVxyXG4gICAgICAgICAgICAgIGNvY29udXQgZWNvc3lzdGVtIHRoYXQgZHJpdmVzIGVjb25vbWljIGdyb3d0aCBhbmQgZW52aXJvbm1lbnRhbFxyXG4gICAgICAgICAgICAgIGltcGFjdCBhY3Jvc3MgQWZyaWNhLiBXZSBlbnZpc2lvbiBhIGZ1dHVyZSB3aGVyZTpcclxuICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwic3BhY2UteS0zXCI+XHJcbiAgICAgICAgICAgICAge1ZJU0lPTl9CVUxMRVRTLm1hcCgoYiwgaSkgPT4gKFxyXG4gICAgICAgICAgICAgICAgPGxpIGtleT17aX0gY2xhc3NOYW1lPVwiZmxleCBnYXAtMyB0ZXh0LWdyYXktNzAwXCI+XHJcbiAgICAgICAgICAgICAgICAgIDxDb2NvbnV0SWNvbiBjbGFzc05hbWU9XCJoLTUgdy01IHNocmluay0wIG10LTAuNVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgIDxzcGFuPntifTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9zZWN0aW9uPlxyXG5cclxuICAgICAgey8qIFdIQVQgV0UgRE8gKi99XHJcbiAgICAgIDxzZWN0aW9uIGFyaWEtbGFiZWxsZWRieT1cIndoYXQtd2UtZG9cIiBjbGFzc05hbWU9XCJiZy1ncmF5LTUwIHB5LTE2IG1kOnB5LTI0XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXIgbXgtYXV0byBweC00IHNtOnB4LTZcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgbWItMTJcIj5cclxuICAgICAgICAgICAgPGgyXHJcbiAgICAgICAgICAgICAgaWQ9XCJ3aGF0LXdlLWRvXCJcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LTN4bCBtZDp0ZXh0LTR4bCBmb250LWJvbGQgbWItMyB0cmFja2luZy10aWdodFwiXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICBXaGF0IHdlIGRvXHJcbiAgICAgICAgICAgIDwvaDI+XHJcbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm1heC13LTJ4bCBteC1hdXRvIHRleHQtZ3JheS03MDBcIj5cclxuICAgICAgICAgICAgICBXZSBsZXZlcmFnZSB0ZWNobm9sb2d5IGFuZCBzdXN0YWluYWJsZSBwcmFjdGljZXMgdG8gdHJhbnNmb3JtIHRoZVxyXG4gICAgICAgICAgICAgIGNvY29udXQgdmFsdWUgY2hhaW4gZnJvbSBwcm9kdWN0aW9uIGFuZCBwcm9jZXNzaW5nIHRvIGRpc3RyaWJ1dGlvblxyXG4gICAgICAgICAgICAgIGFuZCBtYXJrZXQgYWNjZXNzLlxyXG4gICAgICAgICAgICA8L3A+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ3JpZCBtZDpncmlkLWNvbHMtMiBnYXAtNiBtZDpnYXAtOFwiPlxyXG4gICAgICAgICAgICB7V0hBVF9XRV9ETy5tYXAoKGNhcmQpID0+IChcclxuICAgICAgICAgICAgICA8YXJ0aWNsZVxyXG4gICAgICAgICAgICAgICAga2V5PXtjYXJkLm59XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyZWxhdGl2ZSBiZy1hbWJlci05MDAgdGV4dC13aGl0ZSByb3VuZGVkLTJ4bCBwLTggc2hhZG93LW1kXCJcclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImFic29sdXRlIC10b3AtNSBsZWZ0LTggYmctd2hpdGUgdGV4dC1hbWJlci05MDAgZm9udC1ib2xkIHJvdW5kZWQtZnVsbCB3LTEyIGgtMTIgZmxleCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgdGV4dC1sZyBzaGFkb3dcIj5cclxuICAgICAgICAgICAgICAgICAge2NhcmQubn1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGgzIGNsYXNzTmFtZT1cInRleHQtMnhsIGZvbnQtYm9sZCBtYi0zIG10LTJcIj57Y2FyZC50aXRsZX08L2gzPlxyXG4gICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwidGV4dC1hbWJlci0xMDAgbWItNCBsZWFkaW5nLXJlbGF4ZWRcIj5cclxuICAgICAgICAgICAgICAgICAge2NhcmQuZGVzY31cclxuICAgICAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzc05hbWU9XCJzcGFjZS15LTIgdGV4dC1hbWJlci01MFwiPlxyXG4gICAgICAgICAgICAgICAgICB7Y2FyZC5idWxsZXRzLm1hcCgoYiwgaSkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e2l9IGNsYXNzTmFtZT1cImZsZXggZ2FwLTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxDaGVja1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJoLTQgdy00IG10LTEgc2hyaW5rLTBcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWhpZGRlbj1cInRydWVcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPntifTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgICApKX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L3NlY3Rpb24+XHJcblxyXG4gICAgICB7LyogTUVFVCBUSEUgVEVBTSAqL31cclxuICAgICAgPHNlY3Rpb24gYXJpYS1sYWJlbGxlZGJ5PVwibWVldC10aGUtdGVhbVwiIGNsYXNzTmFtZT1cImJnLXdoaXRlIHB5LTE2IG1kOnB5LTI0XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXIgbXgtYXV0byBweC00IHNtOnB4LTZcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgbWItMTBcIj5cclxuICAgICAgICAgICAgPGgyXHJcbiAgICAgICAgICAgICAgaWQ9XCJtZWV0LXRoZS10ZWFtXCJcclxuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJ0ZXh0LTN4bCBtZDp0ZXh0LTR4bCBmb250LWJvbGQgbWItMyB0cmFja2luZy10aWdodFwiXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICBNZWV0IHRoZSBUZWFtXHJcbiAgICAgICAgICAgIDwvaDI+XHJcbiAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cIm1heC13LTJ4bCBteC1hdXRvIHRleHQtZ3JheS03MDBcIj5cclxuICAgICAgICAgICAgICBNZWV0IG91ciB0ZWFtIG9mIGRlZGljYXRlZCBtZW1iZXJzIHdobyBhcmUgY29tbWl0dGVkIHRvIGRyaXZpbmcgdGhlXHJcbiAgICAgICAgICAgICAgZGV2ZWxvcG1lbnQgb2YgQ29jb25vdG8uXHJcbiAgICAgICAgICAgIDwvcD5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyZWxhdGl2ZVwiPlxyXG4gICAgICAgICAgICA8YnV0dG9uXHJcbiAgICAgICAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gc2Nyb2xsQnkoLTEpfVxyXG4gICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJQcmV2aW91cyB0ZWFtIG1lbWJlclwiXHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaGlkZGVuIG1kOmZsZXggYWJzb2x1dGUgLWxlZnQtNCB0b3AtMS8yIC10cmFuc2xhdGUteS0xLzIgei0xMCBiZy13aGl0ZSBzaGFkb3ctbGcgcm91bmRlZC1mdWxsIHctMTAgaC0xMCBpdGVtcy1jZW50ZXIganVzdGlmeS1jZW50ZXIgaG92ZXI6YmctZ3JheS0xMDAgdHJhbnNpdGlvblwiXHJcbiAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8Q2hldnJvbkxlZnQgY2xhc3NOYW1lPVwiaC01IHctNVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIC8+XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8ZGl2XHJcbiAgICAgICAgICAgICAgcmVmPXtjYXJvdXNlbFJlZn1cclxuICAgICAgICAgICAgICByb2xlPVwicmVnaW9uXCJcclxuICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiVGVhbSBjYXJvdXNlbFwiXHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZmxleCBnYXAtNiBvdmVyZmxvdy14LWF1dG8gcGItNCBzbmFwLXggc25hcC1tYW5kYXRvcnlcIlxyXG4gICAgICAgICAgICAgIHN0eWxlPXt7IHNjcm9sbGJhcldpZHRoOiAnbm9uZScgfX1cclxuICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgIHtURUFNLm1hcCgobSwgaSkgPT4gKFxyXG4gICAgICAgICAgICAgICAgPGFydGljbGVcclxuICAgICAgICAgICAgICAgICAga2V5PXtpfVxyXG4gICAgICAgICAgICAgICAgICBjbGFzc05hbWU9e1tcclxuICAgICAgICAgICAgICAgICAgICAnc2hyaW5rLTAgc25hcC1jZW50ZXIgYmctd2hpdGUgcm91bmRlZC14bCBib3JkZXIgYm9yZGVyLWdyYXktMjAwIHAtNCB0ZXh0LWNlbnRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgbS5mZWF0dXJlZCA/ICd3LTcyIG1kOnctODAnIDogJ3ctNjQnLFxyXG4gICAgICAgICAgICAgICAgICBdLmpvaW4oJyAnKX1cclxuICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgPGRpdlxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT17W1xyXG4gICAgICAgICAgICAgICAgICAgICAgJ214LWF1dG8gcm91bmRlZC1sZyBvdmVyZmxvdy1oaWRkZW4gYmctZ3JheS0xMDAnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgbS5mZWF0dXJlZCA/ICdoLTgwJyA6ICdoLTcyJyxcclxuICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJyAnKX1cclxuICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgIDxpbWdcclxuICAgICAgICAgICAgICAgICAgICAgIHNyYz17bS5pbWd9XHJcbiAgICAgICAgICAgICAgICAgICAgICBhbHQ9e2BQb3J0cmFpdCBvZiAke20ubmFtZX1gfVxyXG4gICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGgtZnVsbCBvYmplY3QtY292ZXJcIlxyXG4gICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiZm9udC1ib2xkIG10LTRcIj57bS5uYW1lfTwvaDM+XHJcbiAgICAgICAgICAgICAgICAgIDxwIGNsYXNzTmFtZT1cInRleHQtc20gdGV4dC1ncmF5LTYwMFwiPnttLnJvbGV9PC9wPlxyXG4gICAgICAgICAgICAgICAgICB7bS5mZWF0dXJlZCAmJiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtdC0zIHRleHQtbGVmdCB0ZXh0LXNtIHNwYWNlLXktMVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAge20uZW1haWwgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY9e2BtYWlsdG86JHttLmVtYWlsfWB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiYmxvY2sgdGV4dC1ncmVlbi03MDAgaG92ZXI6dW5kZXJsaW5lIHRydW5jYXRlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHttLmVtYWlsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgICAge20ucGhvbmUgJiYgKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8YVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGhyZWY9e2B0ZWw6JHttLnBob25lLnJlcGxhY2UoL1xccy9nLCAnJyl9YH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJibG9jayB0ZXh0LWdyYXktNzAwXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHttLnBob25lfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgPGFcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHJlZj1cIiNcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcmlhLWxhYmVsPXtgJHttLm5hbWV9IG9uIExpbmtlZEluYH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaW5saW5lLWZsZXggaXRlbXMtY2VudGVyIGdhcC0xIG10LTIgdGV4dC1ibHVlLTYwMCBob3Zlcjp0ZXh0LWJsdWUtNzAwXCJcclxuICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEZhTGlua2VkaW4gY2xhc3NOYW1lPVwiaC01IHctNVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cInRleHQteHNcIj5MaW5rZWRJbjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvYT5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgIDwvYXJ0aWNsZT5cclxuICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxidXR0b25cclxuICAgICAgICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzY3JvbGxCeSgxKX1cclxuICAgICAgICAgICAgICBhcmlhLWxhYmVsPVwiTmV4dCB0ZWFtIG1lbWJlclwiXHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiaGlkZGVuIG1kOmZsZXggYWJzb2x1dGUgLXJpZ2h0LTQgdG9wLTEvMiAtdHJhbnNsYXRlLXktMS8yIHotMTAgYmctd2hpdGUgc2hhZG93LWxnIHJvdW5kZWQtZnVsbCB3LTEwIGgtMTAgaXRlbXMtY2VudGVyIGp1c3RpZnktY2VudGVyIGhvdmVyOmJnLWdyYXktMTAwIHRyYW5zaXRpb25cIlxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgPENoZXZyb25SaWdodCBjbGFzc05hbWU9XCJoLTUgdy01XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgLz5cclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9zZWN0aW9uPlxyXG5cclxuICAgICAgey8qIE9VUiBTT0NJQUwgSU1QQUNUICovfVxyXG4gICAgICA8c2VjdGlvbiBhcmlhLWxhYmVsbGVkYnk9XCJzb2NpYWwtaW1wYWN0XCIgY2xhc3NOYW1lPVwiYmctZ3JheS01MCBweS0xNiBtZDpweS0yNFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyIG14LWF1dG8gcHgtNCBzbTpweC02XCI+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInRleHQtY2VudGVyIG1iLTEwXCI+XHJcbiAgICAgICAgICAgIDxoMlxyXG4gICAgICAgICAgICAgIGlkPVwic29jaWFsLWltcGFjdFwiXHJcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwidGV4dC0zeGwgbWQ6dGV4dC00eGwgZm9udC1ib2xkIG1iLTMgdHJhY2tpbmctdGlnaHRcIlxyXG4gICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgT3VyIFNvY2lhbCBJbXBhY3RcclxuICAgICAgICAgICAgPC9oMj5cclxuICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwibWF4LXctMnhsIG14LWF1dG8gdGV4dC1ncmF5LTcwMFwiPlxyXG4gICAgICAgICAgICAgIENvY29ub3RvIGFsaWducyB3aXRoIHRoZSBVTiBTdXN0YWluYWJsZSBEZXZlbG9wbWVudCBHb2FscyAoU0RHcyA1LFxyXG4gICAgICAgICAgICAgIDggJmFtcDsgMTIpLCBwcm9tb3RpbmcgZ2VuZGVyIGVxdWFsaXR5LCBkZWNlbnQgd29yaywgYW5kXHJcbiAgICAgICAgICAgICAgcmVzcG9uc2libGUgcHJvZHVjdGlvbi5cclxuICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdyaWQgbWQ6Z3JpZC1jb2xzLTMgZ2FwLTZcIj5cclxuICAgICAgICAgICAge1NERy5tYXAoKHMpID0+IChcclxuICAgICAgICAgICAgICA8YXJ0aWNsZVxyXG4gICAgICAgICAgICAgICAga2V5PXtzLmNvZGV9XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJyZWxhdGl2ZSBiZy13aGl0ZSByb3VuZGVkLXhsIGJvcmRlciBib3JkZXItZ3JheS0yMDAgcC02XCJcclxuICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgICAgICA8Q29jb251dEljb24gY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLTYgcmlnaHQtNiBoLTYgdy02XCIgLz5cclxuICAgICAgICAgICAgICAgIDxoMyBjbGFzc05hbWU9XCJ0ZXh0LTJ4bCBmb250LWJvbGQgbWItMlwiPlNERyB7cy5jb2RlfTwvaDM+XHJcbiAgICAgICAgICAgICAgICA8cCBjbGFzc05hbWU9XCJmb250LXNlbWlib2xkIG1iLTRcIj57cy50aXRsZX08L3A+XHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwic3BhY2UteS0yIHRleHQtc20gdGV4dC1ncmF5LTcwMFwiPlxyXG4gICAgICAgICAgICAgICAgICB7cy5idWxsZXRzLm1hcCgoYiwgaSkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBrZXk9e2l9IGNsYXNzTmFtZT1cImZsZXggZ2FwLTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGNsYXNzTmFtZT1cInRleHQtZ3JheS00MDBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgwrdcclxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPntifTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICA8L2xpPlxyXG4gICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgPC9hcnRpY2xlPlxyXG4gICAgICAgICAgICApKX1cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L3NlY3Rpb24+XHJcblxyXG4gICAgICA8V2FpdGxpc3RNb2RhbFxyXG4gICAgICAgIGlzT3Blbj17d2FpdGxpc3RPcGVufVxyXG4gICAgICAgIG9uQ2xvc2U9eygpID0+IHNldFdhaXRsaXN0T3BlbihmYWxzZSl9XHJcbiAgICAgIC8+XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59Il0sImZpbGUiOiJDOi9Vc2Vycy9FTk9DSC9Eb2N1bWVudHMvR2l0SHViL2NvY29ub3RvX2IyYjJjL3NyYy9jb21wb25lbnRzL0Fib3V0LnRzeCJ9