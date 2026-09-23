import { FlagIcon, LockIcon, ShieldCheckIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

import { motion } from 'framer-motion'


const BANNERS = [
  {
    img: "https://images.unsplash.com/photo-1610374634235-b51ef357f905?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000",
    kicker: "This season",
    title: "Where supercars gather after dark",
    sub: "Find the meet. Verify your ride. Roll in.",
  },
  {
    img: "https://images.pexels.com/photos/35416467/pexels-photo-35416467.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=2000",
    kicker: "Private access",
    title: "Invite-only garage nights",
    sub: "Limited passes. Serious machinery.",
  },
  {
    img: "https://images.unsplash.com/photo-1581439645268-ea7bbe6bd091?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000",
    kicker: "Every weekend",
    title: "Canyon runs & sunrise cruises",
    sub: "Hosted by verified enthusiasts.",
  },
];

const INFO = [
  { icon: FlagIcon, t: "Hosted meets", d: "Hosts and admins publish date, time and exact location." },
  { icon: ShieldCheckIcon, t: "RC verified rides", d: "Registration checked against the government registry." },
  { icon: LockIcon, t: "Private passes", d: "Paid, capped guest lists for exclusive garage nights." },

]

function HeroBanner() {
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % BANNERS.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

  const banner = BANNERS[slide];

  return (
    <section className="relative h-[78vh] min-h-120 overflow-hidden grain">
      {BANNERS.map((item, index) => (
        <img
          key={item.img}
          src={item.img}
          alt=""
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
          style={{
            opacity: index === slide ? 1 : 0,
          }}
        />
      ))}

      <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-black/20">
        <div className="absolute bottom-0 z-40 mx-auto flex w-full max-w-7xl flex-col px-5 pb-20 text-white">
          <motion.div
            key={slide}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <p className="mb-2 text-sm font-light uppercase tracking-[0.35em] text-yellow-500">
              {banner.kicker}
            </p>

            <h1 className="mb-4 text-4xl font-extrabold uppercase md:text-6xl">
              {banner.title}
            </h1>

            <p className="text-sm">
              {banner.sub}
            </p>

            <div className="flex gap-4">
              <button className="mt-6 bg-red-600 px-6 py-3 font-light text-white transition-colors duration-300 hover:bg-red-700">
                Browse Meets
              </button>

              <button className="mt-6 bg-gray-800 px-6 py-3 font-light text-white transition-colors duration-300 hover:bg-gray-900">
                Verify My Car
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;