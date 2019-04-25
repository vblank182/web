// Colors for light
const c_on = "yellow";
const c_off = "black";

var lightState = c_off;

//// Morse Code Timing ////

// The WPM (words per minute) of a Morse transmission is determined by the word "PARIS" (50 dots).
// Given a target WPM, the length of one dot in ms should be T = 1200 / WPM.
// Examples: 15 WPM = 80 ms/dot, 10 WPM = 120 ms/dot, 5 WPM = 240 ms/dot
const t_base = 215;  // base time interval in milliseconds (length of a dot)

// Time units for components
const t_dot = 1;   // length of a dot
const t_dash = 3;  // length of a dash
const t_rest = 1;  // length of gap between dots/dashes within a letter
const t_lgap = 3;  // length of gap between letters
const t_wgap = 7;  // length of gap between words
////////////////

var timeoutID = 0;  // ID to keep track of setTimeout calls so they can be terminated with clearTimeout when necessary

var currentTransmission = "";  // string to keep track of currently transmitting (or last transmitted) message

const commonWords = readTextFile().split(" ");  // get list of common english words

$(function() {  // document ready
    $("#light").attr("fill", lightState);  // set initial state of light once here so we don't have to read it


    // Attach button listeners
    $("#stopBtn").on("click", function() {
        clearTimeout(timeoutID);  // cancel any active timeouts
        $("#light").attr("fill", c_off);  // turn off light
        lightState = c_off;  // set state variable to match
        transmissionFinished(); // BUG: rethink this function

    });

    $("#transmitBtn").on("click", function() {
        // Choose a word and number of repetitions and execute.
        timing = getPhraseTiming("hello world");
        repeat = 3;
        executeMorse(timing, repeat);
    });

    $("#randCharsBtn").on("click", function() {
        // Choose a word and number of repetitions and execute.
        word = pickRandomLetters(3);
        currentTransmission = word;

        timing = getPhraseTiming(word);
        repeat = 2;
        executeMorse(timing, repeat);
    });

    $("#randWordBtn").on("click", function() {
        // Choose a word and number of repetitions and execute.
        word = pickEnglishWord(3, 5);
        currentTransmission = word;

        timing = getPhraseTiming(word);
        repeat = 2;
        executeMorse(timing, repeat);
    });

});


function executeMorse(timingSeq, repeat) {
    // Takes a sequence of time intervals in the form [on, off, ..., on] as input.
    // Creates recursive setTimeout chain that toggles the light according to this sequence.
    // This chain loops 'repeat' times.
    // Reference: https://javascript.info/settimeout-setinterval#recursive-settimeout

    k = 0;
    lightState = toggleLight(lightState);
    timeoutID = setTimeout(function interval() {

        if (k < timingSeq.length) {
            lightState = toggleLight(lightState);
            timeoutID = setTimeout(interval, t_base*timingSeq[k++]);  // start new timeout with length of next interval in sequence
        }
        else {  // end of sequence
            if (--repeat > 0) {  // check if we've repeated transmission desired number of times
            // Repeat transmission.
            k = 0;
            lightState = toggleLight(lightState);  // turn light back off
            timeoutID = setTimeout(interval, t_base*t_wgap);  // insert gap before the next word
        }
        else {
            // Finished transmitting.
            lightState = toggleLight(lightState);
            transmissionFinished();
        }
    }

}, t_base*timingSeq[k++]);  // start new timeout with length of next interval in sequence
}

function transmissionFinished(wait=1000) {
    // Handler called after executeMorse() is finished (all timeouts are done)
    // 'wait' is the number of milliseconds to wait before printing

    // Print last message after a moment
    setTimeout(function(){ $("#lastMessage").html(currentTransmission); }, wait);
}


function pickRandomLetters(n, includeNumbers=false) {
    // Function to generate a word of length n made of random letters.
    if (includeNumbers)
    maxIndex = alphanumerics.length;  // choose any letter or number
    else
    maxIndex = alphanumerics.length - 10;  // choose only letters (last 10 elements are numbers)

    randomWord = '';
    for (i=0; i<n; i++) {
        chr = alphanumerics[Math.floor(Math.random()*maxIndex)];  // get a random character
        randomWord += chr;
    }
    return randomWord;
}

