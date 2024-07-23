let questions = [];
let chatHistory = [];

fetch('questions.json')
    .then(response => response.json())
    .then(data => {
        questions = data.sorular;
    })
    .catch(error => console.error('JSON dosyası yüklenemedi:', error));

document.getElementById('send-btn').addEventListener('click', function() {
    let userInput = document.getElementById('user-input').value;
    if (userInput.trim() !== "") {
        addMessage('user', userInput);
        document.getElementById('user-input').value = '';
        processUserInput(userInput);
    }
});

document.getElementById('comment-btn').addEventListener('click', function() {
    let commentInput = document.getElementById('comment-input').value;
    if (commentInput.trim() !== "") {
        addComment('user', commentInput);
        document.getElementById('comment-input').value = '';
        processCommentInput(commentInput);
    }
});

document.querySelectorAll('.example-question').forEach(item => {
    item.addEventListener('click', function() {
        let question = this.textContent;
        addMessage('user', question);
        processUserInput(question);
    });
});

document.querySelectorAll('.comment-question').forEach(item => {
    item.addEventListener('click', function() {
        let question = this.getAttribute('data-question');
        addComment('user', question);
        processCommentInput(question);
    });
});

document.getElementById('download-report-btn').addEventListener('click', function() {
    downloadReportAsPDF();
});

function addMessage(sender, text) {
    let chatOutput = document.getElementById('chat-output');
    let botOutput = document.getElementById('bot-output');
    let message = document.createElement('div');
    message.classList.add('message', sender);

    let icon = document.createElement('img');
    icon.src = sender === 'user' ? 'person.svg' : 'robot.svg';
    icon.alt = sender === 'user' ? 'User Icon' : 'Bot Icon';
    message.appendChild(icon);

    let messageText = document.createElement('div');
    messageText.classList.add('text');
    messageText.textContent = text;
    message.appendChild(messageText);

    chatOutput.appendChild(message);
    chatOutput.scrollTop = chatOutput.scrollHeight;

    let botMessage = message.cloneNode(true);
    botOutput.appendChild(botMessage);
    botOutput.scrollTop = botOutput.scrollHeight;

    chatHistory.push({ sender: sender, text: text });
}

function addComment(sender, text) {
    let comments = document.getElementById('comments');
    let comment = document.createElement('div');
    comment.classList.add('comment', sender);

    let icon = document.createElement('img');
    icon.src = sender === 'user' ? 'person.svg' : 'robot.svg';
    icon.alt = sender === 'user' ? 'User Icon' : 'Bot Icon';
    comment.appendChild(icon);

    let commentText = document.createElement('div');
    commentText.classList.add('text');
    commentText.textContent = text;
    comment.appendChild(commentText);

    comments.appendChild(comment);
    comments.scrollTop = comments.scrollHeight;
    chatHistory.push({ sender: sender, text: text });
}

function processUserInput(input) {
    addTypingIndicator();
    addBotTypingIndicator();
    setTimeout(() => {
        let response = getBotResponse(input);
        removeTypingIndicator();
        removeBotTypingIndicator();
        typeMessage('bot', response);
        typeBotMessage('bot', response);
    }, 2000);
}

function processCommentInput(input) {
    addTypingIndicator();
    addBotTypingIndicator();
    setTimeout(() => {
        let response = getBotCommentResponse(input);
        removeTypingIndicator();
        removeBotTypingIndicator();
        typeComment('bot', response);
    }, 2000);
}

function addTypingIndicator() {
    let chatOutput = document.getElementById('chat-output');
    let typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message', 'bot', 'typing-indicator');

    let icon = document.createElement('img');
    icon.src = 'robot.svg';
    icon.alt = 'Bot Icon';
    typingIndicator.appendChild(icon);

    let typingText = document.createElement('div');
    typingText.classList.add('text');
    typingText.textContent = '...';
    typingIndicator.appendChild(typingText);

    chatOutput.appendChild(typingIndicator);
    chatOutput.scrollTop = chatOutput.scrollHeight;
}

