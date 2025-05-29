export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-purple-700 mb-4 sm:mb-6">
          Welcome to LearnProof
        </h1>
        <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-8 px-4">
          A platform for issuing NFT certificates confirming the completion of online courses, webinars, or educational marathons.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-left">
          <div className="bg-white rounded-xl shadow p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-purple-600 mb-2">🧾 Immutability</h2>
            <p className="text-sm sm:text-base text-gray-600">Certificates are stored on the blockchain — they cannot be forged or deleted.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-purple-600 mb-2">🔗 Verification</h2>
            <p className="text-sm sm:text-base text-gray-600">Anyone can verify the authenticity of your certificate directly on the Solana blockchain.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-semibold text-purple-600 mb-2">💼 Portfolio</h2>
            <p className="text-sm sm:text-base text-gray-600">Collect your certificates in one wallet, forming a digital learning portfolio.</p>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 px-4">
          <p className="text-base sm:text-lg text-gray-800 mb-3 sm:mb-4">
            Connect your wallet and get your first NFT certificate!
          </p>
          <p className="text-xs sm:text-sm text-gray-500 italic">* Connection is available in the top right corner.</p>
        </div>
      </div>
    </main>
  );
}