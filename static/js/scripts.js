document.addEventListener('DOMContentLoaded', () => {
    // Configuration object for the Live Chat plugin
    const chatConfig = {
        allowedOrigin: window.location.origin, // Ensure messages are only allowed from the main website origin
        backendUrl: 'https://api.example.com', // Replace with your backend URL
        backgroundColor: '#f4f6f9', // Chat background color
        headerColor: '#007bff', // Header background color
        fontFamily: 'Roboto', // Font family from Google Fonts
    };

    // Function to show the chat box and start a new session
    function startChatSession() {
        const chatBox = new LiveChat(chatConfig);
        // Expand the chat box on mobile devices by default
        if (window.innerWidth <= 768) {
            chatBox.toggleExpand(document.getElementById('live-chat'), document.getElementById('expand-btn'));
        }
        // Hide the trigger button after starting the session
        document.getElementById('chat-trigger-button').style.display = 'none';
    }

    // Function to end the chat session and reset the UI
    function endChatSession() {
        const chatContainer = document.getElementById('live-chat');
        if (chatContainer) chatContainer.remove(); // Remove chat box from the DOM
        // Show the trigger button again
        document.getElementById('chat-trigger-button').style.display = 'flex';
    }

    // Expose endChatSession function globally to be called from the chat script
    window.endChatSession = endChatSession;

    // Trigger button event listener
    document.getElementById('chat-trigger-button').addEventListener('click', startChatSession);
});