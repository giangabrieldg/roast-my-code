// ─── Toast System ────────────────────────────
function showToast(msg, duration = 4000) {
  const container = document.getElementById("toastContainer");

  const toast = document.createElement("div");
  toast.className = "pixel-toast";

  const msgSpan = document.createElement("span");
  msgSpan.textContent = msg;

  const closeBtn = document.createElement("button");
  closeBtn.className = "toast-close";
  closeBtn.textContent = "[X]";
  closeBtn.onclick = () => dismissToast(toast);

  toast.appendChild(msgSpan);
  toast.appendChild(closeBtn);
  container.appendChild(toast);

  setTimeout(() => dismissToast(toast), duration);
}

function dismissToast(toast) {
  if (!toast.parentElement) return;
  toast.classList.add("toast-exit");
  setTimeout(() => toast.remove(), 300);
}

// ─── Main Logic ───────────────────────────────
async function roastCode() {
  const code = document.getElementById("codeInput").value.trim();

  // Validation → toast instead of inline error
  if (!code) {
    showToast("Please paste some code first. We need something to judge.");
    return;
  }
  if (code.length < 10) {
    showToast("That's barely code. Give us at least a few lines to work with!");
    return;
  }
  if (code.length > 10000) {
    showToast(
      "Code is too long! Keep it under 10,000 characters so we can roast it properly.",
    );
    return;
  }

  setLoading(true);
  hideResults();

  try {
    const res = await fetch("https://rmc-backend-fzqi.onrender.com/api/roast", {
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
    showToast(err.message || "Network error. Is the server running?");
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

function setLoading(on) {
  const btn = document.getElementById("roastBtn");
  btn.querySelector(".btn-text").classList.toggle("d-none", on);
  btn.querySelector(".btn-loading").classList.toggle("d-none", !on);
  btn.disabled = on;
}

function clearAll() {
  document.getElementById("codeInput").value = "";
  hideResults();
}

// Allow Ctrl+Enter to submit
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("codeInput").addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") roastCode();
  });
});
