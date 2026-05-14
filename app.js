const API_URL = "https://cre8tive-vib3s-1.onrender.com/api/chat";

async function sendMessage() {
  const input = document.getElementById("input");
  const chatBox = document.getElementById("chat");

  const userText = input.value.trim();
  if (!userText) return;

  input.value = "";

  chatBox.innerHTML += `<div><b>You:</b> ${userText}</div>`;

  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messages: [
          { role: "user", content: userText }
        ]
      })
    });

    const data = await res.json();

    chatBox.innerHTML += `<div><b>AI:</b> ${data.reply || "No response"}</div>`;

  } catch (err) {
    chatBox.innerHTML += `<div><b>AI:</b> Connection error</div>`;
  }
}
