import React, { useCallback, useEffect, useMemo } from "react";
import "./App.css";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import URI from "urijs";
import dayjs from "dayjs";
import { getDateWithDay } from "../common/helper";
import Header from "../common/Header";
import Nav from "../common/Nav";
import List from "./List";
import Filter from "./Filter";
import useNav from "../common/useNav";
import {
  setFrom,
  setTo,
  setDepartDate,
  setHighSpeed,
  setSearchParsed,
  setTrainList,
  setTicketTypes,
  setTrainTypes,
  setDepartStations,
  setArriveStations,
  prevDate,
  nextDate,
  toggleHighSpeed,
  toggleIsFilterVisible,
  toggleOnlyTickets,
  toggleOrderType,
  setCheckedArriveStations,
  setCheckedDepartStations,
  setCheckedTicketTypes,
  setCheckedTrainTypes,
  setDepartTimeStart,
  setDepartTimeEnd,
  setArriveTimeStart,
  setArriveTimeEnd
} from "./actions";

const App = props => {
  const {
    from,
    to,
    dispatch,
    searchParsed,
    departDate,
    highSpeed,
    orderType,
    onlyTickets,
    isFilterVisible,
    checkedTicketTypes,
    checkedTrainTypes,
    checkedDepartStations,
    checkedArriveStations,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd,
    trainList,
    ticketTypes,
    trainTypes,
    departStations,
    arriveStations
  } = props;

  const onBack = useCallback(() => {
    window.history.back();
  }, []);

  const { isPrevDisabled, isNextDisabled, prev, next } = useNav(
    departDate,
    dispatch,
    prevDate,
    nextDate
  );

  const filterCbs = useMemo(() => {
    return bindActionCreators(
      {
        toggleHighSpeed,
        toggleIsFilterVisible,
        toggleOnlyTickets,
        toggleOrderType,
        setCheckedArriveStations,
        setCheckedDepartStations,
        setCheckedTicketTypes,
        setCheckedTrainTypes,
        setDepartTimeStart,
        setDepartTimeEnd,
        setArriveTimeStart,
        setArriveTimeEnd
      },
      dispatch
    );
  }, []);

  useEffect(() => {
    const queries = URI.parseQuery(window.location.search);
    const { from, to, date, highSpeed } = queries;

    dispatch(setFrom(from));
    dispatch(setTo(to));
    dispatch(setDepartDate(getDateWithDay(dayjs(date).valueOf())));
    dispatch(setHighSpeed(highSpeed === "true"));
    dispatch(setSearchParsed(true));
  }, []);

  useEffect(() => {
    if (!searchParsed) {
      return;
    }
    const url = new URI("/rest/query")
      .setSearch("from", from)
      .setSearch("to", to)
      .setSearch("date", dayjs(departDate).format("YYYY-MM-DD"))
      .setSearch("orderType", orderType)
      .setSearch("onlyTickets", onlyTickets)
      .setSearch("checkedTicketTypes", Object.keys(checkedTicketTypes).join())
      .setSearch("checkedTrainTypes", Object.keys(checkedTrainTypes).join())
      .setSearch(
        "checkedDepartStations",
        Object.keys(checkedDepartStations).join()
      )
      .setSearch(
        "checkedArriveStations",
        Object.keys(checkedArriveStations).join()
      )
      .setSearch("departTimeStart", departTimeStart)
      .setSearch("departTimeEnd", departTimeEnd)
      .setSearch("arriveTimeStart", arriveTimeStart)
      .setSearch("arriveTimeEnd", arriveTimeEnd)
      .toString();

    fetch(url)
      .then(response => response.json())
      .then(result => {
        const {
          dataMap: {
            directTrainInfo: {
              trains,
              filter: { ticketType, trainType, depStation, arrStation }
            }
          }
        } = result;
        dispatch(setTrainList(trains));
        dispatch(setTicketTypes(ticketType));
        dispatch(setTrainTypes(trainType));
        dispatch(setDepartStations(depStation));
        dispatch(setArriveStations(arrStation));
      });
  }, [
    from,
    to,
    departDate,
    highSpeed,
    orderType,
    onlyTickets,
    checkedTicketTypes,
    checkedTrainTypes,
    checkedDepartStations,
    checkedArriveStations,
    departTimeStart,
    departTimeEnd,
    arriveTimeStart,
    arriveTimeEnd
  ]);
  return (
    <div>
      <div className="header-wrapper">
        <Header onBack={onBack} title={`${from} - ${to}`} />
      </div>
      <Nav
        date={departDate}
        isNextDisabled={isNextDisabled}
        isPrevDisabled={isPrevDisabled}
        prev={prev}
        next={next}
      />
      <List list={trainList} />
      <Filter
        highSpeed={highSpeed}
        orderType={orderType}
        onlyTickets={onlyTickets}
        isFilterVisible={isFilterVisible}
        checkedTicketTypes={checkedTicketTypes}
        checkedTrainTypes={checkedTrainTypes}
        checkedDepartStations={checkedDepartStations}
        checkedArriveStations={checkedArriveStations}
        departTimeStart={departTimeStart}
        departTimeEnd={departTimeEnd}
        arriveTimeStart={arriveTimeStart}
        arriveTimeEnd={arriveTimeEnd}
        ticketTypes={ticketTypes}
        trainTypes={trainTypes}
        departStations={departStations}
        arriveStations={arriveStations}
        {...filterCbs}
      />
    </div>
  );
};

const mapStateToProps = state => state;

const mapDispatchToProps = dispatch => {
  return {
    dispatch
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
