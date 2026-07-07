import { motion as Motion } from "framer-motion";
import {
  Mail,
  MessageSquareText,
  ExternalLink,
  Loader2,
  Check,
  CheckCheck,
  Send,
} from "lucide-react";
import StackIcon from "tech-stack-icons";
import { FaLinkedin, FaEnvelope, FaGithub } from "react-icons/fa";
import { useEffect, useState } from "react";
import { INPUT_CLS, LABEL_CLS } from "../admin/constants";
import axiosInstance from "../../lib/axios";
import toast from "react-hot-toast";

const ContactSection = () => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const CONTACTS = [
    {
      label: "Email",
      icon: FaEnvelope,
      link: "appgpacalculator@gmail.com",
      iconColor: "text-violet-400/80",
      borderColor: "border-l-violet-500/80",
    },
    {
      label: "GitHub",
      icon: FaGithub,
      link: "github.com/Pubudu003",
      iconColor: "text-white",
      borderColor: "border-l-white",
    },
    {
      label: "LinkedIn",
      icon: FaLinkedin,
      link: "linkedin.com/in/pubudu-lakshan-e04/",
      iconColor: "text-sky-400/80",
      borderColor: "border-l-sky-500/80",
    },
  ];

  const handleExLink = (label, link) => {
    if (label === "Email") {
      const recipient = link;
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipient}`;
      window.open(gmailUrl, "_blank");
    } else {
      window.open(`https://${link}`, "_blank");
    }
  };

  const handleSubmit = async (name, message) => {
    setIsSaving(true);
    try {
      await axiosInstance.post("/student/feedback", {
        studentName: name,
        feedbackText: message,
      });
      toast.success("Feedback sent!");
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to send feedback");
    } finally {
      setIsSaving(false);
      setName("");
      setMessage("");
    }
  };

  return (
    <>
      <div className="space-y-6">
        {/* Contact Links Card */}
        <div className="space-y-2 text-white">
          <p className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
            contact links
          </p>
          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-3 rounded-2xl border border-gray-700 bg-gray-900 p-6">
              <div className="flex items-center gap-2">
                <Mail size={24} className="text-sky-400" />
                <h3 className="text-lg font-semibold">Get In Touch</h3>
              </div>
              <div className="flex flex-col gap-2">
                {CONTACTS.map(
                  ({ label, icon: Icon, link, iconColor, borderColor }) => {
                    return (
                      <div key={label} className="flex flex-col gap-2">
                        <button
                          className={`rounded-md rounded-l-md border border-l-4 border-gray-700 md:grid md:grid-cols-[120px_1fr_auto] ${borderColor} cursor-pointer bg-gray-600/30 px-4 py-2 hover:bg-gray-600/50`}
                          key={label}
                          onClick={() => handleExLink(label, link)}
                        >
                          <div className="flex items-center justify-start gap-4">
                            <Icon size={22} className={`${iconColor}`} />
                            <p className="font-semibold text-gray-500">
                              {label}
                            </p>
                          </div>
                          <div className="flex min-w-0 items-center justify-start">
                            <p className="ml-10 truncate text-sm text-gray-400">
                              {link}
                            </p>
                          </div>
                          <div className="hidden items-center justify-end md:flex">
                            <ExternalLink
                              size={14}
                              className="text-gray-400 group-hover:text-white"
                            />
                          </div>
                        </button>
                      </div>
                    );
                  },
                )}
              </div>
            </div>
          </Motion.div>
        </div>
        {/* Feedback Form Card */}
        <div className="space-y-2 text-white">
          <p className="text-sm font-semibold tracking-wider text-gray-400 uppercase">
            Feedback Form
          </p>
          <Motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="space-y-4 rounded-2xl border border-gray-700 bg-gray-900 p-6">
              <div className="flex items-start gap-2">
                <MessageSquareText size={24} className="text-violet-400" />
                <div className="flex flex-col">
                  <h3 className="text-lg font-semibold">Send Feedback</h3>
                  <p className="text-sm text-gray-400">
                    Have suggestions or found a bug? Let me know!
                  </p>
                </div>
              </div>
              <div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSubmit(name, message);
                  }}
                  className="space-y-4"
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm tracking-wider text-white">
                        Your Name
                      </label>
                      <input
                        className={INPUT_CLS}
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-sm tracking-wider text-white">
                        Your Message
                      </label>
                      <textarea
                        className={INPUT_CLS}
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Enter your message"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-linear-to-r from-sky-600 to-violet-600 py-2.5 text-sm font-semibold text-white transition-all hover:from-sky-500 hover:to-violet-500 disabled:opacity-60"
                  >
                    {isSaving ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Send size={16} />
                    )}
                    {isSaving ? "Sending..." : "Send Feedback"}
                  </button>
                </form>
              </div>
            </div>
          </Motion.div>
        </div>
      </div>
    </>
  );
};

export default ContactSection;
