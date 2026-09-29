import { Link } from "react-router";
import { SteeringWheelIcon, InstagramLogoIcon, YoutubeLogoIcon, XLogoIcon,MapPinIcon, EnvelopeSimpleIcon, 
    
 } from "@phosphor-icons/react";

const columns = [
  {
    title: "Explore",
    links: [
      { label: "Home", to: "/" },
      { label: "All Meets", to: "/meets" },
      { label: "Private Meets", to: "/meets" },
      { label: "My Garage", to: "/garage" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Become a Host", to: "/register" },
      { label: "RC Verification", to: "/garage" },
      { label: "Create Account", to: "/register" },
      { label: "Sign In", to: "/login" },
    ],
  },
];

const socials = [
  { icon: InstagramLogoIcon, label: "instagram" },
  { icon: YoutubeLogoIcon, label: "youtube" },
  { icon: XLogoIcon, label: "x" },
];

export const Footer = () => (
  <footer data-testid="site-footer" className="relative border-t border-border bg-[#070707] mt-24">
    <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-primary via-accent to-transparent" />

    <div className="max-w-7xl mx-auto px-5 py-16 grid grid-cols-1 md:grid-cols-12 gap-12">
      <div className="md:col-span-5">
       <Link
          to="/"
          className="flex shrink-0 items-center"
        >
          <SteeringWheelIcon
            size={28}
            weight="fill"
            className="mr-1 text-[#E21D48]"
          />

          <span className="lg:text-md font-extrabold text-white">
            SUPER
          </span>

          <span className="lg:text-md  font-extrabold text-[#E21D48]">
            MEET
          </span>
        </Link>
        <p className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-sm">
          The home for supercar culture. Find the meet, verify your ride against the vehicle registry, and roll into invite-only garage nights.
        </p>
        <div className="mt-7 space-y-2 text-sm text-muted-foreground">
          <p className="flex items-center gap-2"><MapPinIcon size={16} className="text-primary" /> Mumbai · Pune · Bengaluru</p>
          <a href="mailto:crew@supermeet.io" data-testid="footer-email" className="flex items-center gap-2 hover:text-white transition-colors">
            <EnvelopeSimpleIcon size={16} className="text-primary" /> crew@supermeet.io
          </a>
        </div>
      </div>

      {columns.map((col) => (
        <div key={col.title} className="md:col-span-2">
          <h3 className="font-display font-bold uppercase text-xs tracking-[0.25em] text-white mb-5">
            {col.title}
          </h3>
          <ul className="space-y-3">
            {col.links.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  data-testid={`footer-link-${l.label.toLowerCase().replace(/ /g, "-")}`}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className="md:col-span-3">
        <h3 className="font-display font-bold uppercase text-xs tracking-[0.25em] text-white mb-5">
          Next meet drop
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          New dates, locations and private passes go live every Thursday.
        </p>
        <Link to="/meets" data-testid="footer-cta">
          <span className="mt-5 inline-block border border-primary text-primary px-6 py-3 text-xs uppercase tracking-[0.2em] hover:bg-primary hover:text-white transition-colors">
            See the calendar
          </span>
        </Link>
        <div className="flex gap-3 mt-7">
          {socials.map(({ icon: Icon, label }) => (
            <a
              key={label}
              href="#"
              aria-label={label}
              data-testid={`footer-social-${label}`}
              className="border border-border p-2.5 text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Icon size={18} />
            </a>
          ))}
        </div>
      </div>
    </div>

    <div className="border-t border-border">
      <div className="max-w-7xl mx-auto px-5 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          © {new Date().getFullYear()} SuperMeet · Built for enthusiasts
        </p>
        <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Drive responsibly · No street racing
        </p>
      </div>
    </div>
  </footer>
);
