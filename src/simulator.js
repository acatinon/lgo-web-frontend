const events = require("events");
const express = require('express');
const cors = require('cors');
const bodyParser = require("body-parser");
const wsApp = express();
require('express-ws')(wsApp);

const httpApp = express();
const event = new events.EventEmitter()

httpApp.use(cors());
httpApp.use(bodyParser.json());

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

httpApp.post('/orders', function (request, response) {
  event.emit("placeOrder", request.body);
  response.status(200).end();
});

httpApp.delete('/orders/:id', function (request, response) {
  event.emit("cancelOrder", request.params.id);
  response.status(200).end();
});

httpApp.listen(3200, function () {
  console.log('Example app listening on port 3200!')
});


wsApp.ws('/', function (ws, req) {
  const placeOrderListener = function (body) {
    const response = {
      "payload": [
        {
          "quantity": body.quantity,
          "time": "2018-11-12T10:24:54.091Z",
          "side": body.side,
          "order_id": Date.now(),
          "type": "pending",
          "order_type": body.type,
          "price": body.price
        }
      ],
      "batch_id": 794,
      "type": "update",
      "channel": "user",
      "product_id": "BTC-USD"
    };

    ws.send(JSON.stringify(response));
  };

  event.on("placeOrder", placeOrderListener);

  const cancelOrderListener = function (orderId) {
    const response = {
      "payload": [
        {
          "time": "2019-06-07T15:02:21.971Z",
          "reason": "canceled",
          "type": "done",
          "order_id": orderId
        }
      ],
      "batch_id": 4075955,
      "type": "update",
      "channel": "user",
      "product_id": "BTC-USD"
    };

    ws.send(JSON.stringify(response));
  };

  event.on("cancelOrder", cancelOrderListener);

  ws.on('close', function (code, reason) {
    event.off("cancelOrder", cancelOrderListener);
    event.off("placeOrder", placeOrderListener);
  });
});


wsApp.listen(3002, function () {
  console.log('Example app listening on port 3002!')
});