function pickEnglishWord(min=1, max=15) {
    // Function to choose a random English word with a length between min and max.
    // https://www.ef.com/wwen/english-resources/english-vocabulary/top-3000-words/
    startIndex = 0;
    endIndex = commonWords.length - 1;

    if (min > 1)
        startIndex = commonWords.findIndex(function(e) { return (e.length >= min) });  // find first entry of length 'min'
    if (max < 16)
        endIndex = commonWords.findIndex(function(e) { return (e.length > max) });  // find first entry of length 'max'

    commonWordsSlice = commonWords.slice(startIndex, endIndex);
    return commonWordsSlice[Math.floor(Math.random()*commonWordsSlice.length)];  // get a random word in selected length range
}


function getLetterTiming(letter) {
    // Takes a letter, looks up the morse code sequence for the letter, and returns an array of timing info.
    // The timing array consists of intervals of time the light should be on/off (depending on position).
    // The first element in the array is the length of time the light should be on for the first part of the sequence.
    // The array alternates between on and off intervals: [on, off, on, off, ..., off, on].
    // e.g. 'K' would return [3, 1, 1, 1, 3]; 'O' would return [3, 1, 3, 1, 3]
    // This function is not responsible for gaps between letters or words.
    letter = letter.toLowerCase();

    timing = [];

    seq = morseCodes[letter].split("");
    for(i=0; i<seq.length; i++) {
        if (seq[i] == '.') {
            timing.push(t_dot);
        }
        else if (seq[i] == '-') {
            timing.push(t_dash);
        }
        timing.push(t_rest);  // append inter-character gap after dot/dash length
    }

    timing.pop();  // trim off the last t_rest gap from the end of the array (the array should end with the last 'on' interval)
    return timing;
}

function getWordTiming(word) {
    // Returns an array of timing info for an entire word.
    word = word.toLowerCase();

    timing = [];
    letters = word.split("");  // separate letters of word

    for (j=0; j<letters.length; j++) {
        timing = timing.concat( getLetterTiming(letters[j]) );  // add timing for individual letter to sequence
        timing.push( t_lgap );  // add inter-letter time gap between letters
    }

    timing.pop();  // trim off the last t_lgap from the end of the array (the array should end with the last 'on' interval)

    return timing;
}

function getPhraseTiming(phrase) {
    // Returns an array of timing info for an entire phrase of words.
    phrase = phrase.toLowerCase();

    timing = [];
    words = phrase.split(" ");  // separate words in phrase

    for (w=0; w<words.length; w++) {
        timing = timing.concat( getWordTiming(words[w]) );  // add timing for individual word to sequence
        timing.push( t_wgap );  // add inter-word time gap between letters
    }

    timing.pop();  // trim off the last t_wgap from the end of the array (the array should end with the last 'on' interval)

    return timing;
}

function toggleLight(lightState) {
    if (lightState == c_on) {
        $("#light").attr("fill", c_off);
        return c_off;
    }
    else if (lightState == c_off) {
        $("#light").attr("fill", c_on);
        return c_on;
    }
}

function readTextFile(file) {
    var allWords = "";
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", "englishcommon_3000_lengthsorted.txt", false);
    rawFile.onreadystatechange = function() {
        if(rawFile.readyState === 4) {
            if(rawFile.status === 200 || rawFile.status == 0) {
                allWords = rawFile.responseText;
            }
        }
    }
    rawFile.send(null);

    return allWords;  // returns a string of words, separated by spaces, sorted by length
}

const morseCodes = {'a':'.-', 'b':'-...', 'c':'-.-.', 'd':'-..',
                    'e':'.', 'f':'..-.', 'g':'--.', 'h':'....',
                    'i':'..', 'j':'.---', 'k':'-.-', 'l':'.-..',
                    'm':'--', 'n':'-.', 'o':'---', 'p':'.--.',
                    'q':'--.-', 'r':'.-.', 's':'...', 't':'-',
                    'u':'..-', 'v':'...-', 'w':'.--', 'x':'-..-',
                    'y':'-.--', 'z':'--..',
                    '1':'.----', '2':'..---', '3':'...--', '4':'....-', '5':'....',
                    '6':'-....', '7':'--...', '8':'---..', '9':'----.', '0':'-----',
                    '-':'-....-', '.':'.-.-.-', ',':'--..--', '?':'..--..', '+':'.-.-.', '\'':'.----.'};

const alphanumerics = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
