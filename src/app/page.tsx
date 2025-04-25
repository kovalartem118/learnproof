
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-purple-700 mb-6">
          Ласкаво просимо до LearnProof
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          Платформа для видачі NFT-сертифікатів, що підтверджують завершення онлайн-курсів, вебінарів чи навчальних марафонів.
        </p>

        <div className="grid md:grid-cols-3 gap-6 text-left">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-purple-600 mb-2">🧾 Незмінність</h2>
            <p className="text-gray-600">Сертифікати зберігаються в блокчейні — їх неможливо підробити або видалити.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-purple-600 mb-2">🔗 Перевірка</h2>
            <p className="text-gray-600">Будь-хто може перевірити справжність вашого сертифікату напряму у блокчейні Solana.</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold text-purple-600 mb-2">💼 Портфоліо</h2>
            <p className="text-gray-600">Збирайте сертифікати в одному гаманці, формуючи цифрове навчальне портфоліо.</p>
          </div>
        </div>

        <div className="mt-12">
          <p className="text-gray-800 text-lg mb-4">
            Підключіть гаманець та отримайте свій перший NFT-сертифікат!
          </p>
          <p className="text-sm text-gray-500 italic">* Підключення доступне у верхньому правому куті.</p>
        </div>
      </div>
    </main>
  );
}
