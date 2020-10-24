import './main.scss'
import '@fortawesome/fontawesome-free/js/fontawesome'
import '@fortawesome/fontawesome-free/js/solid'
import '@fortawesome/fontawesome-free/js/regular'
import '@fortawesome/fontawesome-free/js/brands'
// this.elements.help.innerHTML = '<i class="fas fa-question-circle help-icon"></i>';


let currentHour = new Date().getHours();
if (currentHour === 0) {
    currentHour = 24;
}

// Change Quote
const changeQuote = document.querySelector('.changeQuote');
changeQuote.addEventListener('click', () => {
    changeQuote.disabled = true;
    showQuote(true);
    setTimeout(function () {
        changeQuote.disabled = false
    }, 1000);
});


// Show quote

async function showQuote(isChangeClicked = false) {

    if (isChangeClicked) {
        document.querySelector('.quote').innerHTML = '<i class="fas fa-spinner fa-spin"></i>'
        document.querySelector('.quoteAuthor').innerHTML = '';
    }

    try {
        const url = 'https://favqs.com/api/qotd';
        //data.quoteText
        // let url = `https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.quote.body.length > 80) {
            showQuote();
        } else {
            document.querySelector('.quote').textContent = data.quote.body;
            document.querySelector('.quoteAuthor').textContent = data.quote.author;
        }
    } catch (e) {
        console.log(e.message);
    }


}

// Images => 4 nested array for 4 times of day : morning, afternoon, evening, night
let images = [[], [], [], []];
let imgFolder = '';
let currentImageIndex = '';
let currentTimesOfDay = '';

function getImagesForDay() {
    images = [[], [], [], []];
    const min = 1;
    // 20 images in evey folder
    const max = 20;
    // 4 times of day
    for (let i = 0; i < 4; i++) {
        // 1 image for 1 hour
        for (let j = 0; j < 6; j++) {
            let rand = min + Math.random() * (max + 1 - min);
            if (!images[i].includes(Math.floor(rand))) {
                images[i] = [...images[i], Math.floor(rand)];
            } else {
                j--
            }

        }
    }
}


// Change current image
let refresh = document.querySelector('.refresh')

refresh.addEventListener('click', () => {
    refresh.disabled = true;
    setTimeout(function () {
        refresh.disabled = false
    }, 1000);


    if (currentImageIndex < 5) {
        currentImageIndex++;
    } else {
        currentImageIndex = 0;
    }

    if (currentImageIndex === 0 && currentTimesOfDay < 3) {
        currentTimesOfDay++;
    } else if (currentImageIndex === 0 && currentTimesOfDay === 3) {
        currentTimesOfDay = 0;
    }


    document.body.style.backgroundImage =
        `url('src/assets/images/${imgFolder}/${addZero(images[currentTimesOfDay][currentImageIndex])}.jpg')`;
})


// DOM Elements
const time = document.querySelector('.time'),
    greeting = document.querySelector('.greeting'),
    name = document.querySelector('.name'),
    focus = document.querySelector('.focus'),
    dayOfWeek = document.querySelector('.dayOfWeek');

// Options
const showAmPm = false;

