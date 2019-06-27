const express = require('express');
const app = express();

app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.get('/orders', function (req, res) {
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
              "quantity": "1.00000000",
              "price": "7000.0000",
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
              "quantity": "1.00000000",
              "price": "7000.0000",
              "creation_date": "2018-11-13T12:41:33.738"
            }
          ]
        },
        "nextPage": "aGVsbG8="
      };

      res.send(response);
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});