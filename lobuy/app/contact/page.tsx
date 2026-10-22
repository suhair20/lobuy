"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { SUPPORT_EMAIL, SUPPORT_PHONE } from "@/lib/site";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent successfully!");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="bg-gradient-to-tr from-blue-950 via-black to-blue-950 px-6 py-16 text-center text-white md:py-24">
        <h1 className="mb-4 font-serif text-4xl font-bold md:text-5xl">Contact Us</h1>
        <p className="mx-auto max-w-2xl text-gray-400">Have a question about a product or an order? We&apos;re here to help.</p>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-12 md:py-20 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <InfoCard icon={<Phone className="h-6 w-6 text-gold" />} title="Phone" value={SUPPORT_PHONE} note="Mon-Sat: 9am - 7pm" />
          <InfoCard icon={<Mail className="h-6 w-6 text-gold" />} title="Email" value={SUPPORT_EMAIL} note="24/7 Online Support" />
          <InfoCard icon={<MapPin className="h-6 w-6 text-gold" />} title="Location" value="Kerala, India" note="" />
        </div>
        <div className="rounded-3xl bg-surface p-8 shadow-xl md:p-12 lg:col-span-2">
          <div className="mb-8 flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-gold" />
            <h2 className="text-2xl font-bold text-gray-900">Send a Message</h2>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <input required placeholder="Full Name" className="w-full rounded-xl border border-gray-200 px-4 py-3" onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <input required type="email" placeholder="Email Address" className="w-full rounded-xl border border-gray-200 px-4 py-3" onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <input placeholder="Subject" className="w-full rounded-xl border border-gray-200 px-4 py-3" onChange={(e) => setFormData({ ...formData, subject: e.target.value })} />
            <textarea required rows={5} placeholder="How can we help you today?" className="w-full rounded-xl border border-gray-200 px-4 py-3" onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
            <button type="submit" className="flex items-center justify-center gap-2 rounded-xl bg-blue-950 px-10 py-4 font-bold text-white hover:bg-black">
              <Send className="h-4 w-4" /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, value, note }: { icon: React.ReactNode; title: string; value: string; note: string }) {
  return (
    <div className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-surface p-8 shadow-sm">
      <div className="rounded-lg bg-blue-50 p-3">{icon}</div>
      <div>
        <h3 className="font-bold text-gray-900">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{value}</p>
        {note && <p className="mt-1 text-xs text-gray-400">{note}</p>}
      </div>
    </div>
  );
}
