// app/about/page.tsx

import React from "react";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-6 py-12">
      <div className="max-w-3xl w-full bg-white shadow-lg rounded-2xl p-8 space-y-6">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          About Me
        </h1>
        <p className="text-gray-600 text-center">
          Welcome to my blog! Here I share insights, tutorials, and thoughts on{" "}
          <span className="font-medium text-gray-800">web development, design, and tech</span>.
        </p>

        {/* Profile Section */}
        <div className="flex flex-col md:flex-row items-center gap-6">
         
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Hi, I’m Jubair 👋
            </h2>
            <p className="text-gray-600 mt-2">
              I’m a passionate developer who loves building modern web
              applications and exploring new technologies. Through this blog, I
              aim to simplify programming concepts and share my journey in tech.
            </p>
          </div>
        </div>

        {/* Highlights Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-100 rounded-xl p-4 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">🚀 Coding</h3>
            <p className="text-gray-600 text-sm mt-2">
              Projects, tips, and tricks in Web Dev & DSA.
            </p>
          </div>
          <div className="bg-gray-100 rounded-xl p-4 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">📚 Learning</h3>
            <p className="text-gray-600 text-sm mt-2">
              Documenting my journey in Next.js, Kotlin, and more.
            </p>
          </div>
          <div className="bg-gray-100 rounded-xl p-4 text-center shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800">🌍 Community</h3>
            <p className="text-gray-600 text-sm mt-2">
              Building & connecting with developers worldwide.
            </p>
          </div>
        </div>

        {/* Call to Action */}
   
      </div>
    </main>
  );
}
