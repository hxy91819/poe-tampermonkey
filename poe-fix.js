// ==UserScript==
// @name         Poe扩大聊天框，自动设置输入框焦点
// @name:en      Poe Enlarge chat box And auto set focus to input box.
// @name:zh-CN   Poe扩大聊天框，自动设置输入框焦点
// @namespace    http://tampermonkey.net/
// @version      0.7.0
// @description:en  Features: 1. Enlarge chat box. 2. Auto set focus to input box. Note: Due to poe.com's constant updates, features may become invalid. The author will follow up with updates.
// @description:zh-CN  功能：1. 扩大聊天框。2. 自动设置输入框焦点。说明：由于poe.com在不断的更新，功能可能会失效。作者会跟进更新。
// @author       Cursor & Mason
// @match        *://poe.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poe.com
// @grant        none
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    function removeMessageBubbleMaxWidth() {
        console.log("removeMessageBubbleMaxWidth!")
        // Find all div elements with class starting with Message_botMessageBubble
        const messageBubbles = document.querySelectorAll('div[class^="Message_botMessageBubble"]');
        // Loop through each message bubble and remove the max-width property
        messageBubbles.forEach(messageBubble => {
            messageBubble.style.setProperty('max-width', 'unset', 'important');
        });

        const humanMessageBubbles = document.querySelectorAll('div[class^="Message_humanMessageBubble"]');
        // Loop through each message bubble and remove the max-width property
        humanMessageBubbles.forEach(messageBubble => {
            messageBubble.style.setProperty('max-width', 'unset', 'important');
        });
    }

    /** Function 1: Enlarges the chat box */
    function enlargeChatBox() {
        console.log("enlargeChatBox!")
        // Get all sections with class has prefix 'PageWithSidebarLayout_mainSection'
        const sections = document.querySelectorAll('[class^="PageWithSidebarLayout_mainSection"]');
        // Loop through each section and remove the width and max-width properties
        sections.forEach(section => {
            // make it important to prevent modify
            section.style.setProperty('width', 'unset', 'important');
            section.style.setProperty('max-width', 'unset', 'important');
            section.style.setProperty('min-width', '684px', 'important');
        });

        // 移除消息气泡的最大宽度
        removeMessageBubbleMaxWidth();

        const chatMessagesViews = document.querySelectorAll('div[class^="ChatMessagesView_emptyView"]');
        // Loop through each message bubble and remove the max-width property
        chatMessagesViews.forEach(messageView => {
            messageView.style.setProperty('max-width', 'unset', 'important');
        });
    }

    // Call the function whenever needed
    enlargeChatBox();


    /** Function 2: Automatically moves the focus to the chat input box when the user types or click button. (Has Problem with Chinese Input) */
    function setChatInputFocus() {
        function checkCredits() {
            // Find the div element with class starting with ChatMessageSendButton_noFreeMessageTooltip
            const chatMessageSendButton = document.querySelector('div[class^="ChatMessageSendButton_noFreeMessageTooltip"]');
            // If the chatMessageSendButton's innerHTML contains '0', return directly
            if (chatMessageSendButton && chatMessageSendButton.innerHTML.includes('0')) {
                console.log("no credits left...")
                return true;
            }

            return false;
        }

        // Find the textarea element with class starting with ChatMessageInputView_textInput
        const chatInput = document.querySelector('textarea[class^="GrowingTextArea_textArea"]');
        console.log(chatInput); // print chatInput for debug

        // Add an event listener to the document that listens for user input
        document.addEventListener('keypress', event => {
            if (checkCredits()) {
                return;
            }
            // If the target of the input event is the chatInput element and it does not have focus, set focus to it
            if (!chatInput.matches(':focus')) {
                chatInput.focus();
            }
        });

        // Add an event listener to the document that listens for a click event on button elements
        document.addEventListener('click', event => {
            if (checkCredits()) {
                return;
            }
            // If the clicked element is a button and the chatInput does not have focus, set focus to it
            if (event.target.tagName === 'BUTTON' && !chatInput.matches(':focus')) {
                chatInput.focus();
            }
        });


        /** Function 2.1: Sets the chatInput as the focus when the page is focused. */

        // Set the chatInput as the focus when the page is loaded
        window.addEventListener('focus', () => {
            if (checkCredits()) {
                return;
            }
            chatInput.focus();
        });
    }

    setChatInputFocus();

    /** Function 1.1: 处理切换页面的时候，重新设定大小 */
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
                enlargeChatBox();
            }
        });
    });
    observer.observe(document.body, { attributes: true, subtree: true, attributeFilter: ['href'] });

    /** Function 1.2: 处理气泡的大小问题 */
    const bubbleObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0 && Array.from(mutation.target.classList).some(className => className.startsWith('ChatMessagesView_messagePair'))) {
                // console.log(mutation)
                removeMessageBubbleMaxWidth();
            }
        });
    });
    bubbleObserver.observe(document.body, { childList: true, subtree: true });

})();

