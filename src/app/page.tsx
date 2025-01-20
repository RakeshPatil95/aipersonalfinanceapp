'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Welcome to Personal Finance Tool
        </h1>
        <p className="text-xl text-gray-600">
          Take control of your financial future with our comprehensive budgeting and expense tracking solution.
        </p>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => router.push('/signup')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </button>
          <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </main>

  );
}
