const axios = require("axios");

const token = Buffer
  .from(`${process.env.API_KEY}:${process.env.API_SECRET}`)
  .toString('base64');

const authorizedAxios = axios.create({
  baseURL: process.env.GLOVO_API_URL,
  headers: { Authorization: `Basic ${token}` }
});

module.exports.axiosClient = authorizedAxios;