import React, { useState } from "react";
import { Send } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", message: "" });

      // Reset success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    }, 1500);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm p-8">
      <h3 className="text-2xl font-bold text-white mb-2">Get In Touch</h3>
      <p className="text-white/50 text-sm mb-6">
        Fill out the form below and we'll get back to you within 48 hours.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Input */}
        <div>
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border ${
              errors.name ? "border-red-500/50" : "border-white/[0.08]"
            } text-white placeholder:text-white/30 focus:outline-none focus:border-[#2dd4bf]/50 focus:ring-2 focus:ring-[#2dd4bf]/20 transition-all`}
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.name}</p>
          )}
        </div>

        {/* Email Input */}
        <div>
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border ${
              errors.email ? "border-red-500/50" : "border-white/[0.08]"
            } text-white placeholder:text-white/30 focus:outline-none focus:border-[#2dd4bf]/50 focus:ring-2 focus:ring-[#2dd4bf]/20 transition-all`}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.email}</p>
          )}
        </div>

        {/* Message Textarea */}
        <div>
          <textarea
            name="message"
            placeholder="Your Message"
            value={formData.message}
            onChange={handleChange}
            rows={5}
            className={`w-full px-4 py-3 rounded-xl bg-white/[0.03] border ${
              errors.message ? "border-red-500/50" : "border-white/[0.08]"
            } text-white placeholder:text-white/30 focus:outline-none focus:border-[#2dd4bf]/50 focus:ring-2 focus:ring-[#2dd4bf]/20 transition-all resize-none`}
          />
          {errors.message && (
            <p className="text-red-400 text-xs mt-1.5 ml-1">{errors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || submitSuccess}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: submitSuccess
              ? "linear-gradient(135deg, #22c55e, #16a34a)"
              : "linear-gradient(135deg, #2dd4bf, #14b8a6)",
            color: "#000",
          }}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              Sending...
            </>
          ) : submitSuccess ? (
            <>
              <span>✓</span>
              Message Sent!
            </>
          ) : (
            <>
              <Send size={16} />
              Send Message
            </>
          )}
        </button>

        {submitSuccess && (
          <p className="text-center text-sm text-[#2dd4bf] animate-pulse">
            Thanks! We'll be in touch soon.
          </p>
        )}
      </form>
    </div>
  );
};

export default ContactForm;