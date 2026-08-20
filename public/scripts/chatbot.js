// Inject Chatbot HTML
const chatbotHTML = 
<style>
    #atelier-chatbot {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 9999;
        font-family: 'Inter', sans-serif;
    }
    #chatbot-toggle {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: var(--accent-primary, #6366f1);
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(99, 102, 241, 0.4);
        transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        display: flex;
        align-items: center;
        justify-content: center;
    }
    #chatbot-toggle:hover {
        transform: scale(1.1);
    }
    #chatbot-window {
        position: absolute;
        bottom: 80px;
        right: 0;
        width: 350px;
        height: 450px;
        background: rgba(10, 10, 15, 0.85);
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 16px;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        opacity: 0;
        pointer-events: none;
        transform: translateY(20px) scale(0.95);
        transition: all 0.3s ease;
        box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    }
    #chatbot-window.active {
        opacity: 1;
        pointer-events: all;
        transform: translateY(0) scale(1);
    }
    .chat-header {
        padding: 1rem;
        background: rgba(255,255,255,0.05);
        border-bottom: 1px solid rgba(255,255,255,0.1);
        font-weight: 600;
        color: white;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .chat-body {
        flex-grow: 1;
        padding: 1rem;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }
    .message {
        max-width: 80%;
        padding: 0.8rem 1rem;
        border-radius: 12px;
        font-size: 0.9rem;
        line-height: 1.4;
    }
    .message.bot {
        background: rgba(255,255,255,0.1);
        color: #e2e8f0;
        align-self: flex-start;
        border-bottom-left-radius: 4px;
    }
    .message.user {
        background: var(--accent-primary, #6366f1);
        color: white;
        align-self: flex-end;
        border-bottom-right-radius: 4px;
    }
    .chat-input-area {
        padding: 1rem;
        border-top: 1px solid rgba(255,255,255,0.1);
        display: flex;
        gap: 0.5rem;
    }
    .chat-input-area input {
        flex-grow: 1;
        padding: 0.8rem;
        border-radius: 8px;
        border: 1px solid rgba(255,255,255,0.2);
        background: rgba(0,0,0,0.3);
        color: white;
        outline: none;
        font-family: inherit;
    }
    .chat-input-area button {
        padding: 0 1rem;
        background: var(--accent-primary, #6366f1);
        border: none;
        border-radius: 8px;
        color: white;
        cursor: pointer;
        font-weight: 600;
    }
</style>
<div id="atelier-chatbot">
    <div id="chatbot-window">
        <div class="chat-header">
            <span>Atelier AI</span>
            <button id="close-chat" style="background:none;border:none;color:white;cursor:pointer;font-size:1.2rem;">&times;</button>
        </div>
        <div class="chat-body" id="chat-body">
            <div class="message bot">Hello! I'm Atelier AI. Ask me anything about our services.</div>
        </div>
        <form class="chat-input-area" id="chat-form">
            <input type="text" id="chat-input" placeholder="Type your question..." required autocomplete="off">
            <button type="submit">Send</button>
        </form>
    </div>
    <button id="chatbot-toggle">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
    </button>
</div>
\;

document.body.insertAdjacentHTML('beforeend', chatbotHTML);

const toggleBtn = document.getElementById('chatbot-toggle');
const closeBtn = document.getElementById('close-chat');
const chatWindow = document.getElementById('chatbot-window');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatBody = document.getElementById('chat-body');

toggleBtn.addEventListener('click', () => chatWindow.classList.toggle('active'));
closeBtn.addEventListener('click', () => chatWindow.classList.remove('active'));

function addMessage(text, sender) {
    const div = document.createElement('div');
    div.className = \message \\;
    div.innerText = text;
    chatBody.appendChild(div);
    chatBody.scrollTop = chatBody.scrollHeight;
}

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const msg = chatInput.value.trim();
    if(!msg) return;
    
    addMessage(msg, 'user');
    chatInput.value = '';

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: msg })
        });
        const data = await res.json();
        addMessage(data.response, 'bot');
    } catch(err) {
        addMessage("Sorry, I'm having trouble connecting to the server.", 'bot');
    }
});
