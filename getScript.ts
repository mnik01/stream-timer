export const getScript = (duration: number, finishText = '') => `
  document.addEventListener("DOMContentLoaded", () => {
    // helper function to convert seconds to minutes and seconds
  function parseSeconds(value) {
    const sec = parseInt(value, 10); // convert value to number if it's string
    let hours   = Math.floor(sec / 3600); // get hours
    let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
    let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds; // Return is HH : MM : SS
  }

  const finishText = "${finishText}";
  const h1El = document.getElementById('timer')
  let timeLeft = ${duration - 1};
  h1El.innerHTML = parseSeconds(timeLeft);
  const intervalId = setInterval(() => {
    if (timeLeft <= 0) {
      clearInterval(intervalId);
      h1El.innerHTML = finishText;
      return;
    }
    h1El.innerHTML = parseSeconds(timeLeft);
    timeLeft--;
  }, 1000)
  });
`
