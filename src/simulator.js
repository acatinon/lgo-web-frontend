const express = require('express');
var cors = require('cors');
const wsApp = express();
require('express-ws')(wsApp);

const httpApp = express();

httpApp.use(cors());

httpApp.get('/', function (req, res) {
  res.send('Hello World!')
});

httpApp.get('/orders', function (req, res) {
    let response = {
        "result": {
          "orders": [
            {
              "remaining_quantity": "1.00000000",
              "status": "OPEN",
              "id": "154211289673900001",
              "batch_id": "5",
              "type": "L",
              "side": "B",
              "product_id": "BTC-USD",
              "quantity": "1.20000000",
              "price": "7024.0000",
              "creation_date": "2018-11-13T12:41:36.739"
            },
            {
              "remaining_quantity": "1.00000000",
              "status": "OPEN",
              "id": "154211289373800001",
              "batch_id": "4",
              "type": "L",
              "side": "B",
              "product_id": "BTC-USD",
              "quantity": "2.70000000",
              "price": "7045.0000",
              "creation_date": "2018-11-13T12:41:33.738"
            }
          ]
        },
        "nextPage": "aGVsbG8="
      };

      res.json(response);
});

httpApp.listen(3200, function () {
  console.log('Example app listening on port 3200!')
});


wsApp.ws('/', function(ws, req) {
  ws.on('message', function(msg) {
    console.log(msg);
  });
});


wsApp.listen(3002, function () {
  console.log('Example app listening on port 3002!')
});