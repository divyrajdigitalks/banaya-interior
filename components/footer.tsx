"use client";

import { Logo } from "./logo";
import { Instagram, Facebook, Linkedin, Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-white py-16 px-8 md:px-16">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Description */}
          <div className="lg:col-span-1">
            <Logo variant="light" className="mb-6" />
            <p className="text-white/60 text-sm leading-relaxed">
              Where architecture breathes and every room tells its story. Premium interior design and handcrafted decor.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold mb-6">Quick links</h4>
            <ul className="space-y-3">
              {["Interiors", "Decor", "Projects", "About Us", "Contact"].map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-white/60 text-sm hover:text-[#c9a962] transition-colors"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold mb-6">Our services</h4>
            <ul className="space-y-3">
              {[
                "Full Home Interior",
                "Kitchen Design",
                "Wardrobe Solutions",
                "Office Spaces",
                "Commercial Design",
              ].map((service) => (
                <li key={service}>
                  <a
                    href="#"
                    className="text-white/60 text-sm hover:text-[#c9a962] transition-colors"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold mb-6">Get in touch</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#c9a962]" />
                <span className="text-white/60 text-sm">+91 8855817434</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#c9a962]" />
                <span className="text-white/60 text-sm">hello@banayaa.com</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#c9a962] mt-0.5" />
                <span className="text-white/60 text-sm">
                  Studio 12, Design District
                  <br />
                  Mumbai, India
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-xs">
            © 2024 Banayaa. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-[#c9a962] hover:text-[#c9a962] transition-colors"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-[#c9a962] hover:text-[#c9a962] transition-colors"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center hover:border-[#c9a962] hover:text-[#c9a962] transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
