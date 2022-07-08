export const parseSeconds = (sec: number): string => {
  const hours   = Math.floor(sec / 3600); // get hours
  const minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
  const seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds

  let _hours = String(hours);
  let _minutes = String(minutes);
  let _seconds = String(seconds);

  if (hours   < 10) {_hours   = `0${hours}`}
  if (minutes < 10) {_minutes = `0${minutes}`}
  if (seconds < 10) {_seconds = `0${seconds}`}
  return `${_hours}:${_minutes}:${_seconds}`; // Return is HH : MM : SS
}
