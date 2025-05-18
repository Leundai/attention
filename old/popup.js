document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("scrape-btn");
  button.addEventListener("click", async () => {
    const [currentTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (currentTab?.id) {
      chrome.tabs.sendMessage(
        currentTab.id,
        { type: "start_scraping" },
        (response) => {
          console.log("Scraping started:", response);
        }
      );
    }
  });
});
