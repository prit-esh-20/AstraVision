import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Mail, MessageSquare, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user types
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validate()) return;

  setIsSubmitting(true);

  try {
    const response = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (result.success) {
      setIsSubmitted(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });

      // Hide success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    } else {
      alert(result.message || "Failed to send message");
    }
  } catch (error) {
    console.error("Contact form submission error:", error);
    alert("Server error while sending message");
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center bg-gradient-to-b from-black via-[#0B0F17] to-[#001A33]">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-neon-cyan/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-neon-blue/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-2xl"
      >
        <div className="text-center mb-10">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold font-heading mb-4 bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-white to-neon-blue tracking-tighter"
          >
            Contact <span className="neon-text-cyan">Us</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 font-medium tracking-wide"
          >
            Get in touch with AstraVision team
          </motion.p>
        </div>

        <div className="glass-card p-8 md:p-10 border-white/5 relative overflow-hidden">
          {/* Subtle line decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent" />
          
          <AnimatePresence mode="wait">
            {!isSubmitted ? (
              <motion.form 
                key="contact-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit} 
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neon-cyan flex items-center gap-2">
                      <User size={14} /> Name
                    </label>
                    <div className="relative group">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Agent 007"
                        className={`w-full bg-dark-base/50 border ${errors.name ? 'border-neon-red/50 shadow-[0_0_10px_rgba(255,0,60,0.1)]' : 'border-white/10 group-hover:border-neon-cyan/50'} rounded-lg px-4 py-3 outline-none transition-all focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 focus:shadow-neon-cyan text-white placeholder:text-gray-600`}
                      />
                      {errors.name && (
                        <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] text-neon-red mt-1 flex items-center gap-1">
                          <AlertCircle size={10} /> {errors.name}
                        </motion.span>
                      )}
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-neon-cyan flex items-center gap-2">
                      <Mail size={14} /> Email
                    </label>
                    <div className="relative group">
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="secure@astravision.ai"
                        className={`w-full bg-dark-base/50 border ${errors.email ? 'border-neon-red/50 shadow-[0_0_10px_rgba(255,0,60,0.1)]' : 'border-white/10 group-hover:border-neon-cyan/50'} rounded-lg px-4 py-3 outline-none transition-all focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 focus:shadow-neon-cyan text-white placeholder:text-gray-600`}
                      />
                      {errors.email && (
                        <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] text-neon-red mt-1 flex items-center gap-1">
                          <AlertCircle size={10} /> {errors.email}
                        </motion.span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subject Field */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neon-cyan flex items-center gap-2">
                    <MessageSquare size={14} /> Subject
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Access Request / Technical Issue"
                      className={`w-full bg-dark-base/50 border ${errors.subject ? 'border-neon-red/50 shadow-[0_0_10px_rgba(255,0,60,0.1)]' : 'border-white/10 group-hover:border-neon-cyan/50'} rounded-lg px-4 py-3 outline-none transition-all focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 focus:shadow-neon-cyan text-white placeholder:text-gray-600`}
                    />
                    {errors.subject && (
                      <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] text-neon-red mt-1 flex items-center gap-1">
                        <AlertCircle size={10} /> {errors.subject}
                      </motion.span>
                    )}
                  </div>
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-neon-cyan flex items-center gap-2">
                    <Send size={14} /> Your Message
                  </label>
                  <div className="relative group">
                    <textarea
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Type your transmission here..."
                      className={`w-full bg-dark-base/50 border ${errors.message ? 'border-neon-red/50 shadow-[0_0_10px_rgba(255,0,60,0.1)]' : 'border-white/10 group-hover:border-neon-cyan/50'} rounded-lg px-4 py-3 outline-none transition-all focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan/20 focus:shadow-neon-cyan text-white placeholder:text-gray-600 resize-none`}
                    />
                    {errors.message && (
                      <motion.span initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-[10px] text-neon-red mt-1 flex items-center gap-1">
                        <AlertCircle size={10} /> {errors.message}
                      </motion.span>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full relative py-4 bg-gradient-to-r from-neon-cyan to-neon-blue text-black font-bold uppercase tracking-[0.2em] rounded-lg shadow-neon-cyan hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" size={20} />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send size={18} />
                      </>
                    )}
                  </span>
                  
                  {/* Button Shine Animation */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </motion.button>
              </motion.form>
            ) : (
              <motion.div 
                key="success-message"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center text-center space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-neon-cyan/10 border-2 border-neon-cyan flex items-center justify-center animate-pulse-glow">
                  <CheckCircle2 className="text-neon-cyan" size={40} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold font-heading text-white mb-2">Transmission Received</h3>
                  <p className="text-gray-400">Our agents will process your request and respond via secure channel shortly.</p>
                </div>
                <button 
                  onClick={() => setIsSubmitted(false)}
                  className="text-neon-cyan border-b border-neon-cyan text-xs font-bold uppercase tracking-widest hover:text-white hover:border-white transition-all pb-1"
                >
                  Send another message
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Contact;
