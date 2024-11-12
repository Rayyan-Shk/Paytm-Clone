"use client"
import Image from 'next/image';
import { useRouter } from 'next/navigation';


export default function VenmoLanding() {

  const router = useRouter(); // Hook for navigation

  const handleStartWallet = () => {
    // Programmatically navigate to the /transfer page
    router.push('/transfer');
  };

  return (
    <div className="max-w-7xl w-full flex flex-col md:flex-row items-center justify-between relative">
      <div className="md:w-3/4 bg-blue-100 rounded-3xl p-12 pt-20 z-10">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-6xl font-bold leading-tight">
            Fast, safe<br />
            social<br />
            payments
          </h1>
          <p className="text-gray-600 text-xl">
            Pay, get paid, grow a business, and more. Join<br />
            the tens of millions of people on Venmo.
          </p>
          <button className="bg-black text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-600 transition duration-300"
           onClick={handleStartWallet}> 
            Start your wallet
          </button>
        </div>
      </div>
      {/* Move the image slightly more left */}
      <div className="md:absolute md:right-[-10px] md:top-1/2 md:transform md:-translate-y-1/4 z-20">
        <Image
          src="/venmo.png"
          alt="Friends at a picnic"
          width={500}
          height={300}
          className="rounded-2xl shadow-lg"
        />
      </div>
    </div>
  );
}