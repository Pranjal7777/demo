export const validateTimeSlots = (startTime = "", endTime = "") => {
  startTime = startTime.toLowerCase()
  endTime = endTime.toLowerCase()
  let startNum = startTime.includes('am') ? +startTime.replace(' am', '').split(':').map((val, i) => i === 0 && +val == 12 ? 0 : val).join('') : +startTime.replace(' pm', '').split(':').map((val, i) => i == 0 && val != 12 ? +val + 12 : val).join('');
  let endNum = endTime.includes('am') ? +endTime.replace(' am', '').split(':').map((val, i) => i === 0 && +val == 12 ? 0 : val).join('') : +endTime.replace(' pm', '').split(':').map((val, i) => i == 0 && val != 12 ? +val + 12 : val).join('');
  return startNum < endNum;
}