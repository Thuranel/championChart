/* eslint-disable consistent-return,no-console,no-restricted-syntax,no-plusplus,guard-for-in,no-trailing-spaces,no-param-reassign */
const axios = require('axios');
const jsonfile = require('jsonfile');

exports.getData = function getData() {

  function api() {
    const headers = {
      "Content-Type": "application/json"
    };

    return axios.create({
      headers,
    });
  }

  function getChampData(champIdMap) {
    api().get('http://api.champion.gg/v2/champions', {
      params: {
        api_key: 'champion.gg api key',
        limit: 210,
        champData: 'winsByMatchLength,damage'
      }
    })
      .then((response) => {
        for (let i = 0; i < response.data.length; i++) {
          const champID = response.data[i].championId;
          response.data[i].champName = champIdMap[champID].name;
          response.data[i].key = champIdMap[champID].key;
          response.data[i].winRate = parseFloat(Math.round(response.data[i].winRate * 100 * 100) / 100).toFixed(2);
          response.data[i].playRate = parseFloat(Math.round(response.data[i].playRate * 100 * 100) / 100).toFixed(2);
          response.data[i].banRate = parseFloat(Math.round(response.data[i].banRate * 100 * 100) / 100).toFixed(2);
          response.data[i].damage = parseFloat(Math.round(response.data[i].damageComposition.total * 100) / 100).toFixed(0);

          const fifteenToTwenty = response.data[i].winsByMatchLength.fifteenToTwenty;
          const twentyToTwentyFive = response.data[i].winsByMatchLength.twentyToTwentyFive;
          const numberOfGames = fifteenToTwenty.count + twentyToTwentyFive.count;
          const fifteenToTwentyRatio = fifteenToTwenty.count / numberOfGames;
          const twentyToTwentyFiveRatio = twentyToTwentyFive.count / numberOfGames;
          const averageWinRateAt20 = (fifteenToTwenty.winRate * fifteenToTwentyRatio) + (twentyToTwentyFive.winRate * twentyToTwentyFiveRatio);
          response.data[i].winRateAt20 = parseFloat(Math.round(averageWinRateAt20 * 100 * 100) / 100).toFixed(2);
          response.data[i].winRateAt40plus = parseFloat(Math.round(response.data[i].winsByMatchLength.fortyPlus.winRate * 100 * 100) / 100).toFixed(2);
        }

        jsonfile.writeFile('./data.json', response.data, (err) => {
          if (err) {
            console.log('error writing to file');
          }
        });
      })
      .catch((error) => {
        console.log('There has been an error getting champ data: ');
        console.log(error);

        jsonfile.writeFile('./error.json', error, (err) => {
          if (err) {
            console.log('error writing to file');
          }
        });
      });
  }

  api().get('https://eun1.api.riotgames.com/lol/static-data/v3/champions', {
    params: {
      api_key: 'league api key'
    }
  })
    .then((response) => {
      const champNames = [];
      for (const key in response.data.data) {
        champNames.push(key);
      }

      const champIdMap = [];
      for (let i = 0; i < champNames.length; i++) {
        const champ = response.data.data[champNames[i]];
        champIdMap[champ.id] = { name: champ.name, key: champ.key };
      }

      getChampData(champIdMap);
    })
    .catch((error) => {
      jsonfile.writeFile('./error.json', error, (err) => {
        if (err) {
          console.log('error writing to file');
        }
      });
    });
};

