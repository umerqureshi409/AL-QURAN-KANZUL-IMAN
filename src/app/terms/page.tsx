"use client";
import React from 'react';
import { Github, Instagram, Linkedin, Mail, Code2, Sparkles, ReceiptText, Info, Book, Volume2 } from 'lucide-react';

const Index = () => {
  const terms = {
    name: "Al Quran ",
    role: "Terms & Conditions",
    avatar: "/Quran.png",
    terms: [
      {
        title: "Usage Policy",
        content: "This application is provided free of charge for the purpose of reading and learning the Holy Quran. Users must treat the Quranic content with utmost respect."
      },
      {
        title: "Content Accuracy",
        content: "While we strive for accuracy in Quranic text and translations, users should verify with authentic sources for critical matters."
      },
      {
        title: "User Conduct",
        content: "Users must maintain appropriate conduct and respect while using the application. The app should not be used in inappropriate places."
      },
      {
        title: "Data Privacy",
        content: "We collect minimal necessary data. Your reading progress and bookmarks are stored locally on your device."
      }
    ],
    apiResources: [
      {
        type: "Quran Text",
        source: "Al Quran Cloud API",
        description: "Provides authentic Uthmanic text of the Holy Quran",
        link: "https://alquran.cloud/api"
      },
      {
        type: "Translations",
        source: "Al Quran Cloud API",
        description: "Multiple verified translations in various languages",
        link: "https://alquran.cloud/api"
      },
      {
        type: "Audio Recitations",
        source: "Al Quran Cloud API",
        description: "High-quality audio recitations from renowned Qaris",
        link: "https://alquran.cloud/api"
      }
    ]
  };

  return (
    <div className="min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      
      <div className="max-w-4xl mx-auto">
        <div className="overflow-hidden bg-white shadow-xl rounded-2xl">
      
          <div className="px-8 py-16 text-center bg-gradient-to-r from-green-700 to-green-900">
            <div className="relative w-40 h-40 mx-auto">
              <img
                src={terms.avatar}
                alt={terms.name}
                className="border-4 border-white rounded-full shadow-lg"
              />
              <div className="absolute p-2 bg-white rounded-full shadow-lg -bottom-2 -right-2">
                <ReceiptText className="w-6 h-6 text-[#023020]" />
              </div>
            </div>
            <h1 className="mt-6 text-4xl font-bold text-white">{terms.name}</h1>
            <p className="mt-2 text-xl text-emerald-100">{terms.role}</p>
          </div>

          <div className="px-8 py-12">
         

            {/* Terms and Conditions Section */}
            <div className="mb-12">
              <h2 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
                <ReceiptText className="w-6 h-6 text-[#023020]" />
                Terms and Conditions
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {terms.terms.map((term, index) => (
                  <div
                    key={index}
                    className="p-6 transition-colors border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100"
                  >
                    <h3 className="mb-2 text-lg font-semibold text-[#023020]">{term.title}</h3>
                    <p className="text-green-900">{term.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* API Resources Section */}
            <div className="mb-12">
              <h2 className="flex items-center gap-2 mb-6 text-2xl font-bold text-gray-800">
                <Info className="w-6 h-6 text-[#023020]" />
                API Resources
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {terms.apiResources.map((resource, index) => (
                  <div
                    key={index}
                    className="p-6 transition-colors border border-gray-100 rounded-lg bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {resource.type === "Quran Text" && <Book className="w-5 h-5 text-[#023020]" />}
                      {resource.type === "Translations" && <Code2 className="w-5 h-5 text-[#023020]" />}
                      {resource.type === "Audio Recitations" && <Volume2 className="w-5 h-5 text-[#023020]" />}
                      <h3 className="text-lg font-semibold text-[#023020]">{resource.type}</h3>
                    </div>
                    <p className="mb-1 font-medium text-green-900">Source: {resource.source}</p>
                    <p className="mb-2 text-green-900">{resource.description}</p>
                    <a 
                      href={resource.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#023020] hover:underline"
                    >
                      Learn More →
                    </a>
                  </div>
                ))}
              </div>
            </div>

           
            <div className="flex justify-center space-x-6">
              {/* ... */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;