// wallet.js

(async () => {
  // Wait for DOM ready
  if (document.readyState === "loading") {
    await new Promise(r => document.addEventListener("DOMContentLoaded", r));
  }

  const input = document.querySelector('.search-box input');

  if (!input) {
    console.error("No input found inside '.search-box'");
    return;
  }

  async function checkNearAccount(accountId) {
    const rpcUrl = "https://rpc.shitzuapes.xyz";
    const body = {
      jsonrpc: "2.0",
      id: "dontcare",
      method: "query",
      params: {
        request_type: "view_account",
        finality: "final",
        account_id: accountId,
      },
    };

    try {
      const response = await fetch(rpcUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (data.error && data.error.message.includes("does not exist")) {
        return false;
      } else if (data.result) {
        return true;
      } else {
        console.warn("Unexpected response:", data);
        return null;
      }
    } catch (error) {
      console.error("Error checking account:", error);
      return null;
    }
  }

input.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();

    const rawName = input.value.trim();
    if (!rawName) {
      input.style.outline = 'none';
      return;
    }

    const accountName = rawName.endsWith('.near') ? rawName : rawName + '.near';

    input.style.outline = '2px solid gray'; // checking

    const exists = await checkNearAccount(accountName);

    if (exists === true) {
      input.style.outline = '1px solid red';
    } else {
      input.style.outline = '1px solid #00ec97';
    }
  }
});
})();
