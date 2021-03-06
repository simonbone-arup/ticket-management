import React, { memo, useMemo } from "react";
import "./Passengers.css";
import PropTypes from "prop-types";

const Passenger = memo(props => {
  const {
    id,
    name,
    followingAdult,
    ticketType,
    licenceNo,
    gender,
    birthday,
    onRemove,
    onUpdate,
    showGenderMenu,
    showFollowAdultMenu,
    showTicketTypeMenu,
    followAdultName
  } = props;

  const isAdult = ticketType === "adult";
  return (
    <li className="passenger">
      <i className="delete" onClick={() => onRemove(id)}>
        -
      </i>
      <ol className="items">
        <li className="item">
          <label className="label name">name</label>
          <input
            type="text"
            className="input name"
            placeholder="passenger name"
            value={name}
            onChange={e => onUpdate(id, { name: e.target.value })}
          />
          <label className="ticket-type" onClick={() => showTicketTypeMenu(id)}>
            {isAdult ? "adult" : "child"}
          </label>
        </li>
        {isAdult && (
          <li className="item">
            <label className="label licenceNo">licence</label>
            <input
              type="text"
              className="input licenceNo"
              placeholder="licence Number"
              value={licenceNo}
              onChange={e => onUpdate(id, { licenceNo: e.target.value })}
            />
          </li>
        )}

        {!isAdult && (
          <li className="item arrow">
            <label className="label gender">gender</label>
            <input
              type="text"
              className="input gender"
              placeholder="please choose gender"
              onClick={() => showGenderMenu(id)}
              value={gender ? gender : ""}
              readOnly
            />
          </li>
        )}

        {!isAdult && (
          <li className="item">
            <label className="label birthday">birthday</label>
            <input
              type="text"
              className="input birthday"
              placeholder="birthday"
              value={birthday}
              onChange={e => onUpdate(id, { birthday: e.target.value })}
            />
          </li>
        )}

        {!isAdult && (
          <li className="item arrow">
            <label className="label followAdult">follow</label>
            <input
              type="text"
              className="input followAdult"
              placeholder="please choose"
              value={followAdultName}
              onClick={() => showFollowAdultMenu(id)}
              readOnly
            />
          </li>
        )}
      </ol>
    </li>
  );
});

Passenger.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  followingAdult: PropTypes.number,
  ticketType: PropTypes.string,
  licenceNo: PropTypes.string,
  followAdultName: PropTypes.string,
  gender: PropTypes.string,
  birthday: PropTypes.string,
  onRemove: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
  showGenderMenu: PropTypes.func.isRequired,
  showFollowAdultMenu: PropTypes.func.isRequired,
  showTicketTypeMenu: PropTypes.func.isRequired
};
const Passengers = memo(props => {
  const {
    passengers,
    createAdult,
    createChild,
    removePassenger,
    updatePassenger,
    showGenderMenu,
    showFollowAdultMenu,
    showTicketTypeMenu
  } = props;

  const passengerIdToName = useMemo(() => {
    let idToName = {};
    passengers.forEach(passenger => {
      idToName[passenger.id] = passenger.name;
    });
    return idToName;
  }, [passengers]);
  return (
    <div className="passengers">
      <ul>
        {passengers.map(passenger => {
          return (
            <Passenger
              {...passenger}
              followAdultName={passengerIdToName[passenger.followAdult]}
              key={passenger.id}
              showFollowAdultMenu={showFollowAdultMenu}
              showTicketTypeMenu={showTicketTypeMenu}
              onRemove={removePassenger}
              onUpdate={updatePassenger}
              showGenderMenu={showGenderMenu}
            />
          );
        })}
      </ul>
      <section className="add">
        <div className="adult" onClick={() => createAdult()}>
          Add Adult
        </div>
        <div className="child" onClick={() => createChild()}>
          Add Children
        </div>
      </section>
    </div>
  );
});

Passengers.propTypes = {
  passengers: PropTypes.array.isRequired,
  createAdult: PropTypes.func.isRequired,
  createChild: PropTypes.func.isRequired,
  showGenderMenu: PropTypes.func.isRequired,
  showFollowAdultMenu: PropTypes.func.isRequired,
  showTicketTypeMenu: PropTypes.func.isRequired
};

export default Passengers;
