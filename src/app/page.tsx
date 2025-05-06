export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-6">
          Welcome to LearnProof
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          A platform for issuing NFT certificates confirming the completion of online courses, webinars, or educational marathons.
        </p>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-purple-600 mb-2">🧾 Immutability</h2>
            <p className="text-gray-600">Certificates are stored on the blockchain — they cannot be forged or deleted.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-purple-600 mb-2">🔗 Verification</h2>
            <p className="text-gray-600">Anyone can verify the authenticity of your certificate directly on the Solana blockchain.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-purple-600 mb-2">💼 Portfolio</h2>
            <p className="text-gray-600">Collect your certificates in one wallet, forming a digital learning portfolio.</p>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-gray-800 text-lg mb-4">
            Connect your wallet and get your first NFT certificate!
          </p>
          <p className="text-sm text-gray-500 italic">* Connection is available in the top right corner.</p>
        </div>
      </div>
    </main>
  );
}