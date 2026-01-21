export function FormatMileage(mileage: number, lang: string) {
  if (!mileage || isNaN(mileage)) return "";

  let shortValue = mileage;
  let suffix = "";

  if (mileage >= 1_000_000) {
    shortValue = mileage / 1_000_000;
    if (lang === "ru") suffix = " млн км";
    else if (lang === "mn") suffix = " сая км";
    else if (lang === "kk") suffix = " млн км";
    else suffix = "M km";
  } else if (mileage >= 1_000) {
    shortValue = mileage / 1_000;
    if (lang === "ru") suffix = " тыс. км";
    else if (lang === "mn") suffix = " мянга км";
    else if (lang === "kk") suffix = " мың км";
    else suffix = "K km";
  } else {
    if (lang === "ru") suffix = " км";
    else if (lang === "mn") suffix = " км";
    else if (lang === "kk") suffix = " км";
    else suffix = " km";
  }

  const displayValue =
    shortValue < 10 ? shortValue.toFixed(1) : Math.round(shortValue);

  return `${displayValue}${suffix}`;
}
