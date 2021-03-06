export const SET_TRAIN_NUMBER = "SET_TRAIN_NUMBER";
export const SET_DEPART_STATION = "SET_DEPART_STATION";
export const SET_ARRIVE_STATION = "SET_ARRIVE_STATION";
export const SET_SEAT_TYPE = "SET_SEAT_TYPE";
export const SET_DEPART_DATE = "SET_DEPART_DATE";
export const SET_ARRIVE_DATE = "SET_ARRIVE_DATE";
export const SET_DEPART_TIME_STR = "SET_DEPART_TIME_STR";
export const SET_ARRIVE_TIME_STR = "SET_ARRIVE_TIME_STR";
export const SET_DURATION_STR = "SET_DURATION_STR";
export const SET_PRICE = "SET_PRICE";
export const SET_PASSENGERS = "SET_PASSENGERS";
export const SET_MENU = "SET_MENU";
export const SET_IS_MENU_VISIBLE = "SET_IS_MENU_VISIBLE";
export const SET_SEARCH_PARSED = "SET_SEARCH_PARSED";

export function setTrainnumber(trainNumber) {
  return {
    type: SET_TRAIN_NUMBER,
    payload: trainNumber
  };
}

export function setDepartStation(departStation) {
  return {
    type: SET_DEPART_STATION,
    payload: departStation
  };
}

export function setArriveStation(arriveStation) {
  return {
    type: SET_ARRIVE_STATION,
    payload: arriveStation
  };
}

export function setSeatType(seatType) {
  return {
    type: SET_SEAT_TYPE,
    payload: seatType
  };
}

export function setDepartDate(departDate) {
  return {
    type: SET_DEPART_DATE,
    payload: departDate
  };
}

export function setArriveDate(arriveDate) {
  return {
    type: SET_ARRIVE_DATE,
    payload: arriveDate
  };
}

export function setDepartTimeStr(departTimeStr) {
  return {
    type: SET_DEPART_TIME_STR,
    payload: departTimeStr
  };
}

export function setArriveTimeStr(arriveTimeStr) {
  return {
    type: SET_ARRIVE_TIME_STR,
    payload: arriveTimeStr
  };
}

export function setDurationStr(durationStr) {
  return {
    type: SET_DURATION_STR,
    payload: durationStr
  };
}

export function setPrice(price) {
  return {
    type: SET_PRICE,
    payload: price
  };
}

export function setPassengers(passengers) {
  return {
    type: SET_PASSENGERS,
    payload: passengers
  };
}

export function setMenu(menu) {
  return {
    type: SET_MENU,
    payload: menu
  };
}

export function setIsMenuVisible(isMenuVisible) {
  return {
    type: SET_IS_MENU_VISIBLE,
    payload: isMenuVisible
  };
}

export function setSearchParsed(searchParsed) {
  return {
    type: SET_SEARCH_PARSED,
    payload: searchParsed
  };
}

export function fetchWithUrlQueries(url) {
  return (dispatch, getState) => {
    fetch(url)
      .then(res => res.json())
      .then(data => {
        const {
          arriveTimeStr,
          departTimeStr,
          arriveDate,
          durationStr,
          price
        } = data;

        dispatch(setArriveTimeStr(arriveTimeStr));
        dispatch(setDepartTimeStr(departTimeStr));
        dispatch(setArriveDate(arriveDate));
        dispatch(setDurationStr(durationStr));
        dispatch(setPrice(price));
      });
  };
}

let passengerId = 0;

export function createAdult() {
  return (dispatch, getState) => {
    const { passengers } = getState();

    for (let passenger of passengers) {
      const values = Object.values(passenger);
      for (let value of values) {
        if (!value) {
          return;
        }
      }
    }

    dispatch(
      setPassengers([
        ...passengers,
        {
          id: ++passengerId,
          name: "",
          ticketType: "adult",
          licenseNo: "",
          seat: "Z"
        }
      ])
    );
  };
}

