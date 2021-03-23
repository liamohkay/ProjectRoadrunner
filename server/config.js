const token = 'e6b7b612ae6873c19c352b07e9663ef11e4d8d7d';

module.exports = {
  url: 'https://app-hrsei-api.herokuapp.com/api/fec2/hr-lax',
  headers: {
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'request',
      Authorization: token,
    },
  },
  token,
};
