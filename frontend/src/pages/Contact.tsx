import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HelpCircle } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const OFFICE_ADDRESS = "VISHWAKARMA INSTITUTE OF TECHNOLOGY VIT, Upper Indira Nagar, Bibwewadi, Pune, Maharashtra 411037";
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(OFFICE_ADDRESS)}`;

const TIME_SLOTS = [
  "09:00 AM – 10:00 AM",
  "10:00 AM – 11:00 AM",
  "11:00 AM – 12:00 PM",
  "12:00 PM – 01:00 PM",
  "02:00 PM – 03:00 PM",
  "03:00 PM – 04:00 PM",
  "04:00 PM – 05:00 PM",
];

const REFERRAL_SOURCES = ["Website", "Friend/Family", "Social Media", "Counselor", "Other"];

type ContactMethod = {
  icon: typeof Mail;
  title: string;
  description: string;
  value: string;
  actionLabel: string;
  actionType: "email" | "phone" | "map" | "none";
  actionValue?: string;
};

const contactMethods: ContactMethod[] = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Send us an email and we'll respond within 24 hours",
    value: "contact@voyageedu.edu.in",
    actionLabel: "Send Email",
    actionType: "email",
    actionValue: "contact@voyageedu.edu.in",
  },
  {
    icon: Phone,
    title: "Call Us",
    description: "Speak with our team during business hours",
    value: "+91 98765 43210",
    actionLabel: "Call Now",
    actionType: "phone",
    actionValue: "+919876543210",
  },
  {
    icon: MapPin,
    title: "Visit Us",
    description: "Come visit our office in the heart of Pune",
    value: OFFICE_ADDRESS,
    actionLabel: "Get Directions",
    actionType: "map",
    actionValue: GOOGLE_MAPS_URL,
  },
  {
    icon: Clock,
    title: "Business Hours",
    description: "We're here to help during these hours",
    value: "Mon-Fri: 9:00 AM - 6:00 PM IST",
    actionLabel: "View Hours",
    actionType: "none",
  },
];

const faqItems = [
  {
    question: "How do I search for institutions?",
    answer: "Use our interactive map or search feature to find institutions by location, type, or specialization.",
  },
  {
    question: "Is the information verified?",
    answer: "Yes, we verify all institution information through official sources and regular updates.",
  },
  {
    question: "Can I suggest a new institution?",
    answer: "Absolutely! Use our contact form to suggest institutions that should be added to our platform.",
  },
  {
    question: "How often is the data updated?",
    answer: "We update our database quarterly and monitor for changes in real-time.",
  },
  {
    question: "Can I verify AISHE codes here?",
    answer: "Yes, our AISHE Code Verifier tool validates institutions instantly using official AISHE records.",
  },
  {
    question: "Do you offer enterprise or API access?",
    answer: "We provide curated data exports and API access for institutional partners. Contact us for tailored plans.",
  },
  {
    question: "Can I schedule campus visits online?",
    answer: "Yes, use the Schedule a Visit form and our team will confirm your preferred time slot.",
  },
];

const contactFormInitialState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

const visitFormInitialState = {
  name: "",
  visitDate: "",
  timeSlot: "",
  reason: "",
  referralSource: "",
};

type ContactFormFields = typeof contactFormInitialState;
type VisitFormFields = typeof visitFormInitialState;
type StatusState = { type: "success" | "error"; message: string } | null;

const Contact = () => {
  const [contactForm, setContactForm] = useState<ContactFormFields>(contactFormInitialState);
  const [contactStatus, setContactStatus] = useState<StatusState>(null);
  const [contactSubmitting, setContactSubmitting] = useState(false);

  const [visitForm, setVisitForm] = useState<VisitFormFields>(visitFormInitialState);
  const [visitStatus, setVisitStatus] = useState<StatusState>(null);
  const [visitSubmitting, setVisitSubmitting] = useState(false);

  const handleContactMethodAction = (method: ContactMethod) => {
    switch (method.actionType) {
      case "email":
        window.location.href = `mailto:${method.actionValue}`;
        break;
      case "phone":
        window.location.href = `tel:${method.actionValue}`;
        break;
      case "map":
        if (method.actionValue) {
          window.open(method.actionValue, "_blank", "noopener,noreferrer");
        }
        break;
      default:
        break;
    }
  };

  const handleContactChange = (field: keyof ContactFormFields, value: string) => {
    setContactForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleVisitChange = (field: keyof VisitFormFields, value: string) => {
    setVisitForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleContactSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setContactSubmitting(true);
    setContactStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });

      if (!response.ok) {
        throw new Error("Failed to send your request. Please try again.");
      }

      setContactStatus({
        type: "success",
        message:
          "Your request has been successfully sent to the VoyageEdu team. You will get a callback within 2 working days.",
      });
      setContactForm(contactFormInitialState);
    } catch (error) {
      setContactStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    } finally {
      setContactSubmitting(false);
    }
  };

  const handleVisitSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setVisitSubmitting(true);
    setVisitStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/schedule-visit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(visitForm),
      });

      if (!response.ok) {
        throw new Error("Failed to submit visit request. Please try again.");
      }

      setVisitStatus({
        type: "success",
        message: "Your visit request has been submitted. Our team will confirm your schedule soon.",
      });
      setVisitForm(visitFormInitialState);
    } catch (error) {
      setVisitStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Something went wrong. Please try again.",
      });
    } finally {
      setVisitSubmitting(false);
    }
  };

  const handleDirectionsClick = () => {
    window.open(GOOGLE_MAPS_URL, "_blank", "noopener,noreferrer");
  };

  const scrollToScheduleForm = () => {
    document.getElementById("schedule-visit-form")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-16">
        {/* Hero Section */}
        <div className="py-16 bg-gradient-to-br from-background via-primary/5 to-accent/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Contact Us
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Have questions about VoyageEdu? Need help finding the right institution? We're here to help you on your
                educational journey.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {contactMethods.map((method, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow border-primary/10">
                  <CardHeader>
                    <div className="flex justify-center mb-4">
                      <div className="p-3 rounded-full bg-primary/10">
                        <method.icon className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <CardTitle className="text-lg">{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-medium mb-4">{method.value}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled={method.actionType === "none"}
                      onClick={() => method.actionType !== "none" && handleContactMethodAction(method)}
                    >
                      {method.actionLabel}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
                <p className="text-muted-foreground">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      Get in Touch
                    </CardTitle>
                    <CardDescription>
                      Whether you have questions, suggestions, or need support, we'd love to hear from you.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6" onSubmit={handleContactSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            placeholder="Enter your first name"
                            value={contactForm.firstName}
                            onChange={(event) => handleContactChange("firstName", event.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            placeholder="Enter your last name"
                            value={contactForm.lastName}
                            onChange={(event) => handleContactChange("lastName", event.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          value={contactForm.email}
                          onChange={(event) => handleContactChange("email", event.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number (Optional)</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="Enter your phone number"
                          value={contactForm.phone}
                          onChange={(event) => handleContactChange("phone", event.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select
                          value={contactForm.subject}
                          onValueChange={(value) => handleContactChange("subject", value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="suggestion">Institution Suggestion</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          placeholder="Tell us how we can help you..."
                          className="min-h-[120px]"
                          value={contactForm.message}
                          onChange={(event) => handleContactChange("message", event.target.value)}
                          required
                        />
                      </div>

                      {contactStatus && (
                        <div
                          className={`rounded-md border px-4 py-3 text-sm ${
                            contactStatus.type === "success"
                              ? "border-green-400 bg-green-50 text-green-700"
                              : "border-red-400 bg-red-50 text-red-700"
                          }`}
                        >
                          {contactStatus.message}
                        </div>
                      )}

                      <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary-dark text-primary-foreground"
                        disabled={contactSubmitting}
                      >
                        <Send className="w-4 h-4 mr-2" />
                        {contactSubmitting ? "Sending..." : "Send Message"}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card className="h-max">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-accent" />
                      Frequently Asked Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {faqItems.map((faq, index) => (
                      <div key={index} className="border-b border-border/40 pb-4 last:border-b-0 last:pb-0">
                        <h4 className="font-medium mb-2">{faq.question}</h4>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>

        {/* Schedule a Visit Section */}
        <div className="py-16" id="schedule-visit">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <Card id="schedule-visit-form">
                <CardHeader>
                  <CardTitle>Schedule a Visit</CardTitle>
                  <CardDescription>
                    Plan a personalized campus visit to explore VoyageEdu in person. We&apos;ll confirm your preferred time
                    slot soon after receiving your request.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-6" onSubmit={handleVisitSubmit}>
                    <div className="space-y-2">
                      <Label htmlFor="visit-name">Full Name</Label>
                      <Input
                        id="visit-name"
                        placeholder="Enter your name"
                        value={visitForm.name}
                        onChange={(event) => handleVisitChange("name", event.target.value)}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="visit-date">Date to Visit</Label>
                        <Input
                          id="visit-date"
                          type="date"
                          value={visitForm.visitDate}
                          onChange={(event) => handleVisitChange("visitDate", event.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Preferred Time Slot</Label>
                        <Select
                          value={visitForm.timeSlot}
                          onValueChange={(value) => handleVisitChange("timeSlot", value)}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a slot" />
                          </SelectTrigger>
                          <SelectContent>
                            {TIME_SLOTS.map((slot) => (
                              <SelectItem key={slot} value={slot}>
                                {slot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="visit-reason">Reason to Visit</Label>
                      <Textarea
                        id="visit-reason"
                        placeholder="Let us know what you would like to discuss..."
                        className="min-h-[100px]"
                        value={visitForm.reason}
                        onChange={(event) => handleVisitChange("reason", event.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Information received from?</Label>
                      <Select
                        value={visitForm.referralSource}
                        onValueChange={(value) => handleVisitChange("referralSource", value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                          {REFERRAL_SOURCES.map((source) => (
                            <SelectItem key={source} value={source}>
                              {source}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {visitStatus && (
                      <div
                        className={`rounded-md border px-4 py-3 text-sm ${
                          visitStatus.type === "success"
                            ? "border-green-400 bg-green-50 text-green-700"
                            : "border-red-400 bg-red-50 text-red-700"
                        }`}
                      >
                        {visitStatus.message}
                      </div>
                    )}

                    <Button type="submit" className="w-full" disabled={visitSubmitting}>
                      {visitSubmitting ? "Submitting..." : "Submit Visit Request"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Office Location */}
        <div className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Visit Our Office</h2>
              <p className="text-muted-foreground">Located at VIT Pune campus, we welcome visitors by appointment.</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <Card>
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div className="p-8">
                      <h3 className="text-xl font-semibold mb-4">VoyageEdu Headquarters</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">Address</p>
                            <p className="text-muted-foreground text-sm">
                              VISHWAKARMA INSTITUTE OF TECHNOLOGY VIT
                              <br />
                              Upper Indira Nagar, Bibwewadi
                              <br />
                              Pune, Maharashtra 411037
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium">Office Hours</p>
                            <p className="text-muted-foreground text-sm">
                              Monday - Friday: 9:00 AM - 6:00 PM
                              <br />
                              Saturday: 10:00 AM - 2:00 PM
                              <br />
                              Sunday: Closed
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex flex-col gap-3">
                        <Button variant="outline" onClick={handleDirectionsClick}>
                          Get Directions
                        </Button>
                        <Button onClick={scrollToScheduleForm}>Schedule a Visit</Button>
                      </div>
                    </div>
                    <div className="bg-muted/50 p-0 lg:p-0">
                      <iframe
                        title="VoyageEdu HQ Map"
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.777424842067!2d73.86432427605902!3d18.54040468257352!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c10565d9c63f%3A0xbd1576a3dfcc1a2b!2sVishwakarma%20Institute%20of%20Technology!5e0!3m2!1sen!2sin!4v1733440000000!5m2!1sen!2sin"
                        className="w-full h-full min-h-[300px] lg:min-h-[100%] border-0"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;