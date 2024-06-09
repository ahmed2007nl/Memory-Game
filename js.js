// Get the timer dropdown element
let timerDropdown = document.getElementById("timerDropdown");

// Get the restart notification element
let C_restartNotif = document.querySelector(".GameLosing");

// Store references for restart and cancel buttons
let restartButton, cancelButton;

// Remove the restart notification element from the DOM
C_restartNotif.remove();

// Event listener for starting the game
document.querySelector(".start span").onclick = function () {
  // Generate a random number for anonymous names
  let random = Math.floor(Math.random() * 1000);

  // Ask for the player's name
  let Name = prompt("What is your name?");
  
  // Set the player's name or use anonymous with a random number
  if (Name !== null && Name !== "") {
      document.querySelector(".info_container .name span").innerHTML = Name;
  } else {
      document.querySelector(".info_container .name span").innerHTML = `Anonymous${random}`;
  }

  // Remove the start button
  document.querySelector(".start").remove();
  
  // Play the game start sound effect
  document.getElementById("gameStart").play();

  // Start the game timer
  timer();
};

// Timer element and variables
let timerEle = document.querySelector(".timer span");
let sec = 0, min = 0, totalTime;
let intervalId;

// Timer function
function timer() {
    intervalId = setInterval(() => {
        // Update the timer display
        timerEle.innerHTML = `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
        sec++;

        // Reset seconds and increment minutes when reaching 60 seconds
        if (sec === 60) {
          sec = 0;
          min++;
        }
        
        // Calculate total time in seconds
        totalTime = min * 60 + sec;

        // Check for user selection and game over condition
        Comp_timer_UserSelection(timerDropdown.value, totalTime);
      }, 1000);
}

// Initialize restart and cancel buttons
restartButton = document.getElementById("yes");
cancelButton = document.getElementById("no");

// Comparison of user selection and instant time
function Comp_timer_UserSelection(userSelection, instantTime) {
  if (parseInt(userSelection) == instantTime) {
    // Stop the timer interval
    clearInterval(intervalId);

    // Append the restart notification to the body
    document.body.append(C_restartNotif);

    // Add a class to stop clicking on blocks
    blocks_container.classList.add("stop_clicking");

    // Play the game over sound
    document.getElementById("game-over").play();

    // Delay getting button references after reappending the element
    setTimeout(() => {
      restartButton = document.getElementById("yes");
      cancelButton = document.getElementById("no");

      // Handle the restart button click
      handleRestart();

      // Handle the cancel button click
      cancelButton.addEventListener("click", () => {
        // Remove the GameLosing notification when "No" is clicked
        C_restartNotif.remove();
        // Remove the stop clicking class
        blocks_container.classList.remove("stop_clicking");
      });
    });
  }
}


// Handle restart button click
function handleRestart() {
  
    restartButton.addEventListener("click", () => {
        // Remove the restart notification
        hideGameLosing();

        // Allow clicking on blocks again
        blocks_container.classList.remove("stop_clicking");

        // Reset timer
        min = 0;
        sec = 0;

        // Shuffle the order of blocks
        shuffle(randomOrder);

        // Loop and change the position of blocks
        loop_on_Blocks_to_Change_postion();

        // Remove match class to return the cards to their initial state
        blocks.forEach(b => b.classList.remove("match"));

        // Restart the timer function
        timerEle.innerHTML = `${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`;
        timer();

        // Reset wrong tries
        wrongTimes = 0;
        totalMisses = document.querySelector(".main_container .tries span");
        totalMisses.innerHTML = `${wrongTimes}`;
    });
}

// Get the blocks container and blocks
let blocks_container = document.querySelector(".theGame");
let blocks = Array.from(blocks_container.children);

// Index of each block 
let orderRange = [...Array(blocks.length).keys()];

// If all cards have a match


// Check if all blocks have a match



// Shuffle function 
function shuffle(arr) {
    // Fisher-Yates shuffle algorithm
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * arr.length);
      [arr[i], arr[j]] = [arr[j], arr[i]]; // Swap elements
    }
}

// Create a random order for blocks
let randomOrder = [...orderRange];
shuffle(randomOrder);

// Looping on the blocks
function loop_on_Blocks_to_Change_postion() {
    blocks.forEach((block, index) => {
        block.style.order = randomOrder[index];
        block.onclick = function() {
            flip(block);
        }
    });
}

// Initial loop on blocks for position and click event
loop_on_Blocks_to_Change_postion();

// Flipping the block on click
let flippedArr = [],
 wrongTimes = 0;
 duration = 500

function flip(selectedBlock) {
  selectedBlock.classList.add("flip");

  // Update the flippedArr after adding the "flip" class
  flippedArr = blocks.filter(b => b.classList.contains("flip"));

  // Check when two blocks are flipped
  if (flippedArr.length == 2 ) {
    stop();
    check();
  }
}

// Stop clicking action after clicking 2 cards or blocks
function stop() {
  blocks_container.classList.add("stop_clicking");
  setTimeout(() => {
    blocks_container.classList.remove("stop_clicking");
  }, duration);
}

function showCongratulationsNotification(time) {
  // Create a new div element for the win notification
  let winNotification = document.createElement("div");
  winNotification.className = "GameWinning";
  
  // Create the content of the notification
  winNotification.innerHTML = `
      <div class="modal-content">
          <p><span>Congratulations!</span> You Won!</p> <br>
          <p>Time taken: ${time}</p>
      </div>
  `;

  // Append the win notification to the body
  document.body.appendChild(winNotification);
}

// Function to handle game win
function handleGameWin() {
  // Stop the timer interval
  clearInterval(intervalId);

  // Display the congratulations notification with the time
  showCongratulationsNotification(`${min < 10 ? '0' : ''}${min}:${sec < 10 ? '0' : ''}${sec}`);
  
  // Add a class to stop clicking on blocks
  blocks_container.classList.add("stop_clicking");

  document.getElementById("congrats").play()
  document.getElementById("win").play()
}

// Check if the flipped blocks have a match
function check() {
  if (flippedArr.length === 2) {
      let [firstBlock, secondBlock] = flippedArr;
      let dataDescrValue1 = firstBlock.getAttribute('data-descr');
      let dataDescrValue2 = secondBlock.getAttribute('data-descr');
      if (dataDescrValue1 === dataDescrValue2) {
          flippedArr.forEach(b => {
            b.classList.remove("flip");
            b.classList.add("match");
          });
          document.getElementById("succes").play();
            // Play the success sound
          // Call the Win function after checking for a match
          Win();
      } else {
          // Handle the case when the blocks don't match
          
          setTimeout(() => {
            let wrongAudio = document.getElementById("wrong");
            wrongAudio.volume = 0.3;
            wrongAudio.play();
            flippedArr.forEach(b => {
              b.classList.remove("flip");
              });

              // Get the audio element and set its volume
          }, duration);

          // Increment wrong tries
          wrongTimes++;
          // Update total wrong tries
          let totalMisses = document.querySelector(".main_container .tries span");
          totalMisses.innerHTML = `${wrongTimes}`;
      }
  }
}

// Win function check
function Win() {
  let allBlocksMatch = blocks.every(b => b.classList.contains("match"));

  if (allBlocksMatch) {
      // Handle the game win
      handleGameWin();
  }
}

// Call the Win function where appropriate in your code
Win();


// Function to show the restart notification
function showGameLosing() {
    document.body.appendChild(C_restartNotif);
}

// Function to hide the restart notification
function hideGameLosing() {
    if (C_restartNotif.parentElement) {
        C_restartNotif.parentElement.removeChild(C_restartNotif);
    }
}
