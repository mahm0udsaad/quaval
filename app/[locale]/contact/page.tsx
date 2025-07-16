"use client"

import type React from "react"

import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="bg-background">
      <div className="relative h-[300px] overflow-hidden">
        <div className="absolute inset-0 bg-secondary">
          <div className="container mx-auto px-4 h-full flex items-center">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-bold text-white mb-4">Contact Us</h1>
              <p className="text-xl text-gray-200">
                Get in touch with our team for any inquiries about our products and services.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary-dark transition duration-300 inline-flex items-center"
              >
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </button>
            </form>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <MapPin className="w-6 h-6 text-primary mt-1" />
                <div className="ml-4">
                  <h3 className="font-semibold">Address</h3>
                  <p className="text-gray-600">3055 Saint-Martin West, Suite T500</p>
                  <p className="text-gray-600">Laval, Quebec, Canada, H7T 0J3</p>
                </div>
              </div>
              <div className="flex items-start">
                <Phone className="w-6 h-6 text-primary mt-1" />
                <div className="ml-4">
                  <h3 className="font-semibold">Phone</h3>
                  <p className="text-gray-600">+1 (514) 208-6840</p>
                </div>
              </div>
              {/* <div className="flex items-start">
                <Mail className="w-6 h-6 text-primary mt-1" />
                <div className="ml-4">
                  <h3 className="font-semibold">Email</h3>
                  <p className="text-gray-600">ceo@quaval.ca</p>
                </div>
              </div> */}
            </div>

            <div className="h-[400px] w-full rounded-lg overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2793.5340374609314!2d-73.74215541507547!3d45.55969833508796!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4cc923b7c1251a89%3A0x58037d71e372fb76!2zMzA1NSBCb3VsZXZhcmQgU2FpbnQtTWFydGluIE8gVDUwMC1BLCBMYXZhbCwgUUMgSDdUIDBKM9iMINmD2YbYr9in!5e0!3m2!1sar!2seg!4v1635930176461!5m2!1sar!2seg"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
