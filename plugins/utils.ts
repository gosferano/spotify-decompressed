export const msToText = (ms: number, showDays = false) => {
  const msInSecond = 1000
  const msInMinute: number = msInSecond * 60
  const msInHour: number = msInSecond * 60 * 60
  const msInDay: number = msInSecond * 60 * 60 * 24
  const totalSeconds: number = +(ms / msInSecond).toFixed(1)
  const totalMinutes: number = +(ms / msInMinute).toFixed(1)
  const totalHours: number = +(ms / msInHour).toFixed(1)
  const totalDays: number = +(ms / msInDay).toFixed(1)
  if (totalSeconds < 60) return totalSeconds + 's'
  else if (totalMinutes < 60) return totalMinutes + 'min'
  else if (!showDays || totalHours < 24) return totalHours + 'h'
  else return totalDays + 'd'
}

export const isDevEnvironment = () => {
  return process.env.NODE_ENV === 'development'
}

export const getPage = (array: Array<any>, page: number, pageSize: number) => {
  const start = pageSize * (page - 1)
  const end = start + pageSize
  return array?.slice(start, end)
}

declare module '#app' {
  interface NuxtApp {
    $isDevEnvironment(): boolean
    $getPage(array: Array<any>, page: number, pageSize: number): Array<any>
    $msToText(ms: number, showDays?: boolean): string
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $isDevEnvironment(): boolean
    $getPage(array: Array<any>, page: number, pageSize: number): Array<any>
    $msToText(ms: number, showDays?: boolean): string
  }
}

export default defineNuxtPlugin(() => {
  return {
    provide: {
      isDevEnvironment,
      getPage,
      msToText,
    },
  }
})