function removeTypingIndicator() {
    let typingIndicator = document.querySelector('.typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function addBotTypingIndicator() {
    let botOutput = document.getElementById('bot-output');
    let typingIndicator = document.createElement('div');
    typingIndicator.classList.add('message', 'bot', 'typing-indicator');

    let icon = document.createElement('img');
    icon.src = 'robot.svg';
    icon.alt = 'Bot Icon';
    typingIndicator.appendChild(icon);

    let typingText = document.createElement('div');
    typingText.classList.add('text');
    typingText.textContent = '...';
    typingIndicator.appendChild(typingText);

    botOutput.appendChild(typingIndicator);
    botOutput.scrollTop = botOutput.scrollHeight;
}

function removeBotTypingIndicator() {
    let typingIndicator = document.querySelector('#bot-output .typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function typeMessage(sender, text) {
    let chatOutput = document.getElementById('chat-output');
    let message = document.createElement('div');
    message.classList.add('message', sender);

    let icon = document.createElement('img');
    icon.src = sender === 'user' ? 'person.svg' : 'robot.svg';
    icon.alt = sender === 'user' ? 'User Icon' : 'Bot Icon';
    message.appendChild(icon);

    let messageText = document.createElement('div');
    messageText.classList.add('text');
    message.appendChild(messageText);
    chatOutput.appendChild(message);

    let index = 0;
    function type() {
        if (index < text.length) {
            messageText.textContent += text.charAt(index);
            index++;
            setTimeout(type, 50);
        } else {
            chatOutput.scrollTop = chatOutput.scrollHeight;
            // Mesajı chatHistory'e ekleme
            chatHistory.push({ sender: sender, text: text });
        }
    }
    type();
}

function typeBotMessage(sender, text) {
    let botOutput = document.getElementById('bot-output');
    let message = document.createElement('div');
    message.classList.add('message', sender);

    let icon = document.createElement('img');
    icon.src = sender === 'user' ? 'person.svg' : 'robot.svg';
    icon.alt = sender === 'user' ? 'User Icon' : 'Bot Icon';
    message.appendChild(icon);

    let messageText = document.createElement('div');
    messageText.classList.add('text');
    message.appendChild(messageText);
    botOutput.appendChild(message);

    let index = 0;
    function type() {
        if (index < text.length) {
            messageText.textContent += text.charAt(index);
            index++;
            setTimeout(type, 50);
        } else {
            botOutput.scrollTop = botOutput.scrollHeight;
        }
    }
    type();
}

function typeComment(sender, text) {
    let comments = document.getElementById('comments');
    let comment = document.createElement('div');
    comment.classList.add('comment', sender);

    let icon = document.createElement('img');
    icon.src = sender === 'user' ? 'person.svg' : 'robot.svg';
    icon.alt = sender === 'user' ? 'User Icon' : 'Bot Icon';
    comment.appendChild(icon);

    let commentText = document.createElement('div');
    commentText.classList.add('text');
    comment.appendChild(commentText);
    comments.appendChild(comment);

    let index = 0;
    function type() {
        if (index < text.length) {
            commentText.textContent += text.charAt(index);
            index++;
            setTimeout(type, 50);
        } else {
            comments.scrollTop = comments.scrollHeight;
        }
    }
    type();
}

function getBotResponse(input) {
    input = input.toLowerCase().trim();
    for (let q of questions) {
        if (input.includes(q.soru)) {
            return q.cevap;
        }
    }
    return 'Üzgünüm, bu soruya bir yanıtım yok. Lütfen müşteri hizmetleri ile iletişime geçin.';
}

function getBotCommentResponse(input) {
    if (input.includes('güzel')) {
        return 'Teşekkürler, beğenmenize sevindik!';
    } else if (input.includes('kötü')) {
        return 'Üzgünüz, sorununuzu çözmek için buradayız.';
    } else if (input.includes('kargo dahil mi')) {
        return 'Ürün fiyatına kargo dahil değildir, kargo ücreti sipariş sırasında belirtilir.';
    } else if (input.includes('beden boyutu') || input.includes('beden ölçüsü')) {
        return 'Beden ölçüleri ürün sayfasında belirtilmiştir. Lütfen beden tablosuna göz atın.';
    } else if (input.includes('ne kadar')) {
        return 'Ürün fiyatları web sitemizde belirtilmiştir. Lütfen ilgili ürün sayfasına göz atın.';
    } else if (input.includes('teslimat süresi') || input.includes('ne zaman gelir')) {
        return 'Ürün teslimat süresi 3-5 iş günü arasındadır.';
    } else if (input.includes('garanti')) {
        return 'Evet, tüm ürünlerimiz 2 yıl garanti kapsamındadır.';
    } else if (input.includes('iade') || input.includes('değişim')) {
        return 'İade ve değişim politikamız ürün teslimatından itibaren 30 gündür. Daha fazla bilgi için müşteri hizmetleri ile iletişime geçin.';
    } else {
        return 'Yorumunuz için teşekkürler! Başka sorularınız varsa lütfen belirtin.';
    }
}

function downloadReportAsPDF() {
    const { jsPDF } = window.jspdf;
    let doc = new jsPDF();
    let y = 10;

    chatHistory.forEach(entry => {
        let text = `${entry.sender === 'user' ? 'Kullanıcı' : 'Bot'}: ${entry.text}`;
        doc.text(text, 10, y);
        y += 10;
    });

    doc.save('chat-report.pdf');
}