"use client";

import { useTranslations } from "next-intl";

interface RoundProgressProps {
  currentRound: number;
  totalRounds: number;
  contributionsReceived: number;
  totalMembers: number;
}

export function RoundProgress({
  currentRound,
  totalRounds,
  contributionsReceived,
  totalMembers,
}: RoundProgressProps) {
  const t = useTranslations("roundProgress");
  const roundProgress = totalRounds > 0 ? (currentRound / totalRounds) * 100 : 0;
  const contributionProgress =
    totalMembers > 0 ? (contributionsReceived / totalMembers) * 100 : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {t("title")}
      </h3>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">{t("overall")}</span>
            <span className="font-medium text-gray-900">
              {t("roundOf", { currentRound, totalRounds })}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary-500 h-2 rounded-full transition-all"
              style={{ width: `${roundProgress}%` }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">
              {t("currentContributions")}
            </span>
            <span className="font-medium text-gray-900">
              {contributionsReceived} / {totalMembers}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all"
              style={{ width: `${contributionProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
