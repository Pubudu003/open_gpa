import { Github, Linkedin, Mail } from "lucide-react";

const SOCIALS = [
  {
    name: "Github",
    icon: "../../../../assets/github.png",
    link: "https://github.com/iampubudu",
  },
  {
    name: "Linkedin",
    icon: "../../../../assets/linkedin.png",
    link: "https://www.linkedin.com/in/iampubudu/",
  },
  {
    name: "Mail",
    icon: "../../../../assets/email.png",
    link: "mailto:K0QbD@example.com",
  },
];

const Footer = () => {
  return (
    <footer className="relative border-t border-gray-800/60 bg-gray-950 px-6 py-12 text-gray-400">
      <div className="pointer-events-none absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-sky-500/50 to-transparent" />
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* --- About Section --- */}
          <div className="space-y-4 text-white">
            <h3 className="text-lg font-bold">About Me</h3>
            <p className="text-sm leading-relaxed">
              I am a proud graduate of the BSc (Hons) in Information Technology.
              With a strong foundation in computer science and a passion for
              problem-solving, I am deeply interested in Fullstack development,
              Web development, Backend development, and DevOps practices. My
              goal is to build impactful tools and scalable solutions that
              empower users and create seamless digital experiences.
            </p>
          </div>

          {/* --- Quick Links ---*/}
          <div className="space-y-4 text-white md:text-center">
            <h3 className="text-lg font-bold">Project</h3>
            <ul className="space-y-2 text-sm">
              <li>OPEN GPA - Student GPA & Course Tracker</li>
              <li>Built for OUSL Students</li>
            </ul>
          </div>

          {/* --- Connect Section ---*/}
          <div className="space-y-4 md:text-right">
            <h3 className="text-lg font-bold text-white">Connect with me</h3>
            <div className="flex gap-4 md:justify-end">
              {SOCIALS.map((social) => (
                <a
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  key={social.name}
                  className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full shadow-lg shadow-slate-800/30 transition-all duration-300 hover:scale-110 hover:shadow-gray-700/30"
                >
                  <div className="rounded-full bg-white">
                    <img
                      src={social.icon}
                      alt={social.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </a>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              © {new Date().getFullYear()} Pubudu Lakshan. All rights reserved.
            </p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-2 max-w-6xl text-xs text-gray-400">
        <a
          href="https://www.flaticon.com/free-icons/university"
          title="university icons"
        >
          University icons created by Nsit - Flaticon
        </a>
      </div>
    </footer>
  );
};

export default Footer;
