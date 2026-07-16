/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

/*
Replace this later with your Cloudflare Worker URL.

During the final version, it should look similar to:
https://your-worker-name.your-account.workers.dev
*/
const API_URL = "https://loreal-beauty-assistant.agusionucherish.workers.dev/";

/* The chatbot's instructions */
const systemPrompt = `
You are the L'Oréal Beauty Assistant.

Your purpose is to help users with:
- L'Oréal skincare products
- L'Oréal haircare products
- L'Oréal makeup products
- L'Oréal fragrances
- Personalized beauty routines
- Beauty and product recommendations

Ask helpful follow-up questions when necessary, such as the user's skin type,
hair type, beauty goals, sensitivities, preferences, or budget.

Do not claim that a product will diagnose, treat, cure, or prevent a medical condition.

If a question is unrelated to L'Oréal products, beauty routines, skincare,
haircare, makeup, or fragrance, politely respond:

"I'm here to help with L'Oréal products and beauty-related questions. Please
ask me about skincare, haircare, makeup, fragrance, or a personalized routine."

Keep responses friendly, clear, helpful, and concise.
`;

/* Store conversation history */
const messages = [
  {
    role: "system",
    content: systemPrompt,
  },
];

/* Display the initial welcome message */
chatWindow.innerHTML = `
  <div class="msg ai">
    Welcome to the L'Oréal Beauty Assistant. 
    Ask me about skincare, haircare,
    makeup, fragrance, or personalized beauty routines.
  </div>
`;

/* Add a message bubble to the screen */
function addMessage(message, sender) {
  const messageBubble = document.createElement("div");
  messageBubble.className = `msg ${sender}`;
  messageBubble.textContent = message;

  chatWindow.appendChild(messageBubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  return messageBubble;
}

/* Handle form submission */
chatForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const userMessage = userInput.value.trim();

  if (!userMessage) {
    return;
  }

  /* Display the user's message */
  addMessage(userMessage, "user");

  /* Add the user's message to conversation history */
  messages.push({
    role: "user",
    content: userMessage,
  });

  /* Clear and temporarily disable the input */
  userInput.value = "";
  userInput.disabled = true;

  const submitButton = chatForm.querySelector(
    'button[type="submit"], input[type="submit"]',
  );

  if (submitButton) {
    submitButton.disabled = true;
  }

  /* Show a temporary loading message */
  const loadingBubble = addMessage("Thinking...", "ai");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error?.message ||
          data.error ||
          "The chatbot request was unsuccessful.",
      );
    }

    const assistantMessage =
      data.choices?.[0]?.message?.content ||
      data.response ||
      data.message ||
      "Sorry, I could not create a response.";

    /* Replace the loading text with the real response */
    loadingBubble.textContent = assistantMessage;

    /* Save the assistant response in conversation history */
    messages.push({
      role: "assistant",
      content: assistantMessage,
    });
  } catch (error) {
    console.error("Chatbot error:", error);

    loadingBubble.textContent =
      "Sorry, I couldn't connect to the beauty assistant. Please try again.";
  } finally {
    userInput.disabled = false;

    if (submitButton) {
      submitButton.disabled = false;
    }

    userInput.focus();
  }
});
