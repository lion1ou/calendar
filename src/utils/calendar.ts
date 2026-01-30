import calendarjs from '../lib/calendar.js';
import { isObj, isStr, isArr, isNum, isDate } from './common';
import { HOLIDAY_LIST, WORKDAY_LIST, FESTIVAL_LIST, DAY, WEEK, WEEK_NAME_MAP, FESTIVAL_WEEK_LIST, } from '../config';

type ObjDate = {
  year: number;
  month: number;
  day: number;
  dateStr: string;
  week: number;
  date: Date;
  weekMonthIndex: number;
};

// 获取某日的日期
export const getDate = (time?: any): any => {
  let date: Date = new Date();

  if (isObj(time)) {
    const { year, month, day } = time;
    date = new Date(year, month - 1, day);
  }

  if (isStr(time) && time.split('-').length === 3) {
    const [year, month, day] = time.split('-');
    date = new Date(year, month - 1, day);
  }

  if (isArr(time) && time.length === 3) {
    const [year, month, day] = time;
    date = new Date(year, month - 1, day);
  }

  if (isNum(time) && time.toString().length === 13) {
    date = new Date(time);
  }

  if (isDate(time)) {
    date = time;
  }

  const year: number = date.getFullYear(); // 2021
  const month: number = date.getMonth() + 1; // 0 - 11
  const day: number = date.getDate(); // 日期
  const week: number = date.getDay(); // 周几  0 - 6
  const dateStr: string = `${year}-${month}-${day}`;
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  const second = date.getSeconds().toString().padStart(2, '0');
  const result = {
    year,
    month,
    day,
    hour,
    minute,
    second,
    week,
    dateStr,
    date,
  };
  return result;
};

// 是否是法定工作日
export const isWorkDayFn = (d: ObjDate) => {
  let isWorkDay = false; // 是否是工作日
  WORKDAY_LIST.map((item: string) => {
    if (item === d.dateStr) {
      isWorkDay = true;
    }
  });
  return isWorkDay;
};

// 是否是法定假日
export const isHolidayFn = (d: ObjDate) => {
  let isHoliday = false; // 是否是假日
  HOLIDAY_LIST.map((item: string) => {
    if (item === d.dateStr) {
      isHoliday = true;
    }
  });
  return isHoliday;
};

// 获取节日
export const getFestival = (d: ObjDate) => {
  const result = [];
  // 通过日期来确定节假日
  const festivalDate = `${d.month}-${d.day}`;
  const festival = FESTIVAL_LIST.find(i => i.day === festivalDate)?.name;
  if (festival) {
    result.push(festival);
  }
  // 通过第几月第几周来确定节假日
  const weekFestival = FESTIVAL_WEEK_LIST.find(
    i => i.month === d.month && i.week === d.week && d?.weekMonthIndex === i.weekOfMonth
  )?.name;

  if (weekFestival) {
    result.push(weekFestival);
  }
  return result.join('/');
};

// 获取星座
export const getAstro = (d: ObjDate) => {
  const s = '魔羯水瓶双鱼白羊金牛双子巨蟹狮子处女天秤天蝎射手魔羯';
  const arr = [20, 19, 21, 21, 21, 22, 23, 23, 23, 23, 22, 22];
  return `${s
    .split('')
    .splice(d.month * 2 - (d.day < arr[d.month - 1] ? 2 : 0), 2)
    .join('')}座`;
};

/**
 * d1 距离 d2 多少 时间
 * @param d1
 * @param d2
 * @param unit 时间单位（时间长度/ms），可以是天、周、年
 * @returns
 */
export const timeGap = (d1: ObjDate, d2: ObjDate, unit?: number) => {
  const { year, month, day } = d1;
  const diff = +new Date(`${year}/${month}/${day}`) - +new Date(`${d2.year}/${d2.month}/${d2.day}`);
  const i = unit || DAY;
  if (unit === WEEK) {
    const num = Math.ceil((Math.abs(diff) + d2.week * DAY) / i);
    return num;
  }
  const num = Math.ceil(Math.abs(diff) / i);
  return diff >= 0 ? num : num * -1;
};

/**
 * 获取某日的日历信息
 * @param time 入参可以是 {year: 2021, month: 11, day: 1} / 2021-11-1
 * @returns
 */
export const getDateInfo = (time?: any): any => {
  const now = getDate();
  const date = getDate(time);
  const lunar = calendarjs.solar2lunar(date.year, date.month, date.day); // 农历信息
  const juJin = timeGap(date, now);
  const astro = getAstro(date);
  const isHoliday = isHolidayFn(date);
  const isWorkDay = isWorkDayFn(date);
  const isToday = now.day === date.day && now.month === date.month && now.year === date.year; // 是否是今天
  const isWeekend = date.week === 6 || date.week === 0; // 是否是周末
  const yearNumDay = timeGap(date, getDate([date.year, 1, 1])); // 今年第几天
  const yearNumWeek = timeGap(date, getDate([date.year, 1, 1]), WEEK); // 今年第几周
  const monthNumWeek = timeGap(date, getDate([date.year, date.month, 1]), WEEK); // 本月第几周
  const weekMonthIndex = Math.ceil(date.day / 7); // 本月的第几个周几

  const festival = getFestival({ ...date, weekMonthIndex });

  const result = {
    ...date,
    juJin,
    juJinStr: `${Math.abs(juJin)}天${juJin > 0 ? '后' : '前'}`,
    weekStr: `周${WEEK_NAME_MAP[date.week].label}`,
    festival,
    astro,
    isHoliday,
    isWorkDay,
    isToday,
    isWeekend,
    yearNumDay,
    yearNumWeek,
    monthNumWeek,
    weekMonthIndex,
    lunar,
    festivalStr: festival || lunar.lunarFestival || lunar.Term,
    festivalStrAll: [festival, lunar.lunarFestival, lunar.Term].filter(i => !!i).join('/'),
  };
  return result;
};
