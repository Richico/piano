const pianoKeys = document.querySelectorAll(".key");
const siteTitle = document.getElementById("site-title");

// Prevent user from playing while intro runs
let introPlaying = false;

// --------------------------------------
// Note -> Audio Mapping
// --------------------------------------

const noteMap = {

    "C5":"key01",
    "C#5":"key02",
    "D5":"key03",
    "D#5":"key04",
    "E5":"key05",

    "F5":"key06",
    "F#5":"key07",
    "G5":"key08",
    "G#5":"key09",
    "A5":"key10",
    "A#5":"key11",
    "B5":"key12",

    "C6":"key13",
    "C#6":"key14",
    "D6":"key15",
    "D#6":"key16",
    "E6":"key17",

    "F6":"key18",
    "F#6":"key19",
    "G6":"key20",
    "G#6":"key21",
    "A6":"key22",
    "A#6":"key23",
    "B6":"key24",

    "C3":"key25",
    "C#3":"key26",
    "D3":"key27",
    // "D#3":"key28", //visit
    "E3":"key29",

    "F3":"key30",
    // "F#3":"key31", //visit
    "G3":"key32",
    // "G#3":"key33", //visit
    "A3":"key34",
    // "A#3":"key35", //visit
    "B3":"key36",

    "C4":"key37",
    // "C#4":"key38", //visit
    "D4":"key39",
    // "D#4":"key40", //visit
    "E4":"key41",

    "F4":"key42",
    // "F#4":"key43", //visit
    "G4":"key44",

    "G#4":"key45", 
    "A4":"key46",
    "A#4":"key47",
    "B4":"key48"

};

// ======================================
// Keyboard Maps
// ======================================

// Default (C5 → B6)
const keyboardMap = {

    "a":"C5",
    "w":"C#5",
    "s":"D5",
    "e":"D#5",
    "d":"E5",

    "f":"F5",
    "t":"F#5",
    "g":"G5",
    "y":"G#5",

    "h":"A5",
    "u":"A#5",
    "j":"B5",

    "k":"C6",
    "o":"C#6",
    "l":"D6",
    "p":"D#6",

    ";":"E6",
    "'":"F6",
    "]":"F#6",
    "\\":"G6",

    "x":"A6",
    "v":"G#6",
    "b":"A#6",
    "c":"B6"

};


// Shift OR CapsLock (C3 → B4)

const lowerKeyboardMap = {

    "a":"C3",
    "w":"C#3",
    "s":"D3",
    "e":"D#3",
    "d":"E3",

    "f":"F3",
    "t":"F#3",
    "g":"G3",
    "y":"G#3",

    "h":"A3",
    "u":"A#3",
    "j":"B3",

    "k":"C4",
    "o":"C#4",
    "l":"D4",
    "p":"D#4",

    ";":"E4",
    "'":"F4",
    "]":"F#4",
    "\\":"G4",

    "x":"A4",
    "v":"G#4",
    "b":"A#4",
    "c":"B4"

};

// Upper notes

const upperKeyboardMap = {

    "a":"C7",
    "w":"C#7",
    "s":"D7",
    "e":"D#7",
    "d":"E7",

    "f":"F7",
    "t":"F#7",
    "g":"G7",
    "y":"G#7",

    "h":"A7",
    "u":"A#7",
    "j":"B7",

    "k":"C8",
    "o":"C#8",
    "l":"D8",
    "p":"D#8",

    ";":"E8",
    "'":"F8",
    "]":"F#8",
    "\\":"G8",

    "x":"A8",
    "v":"G#8",
    "b":"A#8",
    "c":"B8"

};

// --------------------------------------
// Preload Audio
// --------------------------------------

const sounds = {};

for (const note in noteMap) {

    const audio = new Audio();

const formats = ["wav", "mp3", "flac"];

let index = 0;

function loadAudio() {

    if (index >= formats.length) {
        console.log(`No audio found for ${noteMap[note]}`);
        return;
    }

    audio.src = `audio1/${noteMap[note]}.${formats[index]}`;

    audio.onerror = () => {
        index++;
        loadAudio();
    };
}

loadAudio();

audio.preload = "auto";

    audio.preload = "auto";

    sounds[note] = audio;

}





function playNote(note, velocity = 1) {

    const sound = sounds[note];

    if (!sound) return;

    const clone = sound.cloneNode();

    clone.volume = velocity;

    clone.play();

    animateKey(note);

}

