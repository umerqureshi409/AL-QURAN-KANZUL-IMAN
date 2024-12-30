"use client";
import React from 'react';
import { Github, Instagram, Linkedin, Mail, Code2, Sparkles } from 'lucide-react';

const Index = () => {
  const developers = {
    name: "Umer Qureshi",
    role: "Computer System Engineering Student",
    bio: "Passionate developer focused on creating intuitive and accessible Islamic applications. Specializing in React, Next.js, and modern web technologies.",
    avatar: "/dev/transparent.png",
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Node.js", "MongoDB"],
    contributions: [
      "1. Developed core Quran reading functionality",
      "2. Implemented Schedule calculations",
      "3. Optimized app performance",
      "4. Created responsive UI components"
    ],
    
    social: {
      github: "https://github.com/umerqureshi409",
      Instagram: "https://instagram.com/umerqureshi409",
      linkedin: "www.linkedin.com/in/umer-qureshi-526118259",
      email: "mailto:aa1660025@gmail.com"
    }
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      {/* Previous sections remain the same */}
      <div className="max-w-4xl mx-auto">
        <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
          {/* Hero Section */}
          <div className="px-8 py-16 text-center bg-gradient-to-r from-green-700 to-green-900">
            <div className="relative w-40 h-40 mx-auto">
              <img
                src={developers.avatar}
                alt={developers.name}
                className="border-4 border-white rounded-full shadow-lg"
              />
              <div className="absolute p-2 bg-white rounded-full shadow-lg -bottom-2 -right-2">
                <Code2 className="w-6 h-6 text-[#023020]" />
              </div>
            </div>
            <h1 className="mt-6 text-4xl font-bold text-white">{developers.name}</h1>
            <p className="mt-2 text-xl text-emerald-100">{developers.role}</p>
          </div>

          <div className="px-8 py-12">
             {/* Content Section */}
          <div className="px-8 py-12">
            {/* Bio */}
            <div className="mb-12 text-center">
              <p className="text-lg text-green-900">{developers.bio}</p>
            </div>

            {/* Skills */}
            <div className="mb-12">
              <h2 className="flex items-center gap-2 mb-4 text-2xl font-bold text-green-900">
                <Sparkles className="w-6 h-6 text-[#023020]" />
                Skills
              </h2>
              <div className="flex flex-wrap gap-3">
                {developers.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-4 py-2 text-sm font-medium rounded-full bg-emerald-100 text-[#023020]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Contributions */}
            <div className="mb-12">
              <h2 className="flex items-center gap-2 mb-4 text-2xl font-bold text-green-900">
                <Code2 className="w-6 h-6 text-[#023020]" />
                Key Contributions
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {developers.contributions.map((contribution, index) => (
                  <div
                    key={index}
                    className="p-4 border border-gray-100 rounded-lg bg-gray-50"
                  >
                    {contribution}
                  </div>
                ))}
              </div>
            </div>
            {/* Social Links */}
            <div className="flex justify-center space-x-6">
              <a
                href={developers.social.github}
                className="text-gray-600 transition-colors hover:text-gray-900"
                aria-label="GitHub Profile"
              >
                <Github className="w-6 h-6" />
              </a>
              <a
                href={developers.social.Instagram}
                className="text-gray-600 transition-colors hover:text-pink-600"
                aria-label="Instagram Profile"
              >
                <Instagram className="w-6 h-6" />
              </a>
              <a
                href={developers.social.linkedin}
                className="text-gray-600 transition-colors hover:text-blue-600"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="w-6 h-6" />
              </a>
              <a
                href={developers.social.email}
                className="text-gray-600 transition-colors hover:text-red-700"
                aria-label="Email Contact"
              >
                <Mail className="w-6 h-6" />
              </a>
            </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;