/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Set initial message
chatWindow.innerHTML =
  '<div class="msg ai">Welcome to the L\'Oreal Beauty Assistant. Ask me about skincare, haircare, makeup, fragrance, or personalized beauty routines.</div>';

/* Handle form submit */
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const userMessage = userInput.value.trim();

  if (!userMessage) {
    return;
  }

  // When using Cloudflare, you'll need to POST a `messages` array in the body,
  // and handle the response using: data.choices[0].message.content

  // Show user and assistant messages as chat bubbles.
  const userBubble = document.createElement("div");
  userBubble.className = "msg user";
  userBubble.textContent = userMessage;
  chatWindow.appendChild(userBubble);

  const assistantBubble = document.createElement("div");
  assistantBubble.className = "msg ai";
  assistantBubble.textContent = "Connect to the OpenAI API for a response!";
  chatWindow.appendChild(assistantBubble);

  userInput.value = "";
  chatWindow.scrollTop = chatWindow.scrollHeight;
});
