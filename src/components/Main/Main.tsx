import { createSignal } from 'solid-js';
import './main.css';
import Sidebar from '../Sidebar/Sidebar';

const API_KEY = 'AIzaSyDpZ6TVp0upQQ130Ziq7lRsQKd9ajJ5Pz8';

interface Message {
    content: string;
    isUser: boolean;
    timestamp: Date;
}

interface Model {
    id: string;
    name: string;
}

const models: Model[] = [
    { id: 'gemini-pro', name: 'Gemini Pro' },
    { id: 'gemini-pro-vision', name: 'Gemini Pro Vision' },
    { id: 'custom', name: 'Custom Model' },
];

// Konfigurasi generationConfig untuk kontrol kualitas jawaban
const generationConfig = {
    temperature: 0.2,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

const Main = () => {
    const [messages, setMessages] = createSignal<Message[]>([]);
    const [input, setInput] = createSignal('');
    const [isLoading, setIsLoading] = createSignal(false);
    const [selectedModel, setSelectedModel] = createSignal<Model>(models[0]);
    const [customModelId, setCustomModelId] = createSignal('');
    const [customPrompt, setCustomPrompt] = createSignal('');

    const sendMessage = async () => {
        if (input().trim() === '') return;
    
        const userMessage: Message = {
            content: input(),
            isUser: true,
            timestamp: new Date(),
        };
    
        setMessages([...messages(), userMessage]);
        setInput('');
        setIsLoading(true);
    
        try {
            const modelId = selectedModel().id === 'custom' ? customModelId() : selectedModel().id;
            const promptedMessage = customPrompt()
                ? `${customPrompt()}\n\nUser: ${userMessage.content}`
                : userMessage.content;
    
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent?key=${API_KEY}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        contents: [{ parts: [{ text: promptedMessage }] }],
                        generationConfig,
                    }),
                }
            );
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const data = await response.json();
            const botReply = data.candidates[0].content.parts[0].text;
    
            // Format respons menjadi HTML yang lebih rapi
            const formattedReply = botReply.split('\n').map((line: any) => {
                // Jika ada bullet points atau daftar, format sebagai list
                if (line.startsWith('-')) {
                    return `<li>${line.slice(1).trim()}</li>`;
                }
                return `<p>${line}</p>`;
            }).join('');
    
            const botMessage: Message = {
                content: formattedReply,
                isUser: false,
                timestamp: new Date(),
            };
    
            setMessages([...messages(), botMessage]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage: Message = {
                content: `Error: ${error.message}. Please try again.`,
                isUser: false,
                timestamp: new Date(),
            };
            setMessages([...messages(), errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };    


    return (
        <>
            <Sidebar />
            <div class='main'>
                <div class='nav'>
                    <p>Vin AI</p>
                    <img src="src/assets/user_icon.png" alt="user" />
                </div>

                <div class='main-container'>
                    {messages().length === 0 && (
                        <>
                            <div class='greet'>
                                <p><span>halo, Bang.</span></p>
                                <p>Aku bisa membantu kalian semua</p>
                            </div>
                            <div class='cards'>
                                <div class='card'>
                                    <p>bayangkan staditur kamu yang paling menyenangkan</p>
                                    <img src="src/assets/compass_icon.png" alt="compas" />
                                </div>
                                <div class='card'>
                                    <p>perencanaan kota</p>
                                    <img src="src/assets/bulb_icon.png" alt="compas" />
                                </div>
                                <div class='card'>
                                    <p>bertukar pikiran</p>
                                    <img src="src/assets/message_icon.png" alt="compas" />
                                </div>
                                <div class='card'>
                                    <p>perbaiki code</p>
                                    <img src="src/assets/code_icon.png" alt="compas" />
                                </div>
                            </div>
                        </>
                    )}

                    <div class="message-list">
                        {messages().map((message) => (
                            <div class={`message ${message.isUser ? 'user-message' : 'bot-message'}`}>
                                {/* Render respons dengan HTML jika bukan pesan pengguna */}
                                <p innerHTML={message.isUser ? message.content : message.content}></p>
                            </div>
                        ))}
                        {isLoading() && (
                            <div class="message bot-message">
                                <div class="loading-animation">
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                    <div class="dot"></div>
                                </div>
                            </div>
                        )}
                    </div>


                    <div class='main-bottom'>
                        {/* Input untuk custom prompt */}
                        <div class='custom-prompt'>
                            <input
                                type="text"
                                placeholder="Masukkan custom prompt"
                                value={customPrompt()}
                                onInput={(e) => setCustomPrompt(e.currentTarget.value)}
                            />
                        </div>

                        <div class='search-box'>
                            <input
                                type="text"
                                placeholder="bisa membantu anda"
                                value={input()}
                                onInput={(e) => setInput(e.currentTarget.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        sendMessage();
                                    }
                                }}
                            />
                            <div>
                                <img src="src/assets/gallery_icon.png" alt="galeri" />
                                <img src="src/assets/mic_icon.png" alt="mic" />
                                <img
                                    src="src/assets/send_icon.png"
                                    alt="send"
                                    onClick={sendMessage}
                                />
                            </div>
                        </div>
                        <p class="bottom-info">so double check its responses</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Main;
