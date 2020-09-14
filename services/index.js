const errorHandler = require("../utils/error-handler");
const { axiosClient } = require("../utils/http-client");
const NodeGeocoder = require('node-geocoder');

const geocoder = NodeGeocoder({
  provider: 'openstreetmap'
});

const DISCOUNT = 0.8;

module.exports.estimateOrder = async (req, res) => {
  const { from, to } = req.body;
 
  if (!from || !to) {
    return res.status(400).send("From and To body params are required");
  }

  let productAddress, deliveryAddress;

  try {
    ([[productAddress], [deliveryAddress]] = await Promise.all([
      geocoder.geocode(from),
      geocoder.geocode(to),
    ]));
  } catch (err) {
    errorHandler(res, "[estimateOrder]", 500, "Error searching provided adresses", err);
  }

  if (!productAddress) {
    return res.status(404).send("Could not recognize product address");
  }

  if (!deliveryAddress) {
    return res.status(404).send("Could not recognize dedlivery address");
  }

  const body = {
    scheduleTime: null,
    description: "Some description",
    addresses: [
      {
        type: "PICKUP",
        lat: productAddress.latitude,
        lon: productAddress.longitude,
        label: "Some label"
      },
      {
        type: "DELIVERY",
        lat: deliveryAddress.latitude,
        lon: deliveryAddress.longitude,
        label: "Some label"
      }
    ]
  };

  try {
    const { data: { total: { amount, currency } } } = await axiosClient.post('/b2b/orders/estimate', body);
    const discountedAmount = amount * DISCOUNT;
    // Cast to human currency format
    const totalPrice = parseFloat((discountedAmount / 100).toFixed(2));
    const resultPrice = `${totalPrice} ${currency}`

    res.send({ price: resultPrice });
  } catch (err) {
    const axiosErrorMessage = err.response.data.error;
    // Glovo responds pretty user friendly error messages and they could be sent to the user
    const errMessage = err.response.status === 400 ? axiosErrorMessage : "Error estimate price";
    errorHandler(res, "[estimateOrder]", 500, errMessage, axiosErrorMessage);
  }
}