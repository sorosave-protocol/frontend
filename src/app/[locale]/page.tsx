import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { getLocale, getMessages } from "@/i18n/messages";

export default function Home({ params }: { params: { locale: string } }) {
  const locale = getLocale(params.locale);
  const messages = getMessages(locale).home;

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                {messages.hero.title}
              </h1>
              <p className="text-xl text-primary-100 mb-8">
                {messages.hero.description}
              </p>
              <div className="flex space-x-4">
                <Link
                  href={`/${locale}/groups`}
                  className="bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  {messages.hero.browseGroups}
                </Link>
                <Link
                  href={`/${locale}/groups/new`}
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  {messages.hero.createGroup}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {messages.how.title}
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {Object.values(messages.how.steps).map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-gray-100 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {messages.features.title}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {Object.values(messages.features.items).map((feature) => (
                <div
                  key={feature.title}
                  className="bg-white p-6 rounded-xl shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-400 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-lg font-semibold text-white mb-2">SoroSave</p>
            <p className="text-sm">
              {messages.footer.description}
            </p>
            <div className="mt-4 space-x-4 text-sm">
              <a
                href="https://github.com/big14way/sorosave"
                className="hover:text-white"
              >
                GitHub
              </a>
              <a href="#" className="hover:text-white">
                {messages.footer.docs}
              </a>
              <a href="#" className="hover:text-white">
                {messages.footer.discord}
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