// --------------------------------------
// Piano Key Animation
// --------------------------------------

function animateKey(note) {

    const key = document.querySelector(`[data-note="${note}"]`);

    if (!key) return;

    key.classList.add("pressed");

    setTimeout(() => {

        key.classList.remove("pressed");

    }, 120);

}

// --------------------------------------
// Mouse Support
// --------------------------------------

pianoKeys.forEach(key => {

    key.addEventListener("click", () => {

        if (introPlaying) return;

        const original = key.dataset.note;

        // Find which keyboard key originally belonged to this piano key
        const keyboardKey = Object.keys(keyboardMap).find(
            k => keyboardMap[k] === original
        );

        if (!keyboardKey) {
            playNote(original);
            return;
        }

        playNote(currentMap[keyboardKey]);

    });

});


// --------------------------------------
// Keyboard Support
// --------------------------------------

let currentMap = keyboardMap;




document.addEventListener("keydown", (event) => {

    if (event.repeat || introPlaying) return;

    if (event.shiftKey && event.getModifierState("CapsLock")) {

        currentMap = upperKeyboardMap;

    }
    else if (event.shiftKey || event.getModifierState("CapsLock")) {

        currentMap = lowerKeyboardMap;

    }
    else {

        currentMap = keyboardMap;

    }

    updateKeyLabels(currentMap);

    const keyElement = document.querySelector(
        `.key[data-note="${keyboardMap[event.key.toLowerCase()]}"]`
    );

    if (!keyElement) return;

    const note = currentMap[event.key.toLowerCase()];

    playNote(note);

});

// --------------------------------------
// Change Website Title
// --------------------------------------

function changeTitle(newTitle) {

    if (!siteTitle) return;

    siteTitle.style.opacity = "0";

    setTimeout(() => {

        siteTitle.textContent = newTitle;

        siteTitle.style.opacity = "1";

    }, 300);

}

// ======================================
// First Time Loading
// ======================================

window.addEventListener("load", () => {

    // Show Happy Birthday first
    changeTitle(" Happy Birthday Mohila !");

    // After 20 seconds, change to Peaceful Corner
    setTimeout(() => {

        changeTitle("Peace With Piano");

    }, 20000);

});




// ======================================
// END OF PART 1
// ======================================

// ======================================
// Play Song
// ======================================


playThemeBtn.addEventListener("click",()=>{

    if(introPlaying) return;

    playSong(bsake);

});

// ======================================
// Prevent Right Click (Optional)
// ======================================

// Uncomment if you want

/*
document.addEventListener("contextmenu", (e) => {

    e.preventDefault();

});
*/

// ======================================
// Prevent Space Bar Scrolling
// ======================================

window.addEventListener("keydown", (event) => {

    if (
        event.code === "Space" &&
        event.target === document.body
    ) {

        event.preventDefault();

    }

});

function updateKeyLabels(activeMap = keyboardMap) {

    document.querySelectorAll(".key").forEach(key => {

        const currentNote = key.dataset.note;

        if (!currentNote) return;

        // Find the keyboard key (a,w,s...)
        let keyboardLetter = "";

        for (const letter in keyboardMap) {

            if (keyboardMap[letter] === currentNote) {

                keyboardLetter = letter;
                break;

            }

        }

        if (!keyboardLetter) return;

        const displayNote = activeMap[keyboardLetter];

        key.textContent = `${displayNote} (${keyboardLetter})`;

    });

}

document.addEventListener("keyup", (event) => {

    if (event.shiftKey && event.getModifierState("CapsLock")) {

        currentMap = upperKeyboardMap;

    }
    else if (event.shiftKey || event.getModifierState("CapsLock")) {

        currentMap = lowerKeyboardMap;

    }
    else {

        currentMap = keyboardMap;

    }

    updateKeyLabels(currentMap);

});

// window.addEventListener("load", () => {

//    const firstVisit = !localStorage.getItem("birthdayShown");

//    if (firstVisit) {

//        changeTitle("Happy Birthday Mohila!");

//        localStorage.setItem("birthdayShown", "true");

//         setTimeout(() => {

//            changeTitle("Peace With Piano");

//        }, 20000);

//    } else {

//        changeTitle("Peace With Piano");

//     }

// });

// ======================================
// END
// ======================================
