import React from 'react';

function AddUserDataPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
       <div className="flex flex-col items-center justify-center w-full lg:w-1/2 p-8 md:p-12 lg:p-16">
      <h1 className="text-5xl mb-4 text-center">
  🚀 Coming Soon! 🚀
</h1>
<h2 className="text-3xl mb-4">Learn How to Add User Data</h2>
<h2 className="text-2xl mb-4">Step-by-step Guided Tutorial: MongoDB Integration</h2>
<p className="mb-4 ">
  Our tutorial for adding MongoDB data is currently in development.   The tutorial will include detailed instructions on integrating MongoDB with your Next.js application. This page will automatically update once the feature is published to our GitHub repository.
</p>

<p className="mb-4 font-bold italic">
  Keep an eye on our GitHub repository. As soon as we push the new tutorial, this page will reflect the latest changes without any manual updates needed.
</p>
<a href="https://github.com/jengerred/Next.js-MongoDB-Authentication-System" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-center">
  Visit our GitHub repository for real-time updates
</a>

    </div>
    </div>
  );
}

export default AddUserDataPage;
