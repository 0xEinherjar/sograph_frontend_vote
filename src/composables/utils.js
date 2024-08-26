export const useUtils = () => {
  function truncateAddress(address) {
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  const toNumber = (str) => Number(String(str).replace(/n/i, ""));

  function dateFormat(date) {
    const newDate = new Date();
    const dayDate = new Date();
    dayDate.setDate(newDate.getDate() - 1);
    if (new Date(date) > dayDate) {
      if (new Date(date).getHours() != newDate.getHours()) {
        const time =
          new Date(date).getHours() < newDate.getHours()
            ? newDate.getHours() - new Date(date).getHours()
            : 24 - new Date(date).getHours() + newDate.getHours();
        return time == 1 ? `${time} hour ago` : `${time} hours ago`;
      } else {
        if (new Date(date).getMinutes() != newDate.getMinutes()) {
          const time =
            new Date(date).getMinutes() < newDate.getMinutes()
              ? newDate.getMinutes() - new Date(date).getMinutes()
              : 60 - new Date(date).getMinutes() + newDate.getMinutes();
          return time == 1 ? `${time} minute ago` : `${time} minutes ago`;
        } else {
          const time =
            new Date(date).getSeconds() < newDate.getSeconds()
              ? newDate.getSeconds() - new Date(date).getSeconds()
              : 60 - new Date(date).getSeconds() + newDate.getSeconds();
          return time == 1 ? `${time} second ago` : `${time} seconds ago`;
        }
      }
    }
    const yearDate = new Date();
    yearDate.setFullYear(newDate.getFullYear() - 1);
    if (new Date(date) > yearDate) {
      return new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
      }).format(new Date(date));
    }
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
    }).format(new Date(date));
  }

  async function copyContent(item) {
    try {
      await navigator.clipboard.writeText(item);
      alert("Address copied to clipboard");
    } catch (err) {
      alert("Failed to copy");
    }
  }

  function isAddress(address) {
    if (!address) return false;
    if (!(address.length === 42 && address.startsWith("0x"))) return false;
    return true;
  }

  return {
    truncateAddress,
    toNumber,
    dateFormat,
    copyContent,
    isAddress,
  };
};
