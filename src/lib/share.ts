export const simulateDownload = (download: string, href: string): void => {
  const a = document.createElement("a");
  a.download = download;
  a.href = href;
  a.click();
  a.remove();
};

export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    console.error("Failed to copy text: ", err);
    throw err;
  }
};