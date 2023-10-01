import fs from "fs";
import axios from "axios";
import * as cheerio from "cheerio";

export const getInfo = async (session) => {
  const promises = Object.entries(session).map(async ([key, value]) => {
    const axiosR = await axios.request({
      method: "GET",
      url: "https://kakaku.com/item/" + value.id + "/pricehistory/",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36",
      },
    });
    const $ = cheerio.load(axiosR.data);
    let price = $("span.difboxMinPrice").text().trim().replace(/¥|,/g, "");
    let name = $("div.h1bg")
      .find("a")
      .text()
      .trim()
      .replace(/(?<=\s)(?!.*\s).*/g, "");
    let seller = $("span.difboxLink").find("a").text().trim();
    session[key].name = name;
    session[key].price = price;
    session[key].seller = seller;
  });

  await Promise.all(promises);
  fs.writeFileSync("./session.json", JSON.stringify(session));
};
