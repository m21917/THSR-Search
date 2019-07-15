export const getStationList = () => {
    return fetch('https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/Station?$top=30&$format=JSON')
          .then((response) => response.json());
};

export const searchTrainByDateAndStop = (start, stop, date) => {
    return fetch(`https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/DailyTimetable/OD/${start}/to/${stop}/${date}?$top=100&$format=JSON`)
          .then((response) => response.json());
};

export const getTrainStayStation = (trainNo) => {
    return fetch(`https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/GeneralTimetable/TrainNo/${trainNo}?$top=30&$format=JSON`)
          .then((response) => response.json());
}

export const getAvailableSeat = (stationID) => {
    return fetch(`https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/AvailableSeatStatusList/${stationID}?$top=30&$format=JSON`)
          .then((response) => response.json());
}

export const getNews = () => {
    return fetch("https://ptx.transportdata.tw/MOTC/v2/Rail/THSR/News?$top=30&$format=JSON")
          .then((response) => response.json());
}