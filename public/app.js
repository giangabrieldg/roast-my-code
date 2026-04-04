async function roastCode() {
  const code = document.getElementById("codeInput").value.trim();
  const btn = document.getElementById("roastBtn");

  // Validation
  if (!code) {
    showError("Please paste some code first. We need something to judge.");
    return;
  }
  if (code.length < 10) {
    showError("That's barely code. Give us at least a few lines to work with!");
    return;
  }

  // UI: loading state
  setLoading(true);
  hideError();
  hideResults();

  try {
    const res = await fetch("/api/roast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Something went wrong on the server.");
    }

    showResults(data);
  } catch (err) {
    showError(err.message || "Network error. Is the server running?");
  } finally {
    setLoading(false);
  }
}

function showResults({ roast, suggestions, explanation }) {
  document.getElementById("placeholder").classList.add("d-none");
  document.getElementById("results").classList.remove("d-none");

  document.getElementById("roastText").textContent =
    roast || "No roast generated.";
  document.getElementById("suggestText").textContent =
    suggestions || "No suggestions generated.";
  document.getElementById("explainText").textContent =
    explanation || "No explanation generated.";
}

function hideResults() {
  document.getElementById("results").classList.add("d-none");
  document.getElementById("placeholder").classList.remove("d-none");
}

function showError(msg) {
  const box = document.getElementById("errorBox");
  document.getElementById("errorMsg").textContent = msg;
  box.classList.remove("d-none");
}

function hideError() {
  document.getElementById("errorBox").classList.add("d-none");
}

function setLoading(on) {
  const btn = document.getElementById("roastBtn");
  btn.querySelector(".btn-text").classList.toggle("d-none", on);
  btn.querySelector(".btn-loading").classList.toggle("d-none", !on);
  btn.disabled = on;
}

function clearAll() {
  document.getElementById("codeInput").value = "";
  hideResults();
  hideError();
}

// Allow Ctrl+Enter to submit
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("codeInput").addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") roastCode();
  });
});
