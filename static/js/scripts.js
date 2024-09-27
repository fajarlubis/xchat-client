function toggleReadMore(button) {
    const fullText = button.previousElementSibling;
    if (fullText.style.display === "none" || fullText.style.display === "") {
        fullText.style.display = "block";
        button.textContent = "Read Less";
    } else {
        fullText.style.display = "-webkit-box"; // Collapse the text back
        button.textContent = "Read More";
    }
}

document.querySelector('.menu-button').addEventListener('click', function () {
    const menu = document.getElementById('floating-menu');
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
});

// Optional: Close the menu when clicking outside of it
document.addEventListener('click', function (event) {
    const menu = document.getElementById('floating-menu');
    const button = document.querySelector('.menu-button');

    if (!menu.contains(event.target) && !button.contains(event.target)) {
        menu.style.display = 'none';
    }
});

// Add click event listener to the arrow button
document.querySelectorAll('.arrow-button').forEach(button => {
    button.addEventListener('click', function (event) {
        // Prevent event from closing the menu immediately
        event.stopPropagation();
        const menu = this.nextElementSibling; // Select the floating menu
        menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
    });
});

// Optional: Close the floating menu when clicking outside
document.addEventListener('click', function (event) {
    document.querySelectorAll('.message-menu').forEach(menu => {
        if (!menu.contains(event.target)) {
            menu.style.display = 'none';
        }
    });
});

// Toggle the template sidebar
document.querySelector('.list-button').addEventListener('click', function () {
    const sidebar = document.getElementById('template-sidebar');
    sidebar.style.right = sidebar.style.right === '0px' ? '-300px' : '0px'; // Slide in or out
});

// Close the sidebar when the close button is clicked
document.querySelector('.close-template-button').addEventListener('click', function () {
    const sidebar = document.getElementById('template-sidebar');
    sidebar.style.right = '-300px'; // Slide out the sidebar
});

// Copy the template text to chat input when a template is clicked
document.querySelectorAll('.template-list li').forEach(template => {
    template.addEventListener('click', function () {
        const chatInput = document.querySelector('.chat-input textarea');
        chatInput.value = this.textContent.trim(); // Copies the template text to the chat input
        adjustTextareaHeight(chatInput);
        chatInput.focus(); // Focus the chat input for immediate editing
    });
});

// Function to adjust the height of the textarea
function adjustTextareaHeight(textarea) {
    const initialHeight = 40; // Initial height matching the default
    textarea.style.height = `${initialHeight}px`; // Reset to initial height
    if (textarea.scrollHeight > initialHeight) {
        // Resize only if content exceeds the initial height
        textarea.style.height = `${textarea.scrollHeight}px`;
    }
}

// Automatically adjust the height of the chat input when the text changes
document.querySelector('.chat-input textarea').addEventListener('input', function () {
    adjustTextareaHeight(this); // Adjust the height whenever the input changes

    // Reset height to initial if the textarea is empty
    if (this.value.trim() === '') {
        this.style.height = '40px'; // Reset to the default height
    }
});

// Function to toggle visibility of an element
const toggleVisibility = (element) => {
    element.classList.toggle('hidden');
};

// Show emoji picker when emoji button is clicked
document.querySelector('.emoji-button').addEventListener('click', function (event) {
    event.stopPropagation(); // Prevent event bubbling
    const emojiPicker = document.getElementById('emoji-picker');
    toggleVisibility(emojiPicker);
});

// Hide emoji picker when clicking outside
document.addEventListener('click', function (event) {
    const emojiPicker = document.getElementById('emoji-picker');
    if (!emojiPicker.contains(event.target) && !event.target.closest('.emoji-button')) {
        emojiPicker.classList.add('hidden');
    }
});

// Add event listener for emoji selection
document.getElementById('emoji-picker').addEventListener('emoji-click', function (event) {
    const chatInput = document.querySelector('.chat-input textarea');
    chatInput.value += event.detail.unicode; // Append selected emoji to the chat input
    chatInput.focus(); // Focus the chat input for immediate editing
});

// Handle active state on pill buttons
document.querySelectorAll('.pill-button').forEach(button => {
    button.addEventListener('click', function () {
        document.querySelectorAll('.pill-button').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });
});

// Define the minimum screen width allowed (e.g., 768px for tablets and larger)
const MIN_SCREEN_WIDTH = 768;

// Function to check screen size
function checkScreenSize() {
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    // If the screen width is less than the allowed minimum, show a warning or redirect
    if (screenWidth < MIN_SCREEN_WIDTH) {
        // Show a warning message or redirect to a different page
        document.body.innerHTML = `
            <div class="screen-warning">
                <h1>Access Restricted</h1>
                <p>This application is not supported on smaller screens. Please use a tablet, laptop, or desktop device.</p>
            </div>
        `;
        document.body.style.display = "flex";
        document.body.style.flexDirection = "column";
        document.body.style.justifyContent = "center";
        document.body.style.alignItems = "center";
        document.body.style.height = "100vh";
        document.body.style.backgroundColor = "#0d1418";
        document.body.style.color = "#d1d7db";
        document.body.style.textAlign = "center";
    }
}

// Run the screen size check when the page loads
window.addEventListener('load', checkScreenSize);

// Optionally re-check if the user resizes their screen
window.addEventListener('resize', checkScreenSize);
