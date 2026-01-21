export function FormatMoney(amount: number, currency: string, lang: string) {
  if (isNaN(amount)) return "";

  // ----- USD -----
  if (currency === "USD") {
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
    return `$${Math.round(amount)}`;
  }

  // ----- RUB -----
  if (currency === "RUB") {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} млн ₽`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)} тыс ₽`;
    return `${Math.round(amount)} ₽`;
  }

  // ----- KZT -----
  if (currency === "KZT") {
    if (amount >= 1_000_000) return `${(amount / 1_000_000).toFixed(1)} млн ₸`;
    if (amount >= 1_000) return `${(amount / 1_000).toFixed(1)} тыс ₸`;
    return `${Math.round(amount)} ₸`;
  }

  // ----- MNT -----
  if (currency === "MNT") {
    if (amount >= 1_000_000_000)
      return `₮${(amount / 1_000_000_000).toFixed(1)} тэрбум`;
    if (amount >= 1_000_000) return `₮${(amount / 1_000_000).toFixed(1)} сая`;
    if (amount >= 1_000) return `₮${(amount / 1_000).toFixed(1)} мянга`;
    return `₮${Math.round(amount)}`;
  }

  return amount.toLocaleString(lang);
}
