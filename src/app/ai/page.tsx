// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: "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",
// });

// const completion = openai.chat.completions.create({
//   model: "gpt-4o-mini",
//   store: true,
//   messages: [
//     {"role": "user", "content": "write a haiku about ai"},
//   ],
// });

// completion.then((result) => console.log(result.choices[0].message));
// src/app/ai/page.tsx
// "use client";

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import Button from '@/components/UI/Button';
// import Loading from '@/components/UI/Loading';

// interface AIResponse {
//   content: string;
//   isError: boolean;
// }

// export default function AIPage() {
//   const [prompt, setPrompt] = useState('');
//   const [response, setResponse] = useState<AIResponse | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const router = useRouter();

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!prompt.trim() || isLoading) return;

//     setIsLoading(true);
//     setResponse(null);

//     try {
//       const res = await fetch('/api/ai', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ prompt }),
//       });

//       if (!res.ok) throw new Error('Failed to fetch response');

//       const data = await res.json();
//       setResponse({
//         content: data.content,
//         isError: false,
//       });
//     } catch (error) {
//       setResponse({
//         content: 'An error occurred while processing your request. Please try again.',
//         isError: true,
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAskQuestion = (e: React.MouseEvent) => {
//     if (isLoading || !prompt.trim()) {
//       e.preventDefault();
//       return;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-primary-color-5 to-primary-color">
//       <div className="container px-4 py-8 mx-auto">
//         <div className="max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
//           {/* Header */}
//           <div className="p-6 text-white bg-gradient-to-r from-primary-color-5 to-primary-color">
//             <h1 className="text-2xl font-bold text-center md:text-3xl">
//               AI Quran Assistant
//             </h1>
//             <p className="mt-2 text-center text-gray-100">
//               Ask questions about the Quran and Islamic knowledge
//             </p>
//           </div>

//           {/* Main Content */}
//           <div className="p-6">
//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <textarea
//                   value={prompt}
//                   onChange={(e) => setPrompt(e.target.value)}
//                   placeholder="Ask your question about the Quran..."
//                   className={`w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-color focus:border-transparent ${
//                     isLoading ? 'bg-gray-100' : ''
//                   }`}
//                   disabled={isLoading}
//                 />
//               </div>

//               <div className="flex justify-end gap-4">
//                 <Button
//                   text="Back"
//                   customStyles="bg-gray-500 text-white px-6 py-2 hover:bg-gray-600 transition-colors"
//                   onclick={() => router.back()}
//                 />
//                 <Button
//                   text={isLoading ? 'Processing...' : 'Ask Question'}
//                   customStyles={`${
//                     isLoading || !prompt.trim() 
//                       ? 'bg-gray-400 cursor-not-allowed' 
//                       : 'bg-primary-color hover:bg-primary-color/90'
//                   } text-white px-6 py-2 transition-colors`}
//                   onclick={handleAskQuestion}
//                   type="submit"
//                 />
//               </div>
//             </form>

//             {/* Response Section */}
//             {isLoading && (
//               <div className="flex justify-center mt-8">
//                 <Loading />
//               </div>
//             )}

//             {response && (
//               <div 
//                 className={`mt-8 p-6 rounded-lg transition-colors ${
//                   response.isError ? 'bg-red-50' : 'bg-green-50'
//                 }`}
//               >
//                 <h2 className="mb-4 text-xl font-semibold">Response:</h2>
//                 <div 
//                   className={`text-lg ${
//                     response.isError ? 'text-red-600' : 'text-gray-700'
//                   }`}
//                 >
//                   {response.content}
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// src/app/ai/page.tsx
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/UI/Button';
import Loading from '@/components/UI/Loading';

interface AIResponse {
  content: string;
  isError: boolean;
}

interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export default function AIPage() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<AIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error('Failed to fetch response');

      const data = await res.json();
      setResponse({
        content: data.content,
        isError: false,
      });
    } catch (error) {
      setResponse({
        content: 'An error occurred while processing your request. Please try again.',
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAskQuestion = (e: React.MouseEvent) => {
    if (isLoading || !prompt.trim()) {
      e.preventDefault();
      return;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-color-5 to-primary-color">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl">
          <div className="p-6 text-white bg-gradient-to-r from-primary-color-5 to-primary-color">
            <h1 className="text-2xl font-bold text-center md:text-3xl">
              AI Quran Assistant
            </h1>
            <p className="mt-2 text-center text-gray-100">
              Ask questions about the Quran and Islamic knowledge
            </p>
          </div>

          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask your question about the Quran..."
                  className={`w-full h-32 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-color focus:border-transparent ${
                    isLoading ? 'bg-gray-100' : ''
                  }`}
                  disabled={isLoading}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  text="Back"
                  customStyles="bg-gray-500 text-white px-6 py-2 hover:bg-gray-600 transition-colors"
                  onclick={() => router.back()}
                />
                <Button
                  text={isLoading ? 'Processing...' : 'Ask Question'}
                  customStyles={`${
                    isLoading || !prompt.trim() 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-primary-color hover:bg-primary-color/90'
                  } text-white px-6 py-2 transition-colors`}
                  onclick={handleAskQuestion}
                  type="submit"
                />
              </div>
            </form>

            {isLoading && (
              <div className="flex justify-center mt-8">
                <Loading />
              </div>
            )}

            {response && (
              <div 
                className={`mt-8 p-6 rounded-lg transition-colors ${
                  response.isError ? 'bg-red-50' : 'bg-green-50'
                }`}
              >
                <h2 className="mb-4 text-xl font-semibold">Response:</h2>
                <div 
                  className={`text-lg ${
                    response.isError ? 'text-red-600' : 'text-gray-700'
                  }`}
                >
                  {response.content}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}