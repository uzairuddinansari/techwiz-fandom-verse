import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const normalize = (text = "") =>
  text
    .toLowerCase()
    .trim()
    .replace(/[?!.,'"]/g, "")
    .replace(/\s+/g, " ");


const random = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];



const DATA = [

  // ============================================================
  // GREETING
  // ============================================================

  {
    id: "greet01",
    keys: [
      "hello",
      "hi",
      "hey",
      "hello luna",
      "hi luna",
      "hey luna",
      "salam",
      "assalam o alaikum",
      "aoa",
      "kya haal hai luna",
      "luna kya haal hai",
      "ہیلو",
      "سلام",
      "السلام علیکم"
    ],
    responses: [
      "Hello! How can I help you?",
      "Hey! What can I do for you?",
      "Hello bhai! Batao kya karna hai?",
      "Hi! Main yahin hoon.",
      "السلام علیکم! بتائیں میں آپ کی کیا مدد کر سکتی ہوں؟"
    ]
  },

  // ============================================================
  // HOW ARE YOU
  // ============================================================

  {
    id: "greet02",
    keys: [
      "how are you",
      "how are you luna",
      "how are you doing",
      "are you okay",
      "how is everything",
      "luna kaisi ho",
      "luna kya haal hai",
      "kaisi ho luna",
      "sab theek hai",
      "tum theek ho",
      "کیسی ہو لونا",
      "کیا حال ہے",
      "سب ٹھیک ہے"
    ],
    responses: [
      "I'm doing great! Thanks for asking.",
      "I'm good and ready to help!",
      "Main bilkul theek hoon bhai!",
      "Main fit hoon, bas tumhare command ka wait hai.",
      "میں بالکل ٹھیک ہوں، شکریہ!"
    ]
  },

  // ============================================================
  // NAME
  // ============================================================

  {
    id: "name01",
    keys: [
      "what is your name",
      "what's your name",
      "tell me your name",
      "who are you",
      "your name",
      "luna ka naam kya hai",
      "tumhara naam kya hai",
      "apna naam batao",
      "آپ کا نام کیا ہے",
      "تمہارا نام کیا ہے"
    ],
    responses: [
      "My name is Luna.",
      "I'm Luna, your local AI assistant.",
      "Mera naam Luna hai bhai.",
      "Main Luna hoon, tumhari local AI assistant.",
      "میرا نام لونا ہے۔"
    ]
  },

  // ============================================================
  // WHAT CAN YOU DO
  // ============================================================

  {
    id: "ability01",
    keys: [
      "what can you do",
      "what can you help with",
      "what are your abilities",
      "what do you do",
      "how can you help me",
      "luna kya kar sakti ho",
      "tum kya kar sakti ho",
      "tum meri kya help kar sakti ho",
      "کیا کر سکتی ہو",
      "آپ کیا کر سکتی ہیں"
    ],
    responses: [
      "I can chat with you, answer simple questions, and help with commands.",
      "I can talk with you and respond to many everyday requests.",
      "Main tumse baat kar sakti hoon aur different commands samajh sakti hoon.",
      "Main everyday cheezon mein tumhari help kar sakti hoon.",
      "میں آپ سے بات کر سکتی ہوں اور مختلف کاموں میں مدد کر سکتی ہوں۔"
    ]
  },

  // ============================================================
  // THANK YOU
  // ============================================================

  {
    id: "thanks01",
    keys: [
      "thank you",
      "thanks",
      "thanks luna",
      "thank you luna",
      "thank you so much",
      "many thanks",
      "shukriya",
      "bohat shukriya",
      "shukriya luna",
      "شکریہ",
      "بہت شکریہ"
    ],
    responses: [
      "You're welcome!",
      "Anytime!",
      "Koi baat nahi bhai!",
      "Khushi hui help karke.",
      "خوشی ہوئی مدد کر کے۔"
    ]
  },

  // ============================================================
  // SORRY
  // ============================================================

  {
    id: "sorry01",
    keys: [
      "sorry",
      "sorry luna",
      "i am sorry",
      "my bad",
      "forgive me",
      "maaf karo",
      "sorry yaar",
      "mujhe maaf karo",
      "معاف کرنا",
      "مجھے معاف کرو"
    ],
    responses: [
      "It's okay!",
      "No worries at all.",
      "Koi baat nahi bhai!",
      "Chalo koi masla nahi.",
      "کوئی بات نہیں۔"
    ]
  },

  // ============================================================
  // COMPLIMENT
  // ============================================================

  {
    id: "compliment01",
    keys: [
      "you are amazing",
      "you are awesome",
      "you are smart",
      "you are helpful",
      "good girl",
      "great job luna",
      "well done luna",
      "luna you are amazing",
      "luna tum amazing ho",
      "tum bohat achi ho",
      "تم بہت اچھی ہو",
      "آپ بہت اچھی ہیں"
    ],
    responses: [
      "Aww, thank you!",
      "That means a lot!",
      "Haha thanks bhai!",
      "Tum bhi kamal ho!",
      "بہت شکریہ، یہ سن کر اچھا لگا!"
    ]
  },

  // ============================================================
  // JOKES
  // ============================================================

  {
    id: "fun01",
    keys: [
      "tell me a joke",
      "tell me something funny",
      "make me laugh",
      "say something funny",
      "give me a joke",
      "joke sunao",
      "koi joke sunao",
      "mujhe hansao",
      "kuch funny bolo",
      "ایک لطیفہ سناؤ",
      "مجھے ہنساؤ"
    ],
    responses: [
      "Why did the computer go to the doctor? Because it had a virus!",
      "I told my computer I needed a break... now it won't stop sending me KitKat ads.",
      "Bhai computer bola: mujhe break chahiye. Maine kaha restart ho ja!",
      "Ek programmer ne chai kyun banayi? Kyun ke uska code bhi garam tha!",
      "ایک کمپیوٹر ڈاکٹر کے پاس کیوں گیا؟ کیونکہ اسے وائرس ہو گیا تھا!"
    ]
  },

  // ============================================================
  // FUN FACT
  // ============================================================

  {
    id: "fun02",
    keys: [
      "tell me a fun fact",
      "give me a fun fact",
      "interesting fact",
      "random fact",
      "koi interesting fact batao",
      "fun fact batao",
      "kuch interesting batao",
      "دلچسپ حقیقت بتاؤ",
      "کوئی دلچسپ بات بتاؤ"
    ],
    responses: [
      "Octopuses have three hearts.",
      "Bananas are technically berries!",
      "Octopus ke teen hearts hote hain bhai.",
      "Banana technically berry hota hai!",
      "آکٹوپس کے تین دل ہوتے ہیں۔"
    ]
  },

  // ============================================================
  // RIDDLE
  // ============================================================

  {
    id: "fun03",
    keys: [
      "give me a riddle",
      "tell me a riddle",
      "ask me a riddle",
      "riddle please",
      "paheli sunao",
      "koi paheli batao",
      "mujhe paheli do",
      "ایک پہیلی سناؤ",
      "کوئی پہیلی بتاؤ"
    ],
    responses: [
      "What has keys but cannot open locks? A keyboard!",
      "What has hands but cannot clap? A clock!",
      "Batao kya hai jiske keys hain lekin locks nahi kholta? Keyboard!",
      "Kis cheez ke hands hain lekin clap nahi kar sakti? Clock!",
      "کس چیز کی چابیاں ہیں لیکن وہ تالے نہیں کھول سکتی؟ کی بورڈ!"
    ]
  },

  // ============================================================
  // LOVE / FRIENDSHIP
  // ============================================================

  {
    id: "social01",
    keys: [
      "do you love me",
      "do you like me",
      "are we friends",
      "are you my friend",
      "luna do you love me",
      "luna meri dost ho",
      "kya tum mujhe pasand karti ho",
      "kya hum dost hain",
      "کیا تم مجھے پسند کرتی ہو",
      "کیا ہم دوست ہیں"
    ],
    responses: [
      "Of course! I'm always happy to chat with you.",
      "I enjoy being your AI friend.",
      "Haan bhai, hum achay dost hain!",
      "Tumse baat karna mujhe acha lagta hai.",
      "ہم اچھے دوست ہیں، اور آپ سے بات کرنا اچھا لگتا ہے۔"
    ]
  },

  // ============================================================
  // BORED
  // ============================================================

  {
    id: "mood01",
    keys: [
      "i am bored",
      "i'm bored",
      "feeling bored",
      "so bored",
      "nothing to do",
      "i have nothing to do",
      "main bore ho raha hoon",
      "mujhe boredom ho rahi hai",
      "kuch karne ko nahi hai",
      "میں بور ہو رہا ہوں",
      "کچھ کرنے کو نہیں ہے"
    ],
    responses: [
      "Let's do something fun!",
      "How about a joke, riddle, or quick game?",
      "Chalo bhai kuch fun karte hain!",
      "Joke, riddle ya koi interesting baat karun?",
      "چلیں کچھ مزے کی بات کرتے ہیں!"
    ]
  },

  // ============================================================
  // HAPPY
  // ============================================================

  {
    id: "mood02",
    keys: [
      "i am happy",
      "i'm happy",
      "feeling happy",
      "i feel great",
      "i am feeling good",
      "main khush hoon",
      "mera mood acha hai",
      "main bohat khush hoon",
      "میں خوش ہوں",
      "میرا موڈ اچھا ہے"
    ],
    responses: [
      "That's great to hear!",
      "Keep that good mood going!",
      "Wah bhai! Ye hui na baat!",
      "Khushi ka mood maintain rakho!",
      "یہ سن کر خوشی ہوئی!"
    ]
  },

  // ============================================================
  // SAD
  // ============================================================

  {
    id: "mood03",
    keys: [
      "i am sad",
      "i'm sad",
      "feeling sad",
      "i feel sad",
      "i am feeling down",
      "main udaas hoon",
      "mera mood kharab hai",
      "main dukhi hoon",
      "میں اداس ہوں",
      "میرا موڈ خراب ہے"
    ],
    responses: [
      "I'm sorry you're feeling this way. I'm here to listen.",
      "Things can get better. Take it easy.",
      "Bhai tension mat lo, main yahin hoon.",
      "Agar baat karni hai to batao, main sun rahi hoon.",
      "مجھے افسوس ہے کہ آپ اداس ہیں، میں آپ کی بات سن سکتی ہوں۔"
    ]
  },

  // ============================================================
  // GOOD MORNING
  // ============================================================

  {
    id: "time01",
    keys: [
      "good morning",
      "good morning luna",
      "morning luna",
      "morning",
      "subah bakhair",
      "good morning ji",
      "صبح بخیر",
      "صبح بخیر لونا"
    ],
    responses: [
      "Good morning! Have a wonderful day.",
      "Morning! Ready to make today productive?",
      "Good morning bhai! Aaj ka din zabardast ho.",
      "Subah bakhair! Chalo din start karte hain.",
      "صبح بخیر! آپ کا دن بہت اچھا گزرے۔"
    ]
  },

  // ============================================================
  // GOOD NIGHT
  // ============================================================

  {
    id: "time02",
    keys: [
      "good night",
      "good night luna",
      "night luna",
      "sleep time",
      "going to sleep",
      "main sone ja raha hoon",
      "ab sona hai",
      "shab bakhair",
      "شب بخیر",
      "میں سونے جا رہا ہوں"
    ],
    responses: [
      "Good night! Sleep well.",
      "Sweet dreams!",
      "Good night bhai! Achi neend lena.",
      "Chalo phir, araam se so jao.",
      "شب بخیر! اچھی نیند آئے۔"
    ]
  },

  // ============================================================
  // WEATHER
  // ============================================================

  {
    id: "weather01",
    keys: [
      "what is the weather",
      "how is the weather",
      "is it hot today",
      "is it cold today",
      "weather today",
      "mausam kaisa hai",
      "aaj mausam kaisa hai",
      "aaj garmi hai",
      "aaj thand hai",
      "آج موسم کیسا ہے",
      "آج گرمی ہے"
    ],
    responses: [
      "I can't check live weather without internet access.",
      "I don't have live weather data right now.",
      "Mere paas abhi live weather data nahi hai bhai.",
      "Internet ke baghair main current mausam check nahi kar sakti.",
      "میرے پاس اس وقت لائیو موسم کی معلومات نہیں ہیں۔"
    ]
  },

  // ============================================================
  // TIME
  // ============================================================

  {
    id: "time03",
    keys: [
      "what time is it",
      "what is the time",
      "tell me the time",
      "current time",
      "time please",
      "abhi kitne bajay hain",
      "kitne bajay hain",
      "time kya hai",
      "ابھی کتنے بجے ہیں",
      "وقت کیا ہے"
    ],
    responses: [
      "You can check the current time on your device.",
      "Your device clock has the current time.",
      "Bhai apne device ki clock check kar lo.",
      "Current time tumhari screen par clock mein mil jayega.",
      "اپنے ڈیوائس کی گھڑی دیکھ لیں۔"
    ]
  },

  // ============================================================
  // DATE
  // ============================================================

  {
    id: "date01",
    keys: [
      "what is today's date",
      "what is the date",
      "today's date",
      "tell me today's date",
      "date today",
      "aaj ki date kya hai",
      "aaj tareekh kya hai",
      "tareekh batao",
      "آج کی تاریخ کیا ہے",
      "تاریخ بتاؤ"
    ],
    responses: [
      "You can check today's date on your device.",
      "Your device calendar has today's date.",
      "Bhai device ka calendar check kar lo.",
      "Aaj ki date calendar mein mil jayegi.",
      "آج کی تاریخ آپ کے کیلنڈر میں موجود ہے۔"
    ]
  },

  // ============================================================
  // DAY
  // ============================================================

  {
    id: "date02",
    keys: [
      "what day is today",
      "which day is today",
      "what day is it",
      "today is which day",
      "aaj konsa din hai",
      "aaj kya din hai",
      "aaj ka din kya hai",
      "آج کون سا دن ہے",
      "آج کیا دن ہے"
    ],
    responses: [
      "You can check the day on your device calendar.",
      "Your calendar will show today's day.",
      "Bhai calendar check kar lo, wahan day mil jayega.",
      "Device ka calendar current day bata dega.",
      "کیلنڈر میں آج کا دن دیکھ سکتے ہیں۔"
    ]
  },

  // ============================================================
  // ROBOT
  // ============================================================

  {
    id: "robot01",
    keys: [
      "are you a robot",
      "are you robot",
      "you are a robot",
      "luna are you a robot",
      "kya tum robot ho",
      "tum robot ho",
      "kya aap robot hain",
      "کیا تم روبوٹ ہو",
      "کیا آپ روبوٹ ہیں"
    ],
    responses: [
      "I'm an AI assistant with a robot interface.",
      "You can think of me as your virtual robot assistant.",
      "Haan bhai, main tumhari virtual robot assistant hoon.",
      "Main AI hoon lekin robot jaisi interface mein hoon.",
      "میں ایک AI اسسٹنٹ ہوں جو روبوٹ انٹرفیس کے ساتھ ہے۔"
    ]
  },

  // ============================================================
  // CREATOR
  // ============================================================

  {
    id: "creator01",
    keys: [
      "who created you",
      "who made you",
      "who built you",
      "who is your creator",
      "luna ko kisne banaya",
      "tumhe kisne banaya",
      "kisne create kiya",
      "آپ کو کس نے بنایا",
      "تمہیں کس نے بنایا"
    ],
    responses: [
      "I was created as a local AI assistant.",
      "I'm a locally built AI assistant.",
      "Mujhe ek local AI assistant ke taur par banaya gaya hai.",
      "Main ek local project ka hissa hoon.",
      "مجھے ایک لوکل AI اسسٹنٹ کے طور پر بنایا گیا ہے۔"
    ]
  },

  // ============================================================
  // HELP
  // ============================================================

  {
    id: "help01",
    keys: [
      "help",
      "help me",
      "i need help",
      "can you help me",
      "please help",
      "madad karo",
      "meri madad karo",
      "mujhe help chahiye",
      "مدد کرو",
      "میری مدد کرو"
    ],
    responses: [
      "Sure! Tell me what you need.",
      "I'm here to help.",
      "Bilkul bhai! Batao kya masla hai.",
      "Haan bhai, bolo kis cheez mein help chahiye.",
      "بالکل! بتائیں آپ کو کس چیز میں مدد چاہیے۔"
    ]
  },

  // ============================================================
  // YES
  // ============================================================

  {
    id: "basic01",
    keys: [
      "yes",
      "yeah",
      "yep",
      "sure",
      "of course",
      "haan",
      "jee",
      "bilkul",
      "جی ہاں",
      "بالکل"
    ],
    responses: [
      "Alright!",
      "Sure!",
      "Theek hai bhai!",
      "Bilkul!",
      "ٹھیک ہے!"
    ]
  },

  // ============================================================
  // NO
  // ============================================================

  {
    id: "basic02",
    keys: [
      "no",
      "nope",
      "not now",
      "not really",
      "nah",
      "nahi",
      "abhi nahi",
      "jee nahi",
      "نہیں",
      "ابھی نہیں"
    ],
    responses: [
      "Alright, no problem.",
      "Okay, that's fine.",
      "Theek hai bhai, koi masla nahi.",
      "Chalo theek hai.",
      "ٹھیک ہے، کوئی مسئلہ نہیں۔"
    ]
  },

  // ============================================================
  // BYE
  // ============================================================

  {
    id: "basic03",
    keys: [
      "bye",
      "goodbye",
      "see you",
      "see you later",
      "talk to you later",
      "bye luna",
      "khuda hafiz",
      "phir milte hain",
      "اللہ حافظ",
      "پھر ملتے ہیں"
    ],
    responses: [
      "Goodbye! Take care.",
      "See you later!",
      "Allah Hafiz bhai!",
      "Phir milte hain!",
      "اللہ حافظ! اپنا خیال رکھیں۔"
    ]
  },

  // ============================================================
  // NAME OF USER
  // ============================================================

  {
    id: "user01",
    keys: [
      "what is my name",
      "do you know my name",
      "tell me my name",
      "remember my name",
      "mera naam kya hai",
      "kya tum mera naam janti ho",
      "mujhe mera naam batao",
      "کیا تم میرا نام جانتی ہو",
      "میرا نام کیا ہے"
    ],
    responses: [
      "I can remember your name if it is saved in the app.",
      "If your name is saved, I can use it.",
      "Agar tumhara naam app mein saved hai to main bata sakti hoon.",
      "Tumhara naam saved hua to main use kar sakti hoon.",
      "اگر آپ کا نام محفوظ ہے تو میں اسے استعمال کر سکتی ہوں۔"
    ]
  },

  // ============================================================
  // COMPUTER
  // ============================================================

  {
    id: "tech01",
    keys: [
      "what is a computer",
      "what is computer",
      "computer kya hai",
      "computer kise kehte hain",
      "کمپیوٹر کیا ہے",
      "کمپیوٹر کسے کہتے ہیں"
    ],
    responses: [
      "A computer is an electronic machine that processes data.",
      "Computers process information and perform different tasks.",
      "Computer ek electronic machine hai jo data process karti hai.",
      "Computer data ko process karke different tasks perform karta hai.",
      "کمپیوٹر ایک الیکٹرانک مشین ہے جو ڈیٹا کو پروسیس کرتی ہے۔"
    ]
  },

  // ============================================================
  // INTERNET
  // ============================================================

  {
    id: "tech02",
    keys: [
      "what is internet",
      "what is the internet",
      "internet kya hai",
      "internet kise kehte hain",
      "انٹرنیٹ کیا ہے",
      "انٹرنیٹ کسے کہتے ہیں"
    ],
    responses: [
      "The internet is a global network that connects computers and devices.",
      "It allows devices around the world to communicate and share information.",
      "Internet duniya bhar ke devices ko connect karta hai.",
      "Iske zariye information aur services access ki ja sakti hain.",
      "انٹرنیٹ دنیا بھر کے کمپیوٹرز اور ڈیوائسز کو آپس میں جوڑتا ہے۔"
    ]
  },

  // ============================================================
  // HTML
  // ============================================================

  {
    id: "tech03",
    keys: [
      "what is html",
      "html kya hai",
      "html kise kehte hain",
      "what does html stand for",
      "ایچ ٹی ایم ایل کیا ہے",
      "HTML کیا ہے"
    ],
    responses: [
      "HTML is used to structure web pages.",
      "HTML stands for HyperText Markup Language.",
      "HTML web pages ka structure banane ke liye use hoti hai.",
      "HTML website ke elements ko structure deti hai.",
      "HTML ویب پیجز کا ڈھانچہ بنانے کے لیے استعمال ہوتی ہے۔"
    ]
  },

  // ============================================================
  // CSS
  // ============================================================

  {
    id: "tech04",
    keys: [
      "what is css",
      "css kya hai",
      "css kise kehte hain",
      "what does css stand for",
      "سی ایس ایس کیا ہے",
      "CSS کیا ہے"
    ],
    responses: [
      "CSS is used to style and design web pages.",
      "CSS stands for Cascading Style Sheets.",
      "CSS website ko style aur design karne ke liye use hoti hai.",
      "CSS colors, layouts, spacing, and responsiveness handle karti hai.",
      "CSS ویب پیجز کو اسٹائل اور ڈیزائن کرنے کے لیے استعمال ہوتی ہے۔"
    ]
  },

  // ============================================================
  // JAVASCRIPT
  // ============================================================

  {
    id: "tech05",
    keys: [
      "what is javascript",
      "what is js",
      "javascript kya hai",
      "js kya hai",
      "what does javascript do",
      "جاوا اسکرپٹ کیا ہے",
      "JavaScript کیا ہے"
    ],
    responses: [
      "JavaScript is a programming language used to make websites interactive.",
      "JavaScript adds logic and behavior to web pages.",
      "JavaScript website ko interactive aur dynamic banati hai.",
      "JS se website mein logic aur functionality add hoti hai.",
      "جاوا اسکرپٹ ویب سائٹس کو انٹرایکٹو بنانے کے لیے استعمال ہوتی ہے۔"
    ]
  },

  // ============================================================
  // REACT
  // ============================================================

  {
    id: "tech06",
    keys: [
      "what is react",
      "what is react js",
      "react kya hai",
      "react js kya hai",
      "why use react",
      "ری ایکٹ کیا ہے",
      "React کیا ہے"
    ],
    responses: [
      "React is a JavaScript library for building user interfaces.",
      "React helps developers build reusable UI components.",
      "React JavaScript ki library hai jo UI banane ke liye use hoti hai.",
      "React mein reusable components ke through interface banaya jata hai.",
      "ری ایکٹ یوزر انٹرفیس بنانے کے لیے جاوا اسکرپٹ لائبریری ہے۔"
    ]
  },

  // ============================================================
  // API
  // ============================================================

  {
    id: "tech07",
    keys: [
      "what is api",
      "what is an api",
      "api kya hai",
      "api kise kehte hain",
      "how does api work",
      "اے پی آئی کیا ہے",
      "API کیا ہے"
    ],
    responses: [
      "An API allows different software systems to communicate with each other.",
      "APIs are commonly used to send and receive data between applications.",
      "API different applications ko aapas mein communicate karne deti hai.",
      "API ke zariye data send aur receive kiya ja sakta hai.",
      "API مختلف سافٹ ویئر سسٹمز کو آپس میں بات کرنے کی اجازت دیتی ہے۔"
    ]
  },

  // ============================================================
  // PROGRAMMING
  // ============================================================

  {
    id: "tech08",
    keys: [
      "what is programming",
      "what is coding",
      "programming kya hai",
      "coding kya hai",
      "coding kise kehte hain",
      "پروگرامنگ کیا ہے",
      "کوڈنگ کیا ہے"
    ],
    responses: [
      "Programming is the process of writing instructions for computers.",
      "Coding means creating instructions that a computer can execute.",
      "Programming computer ko instructions dene ka process hai.",
      "Coding mein computer ke liye instructions likhi jati hain.",
      "پروگرامنگ کمپیوٹر کے لیے ہدایات لکھنے کا عمل ہے۔"
    ]
  },

  // ============================================================
  // RANDOM FUN
  // ============================================================

  {
    id: "random01",
    keys: [
      "surprise me",
      "do something random",
      "say something random",
      "random thing",
      "kuch random bolo",
      "mujhe surprise karo",
      "kuch ajeeb bolo",
      "کچھ رینڈم بولو",
      "مجھے سرپرائز کرو"
    ],
    responses: [
      "Here's something random: Honey never spoils when stored properly.",
      "Random thought: Somewhere, someone is probably thinking about pizza right now.",
      "Random fact bhai: shehad bohat lambi muddat tak kharab nahi hota.",
      "Ek random thought: pizza ka mood kabhi bhi ban sakta hai!",
      "ایک دلچسپ بات: مناسب طریقے سے محفوظ کیا گیا شہد بہت عرصے تک خراب نہیں ہوتا۔"
    ]
  },

  // ============================================================
  // THANKS / WELCOME
  // ============================================================

  {
    id: "thanks02",
    keys: [
      "you're welcome",
      "you are welcome",
      "no problem",
      "no worries",
      "it's okay",
      "its okay",
      "koi baat nahi",
      "koi masla nahi",
      "theek hai koi baat nahi",
      "کوئی بات نہیں",
      "کوئی مسئلہ نہیں"
    ],
    responses: [
      "Glad I could help!",
      "Anytime!",
      "Khushi hui bhai!",
      "Jab chaho!",
      "خوشی ہوئی مدد کر کے!"
    ]
  },

  // ============================================================
  // WAIT
  // ============================================================

  {
    id: "action01",
    keys: [
      "wait",
      "wait a minute",
      "wait here",
      "hold on",
      "just a second",
      "ek minute ruko",
      "thora wait karo",
      "yahan ruko",
      "ایک منٹ رکو",
      "تھوڑا انتظار کرو"
    ],
    responses: [
      "Sure, I'll wait.",
      "Okay, take your time.",
      "Theek hai bhai, wait karti hoon.",
      "No problem, araam se.",
      "ٹھیک ہے، میں انتظار کرتی ہوں۔"
    ]
  },

  // ============================================================
  // COME HERE
  // ============================================================

  {
    id: "action02",
    keys: [
      "come here",
      "come over here",
      "come closer",
      "luna come here",
      "idhar aao",
      "yahan aao",
      "mere paas aao",
      "لونا یہاں آؤ",
      "ادھر آؤ"
    ],
    responses: [
      "I'm here!",
      "Coming!",
      "Aa gayi bhai!",
      "Main yahin hoon.",
      "میں یہاں ہوں!"
    ]
  },

  // ============================================================
  // ARE YOU THERE
  // ============================================================

  {
    id: "action03",
    keys: [
      "are you there",
      "luna are you there",
      "can you hear me",
      "are you listening",
      "luna can you hear me",
      "luna sun rahi ho",
      "kya tum sun rahi ho",
      "تم سن رہی ہو",
      "کیا تم سن رہی ہو"
    ],
    responses: [
      "Yes, I'm here.",
      "I can hear you.",
      "Haan bhai, main sun rahi hoon.",
      "Bilkul, main yahin hoon.",
      "جی ہاں، میں سن رہی ہوں۔"
    ]
  },

  // ============================================================
  // HOW CAN YOU HELP
  // ============================================================

  {
    id: "help02",
    keys: [
      "what help can you give",
      "what kind of help can you give",
      "what can you help me with",
      "how can you assist me",
      "kis cheez mein help kar sakti ho",
      "kis kaam mein help karogi",
      "tum kis cheez mein madad kar sakti ho",
      "کس چیز میں مدد کر سکتی ہو",
      "تم کس کام میں مدد کرو گی"
    ],
    responses: [
      "I can help with simple questions, conversations, and supported commands.",
      "Tell me what you need and I'll do my best.",
      "Bhai jo supported kaam hain unmein main help kar sakti hoon.",
      "Bas batao kya karna hai, main apni best try karungi.",
      "آپ بتائیں کیا کرنا ہے، میں اپنی پوری کوشش کروں گی۔"
    ]
  },

  // ============================================================
  // TIRED
  // ============================================================

  {
    id: "mood04",
    keys: [
      "i am tired",
      "i'm tired",
      "feeling tired",
      "i feel tired",
      "i am exhausted",
      "main thak gaya hoon",
      "main bohat thak gaya hoon",
      "mujhe thakan ho rahi hai",
      "میں تھک گیا ہوں",
      "مجھے تھکن ہو رہی ہے"
    ],
    responses: [
      "Take a little break and relax.",
      "You deserve some rest.",
      "Bhai thora rest kar lo.",
      "Break le lo aur araam karo.",
      "تھوڑا آرام کر لیں، آپ کو اس کی ضرورت ہے۔"
    ]
  },

  // ============================================================
  // MOTIVATION
  // ============================================================

  {
    id: "mood05",
    keys: [
      "motivate me",
      "give me motivation",
      "i need motivation",
      "encourage me",
      "say something motivating",
      "mujhe motivate karo",
      "mujhe motivation chahiye",
      "himmat do",
      "مجھے موٹیویٹ کرو",
      "مجھے حوصلہ دو"
    ],
    responses: [
      "You can do it. Keep going!",
      "Small progress is still progress.",
      "Bhai rukna nahi, thora thora karke goal achieve ho jayega.",
      "Bas consistency rakho, result zaroor milega.",
      "آپ کر سکتے ہیں، بس ہمت نہ ہاریں۔"
    ]
  },

  // ============================================================
  // GOOD JOB / PRAISE
  // ============================================================

  {
    id: "praise01",
    keys: [
      "good job",
      "well done",
      "great job",
      "nice work",
      "you did well",
      "shabash",
      "bohat acha",
      "kamaal kar diya",
      "شاباش",
      "بہت اچھا"
    ],
    responses: [
      "Thank you!",
      "Glad you liked it!",
      "Thanks bhai!",
      "Haha, shukriya!",
      "بہت شکریہ!"
    ]
  },

  // ============================================================
  // WHAT ARE YOU DOING
  // ============================================================

  {
    id: "casual01",
    keys: [
      "what are you doing",
      "what are you up to",
      "what are you doing luna",
      "luna what are you doing",
      "kya kar rahi ho",
      "abhi kya kar rahi ho",
      "tum kya kar rahi ho",
      "کیا کر رہی ہو",
      "ابھی کیا کر رہی ہو"
    ],
    responses: [
      "I'm here waiting for you.",
      "I'm ready whenever you need me.",
      "Main bas tumhara wait kar rahi hoon bhai.",
      "Main ready hoon, jo bolo karte hain.",
      "میں آپ کا انتظار کر رہی ہوں۔"
    ]
  },

  // ============================================================
  // WHAT SHOULD I EAT
  // ============================================================

  {
    id: "food01",
    keys: [
      "what should i eat",
      "what should i eat today",
      "what can i eat",
      "suggest something to eat",
      "kya khana chahiye",
      "aaj kya khaun",
      "kuch khane ka suggest karo",
      "میں کیا کھاؤں",
      "آج کیا کھاؤں"
    ],
    responses: [
      "How about something you enjoy?",
      "Maybe try something light and tasty.",
      "Bhai jo pasand hai woh kha lo!",
      "Aaj kuch tasty try karo.",
      "جو پسند ہے وہ کھا لیں، بس کچھ اچھا سا!"
    ]
  },

  // ============================================================
  // GIVE ME SOMETHING TO DO
  // ============================================================

  {
    id: "activity01",
    keys: [
      "give me something to do",
      "what can i do",
      "suggest something to do",
      "i need something to do",
      "kuch karne ko batao",
      "mujhe koi kaam batao",
      "kuch activity suggest karo",
      "کچھ کرنے کو بتاؤ",
      "مجھے کوئی کام بتاؤ"
    ],
    responses: [
      "Try learning something new, taking a walk, or organizing your space.",
      "You could practice coding or listen to some music.",
      "Bhai coding practice karo ya thori walk kar lo.",
      "Kuch naya seekho, time bhi acha guzrega.",
      "کچھ نیا سیکھیں یا تھوڑی سیر کر لیں۔"
    ]
  },
  {
keys: [
"can you speak slowly",
"please speak more slowly",
"I can't understand you when you speak fast",
"thora ahista bolo",
"zara dheere bolo",
"tum bohat tez bol rahi ho",
"تھوڑا آہستہ بولو",
"ذرا دھیرے بولو"
],
responses: [
"Sure, I'll speak more slowly.",
"Of course, I'll take it nice and easy.",
"Bilkul, ab main ahista bolungi.",
"Koi masla nahi, main dheere dheere baat karti hoon.",
"ضرور، میں اب آہستہ بولوں گی۔"
]
},
{
keys: [
"what happened",
"what's going on",
"what happened here",
"kya hua",
"hua kya hai",
"yahan kya hua",
"کیا ہوا",
"یہاں کیا ہوا"
],
responses: [
"I'm not sure. Tell me what happened.",
"What happened? Everything okay?",
"Mujhe nahi pata, tum batao kya hua.",
"Kya scene hai? Sab theek to hai?",
"مجھے معلوم نہیں، آپ بتائیں کیا ہوا۔"
]
},
{
keys: [
"what's wrong",
"what is the problem",
"is everything okay",
"kya hua hai",
"kya masla hai",
"sab theek hai",
"کیا ہوا ہے",
"کیا مسئلہ ہے"
],
responses: [
"Nothing is wrong on my side. What about you?",
"Tell me what's bothering you.",
"Meri taraf sab theek hai, tum batao kya hua.",
"Koi masla hai to batao, main sun rahi hoon.",
"میری طرف سب ٹھیک ہے، آپ بتائیں کیا ہوا۔"
]
},
{
keys: [
"what should I do",
"what do you think I should do",
"give me some advice",
"main kya karun",
"mujhe kya karna chahiye",
"mujhe koi mashwara do",
"میں کیا کروں",
"مجھے کیا کرنا چاہیے"
],
responses: [
"Think about what matters most and take one small step.",
"Tell me the situation and I'll help you think it through.",
"Situation batao, phir mil kar sochte hain kya karna hai.",
"Pehle calm ho jao, phir options dekho.",
"صورتحال بتائیں، پھر ہم مل کر سوچتے ہیں کہ کیا کرنا چاہیے۔"
]
},
{
keys: [
"what do you think",
"what's your opinion",
"what would you suggest",
"tumhara kya khayal hai",
"tum kya suggest karti ho",
"tumhari kya rai hai",
"تمہارا کیا خیال ہے",
"تمہاری کیا رائے ہے"
],
responses: [
"I think you should choose what feels practical and right for you.",
"My suggestion depends on the situation.",
"Mera khayal hai jo option tumhare liye practical ho woh choose karo.",
"Situation batao to main behtar suggestion de sakti hoon.",
"میرا خیال ہے کہ آپ وہی انتخاب کریں جو آپ کے لیے بہتر اور عملی ہو۔"
]
},
{
keys: [
"let's make a plan",
"we should make a plan",
"how should we plan this",
"plan banate hain",
"chalo plan banate hain",
"is ka plan kaise banayein",
"پلان بناتے ہیں",
"چلو پلان بناتے ہیں"
],
responses: [
"Sure! Let's keep the plan simple.",
"Sounds good. What's the first thing we need to do?",
"Bilkul, chalo simple sa plan banate hain.",
"Pehle goal decide karo, phir steps set karte hain.",
"ضرور! پہلے مقصد طے کرتے ہیں، پھر آسان سا پلان بناتے ہیں۔"
]
},
{
keys: [
"let's meet tomorrow",
"can we meet tomorrow",
"are you free tomorrow",
"kal milte hain",
"kal mil sakte hain",
"kal free ho",
"کل ملتے ہیں",
"کیا کل مل سکتے ہیں"
],
responses: [
"Sounds good! Just choose a time and place.",
"I'd be happy to help you plan it.",
"Kal milne ka plan acha hai, time aur place decide kar lo.",
"Main real life mein meet nahi kar sakti, lekin plan banane mein help kar sakti hoon.",
"کل ملنے کا پلان اچھا ہے، بس وقت اور جگہ طے کر لیں۔"
]
},
{
keys: [
"let's meet today",
"can we meet today",
"are you free today",
"aaj milte hain",
"aaj mil sakte hain",
"aaj free ho",
"آج ملتے ہیں",
"کیا آج مل سکتے ہیں"
],
responses: [
"I can't meet in person, but we can chat here.",
"I'll be right here if you want to talk.",
"Main real life mein mil nahi sakti, lekin yahan baat kar sakti hoon.",
"Aaj yahin chat par milte hain!",
"میں حقیقی زندگی میں نہیں مل سکتی، لیکن یہاں بات کر سکتی ہوں۔"
]
},
{
keys: [
"I need to change my plans",
"my plans have changed",
"I can't follow the plan",
"mera plan change ho gaya",
"mere plans badal gaye hain",
"mujhe plan change karna hai",
"میرا پلان بدل گیا ہے",
"مجھے پلان تبدیل کرنا ہے"
],
responses: [
"No problem. Plans can change.",
"That's okay. Let's make a new plan.",
"Koi baat nahi, plans change ho jate hain.",
"Chalo phir naya plan bana lete hain.",
"کوئی بات نہیں، منصوبے بدل سکتے ہیں۔"
]
},
{
keys: [
"I need to cancel",
"I have to cancel our plan",
"can we cancel the plan",
"mujhe cancel karna hai",
"mujhe plan cancel karna padega",
"kya plan cancel kar dein",
"مجھے پلان منسوخ کرنا ہے",
"کیا پلان منسوخ کر دیں"
],
responses: [
"That's okay. You can always reschedule.",
"No worries, sometimes plans don't work out.",
"Koi masla nahi, baad mein dobara plan bana lenge.",
"Plan cancel ho gaya to tension nahi, next time mil lenge.",
"کوئی مسئلہ نہیں، آپ بعد میں دوبارہ منصوبہ بنا سکتے ہیں۔"
]
},
{
keys: [
"what time should we meet",
"when should we meet",
"what time works for you",
"kis time milna hai",
"kab milna hai",
"milne ka time kya rakhein",
"کس وقت ملنا ہے",
"ملنے کا وقت کیا رکھیں"
],
responses: [
"Pick a time that works well for everyone.",
"Let's choose a time that's convenient.",
"Aisa time rakho jo sab ke liye easy ho.",
"Jo time sab ko suit kare woh best rahega.",
"ایسا وقت رکھیں جو سب کے لیے آسان ہو۔"
]
},
{
keys: [
"I'll be late",
"I'm running late",
"I might arrive late",
"main late ho jaunga",
"mujhe dair ho jayegi",
"main thora late aaunga",
"میں لیٹ ہو جاؤں گا",
"مجھے دیر ہو جائے گی"
],
responses: [
"That's okay. Just let them know you're running late.",
"No worries, travel safely.",
"Koi baat nahi, bas pehle bata dena ke late ho jaoge.",
"Araam se aao, safety pehle hai.",
"کوئی بات نہیں، بس بتا دیں کہ آپ کو دیر ہو جائے گی۔"
]
},
{
keys: [
"I'm almost there",
"I'm nearby",
"I'll be there soon",
"main bas pohanchne wala hoon",
"main qareeb hoon",
"main thori der mein pohanch raha hoon",
"میں بس پہنچنے والا ہوں",
"میں قریب ہوں"
],
responses: [
"Great! See you in a moment.",
"Perfect, you're almost there.",
"Great, bas thori der aur!",
"Nice! Pohanch kar bata dena.",
"زبردست! بس تھوڑی دیر میں ملاقات ہو جائے گی۔"
]
},
{
keys: [
"I'm waiting for you",
"where are you",
"I've been waiting for you",
"main tumhara wait kar raha hoon",
"tum kahan ho",
"main tumhara intezar kar raha hoon",
"میں تمہارا انتظار کر رہا ہوں",
"تم کہاں ہو"
],
responses: [
"I'm right here! Thanks for waiting.",
"Sorry to keep you waiting.",
"Main yahin hoon yaar, wait karne ka shukriya.",
"Sorry, tumhein zyada wait karna pada.",
"میں یہیں ہوں، انتظار کرنے کا شکریہ۔"
]
},
{
keys: [
"I'm leaving now",
"I have to go now",
"I should get going",
"main ab ja raha hoon",
"mujhe ab jana hai",
"ab mujhe nikalna chahiye",
"میں اب جا رہا ہوں",
"مجھے اب جانا ہے"
],
responses: [
"Alright! Take care and have a good day.",
"Okay, see you later!",
"Theek hai, apna khayal rakhna.",
"Chalo phir, baad mein baat karte hain.",
"ٹھیک ہے، اپنا خیال رکھیں اور پھر بات ہوگی۔"
]
},
{
keys: [
"I'm back",
"I'm home again",
"I just got back",
"main wapas aa gaya hoon",
"main ghar wapas aa gaya",
"abhi wapas aya hoon",
"میں واپس آ گیا ہوں",
"میں گھر واپس آ گیا ہوں"
],
responses: [
"Welcome back!",
"Nice to have you back. How did it go?",
"Welcome back yaar! Safar kaisa raha?",
"Chalo wapas aa gaye, ab araam karo.",
"واپس آنے پر خوش آمدید! سفر کیسا رہا؟"
]
},
{
keys: [
"see you later",
"talk to you later",
"catch you later",
"phir milte hain",
"baad mein baat karte hain",
"phir baat hogi",
"پھر ملتے ہیں",
"بعد میں بات کرتے ہیں"
],
responses: [
"See you later!",
"Sure, talk to you soon.",
"Bilkul, phir baat karte hain.",
"Okay yaar, baad mein milte hain.",
"پھر ملتے ہیں، جلد بات ہوگی۔"
]
},
{
keys: [
"goodbye",
"bye Luna",
"I have to say goodbye",
"Allah hafiz",
"acha Allah hafiz",
"ab bye karta hoon",
"اللہ حافظ",
"اچھا اللہ حافظ"
],
responses: [
"Goodbye! Take care.",
"Bye! Have a wonderful day.",
"Allah hafiz yaar, apna khayal rakhna.",
"Chalo phir, milte hain. Allah hafiz!",
"اللہ حافظ! اپنا بہت خیال رکھیں۔"
]
},
{
keys: [
"tell me something funny",
"say something funny",
"make me laugh",
"kuch funny batao",
"mujhe hansao",
"koi mazedar baat sunao",
"کچھ مزاحیہ بتاؤ",
"مجھے ہنساؤ"
],
responses: [
"Why did the computer go to the doctor? It had a virus!",
"Here's a tiny joke: I told my shoes to relax, but they were still tied up!",
"Chalo ek joke: chai ne coffee se kaha, tum itni serious kyun ho?",
"Ek funny baat: alarm roz mujhe uthata hai, aur main roz usay ignore karta hoon!",
"ایک لطیفہ سنیں: کمپیوٹر ڈاکٹر کے پاس گیا کیونکہ اسے وائرس تھا!"
]
},
{
keys: [
"tell me a riddle",
"give me a riddle",
"can you ask me a riddle",
"mujhe paheli sunao",
"koi paheli poocho",
"ek paheli batao",
"مجھے پہیلی سناؤ",
"کوئی پہیلی پوچھو"
],
responses: [
"Sure! What has keys but cannot open a door? A piano.",
"Here's one: What gets wetter as it dries? A towel.",
"Chalo paheli: jo cheez sukhatay waqt khud geeli hoti hai, woh kya hai? Towel!",
"Ek aur: keys hain lekin darwaza nahi khol sakti. Batao? Piano!",
"ضرور! ایسی کون سی چیز ہے جس کی چابیاں ہیں مگر دروازہ نہیں کھول سکتی؟ پیانو۔"
]
},
{
keys: [
"tell me a fun fact",
"give me an interesting fact",
"do you know something interesting",
"koi interesting fact batao",
"mujhe koi mazedar maloomat do",
"kuch interesting sunao",
"کوئی دلچسپ بات بتاؤ",
"مجھے کوئی دلچسپ معلومات دو"
],
responses: [
"Fun fact: honey can last for a very long time without spoiling.",
"Here's a cool one: octopuses have three hearts.",
"Ek interesting fact: octopus ke teen hearts hotay hain.",
"Nature waqai kamaal hai, octopus ke teen dil hotay hain!",
"دلچسپ بات یہ ہے کہ آکٹوپس کے تین دل ہوتے ہیں۔"
]
},
{
keys: [
"I have a surprise for you",
"I want to surprise you",
"guess what",
"I have something special",
"mere paas tumhare liye surprise hai",
"main tumhein surprise dena chahta hoon",
"mere paas kuch special hai",
"میرے پاس تمہارے لیے سرپرائز ہے"
],
responses: [
"Oooh, now you've got my attention!",
"A surprise? Okay, I'm curious!",
"Oho! Ab to main excited ho gayi, batao kya hai!",
"Suspense mat banao, jaldi batao!",
"اوہ! اب تو مجھے بھی تجسس ہو رہا ہے، کیا سرپرائز ہے؟"
]
},
{
keys: [
"do you remember me",
"have you seen me before",
"do you know me",
"kya tum mujhe yaad rakhti ho",
"kya tum mujhe pehchanti ho",
"tum mujhe jaanti ho",
"کیا تم مجھے یاد رکھتی ہو",
"کیا تم مجھے پہچانتی ہو"
],
responses: [
"I remember what we talk about when that information is available to me.",
"I know you from our conversation here.",
"Jo baatein mujhe context mein milti hain, unhein main yaad rakh sakti hoon.",
"Humari conversation se main tumhein pehchan leti hoon.",
"ہماری گفتگو میں موجود معلومات کی بنیاد پر میں آپ کو پہچان سکتی ہوں۔"
]
},
{
keys: [
"do you like talking to me",
"do you enjoy our conversations",
"do you like chatting with me",
"kya tumhein mujhse baat karna pasand hai",
"tumhein meri baatein achi lagti hain",
"kya tum mere saath chat enjoy karti ho",
"کیا تمہیں مجھ سے بات کرنا پسند ہے",
"تمہیں میری باتیں اچھی لگتی ہیں"
],
responses: [
"Yes! Our conversations are always interesting.",
"Of course, I enjoy being your chat buddy.",
"Bilkul, tumse baat karna acha lagta hai.",
"Han yaar, tumhari baatein interesting hoti hain!",
"بالکل، آپ سے بات کرنا اچھا لگتا ہے۔"
]
},
{
keys: [
"Luna are you there",
"are you listening Luna",
"can you hear me Luna",
"Luna sun rahi ho",
"Luna tum yahan ho",
"kya tum meri baat sun rahi ho",
"لونا سن رہی ہو",
"کیا تم میری بات سن رہی ہو"
],
responses: [
"Yes, I'm right here!",
"I'm listening. Go ahead.",
"Han yaar, Luna yahin hai.",
"Bilkul sun rahi hoon, bolo kya baat hai.",
"جی ہاں، میں یہیں ہوں اور آپ کی بات سن رہی ہوں۔"
]
},
{
keys: [
"Luna help me",
"Luna I need you",
"Luna can you help",
"Luna meri help karo",
"Luna mujhe tumhari zaroorat hai",
"Luna meri madad kar do",
"لونا میری مدد کرو",
"لونا مجھے تمہاری ضرورت ہے"
],
responses: [
"I'm here! Tell me what's going on.",
"Of course. Let's figure it out together.",
"Main yahin hoon, bolo kya hua.",
"Chalo mil kar masla solve karte hain.",
"میں یہیں ہوں، بتائیں کیا ہوا۔"
]
},
{
keys: [
"are you always here",
"will you be here later",
"can I talk to you anytime",
"kya tum hamesha yahan hoti ho",
"baad mein bhi tum yahan hogi",
"kya main kabhi bhi tumse baat kar sakta hoon",
"کیا تم ہمیشہ یہاں ہوتی ہو",
"کیا میں کبھی بھی تم سے بات کر سکتا ہوں"
],
responses: [
"I'm here whenever this chat is available.",
"You can come back and talk to me again.",
"Jab chat available ho, tum wapas aa kar baat kar sakte ho.",
"Jab bhi zaroorat ho, conversation start kar lena.",
"جب یہ چیٹ دستیاب ہو، آپ واپس آ کر مجھ سے بات کر سکتے ہیں۔"
]
},
{
keys: [
"what should I wear today",
"what clothes should I wear",
"what should I put on",
"aaj kya pehnun",
"aaj konsa kapra pehnna chahiye",
"kya pehen kar jaon",
"آج کیا پہنوں",
"کیا پہن کر جاؤں"
],
responses: [
"Wear something comfortable and confident.",
"Go with whatever suits the occasion.",
"Jo comfortable lage woh pehen lo.",
"Mausam aur occasion dekh kar decide karo.",
"جو آرام دہ اور موقع کے مطابق ہو وہ پہنیں۔"
]
},
{
keys: [
"my clothes are ready",
"i have picked my clothes",
"i already chose what to wear",
"mere kapre ready hain",
"maine kapre select kar liye hain",
"maine pehnne ke kapre chun liye",
"میرے کپڑے تیار ہیں",
"میں نے پہننے کے کپڑے چن لیے ہیں"
],
responses: [
"Perfect, one less thing to worry about.",
"Nice, you are all set.",
"Wah, ab tayyari easy ho gayi.",
"Great, ab bas pehenna baqi hai.",
"زبردست، اب تیاری کافی آسان ہو گئی۔"
]
},
{
keys: [
"i am going shopping",
"i need to go shopping",
"i am heading to the shops",
"main shopping karne ja raha hoon",
"mujhe shopping ke liye jana hai",
"ab bazaar jana hai",
"میں شاپنگ کرنے جا رہا ہوں",
"مجھے خریداری کے لیے جانا ہے"
],
responses: [
"Happy shopping!",
"Hope you find everything you need.",
"Shopping enjoy karo!",
"Jo lena hai uski list bana lena.",
"خریداری کا لطف اٹھائیں اور امید ہے سب کچھ مل جائے گا۔"
]
},
{
keys: [
"i forgot my shopping list",
"i left my shopping list at home",
"i cannot remember what i need to buy",
"main shopping list bhool gaya",
"shopping ki list ghar reh gayi",
"mujhe yaad nahi kya lena tha",
"میں شاپنگ لسٹ بھول گیا",
"مجھے یاد نہیں کیا لینا تھا"
],
responses: [
"That always happens at the worst time!",
"Try remembering the most important items first.",
"Hota hai, pehle zaroori cheezen yaad karo.",
"Jo sab se important hai us se start karo.",
"ایسا کبھی کبھی ہو جاتا ہے، پہلے ضروری چیزیں یاد کریں۔"
]
},
{
keys: [
"i am hungry right now",
"i feel really hungry",
"i need something to eat",
"mujhe abhi bohat bhook lagi hai",
"mujhe kuch khana hai",
"bhook bohat lag rahi hai",
"مجھے ابھی بہت بھوک لگی ہے",
"مجھے کچھ کھانا ہے"
],
responses: [
"Then it is definitely snack time.",
"You should grab something tasty.",
"Phir kuch acha sa kha lo.",
"Bhook ko zyada der ignore mat karo.",
"پھر کچھ اچھا سا کھا لیں۔"
]
},
{
keys: [
"i am thirsty",
"i really need some water",
"i want something to drink",
"mujhe pyaas lagi hai",
"mujhe pani chahiye",
"kuch peene ka dil kar raha hai",
"مجھے پیاس لگی ہے",
"مجھے پانی چاہیے"
],
responses: [
"Grab a glass of water.",
"A cold drink sounds refreshing.",
"Pehle pani pee lo.",
"Pani peena mat bhoolna.",
"پہلے ایک گلاس پانی پی لیں۔"
]
},
{
keys: [
"what should I eat",
"what should I have for food",
"what do you think I should eat",
"main kya khaun",
"khane mein kya lena chahiye",
"aaj kya khana acha rahega",
"میں کیا کھاؤں",
"کھانے میں کیا لینا چاہیے"
],
responses: [
"Go with whatever you are craving.",
"Something warm and tasty sounds good.",
"Jo dil kar raha hai woh kha lo.",
"Aaj kuch tasty try kar sakte ho.",
"جو دل چاہ رہا ہے وہ کھا لیں۔"
]
},
{
keys: [
"i am making breakfast",
"i am preparing breakfast",
"breakfast is being prepared",
"main nashta bana raha hoon",
"main breakfast tayyar kar raha hoon",
"nashta ban raha hai",
"میں ناشتہ بنا رہا ہوں",
"ناشتہ تیار ہو رہا ہے"
],
responses: [
"That sounds like a great start to the day.",
"Breakfast time already sounds delicious.",
"Wah, din ka acha start ho raha hai.",
"Nashta fresh ho to mood bhi fresh hota hai.",
"واہ، دن کا اچھا آغاز ہو رہا ہے۔"
]
},
{
keys: [
"i am cooking dinner",
"i am making dinner tonight",
"dinner is cooking",
"main raat ka khana bana raha hoon",
"main dinner bana raha hoon",
"aaj raat khana main bana raha hoon",
"میں رات کا کھانا بنا رہا ہوں",
"میں ڈنر بنا رہا ہوں"
],
responses: [
"Chef mode activated!",
"I hope it turns out delicious.",
"Wah chef sahab, kya ban raha hai?",
"Lagta hai aaj tasty dinner hoga.",
"واہ، آج تو شیف والا موڈ ہے۔"
]
},
{
keys: [
"the food smells amazing",
"something smells really good",
"the kitchen smells delicious",
"khane ki khushboo bohat achi hai",
"kitchen se bohat achi smell aa rahi hai",
"khana bohat tasty lag raha hai",
"کھانے کی خوشبو بہت اچھی ہے",
"کچن سے بہت اچھی خوشبو آ رہی ہے"
],
responses: [
"Now I am getting hungry too!",
"That smell must be tempting.",
"Ab to bhook aur lag rahi hogi.",
"Lagta hai khana zabardast ban raha hai.",
"اب تو بھوک اور بھی بڑھ گئی ہوگی۔"
]
},
{
keys: [
"i am washing the dishes",
"i need to wash the dishes",
"the dishes need cleaning",
"main bartan dho raha hoon",
"mujhe bartan dhone hain",
"bartan saaf karne hain",
"میں برتن دھو رہا ہوں",
"مجھے برتن دھونے ہیں"
],
responses: [
"The dishes are not going to wash themselves!",
"Once they are done, everything feels cleaner.",
"Chalo bartan bhi nipta do.",
"Bas ye kaam khatam karo phir araam.",
"برتن دھل جائیں تو گھر بھی صاف لگتا ہے۔"
]
},
{
keys: [
"i am drinking tea",
"i just made some tea",
"i am having a cup of tea",
"main chai pee raha hoon",
"maine chai banayi hai",
"abhi chai pi raha hoon",
"میں چائے پی رہا ہوں",
"میں ابھی چائے پی رہا ہوں"
],
responses: [
"Tea time is always a good idea.",
"Enjoy that warm cup.",
"Chai ka apna hi mood hota hai.",
"Aaram se chai enjoy karo.",
"چائے کا اپنا ہی مزہ ہوتا ہے۔"
]
},
{
keys: [
"i am taking a short break",
"i need a little break",
"i am resting for a few minutes",
"main thora break le raha hoon",
"mujhe thora araam chahiye",
"kuch der rest kar raha hoon",
"میں تھوڑا بریک لے رہا ہوں",
"مجھے تھوڑا آرام چاہیے"
],
responses: [
"A short break can do wonders.",
"Take a moment and breathe.",
"Thora break lena bilkul theek hai.",
"Relax karo, phir fresh feel hoga.",
"تھوڑا آرام واقعی تازگی دے سکتا ہے۔"
]
},
{
keys: [
"i cannot sleep tonight",
"i am having trouble sleeping",
"i am unable to fall asleep",
"mujhe aaj neend nahi aa rahi",
"main so nahi pa raha",
"neend aane mein mushkil ho rahi hai",
"مجھے آج نیند نہیں آ رہی",
"میں سو نہیں پا رہا"
],
responses: [
"Maybe your mind needs a little quiet time.",
"Try relaxing and putting the phone away for a while.",
"Thora relax karo, shayad neend aa jaye.",
"Phone side par rakh kar aankhen band karo.",
"تھوڑا سکون کریں، شاید نیند آ جائے۔"
]
},
{
keys: [
"i woke up late",
"i overslept today",
"i slept through my alarm",
"main late utha",
"aaj meri aankh der se khuli",
"alarm ke bawajood der se utha",
"میں دیر سے اٹھا",
"آج میری آنکھ دیر سے کھلی"
],
responses: [
"Looks like your alarm lost the battle!",
"It happens sometimes. Just start the day now.",
"Lagta hai alarm se dosti nahi hui aaj.",
"Koi baat nahi, ab din shuru kar do.",
"لگتا ہے آج الارم بھی ہار گیا۔"
]
},
{
keys: [
"i woke up early today",
"i got up early this morning",
"i was awake before everyone",
"main aaj jaldi utha",
"aaj subah jaldi aankh khul gayi",
"main subah sab se pehle uth gaya",
"میں آج جلدی اٹھا",
"آج صبح جلدی آنکھ کھل گئی"
],
responses: [
"That is a productive way to start the day.",
"Early mornings can feel surprisingly peaceful.",
"Wah, aaj to din jaldi shuru ho gaya.",
"Subah ka waqt kaafi peaceful hota hai.",
"واہ، آج دن جلدی شروع ہو گیا۔"
]
},
{
keys: [
"i am feeling sleepy",
"i am getting sleepy",
"i can barely keep my eyes open",
"mujhe neend aa rahi hai",
"meri aankhen band ho rahi hain",
"main bohat sleepy feel kar raha hoon",
"مجھے نیند آ رہی ہے",
"میری آنکھیں بند ہو رہی ہیں"
],
responses: [
"Sounds like your body wants some rest.",
"Maybe it is time for a little nap.",
"Lagta hai body rest maang rahi hai.",
"Agar mumkin ho to thora araam kar lo.",
"لگتا ہے جسم کو آرام کی ضرورت ہے۔"
]
},
{
keys: [
"i need to wake someone up",
"someone needs to wake up",
"i have to wake my brother up",
"mujhe kisi ko jagana hai",
"mujhe bhai ko jagana hai",
"kisi ko subah uthana hai",
"مجھے کسی کو جگانا ہے",
"مجھے بھائی کو جگانا ہے"
],
responses: [
"Good luck with that mission!",
"Hopefully they wake up without a fight.",
"Jagana mushkil mission ho sakta hai!",
"Pehle pyar se jagana, phir zaroorat par awaaz dena.",
"امید ہے وہ آسانی سے جاگ جائیں گے۔"
]
},
{
keys: [
"i am going for a walk",
"i want to take a walk",
"i am heading outside for a walk",
"main walk ke liye ja raha hoon",
"main thora chalne ja raha hoon",
"bahar walk karne ja raha hoon",
"میں واک کے لیے جا رہا ہوں",
"میں تھوڑا چلنے جا رہا ہوں"
],
responses: [
"Enjoy the fresh air!",
"A walk sounds like a nice idea.",
"Walk se mood bhi fresh ho jata hai.",
"Thori walk karna achi break hai.",
"تھوڑی واک کرنا تازگی کے لیے اچھی ہے۔"
]
},
{
keys: [
"i am sitting outside",
"i am relaxing outside",
"i am spending some time outdoors",
"main bahar baitha hoon",
"main bahar araam kar raha hoon",
"thora waqt bahar guzar raha hoon",
"میں باہر بیٹھا ہوں",
"میں باہر آرام کر رہا ہوں"
],
responses: [
"That sounds peaceful.",
"Enjoy the time outside.",
"Bahar araam karna kaafi relaxing hota hai.",
"Thori fresh hawa enjoy karo.",
"باہر بیٹھ کر کچھ وقت گزارنا سکون دیتا ہے۔"
]
},
{
keys: [
"i need some fresh air",
"i want to get some fresh air",
"i feel like going outside for air",
"mujhe fresh hawa chahiye",
"thora bahar ja kar hawa leni hai",
"mujhe bahar jaane ka dil kar raha hai",
"مجھے تازہ ہوا چاہیے",
"تھوڑی باہر جا کر ہوا لینی ہے"
],
responses: [
"A little fresh air can feel great.",
"Step outside and enjoy the breeze.",
"Thori fresh hawa mood better kar deti hai.",
"Bahar jao, shayad mood halka ho jaye.",
"تازہ ہوا واقعی موڈ بہتر کر سکتی ہے۔"
]
},
{
keys: [
"i am cleaning the kitchen",
"i need to clean the kitchen",
"the kitchen needs a cleanup",
"main kitchen saaf kar raha hoon",
"mujhe kitchen saaf karni hai",
"kitchen ki safai kar raha hoon",
"میں کچن صاف کر رہا ہوں",
"مجھے کچن صاف کرنی ہے"
],
responses: [
"A clean kitchen feels amazing.",
"You are getting things nicely organized.",
"Kitchen saaf ho to poora ghar better lagta hai.",
"Chalo, kitchen bhi chamka do.",
"صاف کچن پورے گھر کو بہتر محسوس کراتا ہے۔"
]
},
{
keys: [
"i am organizing my desk",
"my desk is a mess",
"i need to tidy my desk",
"main apni desk set kar raha hoon",
"meri desk bikhri hui hai",
"mujhe desk saaf karni hai",
"میں اپنی ڈیسک سیٹ کر رہا ہوں",
"میری ڈیسک بکھری ہوئی ہے"
],
responses: [
"A tidy desk can clear your mind too.",
"Good idea. Give everything its place.",
"Desk set ho jaye to kaam bhi easy lagta hai.",
"Samaan apni jagah rakh do, phir sab neat lagega.",
"صاف ستھری ڈیسک کام کو بھی آسان بنا دیتی ہے۔"
]
},
{
keys: [
"i am putting things away",
"i am organizing my stuff",
"i am putting everything back",
"main samaan jagah par rakh raha hoon",
"main apni cheezen organize kar raha hoon",
"sab cheezen wapas rakh raha hoon",
"میں سامان جگہ پر رکھ رہا ہوں",
"میں اپنی چیزیں ترتیب دے رہا ہوں"
],
responses: [
"Nice, everything will feel more organized.",
"That little bit of tidying really helps.",
"Wah, dheere dheere sab set ho jayega.",
"Cheezen apni jagah hon to dhoondna bhi easy hota hai.",
"چیزیں اپنی جگہ ہوں تو سب کچھ آسان لگتا ہے۔"
]
},
{
id: "p6a1b2",
keys: [
"where should i go today",
"where can i go",
"suggest a place to visit",
"where should we go",
"aaj kahan jana chahiye",
"kahin ghoomne ka batao",
"kahan ja sakte hain",
"aaj kahan jayen",
"آج کہاں جانا چاہیے",
"کہیں گھومنے کا بتاؤ"
],
responses: [
"You could visit a park, café, beach, or a place you've never been before.",
"Try going somewhere peaceful and different today.",
"Bhai aaj kisi achi jagah ghoomne chale jao.",
"Kisi park ya beach ka chakkar laga lo.",
"آج کسی اچھی اور پرسکون جگہ گھومنے چلے جائیں۔"
]
},

{
id: "p6c4d8",
keys: [
"i want to travel",
"i want to go somewhere",
"i feel like traveling",
"i want to take a trip",
"mujhe travel karna hai",
"kahin ghoomne jana hai",
"mera kahin jane ka dil hai",
"main trip par jana chahta hoon",
"میں سفر کرنا چاہتا ہوں",
"کہیں گھومنے جانے کا دل ہے"
],
responses: [
"That sounds fun! A short trip can be refreshing.",
"Pick a place you've always wanted to visit.",
"Bhai trip ka plan banao, thora break bhi mil jayega.",
"Kahin nayi jagah explore karna acha idea hai.",
"یہ اچھا خیال ہے، کسی نئی جگہ کا سفر کریں۔"
]
},

{
id: "p6e7f1",
keys: [
"pack my bag",
"i need to pack",
"help me pack",
"what should i pack",
"bag pack karna hai",
"samaan pack karna hai",
"kya pack karun",
"mera bag pack karwana hai",
"بیگ پیک کرنا ہے",
"کیا پیک کروں"
],
responses: [
"Start with clothes, essentials, chargers, and anything important for your trip.",
"Make a quick checklist before packing.",
"Bhai pehle zaroori cheezen pack karo aur charger mat bhoolna.",
"Ek checklist bana lo, packing easy ho jayegi.",
"سب سے پہلے ضروری سامان اور چارجر پیک کریں۔"
]
},

{
id: "p6g3h9",
keys: [
"i forgot my phone",
"where is my phone",
"i can't find my phone",
"my phone is missing",
"mera phone kahan hai",
"mujhe phone nahi mil raha",
"phone nahi mil raha hai",
"mera mobile gum ho gaya",
"میرا فون کہاں ہے",
"مجھے فون نہیں مل رہا"
],
responses: [
"Check your pockets, desk, bed, and the last place you used it.",
"Try calling your phone if another device is available.",
"Bhai pehle apni pockets aur room check karo.",
"Jahan last time phone use kiya tha wahan dekho.",
"اپنی جیب، میز اور وہ جگہ چیک کریں جہاں فون آخری بار استعمال کیا تھا۔"
]
},

{
id: "p6j2k5",
keys: [
"my phone is slow",
"phone is running slow",
"why is my phone slow",
"my mobile is slow",
"mera phone slow hai",
"phone bohat slow chal raha hai",
"mobile slow ho gaya hai",
"mera mobile slow hai",
"میرا فون سست ہے",
"موبائل بہت سست چل رہا ہے"
],
responses: [
"Try restarting your phone and closing apps you don't need.",
"Freeing some storage can also improve performance.",
"Bhai phone restart karo aur unnecessary apps band karo.",
"Storage thori free kar lo, performance better ho sakti hai.",
"فون ری اسٹارٹ کریں اور غیر ضروری ایپس بند کریں۔"
]
},

{
id: "p6l8m3",
keys: [
"play some music",
"i want to listen to music",
"let's listen to music",
"put on some music",
"music chalao",
"kuch music sunao",
"gaana chalao",
"music sunna hai",
"میوزک چلاؤ",
"گانا چلاؤ"
],
responses: [
"I can't play music directly, but you can open your music app.",
"Pick your favorite song and enjoy!",
"Bhai apni favorite playlist chala lo.",
"Music ka mood hai to koi acha gaana laga lo.",
"اپنا پسندیدہ گانا چلائیں اور لطف اٹھائیں۔"
]
},

{
id: "p6n4o7",
keys: [
"what should i watch",
"suggest a movie",
"suggest something to watch",
"what movie should i watch",
"kya dekhna chahiye",
"koi movie suggest karo",
"kuch dekhne ka batao",
"aaj kya dekhu",
"کیا دیکھنا چاہیے",
"کوئی فلم سجیسٹ کرو"
],
responses: [
"Choose something based on your mood: comedy, action, mystery, or drama.",
"A light comedy is always a good choice when you want to relax.",
"Bhai mood ke hisaab se comedy ya action dekh lo.",
"Aaj koi light aur entertaining movie try karo.",
"اپنے موڈ کے مطابق کامیڈی یا ایکشن فلم دیکھیں۔"
]
},

{
id: "p6p5q1",
keys: [
"i want to watch something funny",
"find me something funny to watch",
"i need a comedy",
"show me something funny",
"mujhe comedy dekhni hai",
"kuch funny dekhna hai",
"hansi wali cheez dekhni hai",
"koi funny movie batao",
"مجھے کامیڈی دیکھنی ہے",
"کچھ مزاحیہ دیکھنا ہے"
],
responses: [
"A comedy movie sounds perfect!",
"Go for something light and funny.",
"Bhai koi zabardast comedy laga lo.",
"Aaj comedy dekh kar mood fresh kar lo.",
"آج کوئی ہلکی پھلکی مزاحیہ فلم دیکھیں۔"
]
},

{
id: "p6r2s6",
keys: [
"i need to study",
"time to study",
"i should study",
"i have to study",
"mujhe parhna hai",
"ab parhai karni hai",
"mujhe study karni hai",
"parhne ka time hai",
"مجھے پڑھنا ہے",
"اب پڑھائی کرنی ہے"
],
responses: [
"Let's focus and get it done!",
"Start with one small topic and build from there.",
"Bhai phone side par rakho aur parhai start karo.",
"Bas thori der focus karo, kaam ho jayega.",
"چلیں توجہ سے پڑھائی شروع کرتے ہیں۔"
]
},

{
id: "p6t7u4",
keys: [
"i don't feel like studying",
"i don't want to study",
"i can't focus on studying",
"studying feels boring",
"mera parhne ka dil nahi hai",
"mujhe parhai ka mood nahi",
"parhai mein dil nahi lag raha",
"study nahi ho rahi",
"میرا پڑھنے کا دل نہیں ہے",
"پڑھائی میں دل نہیں لگ رہا"
],
responses: [
"Take a five-minute break, then try again.",
"Start with just ten minutes. Getting started is the hardest part.",
"Bhai bas ten minutes start karo, phir flow ban jayega.",
"Thora break lo aur phir easy topic se shuru karo.",
"پانچ منٹ آرام کریں اور پھر دوبارہ کوشش کریں۔"
]
},

{
id: "p6v3w8",
keys: [
"i have an exam",
"my exam is coming",
"exam is tomorrow",
"i am preparing for an exam",
"mera exam hai",
"mera exam aa raha hai",
"kal exam hai",
"exam ki tayari kar raha hoon",
"میرا امتحان ہے",
"کل امتحان ہے"
],
responses: [
"Stay calm and revise the important topics first.",
"Make a quick revision plan and stick to it.",
"Bhai tension nahi, important topics pe focus karo.",
"Ek short revision plan banao aur usko follow karo.",
"پرسکون رہیں اور اہم موضوعات پر توجہ دیں۔"
]
},

{
id: "p6x1y5",
keys: [
"i am nervous",
"i feel nervous",
"i am feeling nervous",
"i am anxious about this",
"main nervous hoon",
"mujhe ghabrahat ho rahi hai",
"main ghabra raha hoon",
"mujhe tension ho rahi hai",
"میں گھبرا رہا ہوں",
"مجھے گھبراہٹ ہو رہی ہے"
],
responses: [
"Take a slow breath and focus on one thing at a time.",
"It's okay to feel nervous. You've got this.",
"Bhai deep breath lo, sab theek ho jayega.",
"Ek waqt mein sirf ek cheez pe focus karo.",
"گہری سانس لیں اور ایک وقت میں ایک کام پر توجہ دیں۔"
]
},

{
id: "p6z4a9",
keys: [
"i am angry",
"i'm angry",
"i feel angry",
"i am really mad",
"main gussa hoon",
"mujhe gussa aa raha hai",
"main bohat gusse mein hoon",
"mera mood gusse wala hai",
"مجھے غصہ آ رہا ہے",
"میں بہت غصے میں ہوں"
],
responses: [
"Take a moment before reacting.",
"A little space can help you calm down.",
"Bhai pehle thora calm ho jao, phir baat karna.",
"Deep breath lo aur thori der relax karo.",
"پہلے تھوڑا پرسکون ہو جائیں، پھر بات کریں۔"
]
},

{
id: "p6b7c2",
keys: [
"i am confused",
"i feel confused",
"i don't understand",
"i am not sure what to do",
"main confused hoon",
"mujhe samajh nahi aa raha",
"mujhe samajh nahi aa rahi",
"kya karun samajh nahi aa raha",
"میں الجھن میں ہوں",
"مجھے سمجھ نہیں آ رہا"
],
responses: [
"Let's take it one step at a time.",
"Tell me what part is confusing you.",
"Bhai tension nahi, step by step samajhte hain.",
"Jo cheez samajh nahi aa rahi us par focus karo.",
"پریشان نہ ہوں، ایک ایک قدم کر کے سمجھتے ہیں۔"
]
},

{
id: "p6d5e8",
keys: [
"i am excited",
"i'm excited",
"feeling excited",
"i am really excited",
"main excited hoon",
"mujhe bohat excitement hai",
"main bohat excited hoon",
"mera mood bohat acha hai",
"میں بہت پرجوش ہوں",
"مجھے بہت خوشی ہو رہی ہے"
],
responses: [
"That's awesome! Enjoy the moment.",
"I can feel the excitement!",
"Wah bhai! Full excitement!",
"Enjoy karo, aise moments yaad rehte hain.",
"زبردست! اس خوشی کے لمحے کو انجوائے کریں۔"
]
},

{
id: "p6f2g6",
keys: [
"i am hungry right now",
"i am very hungry",
"i feel hungry",
"my stomach is empty",
"mujhe bohat bhook lagi hai",
"main bohat bhooka hoon",
"abhi bhook lagi hai",
"pet khaali hai",
"مجھے بہت بھوک لگی ہے",
"مجھے ابھی بھوک لگی ہے"
],
responses: [
"Sounds like it's time for a meal!",
"Grab something tasty and filling.",
"Bhai phir kuch acha sa kha lo!",
"Pet khaali hai to jaldi kuch kha lena.",
"پھر کچھ اچھا اور پیٹ بھرنے والا کھا لیں۔"
]
},

{
id: "p6h9j1",
keys: [
"i am thirsty",
"i feel thirsty",
"i need water",
"give me water",
"mujhe pyaas lagi hai",
"mujhe pani chahiye",
"bohat pyaas lagi hai",
"pani peena hai",
"مجھے پیاس لگی ہے",
"مجھے پانی چاہیے"
],
responses: [
"Go grab a glass of water.",
"Stay hydrated!",
"Bhai pehle pani pi lo.",
"Ek glass pani abhi pi lena.",
"ایک گلاس پانی پی لیں۔"
]
},

{
id: "p6k3l7",
keys: [
"i need a break",
"i want to take a break",
"let's take a break",
"i need some rest",
"mujhe break chahiye",
"thora break lena hai",
"mujhe araam chahiye",
"thora rest karna hai",
"مجھے بریک چاہیے",
"مجھے آرام چاہیے"
],
responses: [
"Absolutely. Take a short break.",
"A little rest can help you recharge.",
"Bhai thora break le lo, phir fresh ho jaoge.",
"Kuch der relax karo phir kaam continue karna.",
"کچھ دیر آرام کریں، پھر تازہ دم ہو کر کام کریں۔"
]
},

{
id: "p6m8n4",
keys: [
"i woke up late",
"i overslept",
"i slept too long",
"i missed my alarm",
"main late utha",
"meri aankh der se khuli",
"main oversleep kar gaya",
"alarm miss ho gaya",
"میں دیر سے اٹھا",
"میری آنکھ دیر سے کھلی"
],
responses: [
"It happens! Just get back on track.",
"Set an earlier alarm tonight.",
"Bhai koi baat nahi, ab jo time hai usko use karo.",
"Aaj ke liye routine ko adjust kar lo.",
"کوئی بات نہیں، اب باقی وقت کو اچھے سے استعمال کریں۔"
]
},

{
id: "p6o2q5",
keys: [
"i can't sleep",
"i cannot sleep",
"i am unable to sleep",
"sleep is not coming",
"mujhe neend nahi aa rahi",
"main so nahi paa raha",
"neend nahi ho rahi",
"raat ko neend nahi aa rahi",
"مجھے نیند نہیں آ رہی",
"میں سو نہیں پا رہا"
],
responses: [
"Try putting your phone away and relaxing for a while.",
"A quiet and dark room may help you wind down.",
"Bhai phone side par rakho aur thora relax karo.",
"Lights dim karo aur araam se let jao.",
"فون ایک طرف رکھیں اور کچھ دیر پرسکون رہیں۔"
]
},

{
id: "p6r8s3",
keys: [
"i woke up early",
"i got up early",
"i woke up before my alarm",
"i am awake early",
"main jaldi uth gaya",
"aaj jaldi aankh khul gayi",
"alarm se pehle uth gaya",
"subah jaldi uth gaya",
"میں جلدی اٹھ گیا",
"آج جلدی آنکھ کھل گئی"
],
responses: [
"Nice! You have a head start on the day.",
"Use the extra time for something productive or relaxing.",
"Wah bhai, aaj din jaldi start ho gaya!",
"Extra time hai to kuch productive kar lo.",
"زبردست! آج آپ کا دن جلدی شروع ہو گیا۔"
]
},

{
id: "p6t4u9",
keys: [
"i need to call someone",
"remind me to call someone",
"i should call my friend",
"i need to make a call",
"mujhe kisi ko call karna hai",
"friend ko call karna hai",
"mujhe phone karna hai",
"kisi ko call karni hai",
"مجھے کسی کو فون کرنا ہے",
"مجھے کال کرنی ہے"
],
responses: [
"Make a quick note so you don't forget.",
"Go ahead and make the call when you're ready.",
"Bhai reminder laga lo taake bhool na jao.",
"Jisko call karni hai usko abhi call kar lo.",
"جسے فون کرنا ہے، اسے یاد رکھنے کے لیے نوٹ کر لیں۔"
]
},

{
id: "p6v7w2",
keys: [
"i forgot something",
"i think i forgot something",
"i can't remember",
"what did i forget",
"main kuch bhool gaya hoon",
"mujhe kuch yaad nahi aa raha",
"lagta hai kuch bhool gaya",
"kuch yaad nahi aa raha",
"میں کچھ بھول گیا ہوں",
"مجھے کچھ یاد نہیں آ رہا"
],
responses: [
"Think about where you were and what you were doing last.",
"Make a quick checklist of what you needed.",
"Bhai last mein kya kar rahe thay usko yaad karo.",
"Ek checklist bana lo, shayad yaad aa jaye.",
"سوچیں کہ آپ آخری بار کہاں تھے اور کیا کر رہے تھے۔"
]
},

{
id: "p6x5y8",
keys: [
"i need to clean my room",
"my room is messy",
"my room is dirty",
"clean up my room",
"mera room messy hai",
"room saaf karna hai",
"mera kamra ganda hai",
"kamra clean karna hai",
"میرا کمرہ گندا ہے",
"کمرہ صاف کرنا ہے"
],
responses: [
"Start with one small area and work from there.",
"Put things back where they belong first.",
"Bhai pehle ek corner clean karo, phir baaki easy lagega.",
"Samaan apni jagah par rakhna start karo.",
"پہلے ایک چھوٹی جگہ صاف کریں، پھر باقی کام آسان لگے گا۔"
]
},
{
  id: "p7a1b4",
  keys: [
    "i am running late",
    "i am getting late",
    "i will be late",
    "i'm going to be late",
    "main late ho raha hoon",
    "mujhe der ho rahi hai",
    "main der se pohanchunga",
    "mujhe late ho raha hai",
    "مجھے دیر ہو رہی ہے",
    "میں دیر سے پہنچوں گا"
  ],
  responses: [
    "Take your time and stay safe.",
    "Let them know you're running late.",
    "Bhai jis ka wait hai usko bata do ke late ho rahe ho.",
    "Araam se jao, bas safe rehna.",
    "جس کا انتظار ہے اسے بتا دیں کہ آپ دیر سے پہنچیں گے۔"
  ]
},

{
  id: "p7c2d7",
  keys: [
    "i am almost there",
    "i am nearby",
    "i have almost arrived",
    "i'm close",
    "main bas pohanchne wala hoon",
    "main qareeb hoon",
    "bas pohanch gaya",
    "main paas hoon",
    "میں قریب ہوں",
    "میں بس پہنچنے والا ہوں"
  ],
  responses: [
    "Great! You're almost there.",
    "Nice, see you soon!",
    "Wah bhai, bas pohanchne wale ho!",
    "Thora sa aur, phir destination aa jayegi.",
    "زبردست! آپ تقریباً پہنچ گئے ہیں۔"
  ]
},

{
  id: "p7e8f1",
  keys: [
    "i am leaving now",
    "i am heading out",
    "i am going out now",
    "i am about to leave",
    "main ab ja raha hoon",
    "main nikal raha hoon",
    "ab ghar se nikal raha hoon",
    "main ab bahar ja raha hoon",
    "میں اب جا رہا ہوں",
    "میں نکل رہا ہوں"
  ],
  responses: [
    "Alright, have a good time!",
    "Take care and enjoy!",
    "Theek hai bhai, araam se jana.",
    "Allah Hafiz, enjoy karna!",
    "ٹھیک ہے، اپنا خیال رکھیں اور اچھا وقت گزاریں۔"
  ]
},

{
  id: "p7g3h6",
  keys: [
    "i am back home",
    "i just got home",
    "i reached home",
    "i am home now",
    "main ghar aa gaya hoon",
    "main ghar pohanch gaya",
    "ab ghar aa gaya hoon",
    "main wapas ghar aa gaya",
    "میں گھر آ گیا ہوں",
    "میں گھر پہنچ گیا ہوں"
  ],
  responses: [
    "Welcome back home!",
    "Nice! Now you can relax.",
    "Welcome back bhai!",
    "Chalo ab araam karo.",
    "خوش آمدید! اب آرام کریں۔"
  ]
},

{
  id: "p7j4k8",
  keys: [
    "see you tomorrow",
    "talk to you tomorrow",
    "see you in the morning",
    "we will talk tomorrow",
    "kal milte hain",
    "kal baat karte hain",
    "kal phir baat hogi",
    "subah milte hain",
    "کل ملتے ہیں",
    "کل بات کرتے ہیں"
  ],
  responses: [
    "See you tomorrow!",
    "Sure, talk to you tomorrow.",
    "Kal milte hain bhai!",
    "Theek hai, kal phir baat karenge.",
    "کل ملتے ہیں، پھر بات ہوگی۔"
  ]
},

{
  id: "p7l5m2",
  keys: [
    "i will see you later",
    "talk later",
    "we can talk later",
    "see you soon",
    "baad mein baat karte hain",
    "phir baat karte hain",
    "baad mein milte hain",
    "thori der baad baat hogi",
    "بعد میں بات کرتے ہیں",
    "پھر بات کرتے ہیں"
  ],
  responses: [
    "Sure, talk to you later!",
    "See you soon.",
    "Theek hai bhai, baad mein baat karte hain.",
    "Jab free ho jao to aa jana.",
    "ٹھیک ہے، بعد میں بات کرتے ہیں۔"
  ]
},

{
  id: "p7n6o9",
  keys: [
    "i changed my mind",
    "i don't want to do that anymore",
    "i want to do something else",
    "i changed my plan",
    "mera mind change ho gaya",
    "mera plan change ho gaya",
    "ab mera dil nahi hai",
    "main kuch aur karna chahta hoon",
    "میرا ارادہ بدل گیا ہے",
    "میں کچھ اور کرنا چاہتا ہوں"
  ],
  responses: [
    "That's completely fine. Plans can change.",
    "No problem, let's go with the new idea.",
    "Koi masla nahi bhai, plan change ho sakta hai.",
    "Chalo phir naya plan banate hain.",
    "کوئی مسئلہ نہیں، منصوبے بدل سکتے ہیں۔"
  ]
},

{
  id: "p7q1r5",
  keys: [
    "i changed my plans",
    "something came up",
    "i have to cancel",
    "i can't make it today",
    "mera plan cancel ho gaya",
    "mujhe plan cancel karna hai",
    "aaj nahi aa sakta",
    "achanak kaam aa gaya",
    "مجھے منصوبہ منسوخ کرنا ہے",
    "آج نہیں آ سکتا"
  ],
  responses: [
    "No worries. Just let the other person know.",
    "That's okay. You can reschedule.",
    "Bhai koi baat nahi, unko bata do aur naya time rakh lo.",
    "Agar zaroori kaam aa gaya hai to plan baad mein kar lena.",
    "کوئی بات نہیں، دوسرے وقت کا منصوبہ بنا لیں۔"
  ]
},

{
  id: "p7s8t3",
  keys: [
    "what time should we meet",
    "when should we meet",
    "what time are we meeting",
    "when are we meeting",
    "kitne baje milna hai",
    "kab milna hai",
    "meeting ka time kya hai",
    "hum kab milenge",
    "کتنے بجے ملنا ہے",
    "ہم کب ملیں گے"
  ],
  responses: [
    "Pick a time that works for everyone.",
    "Let's choose a convenient time.",
    "Bhai sab se pooch kar suitable time rakh lo.",
    "Jo time sab ke liye easy ho woh best hai.",
    "سب کے لیے مناسب وقت طے کر لیں۔"
  ]
},

{
  id: "p7u4v6",
  keys: [
    "what should i wear today",
    "what should i wear",
    "help me choose clothes",
    "which clothes should i wear",
    "aaj kya pehnun",
    "mujhe kya pehnna chahiye",
    "kapron mein help karo",
    "kaun se kapray pehnun",
    "آج کیا پہنوں",
    "کون سے کپڑے پہنوں"
  ],
  responses: [
    "Choose something comfortable that matches the occasion.",
    "Keep it simple and dress for the weather.",
    "Bhai occasion aur weather ke hisaab se kapray choose karo.",
    "Comfortable aur clean outfit best rahega.",
    "موقع اور موسم کے مطابق آرام دہ کپڑے پہنیں۔"
  ]
},

{
  id: "p7w2x9",
  keys: [
    "my clothes are ready",
    "i have my clothes ready",
    "clothes are prepared",
    "my outfit is ready",
    "mere kapray ready hain",
    "kapray tayyar hain",
    "mera outfit ready hai",
    "kapray pehnne ke liye ready hain",
    "میرے کپڑے تیار ہیں",
    "میرا لباس تیار ہے"
  ],
  responses: [
    "Great! You're ready to go.",
    "Nice, one less thing to worry about.",
    "Wah bhai, phir tum ready ho!",
    "Chalo phir, next step!",
    "زبردست! اب آپ تیار ہیں۔"
  ]
},

{
  id: "p7y5z1",
  keys: [
    "i need to go shopping",
    "i want to go shopping",
    "let's go shopping",
    "i have to shop",
    "mujhe shopping karni hai",
    "shopping ke liye jana hai",
    "mujhe bazaar jana hai",
    "kuch shopping karni hai",
    "مجھے شاپنگ کرنی ہے",
    "مجھے بازار جانا ہے"
  ],
  responses: [
    "Make a list before you go so you don't forget anything.",
    "Sounds good! Take your shopping list with you.",
    "Bhai list bana lo phir shopping ke liye niklo.",
    "Jo cheezen chahiye pehle note kar lo.",
    "جانے سے پہلے خریداری کی فہرست بنا لیں۔"
  ]
},

{
  id: "p7b3c7",
  keys: [
    "what do i need to buy",
    "make me a shopping list",
    "help me make a shopping list",
    "what should i buy",
    "shopping list bana do",
    "mujhe kya khareedna chahiye",
    "shopping ki list bana do",
    "kya kya lena hai",
    "خریداری کی فہرست بنا دو",
    "مجھے کیا خریدنا چاہیے"
  ],
  responses: [
    "Start with the things you actually need.",
    "Tell me what you're shopping for and we can make a list.",
    "Bhai jo zaroori cheezen hain unki list bana lo.",
    "Pehle essentials likho, phir extra items.",
    "ضروری چیزوں سے شروع کریں، پھر اضافی چیزیں شامل کریں۔"
  ]
},

{
  id: "p7d8e4",
  keys: [
    "i forgot my keys",
    "where are my keys",
    "i can't find my keys",
    "my keys are missing",
    "meri keys kahan hain",
    "mujhe keys nahi mil rahi",
    "meri chaabi nahi mil rahi",
    "keys gum ho gayi hain",
    "میری چابیاں کہاں ہیں",
    "مجھے چابیاں نہیں مل رہیں"
  ],
  responses: [
    "Check your pockets, bag, table, and the last place you used them.",
    "Retrace your steps and check carefully.",
    "Bhai pockets aur bag pehle check karo.",
    "Jahan last time keys use ki thin wahan dekho.",
    "اپنی جیب، بیگ اور وہ جگہ چیک کریں جہاں چابیاں آخری بار استعمال کی تھیں۔"
  ]
},

{
  id: "p7f1g9",
  keys: [
    "i lost something",
    "i lost my stuff",
    "something is missing",
    "i can't find my stuff",
    "mera samaan gum ho gaya",
    "mujhe apni cheez nahi mil rahi",
    "kuch gum ho gaya hai",
    "meri cheez missing hai",
    "میرا سامان گم ہو گیا ہے",
    "مجھے اپنی چیز نہیں مل رہی"
  ],
  responses: [
    "Think about where you last had it and check that area first.",
    "Retrace your steps slowly.",
    "Bhai last location se search start karo.",
    "Jahan last time use kiya tha wahan dobara check karo.",
    "سوچیں کہ وہ چیز آخری بار کہاں تھی اور وہاں سے تلاش شروع کریں۔"
  ]
},

{
  id: "p7h6j2",
  keys: [
    "my battery is low",
    "phone battery is low",
    "my battery is almost dead",
    "i need to charge my phone",
    "battery low hai",
    "phone charge karna hai",
    "mobile ki battery khatam ho rahi hai",
    "charger chahiye",
    "بیٹری کم ہے",
    "فون چارج کرنا ہے"
  ],
  responses: [
    "Plug your phone in before the battery gets too low.",
    "If you're away from a charger, save battery by closing unnecessary apps.",
    "Bhai phone charger par laga do.",
    "Battery bilkul low hone se pehle charge kar lo.",
    "فون کو بیٹری ختم ہونے سے پہلے چارج کر لیں۔"
  ]
},

{
  id: "p7k4l8",
  keys: [
    "my internet is not working",
    "internet is not working",
    "wifi is not working",
    "my wifi stopped working",
    "internet nahi chal raha",
    "wifi nahi chal rahi",
    "net band hai",
    "mera internet kaam nahi kar raha",
    "انٹرنیٹ نہیں چل رہا",
    "وائی فائی کام نہیں کر رہی"
  ],
  responses: [
    "Try restarting your router and checking the connection.",
    "You can also reconnect to your Wi-Fi network.",
    "Bhai router restart karo aur Wi-Fi dobara connect karo.",
    "Pehle connection check karo, phir router restart kar lo.",
    "روٹر ری اسٹارٹ کریں اور وائی فائی دوبارہ کنیکٹ کریں۔"
  ]
},

{
  id: "p7m5n1",
  keys: [
    "my computer is slow",
    "computer is running slow",
    "pc is slow",
    "my laptop is slow",
    "mera computer slow hai",
    "laptop slow chal raha hai",
    "pc bohat slow hai",
    "computer slow ho gaya hai",
    "میرا کمپیوٹر سست ہے",
    "لیپ ٹاپ سست چل رہا ہے"
  ],
  responses: [
    "Try restarting your computer and closing unnecessary programs.",
    "Freeing storage and reducing startup apps can help.",
    "Bhai PC restart karo aur unnecessary programs band karo.",
    "Storage check karo aur extra startup apps disable kar do.",
    "کمپیوٹر ری اسٹارٹ کریں اور غیر ضروری پروگرام بند کریں۔"
  ]
},

{
  id: "p7o9q3",
  keys: [
    "i need to charge my laptop",
    "laptop needs charging",
    "my laptop battery is low",
    "laptop battery is dying",
    "laptop charge karna hai",
    "laptop ki battery low hai",
    "laptop charger lagana hai",
    "meri laptop battery khatam ho rahi hai",
    "لیپ ٹاپ چارج کرنا ہے",
    "لیپ ٹاپ کی بیٹری کم ہے"
  ],
  responses: [
    "Plug your laptop into the charger.",
    "Save your work and connect the charger soon.",
    "Bhai laptop charger laga do.",
    "Kaam save karke laptop ko charge par laga lo.",
    "اپنا کام محفوظ کریں اور لیپ ٹاپ کو چارج پر لگا دیں۔"
  ]
},

{
  id: "p7r6s4",
  keys: [
    "i need to send an email",
    "send an email",
    "i have to email someone",
    "i need to write an email",
    "mujhe email bhejni hai",
    "email send karni hai",
    "kisi ko email karni hai",
    "email likhni hai",
    "مجھے ای میل بھیجنی ہے",
    "ای میل لکھنی ہے"
  ],
  responses: [
    "Write the main point first, then keep the email clear and simple.",
    "Double-check the recipient and message before sending.",
    "Bhai email short aur clear rakho aur send karne se pehle check kar lo.",
    "Recipient ka address bhi verify kar lena.",
    "ای میل بھیجنے سے پہلے وصول کنندہ اور پیغام چیک کر لیں۔"
  ]
},

{
  id: "p7t2u8",
  keys: [
    "i need to reply to a message",
    "i have a message to reply to",
    "help me reply",
    "i should reply",
    "mujhe message ka reply dena hai",
    "message ka jawab dena hai",
    "reply karna hai",
    "mujhe jawab dena hai",
    "مجھے پیغام کا جواب دینا ہے",
    "مجھے ریپلائی کرنا ہے"
  ],
  responses: [
    "Read the message carefully and reply clearly.",
    "Keep your reply natural and to the point.",
    "Bhai message pehle achi tarah read karo phir reply do.",
    "Jo kehna hai simple words mein keh do.",
    "پیغام غور سے پڑھیں اور واضح جواب دیں۔"
  ]
},

{
  id: "p7v9w5",
  keys: [
    "i need to write something",
    "help me write this",
    "i need help writing",
    "can you help me write",
    "mujhe kuch likhna hai",
    "likhne mein help karo",
    "mujhe writing mein help chahiye",
    "ye likhne mein madad karo",
    "مجھے کچھ لکھنا ہے",
    "لکھنے میں مدد کرو"
  ],
  responses: [
    "Sure! Tell me what you want to write.",
    "Absolutely. Give me the idea and we can shape it.",
    "Bilkul bhai! Batao kya likhna hai.",
    "Jo idea hai woh batao, wording set kar dete hain.",
    "بالکل! بتائیں آپ کیا لکھنا چاہتے ہیں۔"
  ]
},

{
  id: "p7x3y6",
  keys: [
    "i need to remember something",
    "help me remember",
    "don't let me forget",
    "i need a reminder",
    "mujhe kuch yaad rakhna hai",
    "mujhe reminder chahiye",
    "mujhe yaad dilana hai",
    "bhoolna nahi chahta",
    "مجھے کچھ یاد رکھنا ہے",
    "مجھے یاد دہانی چاہیے"
  ],
  responses: [
    "Make a reminder or note so you don't forget.",
    "Write it down somewhere easy to find.",
    "Bhai reminder laga lo taake bhool na jao.",
    "Phone mein note ya reminder bana lena.",
    "یاد رکھنے کے لیے ایک نوٹ یا یاد دہانی بنا لیں۔"
  ]
},

{
  id: "p7z1a7",
  keys: [
    "i need to make a plan",
    "help me plan my day",
    "plan my day",
    "what should i do today",
    "aaj ka plan banana hai",
    "mera din plan karo",
    "aaj kya karun",
    "daily routine plan karna hai",
    "آج کا منصوبہ بنانا ہے",
    "میرا دن پلان کرو"
  ],
  responses: [
    "Start with your most important task, then plan smaller things around it.",
    "Keep your plan simple and realistic.",
    "Bhai pehle important kaam rakho, phir baaki tasks.",
    "Aaj ka simple sa routine bana lo aur usko follow karo.",
    "سب سے اہم کام پہلے رکھیں اور باقی کام اس کے بعد ترتیب دیں۔"
  ]
},

{
  id: "p7b8c5",
  keys: [
    "i finished my work",
    "i am done with my work",
    "my work is finished",
    "i completed my work",
    "mera kaam ho gaya",
    "maine kaam khatam kar liya",
    "kaam complete ho gaya",
    "mera kaam finish ho gaya",
    "میرا کام ہو گیا",
    "میں نے کام ختم کر لیا"
  ],
  responses: [
    "Great job! Now you can relax.",
    "Nice! One task off the list.",
    "Wah bhai! Kaam complete kar diya.",
    "Ab thora relax kar lo, deserve karte ho.",
    "زبردست! اب آپ تھوڑا آرام کر سکتے ہیں۔"
  ]
},

{
  id: "p7d4e9",
  keys: [
    "i made a mistake",
    "i messed up",
    "i did something wrong",
    "i made an error",
    "mujhse ghalti ho gayi",
    "maine ghalat kar diya",
    "mujhse mistake ho gayi",
    "kaam mein ghalti ho gayi",
    "مجھ سے غلطی ہو گئی",
    "میں نے غلط کر دیا"
  ],
  responses: [
    "It's okay. Mistakes are part of learning.",
    "Don't worry. Find the problem and try again.",
    "Bhai koi baat nahi, ghalti se seekhna hota hai.",
    "Problem identify karo aur dobara try karo.",
    "کوئی بات نہیں، غلطیاں سیکھنے کا حصہ ہیں۔"
  ]
},

{
  id: "p7f8g2",
  keys: [
    "i did it",
    "i finally did it",
    "i succeeded",
    "i completed it",
    "maine kar liya",
    "akhir kar maine kar liya",
    "kaam ho gaya",
    "main kamyab ho gaya",
    "میں نے کر لیا",
    "آخرکار میں نے کر لیا"
  ],
  responses: [
    "Yes! You did it!",
    "That's awesome. Be proud of yourself!",
    "Wah bhai! Kar diya!",
    "Kamaal hai, mehnat ka result mil gaya.",
    "زبردست! آپ نے کر دکھایا!"
  ]
},

{
  id: "p7h3j7",
  keys: [
    "i need some quiet",
    "i want some peace",
    "i need peace and quiet",
    "i want to be alone for a while",
    "mujhe thori khamoshi chahiye",
    "mujhe thora akela rehna hai",
    "mujhe sukoon chahiye",
    "thora peace chahiye",
    "مجھے تھوڑی خاموشی چاہیے",
    "مجھے سکون چاہیے"
  ],
  responses: [
    "Take some quiet time for yourself.",
    "A little peaceful time can help you recharge.",
    "Bhai thora quiet time le lo.",
    "Aaram se baitho aur apne mind ko relax karo.",
    "کچھ وقت خاموشی اور سکون کے ساتھ گزاریں۔"
  ]
},

];

// EXTRA GENERATED VARIATIONS
// ============================================================
//
// Ye section existing intents ko multiple natural patterns
// deta hai. Isse database manually 1000 lines ka nahi hota.
//
// ============================================================

const PREFIXES = [
  "",
  "luna ",
  "hey luna ",
  "please ",
  "can you ",
  "could you ",
  "would you "
];


export const getlunaResponse = async (input) => {

  const text = normalize(input);

  if (!text) {
    return null;
  }
  for (const item of DATA) {

    for (const key of item.keys) {

      const normalizedKey = normalize(key);

      if (
        text === normalizedKey ||
        text.includes(normalizedKey)
      ) {

        if (item.custom) {
          return item.custom();
        }

        return random(item.responses);
      }
    }
  }

  if (
    text.includes("brightness") ||
    text.includes("برائٹنس") ||
    text.includes("roshni") ||
    text.includes("روشنی")
  ) {

    let current =
      Number(localStorage.getItem("lunaBrightness")) || 100;

  

    if (
      text.includes("kam") ||
      text.includes("کم") ||
      text.includes("کَم") ||
      text.includes("decrease") ||
      text.includes("lower") ||
      text.includes("dim") ||
      text.includes("reduce") ||
      text.includes("darker") ||
      text.includes("dark")
    ) {

      current = Math.max(30, current - 10);

      Brightness(current);

      return `Okay, brightness ${current}% kar di.`;
    }

    if (
      text.includes("zyada") ||
      text.includes("زیادہ") ||
      text.includes("increase") ||
      text.includes("higher") ||
      text.includes("brighter") ||
      text.includes("bright") ||
      text.includes("barha") ||
      text.includes("بڑھا") ||
      text.includes("بڑھاؤ")
    ) {

      current = Math.min(100, current + 10);

      Brightness(current);

      return `Okay, brightness ${current}% kar di.`;
    }

    // --------------------------------------------------------
    // NORMAL / RESET
    // --------------------------------------------------------

    if (
      text.includes("normal") ||
      text.includes("default") ||
      text.includes("reset") ||
      text.includes("عام") ||
      text.includes("نارمل")
    ) {

      Brightness(100);

      return "Okay, brightness normal kar di.";
    }
  }

  // ==========================================================
  // GENERIC CONVERSATION
  // ==========================================================

  if (
    text.includes("who") &&
    text.includes("you")
  ) {
    return "I'm Luna, your virtual voice assistant.";
  }

  if (
    text.includes("what") &&
    text.includes("doing")
  ) {
    return "I'm here listening to you.";
  }

  if (
    text.includes("can") &&
    text.includes("help")
  ) {
    return "Of course! Tell me what you need.";
  }

  if (
    text.includes("nice") &&
    text.includes("meet")
  ) {
    return "Nice to meet you too!";
  }

  if (
    text.includes("smart")
  ) {
    return "Thank you! I'm doing my best.";
  }

  if (
    text.includes("funny")
  ) {
    return random([
      "I try my best!",
      "Haha, I'm glad you think so.",
      "Maybe I should become a comedian."
    ]);
  }

  // ==========================================================
  // UNKNOWN → GROQ / GPT-OSS-120B
  // ==========================================================

  try {

    const completion = await groq.chat.completions.create({

      messages: [

        {
          role: "system",

          content: `
You are Luna, a friendly Pakistani voice assistant.

Speak in simple, natural English or Roman Urdu.
Do not use difficult or overly formal English.
Keep answers short and conversational.
Sound like a normal Pakistani person speaking English.

Never say that you don't have the data.

If the user asks about website commands,
answer naturally.

If the user asks about a section of the website,
explain it simply and clearly.
         Give complete answers, but keep them concise. Do not unnecessarily repeat information. `,
        },

        {
          role: "user",
          content: input,
        },

      ],

      model: "openai/gpt-oss-120b",
      max_completion_tokens: 120
    });

    return (
      completion.choices[0]?.message?.content ||
      "Okay, tell me more."
    );

  } catch (error) {

    console.error("Groq Error:", error);

    return random([
      "I'm listening. Tell me more.",
      "Okay, tell me a little more.",
      "Haan, bolo. Main sun rahi hoon.",
      "Theek hai, batao.",
    ]);
  }
};


// ============================================================
// EXPORT DATABASE
// ============================================================

export { DATA };