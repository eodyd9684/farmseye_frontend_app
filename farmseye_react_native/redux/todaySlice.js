import { createSlice } from "@reduxjs/toolkit";

const getToday = () => {
  const now = new Date();

  // UTC 시간 + 9시간
  const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  const year = koreaTime.getUTCFullYear();
  const month = (koreaTime.getUTCMonth() + 1).toString().padStart(2, '0');
  const date = koreaTime.getUTCDate().toString().padStart(2, '0');
  const hours = koreaTime.getUTCHours().toString().padStart(2, "0");
  const minutes = koreaTime.getUTCMinutes().toString().padStart(2, "0");

  return (`${year}.${month}.${date} ${hours}:${minutes}`);
};


const todaySlice = createSlice({
  name : 'today',
  initialState : {today : getToday()},
});

export default todaySlice;