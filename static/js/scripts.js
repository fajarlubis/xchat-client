document.addEventListener('DOMContentLoaded', () => {
    const chatConfig = {
        allowedOrigin: window.location.origin,
        backendUrl: 'https://api.livechat260.com',
        backgroundColor: '#f4f6f9', 
        headerColor: '#007bff',
        fontFamily: 'Roboto',
    };

    function startChatSession() {
        const chatBox = new LiveChat(chatConfig);
        
        if (window.innerWidth <= 768) {
            chatBox.toggleExpand(document.getElementById('live-chat'), document.getElementById('expand-btn'));
        }
        document.getElementById('chat-trigger-button').style.display = 'none';
    }

    function endChatSession() {
        const chatContainer = document.getElementById('live-chat');
        if (chatContainer) chatContainer.remove();
        document.getElementById('chat-trigger-button').style.display = 'flex';
    }

    window.endChatSession = endChatSession;
    document.getElementById('chat-trigger-button').addEventListener('click', startChatSession);
});