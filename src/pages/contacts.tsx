 import ContactMethodCard from "@/features/contacts/contactMethodCard";
import ContactForm from "@/features/contacts/form/contactsForm";
import { MapPin, Phone, Mail } from "lucide-react";
 

const ContactIndex = () => {
  const contactMethods = [
    {
      icon: MapPin,
      label: "Location",
      value: "Lagos Nigeria",
      accentColor: "#2dd4bf",
    },
    {
      icon: Phone,
      label: "Phone",
      value: "+237 679209795",
      href: "tel:+237 679209795",
      accentColor: "#fb923c",
    },
    {
      icon: Mail,
      label: "Email",
      value: "johnobi699@gmail.com",
      href: "mailto:johnobi699@gmail.com",
      accentColor: "#818cf8",
    },
  ];

  return (
    <div className="min-h-screen pb-16">
      
      {/* Hero Section */}
      <section className="px-40 pt-16 pb-12">
        <h1 className="text-7xl font-bold text-white mb-6">Contact Us</h1>
        <p className="text-xl text-white/60 max-w-3xl leading-relaxed">
          We value your interest and involvement in the I2I5 Tribes community. 
          Whether you have questions, need support, or want to get more involved, 
          we're here to help. Below are the ways you can reach out to us directly 
          or stay connected through our updates.
        </p>
      </section>

      {/* Contact Methods Row */}
      <section className="px-40 pb-16">
        <div className="grid grid-cols-3 gap-6">
          {contactMethods.map((method, index) => (
            <ContactMethodCard
              key={index}
              icon={method.icon}
              label={method.label}
              value={method.value}
              href={method.href}
              accentColor={method.accentColor}
            />
          ))}
        </div>
      </section>

      {/* Form + Info Section */}
      <section className="px-40">
        <div className="grid grid-cols-2 gap-12">
          
          {/* Left: Form */}
          <div>
            <ContactForm />
          </div>

          {/* Right: Contact Us restatement */}
          <div className="flex flex-col justify-center">
            <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm p-12">
              <h2 className="text-5xl font-bold text-white mb-6">Contact Us</h2>
              <p className="text-white/50 text-base leading-relaxed mb-8">
                We strive to respond to all inquiries within 48 hours. Thank you 
                for your patience and interest.
              </p>
              
              {/* Decorative accent line */}
              <div className="w-20 h-1 rounded-full bg-gradient-to-r from-[#2dd4bf] to-[#14b8a6]" />
              
              {/* Additional info (optional) */}
              <div className="mt-10 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#2dd4bf] mt-2 flex-shrink-0" />
                  <p className="text-white/40 text-sm">
                    Average response time: <span className="text-white/70">24-48 hours</span>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#fb923c] mt-2 flex-shrink-0" />
                  <p className="text-white/40 text-sm">
                    Support hours: <span className="text-white/70">Mon-Fri, 9AM-6PM EST</span>
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#818cf8] mt-2 flex-shrink-0" />
                  <p className="text-white/40 text-sm">
                    Emergency contact: <span className="text-white/70">Available 24/7</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
};

export default ContactIndex;