export default function convertHourToMinuts(time: string) {

  const [hour, minuts] = time.split(':').map(Number)
  const timeInMinuts = (hour * 60) + minuts;

  return timeInMinuts
}