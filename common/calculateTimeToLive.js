const SECONDS_IN_A_DAY = 60 * 60 * 24;

const calculateTimeToLive = ({ numberOfDays = 7 }) => {
  const secondsSinceEpoch = Math.round(Date.now() / 1000);
  const expirationTime = secondsSinceEpoch + numberOfDays * SECONDS_IN_A_DAY;

  return expirationTime;
};

export default calculateTimeToLive;
