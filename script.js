let timer;
let seconds = 1500; // 25 minutes by default
let curMinute = 25;
let currency = 0;
let breakCount = 0;
let pomodoroCount = 0;
let isBreak = false;

// Default timer values
let studyTime = 25; // Study time in minutes
let shortBreakTime = 5; // Short break time in minutes
let longBreakTime = 15; // Long break time in minutes

// Array containing all possible cat icons
const catImages = [
  'assets/defaultCat.jpg',
  'assets/boxCat.jpg',
  'assets/murderCat.jpg',
  'assets/cinqueCat.png',
  'assets/donaldCat.png',
  'assets/leonCat1.png',
  'assets/leonCat2.png',
  'assets/samCat.png',
  'assets/teresaCat.jpg',
  'assets/kuyaCat.jpg',
  'assets/lindsayCat1.jpg',
  'assets/lindsayCat2.jpg',
  'assets/lindsayCat3.jpg',
  'assets/michaelCat.jpg',
];

// Array containing user's unlocked cat icons
const ownedCats = [
  'assets/defaultCat.jpg'
];

// Function to update the timer based on user input
function applySettings() {
  studyTime = parseInt(document.getElementById('studyTimeInput').value) || 25;
  shortBreakTime = parseInt(document.getElementById('shortBreakTimeInput').value) || 5;
  longBreakTime = parseInt(document.getElementById('longBreakTimeInput').value) || 15;
  resetTimer();
}

// Apply settings button event listener
document.getElementById('applySettingsBtn').addEventListener('click', applySettings);

// Updates the timer using the seconds variable
function updateTimerDisplay() {
  const minutes = Math.max(0, Math.floor(seconds / 60));
  const remainingSeconds = Math.max(0, seconds % 60);
  document.getElementById('timer').textContent = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Updates the currency within the hotbar
function updateCurrencyDisplay() {
  document.getElementById('currency').textContent = `Currency: ${currency}`;
}

// Starts the countdown timer
function startTimer() {
  timer = setInterval(function() {
    seconds--;
    updateTimerDisplay();

    // Increment currency for every minute that passes
    if (((seconds / 60) < curMinute) && (seconds % 60 === 0) && (seconds >= 0)) {
      curMinute--;
      if (!isBreak) {
        currency++;
      }
      updateCurrencyDisplay();
    } else if (seconds < 0) {
      clearInterval(timer);
      pomodoroCount++;

      if (pomodoroCount % 4 === 0) {
        // Take a longer break after every 4 Pomodoros
        seconds = longBreakTime * 60;
        curMinute = longBreakTime;
        updateTimerDisplay();
        breakCount++;
        isBreak = true;
        showPopup('Time to take a long break.');
      } else if (pomodoroCount % 2 === 0) {
        // Study time
        seconds = studyTime * 60;
        curMinute = studyTime;
        updateTimerDisplay();
        breakCount = 0;
        isBreak = false;
        showPopup('Time to get back to studying.');
      } else {
        // Take a short break
        seconds = shortBreakTime * 60;
        curMinute = shortBreakTime;
        updateTimerDisplay();
        breakCount++;
        isBreak = true;
        showPopup('Time to take a short break.');
      }
    }
  }, 1000);

  document.getElementById('startBtn').style.display = 'none';
  document.getElementById('stopBtn').style.display = 'inline';
  document.getElementById('resetBtn').style.display = 'inline';
}

// Function to show pop-up message
function showPopup(message) {
  const popup = document.getElementById('popupMessage');
  const popupText = document.getElementById('popupText');
  popupText.textContent = message;
  popup.style.display = 'block';

  // Display overlay
  document.getElementById('overlay').style.display = 'block';
}

// Function to close pop-up message
function closePopup() {
  const popup = document.getElementById('popupMessage');
  popup.style.display = 'none';

  // Hide overlay
  document.getElementById('overlay').style.display = 'none';
}

// Reset timer
function resetTimer() {
  clearInterval(timer);
  seconds = studyTime * 60;
  curMinute = studyTime;
  pomodoroCount--;
  updateTimerDisplay();
  document.getElementById('startBtn').style.display = 'inline';
  document.getElementById('stopBtn').style.display = 'none';
  document.getElementById('resetBtn').style.display = 'none';
}

// Pause the timer
function stopTimer() {
  clearInterval(timer);
  document.getElementById('startBtn').style.display = 'inline';
  document.getElementById('stopBtn').style.display = 'none';
  document.getElementById('resetBtn').style.display = 'none';
}

// Gets a random cat from unowned options
function getRandomCatImage() {
  let randomIndex = Math.floor(Math.random() * catImages.length);
  while (ownedCats.includes(catImages[randomIndex])) {
    randomIndex = Math.floor(Math.random() * catImages.length);
  }
  return catImages[randomIndex];
}

// Simulates rolling a gacha to get a new cat
function rollGacha() {
  if (currency >= 25) {
    let selectedImage;
    do {
      selectedImage = getRandomCatImage();
    } while (ownedCats.includes(selectedImage));
    
    ownedCats.push(selectedImage);
    currency -= 25;
    updateCurrencyDisplay();
    showPopup('Congratulations! You got a new cat.');
  } else {
    showPopup('Not enough currency. Keep studying to earn more!');
  }
}

// Open cat inventory modal and display all owned cats
function openInventory() {
  const modal = document.getElementById('inventoryModal');
  const catListContainer = document.getElementById('catList');
  
  // Clear previous content
  catListContainer.innerHTML = '';

  // Populate the cat list
  ownedCats.forEach(cat => {
    const catElement = document.createElement('img');
    catElement.src = cat;
    catElement.alt = 'Owned Cat';
    catElement.classList.add('inventory-cat');
    catElement.addEventListener('click', () => selectCat(cat));
    catListContainer.appendChild(catElement);
  });

  modal.style.display = 'block';

  // Close the modal when the close button is clicked
  const closeBtn = document.querySelector('.close');
  closeBtn.addEventListener('click', closeInventory);

  // Close the modal when clicking outside the modal
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeInventory();
    }
  });
}

// Updates the cat on the page
function selectCat(cat) {
  document.getElementById('selectedImage').src = cat;
  closeInventory();
}

// Close the cat inventory
function closeInventory() {
  const modal = document.getElementById('inventoryModal');
  modal.style.display = 'none';
}

document.getElementById('startBtn').addEventListener('click', startTimer);
document.getElementById('stopBtn').addEventListener('click', stopTimer);
document.getElementById('resetBtn').addEventListener('click', resetTimer);
document.getElementById('rollBtn').addEventListener('click', rollGacha);
document.getElementById('inventoryBtn').addEventListener('click', openInventory);