export function createChild() {
  return (dispatch, getState) => {
    const { passengers } = getState();

    let adult = null;

    for (let passenger of passengers) {
      const values = Object.values(passenger);
      for (let value of values) {
        if (value === undefined) {
          return;
        }
      }

      if (passenger.ticketType === "adult") {
        adult = passenger.id;
      }
    }

    if (!adult) {
      alert("cannot find adult");
      return;
    }

    /* eslint-disable no-console */
    console.log("you got here");
    /* eslint-enable no-console */
    dispatch(
      setPassengers([
        ...passengers,
        {
          id: ++passengerId,
          name: "",
          ticketType: "child",
          gender: "none",
          birthday: "",
          followAdult: adult,
          seat: "Z"
        }
      ])
    );
  };
}

export function removePassenger(id) {
  return (dispatch, getState) => {
    const { passengers } = getState();

    const filterdPassengers = passengers.filter(passenger => {
      return passenger.id !== id && passenger.followAdult !== id;
    });

    dispatch(setPassengers(filterdPassengers));
  };
}

export function updatePassenger(id, data, keysToBeRemoved = []) {
  return (dispatch, getState) => {
    const { passengers } = getState();
    for (let i = 0; i < passengers.length; i++) {
      if (passengers[i].id === id) {
        const newPassenger = [...passengers];
        newPassenger[i] = Object.assign({}, passengers[i], data);

        for (let key of keysToBeRemoved) {
          delete newPassenger[i][key];
        }
        dispatch(setPassengers(newPassenger));
        break;
      }
    }
  };
}

export function showMenu(menu) {
  return dispatch => {
    dispatch(setMenu(menu));
    dispatch(setIsMenuVisible(true));
  };
}

export function showGenderMenu(id) {
  return (dispatch, getState) => {
    const { passengers } = getState();
    const passenger = passengers.find(passenger => passenger.id === id);
    if (!passenger) {
      return;
    }

    dispatch(
      showMenu({
        onPress(gender) {
          /* eslint-disable no-console */
          console.log("you got here", gender);
          /* eslint-enable no-console */
          dispatch(updatePassenger(id, { gender }));
          dispatch(hideMenu());
        },
        options: [
          {
            title: "male",
            value: "male",
            active: "male" === passenger.gender
          },
          {
            title: "female",
            value: "female",
            active: "female" === passenger.gender
          }
        ]
      })
    );
  };
}

export function showFollowAdultMenu(id) {
  return (dispatch, getState) => {
    const { passengers } = getState();
    const passenger = passengers.find(passenger => passenger.id === id);

    if (!passenger) {
      return;
    }

    dispatch(
      showMenu({
        onPress(followAdult) {
          /* eslint-disable no-console */
          console.log("you got here", followAdult);
          /* eslint-enable no-console */
          dispatch(updatePassenger(id, { followAdult }));
          dispatch(hideMenu());
        },
        options: passengers
          .filter(passenger => passenger.ticketType === "adult")
          .map(adult => {
            return {
              title: adult.name,
              value: adult.id,
              active: adult.id === passenger.followAdult
            };
          })
      })
    );
  };
}

export function showTicketTypeMenu(id) {
  return (dispatch, getState) => {
    const { passengers } = getState();

    const passenger = passengers.find(passenger => passenger.id === id);
    if (!passenger) {
      return;
    }
    dispatch(
      showMenu({
        onPress(ticketType) {
          if (ticketType === "adult") {
            dispatch(
              updatePassenger(
                id,
                {
                  ticketType,
                  licenceNo: ""
                },
                ["gender", "followAdult", "birthday"]
              )
            );
          } else {
            const adult = passengers.find(
              passenger =>
                passenger.id !== id && passenger.ticketType === "adult"
            );

            if (adult) {
              dispatch(
                updatePassenger(
                  id,
                  {
                    ticketType,
                    gender: "",
                    followAdult: adult.id,
                    birthday: ""
                  },
                  ["licenseNo"]
                )
              );
            } else {
              alert("no adult");
            }
          }
          dispatch(hideMenu());
        },
        options: [
          {
            title: "adult",
            value: "adult",
            active: "adult" === passenger.ticketType
          },
          {
            title: "child",
            value: "child",
            active: "child" === passenger.ticketType
          }
        ]
      })
    );
  };
}

export function hideMenu() {
  return setIsMenuVisible(false);
}
