export const msToText = (ms: number) => {
    const msInSecond : number = 1000;
    const msInMinute : number = msInSecond * 60;
    const msInHour : number = msInSecond * 60 * 60;
    const msInDay : number = msInSecond * 60 * 60 * 24;
    let totalSeconds : number = +(ms / msInSecond).toFixed(1);
    let totalMinutes : number = +(ms / msInMinute).toFixed(1);
    let totalHours : number = +(ms / msInHour).toFixed(1);
    let totalDays : number = +(ms / msInDay).toFixed(1);
    if (totalSeconds < 60) return totalSeconds + "s";
    else if (totalMinutes < 60) return totalMinutes + "min";
    // else if (totalHours < 24) return totalHours + "h";
    // else return totalDays + "d"
    else return totalHours + "h";
}