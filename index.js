const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");

const getPriceFeed = async () => {
  try {
    const siteUrl = "https://coinmarketcap.com";
    const { data } = await axios({
      method: "GET",
      url: siteUrl,
    });
    const $ = cheerio.load(data);
    const elementSelector =
      "#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div > div.h7vnx2-1.bFzXgL > table > tbody > tr";
    const keys = [
      "",
      "rank",
      "name",
      "price",
      "24h",
      "7d",
      "marketCap",
      "volume",
      "circulatingSupply",
    ];
    const coinArr = [];
    $(elementSelector).each((parentIndex, parentElement) => {
      let keyIndex = 0;
      const coinObj = {};
      if (parentIndex < 10) {
        $(parentElement)
          .children()
          .each((childIndex, childElement) => {
            let tdValue = $(childElement).text();
            if (childIndex === 2) {
              tdValue = $("p:first-child", $(childElement).html()).text();
            }
            if (childIndex === 6) {
              tdValue = $("span:nth-child(2)", $(childElement).html()).text();
            }
            if (childIndex === 7) {
              tdValue = $("a:first-child", $(childElement).html()).text();
            }
            if (tdValue) {
              coinObj[keys[keyIndex]] = tdValue;
            }
            keyIndex++;
          });
        coinArr.push(coinObj);
      }
    });
    return coinArr;
  } catch (err) {
    console.log(err);
  }
};
const app = express();

app.get("/api/price-feed", async (req, res) => {
  try {
    const priceFeed = await getPriceFeed();
    return res.status(200).json({
      resule: priceFeed,
    });
  } catch (err) {
    return res.status(500).json({
      err: err.toString(),
    });
  }
});

app.listen(3000, () => {
  console.log("running on port 3000");
});
