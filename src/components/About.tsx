"use client";

import { useTranslation } from "@/components/IntlProvider";

export function About() {
  const { t } = useTranslation();
  return (
    <div
      className={`
        max-w-xl mx-auto h-full space-y-8
        [&_p]:mb-3
      `}
    >
      <section>
        <h1 className="font-bold">{t("About.About.title")}</h1>
        <p>{t("About.About.content")}</p>
      </section>
      <section>
        <h2 className="font-bold">{t("About.Dao.title")}</h2>
        <p>{t("About.Dao.content")}</p>
      </section>
      <section>
        <h2 className="font-bold">{t("About.HowToUse.title")}</h2>
        <p>{t("About.HowToUse.content")}</p>
      </section>
      <section>
        <h2 className="font-bold">{t("About.Why.title")}</h2>
        <p>{t("About.Why.content")}</p>
      </section>
      <section>
        <h2 className="font-bold">{t("About.WhyMemorize.title")}</h2>
        <p>{t("About.WhyMemorize.content")}</p>
      </section>
    </div>
  );
}
