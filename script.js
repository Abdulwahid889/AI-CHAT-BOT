// DOM Elements
let prompt = document.querySelector("#prompt");
let submitbtn = document.querySelector("#submit");
let imagebtn = document.querySelector("#image-btn");
let imageInput = document.querySelector("#image-input");
let chatContainer = document.querySelector(".chat-container");

// API URL
const Api_Url = "Your-API-Key Here";

// User object to store message and file data
let user = {
    message: null,
    file: {
        mime_type: null,
        data: null,
    },
};

// Function to generate AI response
async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area");
    let requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            contents: [
                {
                    parts: [
                        { text: user.message },
                        ...(user.file.data ? [{ inline_data: user.file }] : []),
                    ],
                },
            ],
        }),
    };

    try {
        let response = await fetch(Api_Url, requestOptions);

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Error Response Body:", errorBody);
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        let data = await response.json();

        if (!data || !data.candidates || !data.candidates[0].content || !data.candidates[0].content.parts) {
            throw new Error("Invalid API response structure.");
        }

        let apiResponse = data.candidates[0].content.parts[0].text.trim();
        text.innerHTML = apiResponse;
    } catch (error) {
        console.error("Error in generateResponse:", error);
        text.innerHTML = "Something went wrong. Please try again.";
    } finally {
        chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });
        user.file = {}; // Reset file after response
    }
}

// Function to create a chat box
function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

// Handle User Input and AI Response
function handleChatResponse(userMessage) {
    user.message = userMessage;

    let userChatHtml = `<img src="user.png" alt="" id="userImage" width="8%">
    <div class="user-chat-area">
        ${user.message}
        ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}" class="uploaded-image">` : ""}
    </div>`;
    prompt.value = "";

    let userChatBox = createChatBox(userChatHtml, "user-chat-box");
    chatContainer.appendChild(userChatBox);

    chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: "smooth" });

    setTimeout(() => {
        let aiChatHtml = `<img src="ai.png" alt="" id="aiImage" width="10%">
        <div class="ai-chat-area">
            <img src="loading.webp" alt="Loading" class="load" width="50px">
        </div>`;
        let aiChatBox = createChatBox(aiChatHtml, "ai-chat-box");
        chatContainer.appendChild(aiChatBox);

        generateResponse(aiChatBox);
    }, 600);
}


// Event Listeners for Text Input
prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && prompt.value.trim()) {
        handleChatResponse(prompt.value);
    }
});

submitbtn.addEventListener("click", () => {
    if (prompt.value.trim()) {
        handleChatResponse(prompt.value);
    }
});