// Show Time
function showTime() {
    let today = new Date(),
        hour = today.getHours(),
        min = today.getMinutes(),
        sec = today.getSeconds(),
        day = today.getDay(),
        date = today.getDate(),
        month = today.getMonth();

    // Set AM or PM
    const amPm = hour >= 12 ? 'PM' : 'AM';


    if (!showAmPm && hour === 0) {
        hour = 24;
    }

    if (hour === 23 && min === 59 && sec === 59) {
        currentHour = hour;
        getImagesForDay();
    }

    if (currentHour !== hour) {
        currentHour++;
        setBgGreet();
    }


// 12hr Format
// hour = hour % 12 || 12;


    const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

// Output Time
    time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(
        sec
    )} ${showAmPm ? amPm : ''}`;

// Output Date, Day, Month,
    dayOfWeek.innerHTML = `<p>${weekday[day]}, ${date} ${months[month]}</p>`

    setTimeout(showTime, 1000);
}

// Add Zeros
function addZero(n) {
    return (parseInt(n, 10) < 10 ? '0' : '') + n;
}

// Set Background and Greeting
function setBgGreet() {
    let today = new Date(),
        hour = today.getHours();

    if (!showAmPm && hour === 0) {
        hour = 24;
    }

    currentImageIndex = hour % 6;


    if (hour >= 6 && hour < 12) {
        // Morning
        currentTimesOfDay = 0;
        imgFolder = 'morning';
        document.body.style.backgroundImage =
            `url('src/assets/images/${imgFolder}/${addZero(images[currentTimesOfDay][currentImageIndex])}.jpg')`;
        greeting.textContent = 'Good Morning, ';
    } else if (hour >= 12 && hour < 18) {
        // Afternoon
        currentTimesOfDay = 1;
        imgFolder = 'day';
        document.body.style.backgroundImage =
            `url('src/assets/images/${imgFolder}/${addZero(images[currentTimesOfDay][currentImageIndex])}.jpg')`;
        greeting.textContent = 'Good Afternoon, ';
    } else if (hour >= 18 && hour < 24) {
        // Evening
        currentTimesOfDay = 2;
        imgFolder = 'evening';
        document.body.style.backgroundImage =
            `url('src/assets/images/${imgFolder}/${addZero(images[currentTimesOfDay][currentImageIndex])}.jpg')`;
        greeting.textContent = 'Good Evening, ';
    } else if (hour === 24 || (hour >= 1 && hour < 6)) {
        // Night
        currentTimesOfDay = 3;
        imgFolder = 'night';
        document.body.style.backgroundImage =
            `url('src/assets/images/${imgFolder}/${addZero(images[currentTimesOfDay][currentImageIndex])}.jpg')`;
        greeting.textContent = 'Good Night, ';
        // document.body.style.color = 'white';
    }
}


let prevName = '[Enter Name]';
let prevFocus = '[Enter Focus]';

// Get Name
function getName() {
    if (localStorage.getItem('name') === null) {
        name.textContent = '[Enter Name]';
    } else {
        name.textContent = localStorage.getItem('name');
    }
}

// Check Name

function checkName(e) {
    prevName = e.target.innerText.trim();
    e.target.innerText = '';
}

// Set Name
function setName(e) {
    if (e.target.innerText.trim() === '') {
        e.target.innerText = prevName;
    }
    e.target.innerText = e.target.innerText.trim();
    localStorage.setItem('name', e.target.innerText.trim());
}

function resetNameOnEnter(e) {
    if (e.type === 'keypress' && e.keyCode === 13) {
        // Make sure enter is pressed
        name.blur();
        setName(e);
    }
}


// Get Focus
function getFocus() {
    if (localStorage.getItem('focus') === null) {
        focus.textContent = '[Enter Focus]';
    } else {
        focus.textContent = localStorage.getItem('focus');
    }
}

// Check Focus
function checkFocus(e) {
    prevFocus = e.target.innerText.trim();
    e.target.innerText = '';
}

function resetFocusOnEnter(e) {
    if (e.type === 'keypress' && e.keyCode === 13) {
        // Make sure enter is pressed
        focus.blur();
        setFocus(e);
    }
}

// Set Focus
function setFocus(e) {
    if (e.target.innerText.trim() === '') {
        e.target.innerText = prevFocus;
    }
    e.target.innerText = e.target.innerText.trim();
    localStorage.setItem('focus', e.target.innerText.trim());
}

name.addEventListener('click', checkName);
name.addEventListener('keypress', resetNameOnEnter);
name.addEventListener('blur', setName);

focus.addEventListener('click', checkFocus);
focus.addEventListener('keypress', resetFocusOnEnter);
focus.addEventListener('blur', setFocus);

// Run
document.addEventListener('DOMContentLoaded', showQuote);
getImagesForDay()
showTime();
setBgGreet();
getName();
getFocus();



