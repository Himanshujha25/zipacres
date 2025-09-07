import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import emailjs from "@emailjs/browser";

// Icons
const WhatsAppIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.655 4.502 1.906 6.344l-1.197 4.354 4.469-1.182z" />
  </svg>
);
const PhoneIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);
const MailIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

// Animations
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// Form validation
const ContactSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Invalid phone number")
    .required("Phone number is required"),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string().required("Message is required"),
});

export default function Contact() {
  const location = useLocation();
  const initialForm = {
    name: "",
    email: "",
    phone: "",
    subject: location.state?.propertyTitle
      ? `Inquiry about ${location.state.propertyTitle}`
      : "",
    message: location.state?.propertyTitle
      ? `I am interested in the property: "${location.state.propertyTitle}". Please provide more details including price, availability, and viewing options.`
      : "",
  };

  const handleSubmit = (values, { resetForm, setSubmitting }) => {
    const serviceID = "YOUR_EMAILJS_SERVICE_ID";
    const templateID = "YOUR_EMAILJS_TEMPLATE_ID";
    const publicKey = "YOUR_EMAILJS_PUBLIC_KEY";

    emailjs
      .send(serviceID, templateID, values, publicKey)
      .then(() => {
        alert("Message sent successfully!");
        resetForm();
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to send message. Please try again later.");
      })
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="bg-zinc-100 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gray-900 text-white py-24 px-4 overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-full object-cover z-0">
          <img
            src="https://images.pexels.com/photos/31425035/pexels-photo-31425035.jpeg"
            alt="Modern office building"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gray-900/70"></div>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-none mb-2">
            Contact Us for Property
          </h1>
          <p className="text-md text-gray-300 tracking-tight leading-tight mx-auto">
            Ready to find your dream home or investment property? Our expert
            team is here to guide you through every step of your real estate
            journey.
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-3 gap-12"
        >
          <motion.div variants={fadeInUp} className="lg:col-span-2">
            <div className="bg-gray-50 rounded-xl shadow-lg p-8">
              <div className="text-center mb-8  bg-gradient-to-r rounded-md from-blue-800 to-blue-900">
                <h1 className="text-3xl font-semibold   text-white text-center py-4 rounded-lg">
                  Send Your Query{" "}
                </h1>
              </div>
              <Formik
                initialValues={initialForm}
                validationSchema={ContactSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <Field
                          name="name"
                          placeholder="Enter name"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                        />
                        <ErrorMessage
                          name="name"
                          component="p"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>
                      <div>
                        <Field
                          name="phone"
                          placeholder="+91 987xxxxxx"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                        />
                        <ErrorMessage
                          name="phone"
                          component="p"
                          className="text-red-600 text-sm mt-1"
                        />
                      </div>
                    </div>

                    <div>
                      <Field
                        name="email"
                        type="email"
                        placeholder="Your@email.com"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                      />
                      <ErrorMessage
                        name="email"
                        component="p"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <Field
                        as="select"
                        name="subject"
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all"
                      >
                        <option value="">Select a subject</option>
                        <option value="Property Inquiry">
                          Property Inquiry
                        </option>
                        <option value="Property Inquiry">
                          Book an appointment
                        </option>
                        <option value="Property Inquiry">
                          Request for a call back
                        </option>
                        <option value="Property Inquiry">
                          Looking for a job
                        </option>
                        <option value="Property Inquiry">
                          Need property details on
                        </option>
                        <option value="Property Inquiry">
                         WhatsAPp
                        </option>

                        <option value="Property Valuation">
                          Online Booking
                        </option>
                        <option value="Property Management">
                          Business Proposal
                        </option>
                        <option value="General Inquiry">want to sell property</option>
                        <option value="Other">Other</option>
                      </Field>
                      <ErrorMessage
                        name="subject"
                        component="p"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <div>
                      <Field
                        as="textarea"
                        name="message"
                        rows="5"
                        placeholder="Please describe your requirements..."
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-all resize-none"
                      />
                      <ErrorMessage
                        name="message"
                        component="p"
                        className="text-red-600 text-sm mt-1"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gray-700 text-white font-medium py-3 px-6 rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? "Sending Message..." : "Send Message"}
                    </button>
                  </Form>
                )}
              </Formik>
            </div>
          </motion.div>

          <motion.div variants={fadeInUp} className="lg:col-span-1">
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold tracking-tight text-gray-900 mb-2">
                  Quick Contact
                </h3>
                <a
                  href="https://wa.me/919876543210"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors mb-2"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-green-700 text-white rounded-lg ">
                    <WhatsAppIcon />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">WhatsApp</p>
                    <p className="text-sm text-gray-600">9990-263-263</p>
                  </div>
                </a>
                <a
                  href="tel:+9990-263-263"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors mb-2"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-lg">
                    <PhoneIcon />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Call Us</p>
                    <p className="text-sm text-gray-600">9990-263-263</p>
                  </div>
                </a>
                <a
                  href="mailto:contact@zipacres.com"
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-gray-600 text-white rounded-lg">
                    <MailIcon />
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">
                      contact@zipacres.com
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-12"
        >
          <div className="bg-zinc-50 rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
              Frequently Asked Questions
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-zinc-400">
              {[
                {
                  question: "How quickly can I expect a response?",
                  answer:
                    "We typically respond within 2-4 hours during business hours, and within 24 hours on weekends.",
                },
                {
                  question: "Do you charge for property consultation?",
                  answer:
                    "Initial consultation and property viewing are completely free. We only charge commission after successful transactions.",
                },
                {
                  question: "Can you help with property arrangements?",
                  answer:
                    "Yes, we have partnerships with leading banks and can help you get the best rates and quick approvals.",
                },
                {
                  question: "Do you handle property documentation?",
                  answer:
                    "Absolutely! We provide complete legal documentation support including verification, registration, and paperwork.",
                },
              ].map((faq, index) => (
                <div key={index} className="p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
