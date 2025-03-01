import React from 'react';

function CustomizeUIPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center w-full lg:w-3/4 p-8 md:p-12 lg:p-16">
        <h1 className="text-5xl mb-4">
        🚀 Coming Soon! 🚀
        </h1>
        <h2 className="text-3xl mb-4">Learn How to Customize UI for a Finance Tracking App with Tailwind</h2>
        <h2 className="text-2xl mb-4">Step-by-step Guided Tutorial: Tailwind CSS Integration for Personal Finance App</h2>
        <p className="mb-4">
          Our tutorial for customizing the UI of your finance tracking app with Tailwind CSS is currently in development. The tutorial will include detailed instructions on integrating and utilizing Tailwind CSS to enhance the user experience of your personal finance application. This page will automatically update once the feature is published to our GitHub repository.
        </p>
        <p className="mb-4 font-bold italic">
          Keep an eye on our GitHub repository. As soon as we push the new tutorial, this page will reflect the latest changes without any manual updates needed.
        </p>
        <a href="https://github.com/jengerred/Next.js-MongoDB-Authentication-System" target="_blank" rel="noopener noreferrer" className="text-blue-600 text-center hover:text-blue-700">
          Visit our GitHub repository for real-time updates
        </a>
      </div>
    </div>
  );
}

export default CustomizeUIPage;
