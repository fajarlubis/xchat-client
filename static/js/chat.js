// chat.js - hosted on https://chat.example.com/chat.js

class LiveChat {
    constructor(config) {
        this.config = config;
        this.isExpanded = false; // Track if the chat is expanded
        this.isHidden = false;   // Track if the chat is hidden
        this.unreadCount = 0;    // Track the number of unread messages
        this.initChatBox();
    }

    initChatBox() {
        // Load Google Font dynamically based on config
        this.loadGoogleFont(this.config.fontFamily);

        // Set default position and size for the chat box
        this.defaultPosition = { bottom: '0px', right: '20px' };
        this.defaultSize = { width: '300px', height: '400px' };

        // Create chat container
        const chatContainer = document.createElement('div');
        chatContainer.id = 'live-chat';
        chatContainer.style.position = 'fixed';
        chatContainer.style.bottom = this.defaultPosition.bottom;
        chatContainer.style.right = this.defaultPosition.right;
        chatContainer.style.width = this.defaultSize.width;
        chatContainer.style.height = this.defaultSize.height;
        chatContainer.style.border = '1px solid #ccc';
        chatContainer.style.backgroundColor = this.config.backgroundColor || '#ffffff';
        chatContainer.style.display = 'flex';
        chatContainer.style.flexDirection = 'column';
        chatContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        chatContainer.style.zIndex = '1000'; // Ensure the chat is above other content
        chatContainer.style.fontFamily = this.config.fontFamily;
        document.body.appendChild(chatContainer);

        // Create chat header with buttons and unread counter
        const header = document.createElement('div');
        header.style.backgroundColor = this.config.headerColor || '#007bff';
        header.style.color = '#fff';
        header.style.padding = '10px';
        header.style.display = 'flex';
        header.style.justifyContent = 'space-between';
        header.style.alignItems = 'center';
        header.style.cursor = 'pointer'; // Set cursor to pointer to indicate clickable

        // Unread counter badge
        const unreadCounter = document.createElement('span');
        unreadCounter.id = 'unread-counter';
        unreadCounter.style.display = 'none'; // Hidden by default
        unreadCounter.style.backgroundColor = '#ff0000';
        unreadCounter.style.color = '#fff';
        unreadCounter.style.borderRadius = '50%';
        unreadCounter.style.padding = '2px 6px';
        unreadCounter.style.fontSize = '12px';
        unreadCounter.style.marginLeft = '10px';

        // Toggle hide/show when header is clicked
        header.addEventListener('click', () => {
            if (!this.isExpanded) { // Disable header click when expanded
                this.toggleHide(chatContainer, messages, footer, expandButton, endButton, unreadCounter);
            }
        });

        // Buttons container
        const buttonsContainer = document.createElement('div');

        // Expand/Downsize button
        const expandButton = document.createElement('button');
        expandButton.id = 'expand-btn';
        expandButton.innerHTML = '<i class="fas fa-expand"></i>'; // Font Awesome expand icon
        expandButton.style.marginRight = '5px';
        expandButton.style.border = 'none';
        expandButton.style.background = 'transparent';
        expandButton.style.color = '#fff';
        expandButton.style.cursor = 'pointer';
        expandButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent header click event when clicking expand button
            this.toggleExpand(chatContainer, expandButton);
        });

        // End Session button
        const endButton = document.createElement('button');
        endButton.id = 'end-btn';
        endButton.innerHTML = '<i class="fas fa-sign-out-alt"></i>'; // Font Awesome end session icon
        endButton.style.border = 'none';
        endButton.style.background = 'transparent';
        endButton.style.color = '#fff';
        endButton.style.cursor = 'pointer';
        endButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent header click event when clicking end button
            this.endChat(); // End chat session when clicked
        });

        // Append buttons and counter to the header
        buttonsContainer.appendChild(expandButton);
        buttonsContainer.appendChild(endButton);
        header.appendChild(document.createTextNode('Chat Support'));
        header.appendChild(unreadCounter);
        header.appendChild(buttonsContainer);
        chatContainer.appendChild(header);

        // Create chat messages area with sample chat bubbles
        const messages = document.createElement('div');
        messages.id = 'chat-messages';
        messages.style.flex = '1';
        messages.style.padding = '10px';
        messages.style.overflowY = 'auto';
        messages.style.display = 'flex';
        messages.style.flexDirection = 'column'; // Ensure messages stack vertically
        messages.style.gap = '5px'; // Add spacing between chat bubbles
        chatContainer.appendChild(messages);

        // Add sample chat bubbles
        this.addSampleMessages(messages);

        // Create chat footer with input and attachment button
        const footer = document.createElement('div');
        footer.style.padding = '10px';
        footer.style.display = 'flex';
        footer.style.borderTop = `1px solid ${this.config.headerColor || '#007bff'}`; // Add a border to separate from messages
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Type your message...';
        input.style.flex = '1';
        input.style.padding = '8px';
        input.style.border = `1px solid ${this.config.headerColor || '#007bff'}`;
        input.style.borderRadius = '4px';

        // Attachment button
        const attachButton = document.createElement('button');
        attachButton.innerHTML = '<i class="fas fa-paperclip"></i>'; // Font Awesome attachment icon
        attachButton.title = 'Attach a file';
        attachButton.style.marginLeft = '5px';
        attachButton.style.border = 'none';
        attachButton.style.background = 'transparent';
        attachButton.style.cursor = 'pointer';
        attachButton.style.color = this.config.headerColor || '#007bff';
        attachButton.addEventListener('click', () => {
            alert('Attachment functionality will be added here.');
            // Add attachment handling functionality here
        });

        footer.appendChild(input);
        footer.appendChild(attachButton);
        chatContainer.appendChild(footer);

        // Send message on Enter key press
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                const message = input.value;
                const timestamp = this.getCurrentTimestamp();
                messages.innerHTML += `<div class="chat-bubble user-bubble">${message} <span class="timestamp">${timestamp}</span></div>`;
                input.value = '';
                this.sendMessage(message);
                messages.scrollTop = messages.scrollHeight; // Scroll to the bottom
            }
        });

        // Listen for messages from the main website
        window.addEventListener('message', (event) => {
            if (!event.origin.includes(this.config.allowedOrigin)) return; // Security check
            const { userId, userState } = event.data;
            this.handleUserState(userState, unreadCounter);
        });

        // Simulate agent joining the conversation after a delay
        setTimeout(() => {
            this.notifyAgentJoined(messages);
        }, 2000); // Simulate a delay of 2 seconds before agent joins
    }

    toggleExpand(chatContainer, expandButton) {
        if (!this.isExpanded) {
            // Expand to full screen
            chatContainer.style.position = 'absolute';
            chatContainer.style.top = '0';
            chatContainer.style.left = '0';
            chatContainer.style.bottom = '0'; // Reset bottom to prevent overlap
            chatContainer.style.right = '0';  // Reset right to prevent overlap
            chatContainer.style.width = '100vw';
            chatContainer.style.height = '100vh';
            expandButton.innerHTML = '<i class="fas fa-compress"></i>'; // Change icon to indicate downsize
            this.isExpanded = true;
        } else {
            // Resize back to default size and position at the bottom right
            chatContainer.style.position = 'fixed';
            chatContainer.style.top = ''; // Clear the top property
            chatContainer.style.left = ''; // Clear the left property
            chatContainer.style.bottom = this.defaultPosition.bottom;
            chatContainer.style.right = this.defaultPosition.right;
            chatContainer.style.width = this.defaultSize.width;
            chatContainer.style.height = this.defaultSize.height;
            expandButton.innerHTML = '<i class="fas fa-expand"></i>'; // Change icon back to expand
            this.isExpanded = false;
        }
    }

    toggleHide(chatContainer, messages, footer, expandButton, endButton, unreadCounter) {
        if (!this.isHidden) {
            messages.style.display = 'none'; // Hide the chat messages area
            footer.style.display = 'none';   // Hide the footer
            expandButton.style.display = 'none'; // Hide the expand button
            endButton.style.display = 'none'; // Hide the end chat button
            chatContainer.style.height = '40px'; // Adjust height to show only the header
            this.isHidden = true;
        } else {
            messages.style.display = 'flex'; // Show the chat messages area
            footer.style.display = 'flex';   // Show the footer
            expandButton.style.display = 'inline-block'; // Show the expand button
            endButton.style.display = 'inline-block'; // Show the end chat button
            chatContainer.style.height = this.defaultSize.height;
            this.isHidden = false;
            this.resetUnreadCounter(unreadCounter); // Reset unread counter when shown
        }
    }

    updateUnreadCounter(unreadCounter) {
        this.unreadCount++;
        unreadCounter.textContent = this.unreadCount;
        unreadCounter.style.display = 'inline-block';
    }

    resetUnreadCounter(unreadCounter) {
        this.unreadCount = 0;
        unreadCounter.style.display = 'none';
    }

    endChat() {
        // Placeholder for ending the chat session
        alert('Chat session ended.');
        // Call the callback function to notify the main website
        if (typeof window.endChatSession === 'function') {
            window.endChatSession();
        }
        // Additional logic like sending a "chat ended" message to the backend can be added here
        this.sendMessage('Chat session has been ended by the user.');
    }

    sendMessage(message) {
        // Placeholder for sending messages to the backend
        fetch(`${this.config.backendUrl}/send-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
    }

    handleUserState(state, unreadCounter) {
        // Handle user state to trigger automatic responses
        fetch(`${this.config.backendUrl}/auto-message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ state })
        })
            .then(response => response.json())
            .then(data => {
                const timestamp = this.getCurrentTimestamp();
                document.getElementById('chat-messages').innerHTML += `<div class="chat-bubble bot-bubble">${data.message} <span class="timestamp">${timestamp}</span></div>`;
                if (this.isHidden) {
                    this.updateUnreadCounter(unreadCounter); // Update counter if hidden
                }
            });
    }

    addSampleMessages(messages) {
        // Add sample chat bubbles to demonstrate message styling
        const timestamp = this.getCurrentTimestamp();
        messages.innerHTML += `<div class="chat-bubble bot-bubble">Hello! How can I help you today? <span class="timestamp">${timestamp}</span></div>`;
        messages.innerHTML += `<div class="chat-bubble user-bubble">I need some assistance with my order. <span class="timestamp">${timestamp}</span></div>`;
        messages.innerHTML += `<div class="chat-bubble bot-bubble">Sure! Could you please provide your order number? <span class="timestamp">${timestamp}</span></div>`;

        // Scroll to the bottom to show the latest messages
        messages.scrollTop = messages.scrollHeight;
    }

    notifyAgentJoined(messages) {
        // Display a system message when an agent joins the conversation
        const timestamp = this.getCurrentTimestamp();
        messages.innerHTML += `<div class="chat-bubble system-bubble">Agent has joined the conversation. <span class="timestamp">${timestamp}</span></div>`;
        messages.scrollTop = messages.scrollHeight; // Scroll to the bottom
    }

    getCurrentTimestamp() {
        // Get the current timestamp in HH:MM format
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    loadGoogleFont(fontFamily) {
        // Load Google Font dynamically based on config
        if (fontFamily) {
            const link = document.createElement('link');
            link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(
                ' ',
                '+'
            )}&display=swap`;
            link.rel = 'stylesheet';
            document.head.appendChild(link);
        }
    }
}

// Expose the LiveChat class to the global scope
window.LiveChat = LiveChat;

// Load Font Awesome for icons
const fontAwesomeLink = document.createElement('link');
fontAwesomeLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
fontAwesomeLink.rel = 'stylesheet';
document.head.appendChild(fontAwesomeLink);

// CSS for chat bubbles (added dynamically for demonstration purposes)
const style = document.createElement('style');
style.innerHTML = `
    .chat-bubble {
        max-width: 80%;
        padding: 10px;
        margin: 5px 0;
        border-radius: 10px;
        line-height: 1.4;
        display: inline-block;
        word-wrap: break-word;
        position: relative;
    }
    .user-bubble {
        background-color: #e0f7fa;
        margin-left: auto;
        text-align: right;
    }
    .bot-bubble {
        background-color: #f1f1f1;
        margin-right: auto;
        text-align: left;
    }
    .system-bubble {
        background-color: #ffe082;
        margin: 0 auto;
        text-align: center;
        font-style: italic;
    }
    .timestamp {
        font-size: 10px;
        color: #999;
        display: block;
        margin-top: 5px;
        text-align: right;
    }
`;
document.head.appendChild(style);
