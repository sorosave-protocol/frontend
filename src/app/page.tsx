import Link from "next/link";
import {Navbar} from "@/components/Navbar";
import {getTranslations} from "next-intl/server";

export default async function Home() {
  const t = await getTranslations("home");
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="max-w-3xl">
              <h1 className="text-4xl sm:text-5xl font-bold mb-6">
                {t("title")}
              </h1>
              <p className="text-xl text-primary-100 mb-8">
                {t("subtitle")}
              </p>
              <div className="flex space-x-4">
                <Link
                  href="/groups"
                  className="bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                >
                  {t("browse_groups")}
                </Link>
                <Link
                  href="/groups/new"
                  className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
                >
                  {t("create_group")}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              {t("how_it_works")}
            </h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: t("steps.1_title"),
                  description: t("steps.1_desc"),
                },
                {
                  step: "2",
                  title: t("steps.2_title"),
                  description: t("steps.2_desc"),
                },
                {
                  step: "3",
                  title: t("steps.3_title"),
                  description: t("steps.3_desc"),
                },
                {
                  step: "4",
                  title: t("steps.4_title"),
                  description: t("steps.4_desc"),
                },
              ].map((item) => (
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
              {t("why_sorosave")}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: t("features.trustless"),
                  description: t("features.trustless_desc"),
                },
                {
                  title: t("features.transparent"),
                  description: t("features.transparent_desc"),
                },
                {
                  title: t("features.low_cost"),
                  description: t("features.low_cost_desc"),
                },
              ].map((feature) => (
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
            <p className="text-sm">{t("footer.tagline")}</p>
            <div className="mt-4 space-x-4 text-sm">
              <a
                href="https://github.com/big14way/sorosave"
                className="hover:text-white"
              >
                {t("footer.github")}
              </a>
              <a href="#" className="hover:text-white">
                {t("footer.docs")}
              </a>
              <a href="#" className="hover:text-white">
                {t("footer.discord")}
              </a>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}
