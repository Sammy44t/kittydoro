let timer;
let seconds = 1500; // 25 minutes
let curMinute = 25;
let currency = 100;
let breakCount = 0;
let pomodoroCount = 0;
let isBreak = false;

// Array containing all possible cat icons
const catImages = [
  'defaultCat.jpg',
  'boxCat.jpg',
  'murderCat.jpg',
  'cinqueCat.png',
  'donaldCat.png',
  'leonCat1.png',
  'leonCat2.png',
  'samCat.png',
  'teresaCat.jpg',
  'kuyaCat.jpg',
  'lindsayCat1.jpg',
  'lindsayCat2.jpg',
  'lindsayCat3.jpg',
  'michaelCat.jpg',
];

// Array containing user's unlocked cat icons
const ownedCats = [
  'defaultCat.jpg'
];

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
    if (((seconds / 60)  < curMinute) && (seconds % 60 == 0) && (seconds >= 0)) {
      curMinute--;
      if (!isBreak) {
        currency++;
      }
      updateCurrencyDisplay();
      // When you run out of time, reset the time
    } else if (seconds < 0) {
        clearInterval(timer);
        pomodoroCount++;
        if (pomodoroCount % 4 === 0) {
          // Take a longer break after every 4 Pomodoros
          showPopup('Time to take a long break.');
          seconds = 900; // 15 minutes
          curMinute = 15;
          breakCount++
          isBreak = true;
          // Update button visibility
          document.getElementById('startBtn').style.display = 'inline';
          document.getElementById('stopBtn').style.display = 'none';
          document.getElementById('resetBtn').style.display = 'none';
        } else if (breakCount == 4) {
          showPopup('Time to get back to studying.');
          seconds = 1500;
          curMinute = 25;
          breakCount = 0;
          isBreak = false;
          document.getElementById('startBtn').style.display = 'inline';
          document.getElementById('stopBtn').style.display = 'none';
          document.getElementById('resetBtn').style.display = 'none';
        } else {
          // Take a short break
          showPopup('Time to take a short break.');
          seconds = 300; // 5 minutes
          curMinute = 5;
          breakCount++;
          isBreak = true;
          // Update button visibility
          document.getElementById('startBtn').style.display = 'inline';
          document.getElementById('stopBtn').style.display = 'none';
          document.getElementById('resetBtn').style.display = 'none';
        }
        updateTimerDisplay();
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

// Reset timer to 25 minutes
function resetTimer() {
  clearInterval(timer);
  curMinute = 25;
  seconds = 1500;
  updateTimerDisplay();

  // Update button visibility
  document.getElementById('startBtn').style.display = 'inline';
  document.getElementById('stopBtn').style.display = 'none';
  document.getElementById('resetBtn').style.display = 'none';
}

// Pause the timer
function stopTimer() {
  clearInterval(timer);

  // Update button visibility
  document.getElementById('startBtn').style.display = 'inline';
  document.getElementById('stopBtn').style.display = 'none';
  document.getElementById('resetBtn').style.display = 'none';
}

// Gets a random cat from unowned options
function getRandomCatImage() {
  const randomIndex = Math.floor(Math.random() * catImages.length);
  while (ownedCats.includes(catImages[randomIndex])) {
    randomIndex = Math.floor(Math.random() * catImages.length);
  }
  return catImages[randomIndex];
}

// Simulates rolling a gacha to get a new cat
function rollGacha() {
  if (currency >= 25) {
    let selectedImage = getRandomCatImage();
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
