"use client";
import React, { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface ContactPageProps {
  onBack?: () => void;
}

export default function ContactPage({ onBack }: ContactPageProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: "Email Us",
      description: "Send us an email anytime",
      contact: "hello@sockco.com",
      action: "mailto:hello@sockco.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      description: "Mon-Fri from 8am to 6pm",
      contact: "+1 (555) 123-4567",
      action: "tel:+15551234567",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      description: "Come see our amazing socks",
      contact: "123 Comfort St",
      action: "https://maps.google.com",
    },
  ];

  const faqs = [
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for all unworn items in original packaging.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Standard shipping takes 3-5 business days. Express shipping is available for 1-2 day delivery.",
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Yes, we ship worldwide. International shipping typically takes 7-14 business days.",
    },
    {
      question: "What materials are your socks made from?",
      answer:
        "We use premium cotton blends, merino wool, and performance synthetic materials depending on the sock type.",
    },
  ];

  return (
    <div className="from-primary/5 min-h-screen bg-gradient-to-b to-white py-10">
      {/* Contact Methods */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {contactMethods.map((method, index) => (
              <a
                key={index}
                href={method.action}
                className="group transform transition-all hover:-translate-y-1"
              >
                <Card className="shadow-primary h-full rounded border-none transition-colors">
                  <CardContent className="flex h-full flex-col items-center p-8 text-center">
                    <div className="bg-primary/10 group-hover:bg-primary/20 mb-6 flex h-16 w-16 items-center justify-center rounded-full transition-colors">
                      <method.icon className="text-primary h-8 w-8" />
                    </div>
                    <h3 className="text-foreground mb-2 text-xl font-semibold">
                      {method.title}
                    </h3>
                    <p className="text-muted-foreground mb-3">
                      {method.description}
                    </p>
                    <span className="text-primary font-semibold">
                      {method.contact}
                    </span>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div>
              <Card className="shadow-primary h-full rounded border-none transition-colors">
                <CardHeader>
                  <CardTitle className="text-2xl">Send us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as
                    possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isSubmitted ? (
                    <div className="py-12 text-center">
                      <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
                      <h3 className="text-foreground mb-2 text-2xl font-semibold">
                        Message Sent!
                      </h3>
                      <p className="text-muted-foreground">
                        Thank you for contacting us. We'll get back to you
                        within 24 hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-2">
                          <Label htmlFor="name">Full Name</Label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="Your name"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Select
                          value={formData.subject}
                          onValueChange={(value) =>
                            setFormData({ ...formData, subject: value })
                          }
                          required
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a subject" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">
                              General Inquiry
                            </SelectItem>
                            <SelectItem value="order">Order Support</SelectItem>
                            <SelectItem value="returns">
                              Returns & Exchanges
                            </SelectItem>
                            <SelectItem value="sizing">Sizing Help</SelectItem>
                            <SelectItem value="wholesale">
                              Wholesale Inquiry
                            </SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          name="message"
                          rows={6}
                          value={formData.message}
                          onChange={handleInputChange}
                          placeholder="Tell us how we can help you..."
                          required
                        />
                      </div>

                      <Button type="submit" className="w-full">
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Company Info */}
            <div className="space-y-6">
              <Card className="shadow-primary h-full rounded border-none transition-colors">
                <CardHeader>
                  <CardTitle className="text-2xl">Visit Our Store</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 mt-1 rounded-full p-2">
                      <MapPin className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-foreground font-semibold">
                        SockCo Headquarters
                      </h4>
                      <p className="text-muted-foreground">
                        123 Comfort Street
                        <br />
                        Style City, SC 12345
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 mt-1 rounded-full p-2">
                      <Clock className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-foreground font-semibold">
                        Store Hours
                      </h4>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9:00 AM - 8:00 PM
                        <br />
                        Saturday: 10:00 AM - 6:00 PM
                        <br />
                        Sunday: 12:00 PM - 5:00 PM
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 mt-1 rounded-full p-2">
                      <Clock className="text-primary h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-foreground font-semibold">
                        Store Hours
                      </h4>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9:00 AM - 8:00 PM
                        <br />
                        Saturday: 10:00 AM - 6:00 PM
                        <br />
                        Sunday: 12:00 PM - 5:00 PM
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with Accordion */}
      <section className="py-16">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-12 text-center">
            <h2 className="text-foreground mb-4 text-3xl font-bold">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-lg">
              Quick answers to common questions about our socks and services.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-border bg-background rounded-lg border px-4"
              >
                <AccordionTrigger className="hover:no-underline [&[data-state=open]>svg:last-child]:rotate-180">
                  <h4 className="text-left">{faq.question}</h4>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pt-1 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">
              Can't find what you're looking for?
            </p>
            <Button>Contact Support</Button>
          </div>
        </div>
      </section>
    </div>
  );
}
