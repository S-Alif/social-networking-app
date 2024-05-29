import moment from 'moment-timezone';

export const formatDate = (datetime) => {
  const userTimeZone = moment.tz.guess();
  const zonedDate = moment.tz(datetime, userTimeZone);
  return zonedDate.format('DD-MM-YYYY [at] h:mm A');
};
