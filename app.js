// 🛡️ HUTTU PRO - Genuine Blockchain & Secure Backend Integration
let userWalletAddress = null;
let isAcceptedMember = false; 
let lastMessageTime = 0; 

// 1. Safe Wallet Connection (Web3 Injection)
async function connectWallet() {
    if (window.ethereum) {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userWalletAddress = accounts[0];
            
            const shortAddress = userWalletAddress.substring(0, 6) + "..." + userWalletAddress.substring(userWalletAddress.length - 4);
            document.getElementById('walletBtn').innerText = "Secured: " + shortAddress;
            document.getElementById('walletBtn').style.backgroundColor = "#2ebd85"; 
            
            if(document.getElementById('referralLinkInput')) {
                document.getElementById('referralLinkInput').value = `https://beingdigitalraj.github.io/HUTTU-PRO/?ref=${userWalletAddress}`;
            }
            unlockChatArea();
        } catch (error) {
            alert("Security Log: Connection request aborted.");
        }
    } else {
        alert("Security Alert: Use Kiwi Browser/Mises Browser with MetaMask extension installed.");
    }
}

// 2. 📜 Real Smart Contract Interaction (Anti-Scam Transparent Ledger)
const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS_HERE"; // Remix से डिप्लॉय करने के बाद यहाँ एड्रेस डालना होगा
const contractABI = [
    {
        "inputs": [{"internalType": "address", "name": "_referrer", "type": "address"}],
        "name": "invest",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    }
];

async function investInPool(referrerAddress, amountInEther) {
    if (!userWalletAddress) { alert("Please connect wallet first!"); return; }
    
    try {
        const web3 = new Web3(window.ethereum);
        const myContract = new web3.eth.Contract(contractABI, contractAddress);
        const amountInWei = web3.utils.toWei(amountInEther, 'ether');
        
        // यह असली ब्लॉकचेन पर ट्रांजैक्शन भेजेगा और 7-लेवल कमीशन ऑन-चेन बांटेगा
        alert("⏳ Connecting to Blockchain... Confirm transaction in MetaMask.");
        await myContract.methods.invest(referrerAddress).send({
            from: userWalletAddress,
            value: amountInWei
        });
        alert("✅ Investment successful and commission distributed transparently!");
    } catch (error) {
        alert("Blockchain Error: Transaction failed or rejected.");
    }
}

// 3. 🔑 Secure Multi-Exchange API Call via Termux Node.js Server
async function saveExchangeAPI() {
    const exchange = document.getElementById('exchangeSelect').value;
    const apiKey = document.getElementById('apiKey').value.trim();
    const secretKey = document.getElementById('secretKey').value.trim();
    const statusText = document.getElementById('apiStatus');

    if (!userWalletAddress) { alert("Access Denied: Connect Wallet First!"); return; }
    if (apiKey === "" || secretKey === "") { alert("Notice: API fields cannot be empty."); return; }

    statusText.innerText = `⏳ Initializing secure server handshake via Node.js...`;
    statusText.style.color = "#f0b90b";

    try {
        // यह आपके Termux में चल रहे लोकल सर्वर (Port 5000) को सुरक्षित डेटा भेजेगा
        const response = await fetch('http://localhost:5000/api/v1/binance/execute', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ apiKey, secretKey, action: "BOT_START", amount: "0.01" })
        });
        
        const result = await response.json();
        if (result.success) {
            statusText.innerText = `✅ Success: ${result.message}`;
            statusText.style.color = "#2ebd85";
        } else {
            statusText.innerText = `🚨 Error: ${result.error}`;
            statusText.style.color = "#f6465d";
        }
    } catch (err) {
        // अगर Termux सर्वर बंद है या चालू नहीं हुआ है
        alert("🚨 Connection Failed! Make sure your Node.js server is running inside Termux on port 5000.");
        statusText.innerText = "Failed to connect to backend server.";
        statusText.style.color = "#f6465d";
    }
}

// 4. Promotion Link Copy Function
function copyReferralLink() {
    const copyText = document.getElementById("referralLinkInput");
    copyText.select();
    copyText.setSelectionRange(0, 99999); 
    navigator.clipboard.writeText(copyText.value);
    alert("🚀 Promotion Link Copied Successfully!");
}

// 5. Anti-Spam Chat Controller
function unlockChatArea() {
    isAcceptedMember = true; 
    document.getElementById('chatInput').disabled = false;
    document.getElementById('chatInput').placeholder = "Type your verified message here...";
    document.getElementById('chatSendBtn').disabled = false;
}

function sendMessage() {
    const input = document.getElementById('chatInput');
    const chatBox = document.getElementById('chatBox');
    const currentTime = Date.now();

    if (currentTime - lastMessageTime < 3000) { alert("Anti-Spam Filter: Please slow down."); return; }

    if (input.value.trim() !== "") {
        if(input.value.includes("<") || input.value.includes(">")) { input.value = ""; return; }
        const newMsg = document.createElement('p');
        newMsg.innerHTML = `<strong>User (${userWalletAddress.substring(0,4)}...):</strong> ${input.value}`;
        chatBox.appendChild(newMsg);
        lastMessageTime = currentTime; 
        input.value = "";
        chatBox.scrollTop = chatBox.scrollHeight; 
    }
}
// Firebase की कॉन्फ़िगरेशन सेट करें
const firebaseConfig = {
  // यहाँ अपने Firebase प्रोजेक्ट की 'SDK config' डालें
};
// firebase.initializeApp(firebaseConfig);
// const db = firebase.database();

// लाइव चैटिंग का फंक्शन
function sendMessage() {
    const msg = document.getElementById("chatInput").value;
    // db.ref('messages').push({ text: msg, time: Date.now() });
    alert("Message Sent: " + msg);
}

// लाइव प्राइस अपडेट (Binance WebSocket)
const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    document.getElementById("price").innerText = "$" + parseFloat(data.c).toFixed(2);
};

