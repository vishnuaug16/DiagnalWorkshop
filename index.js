"use strict";
const metaget = require("metaget");
const cheerio = require("cheerio");
const request = require("request");

exports.handler = function (event, context, callback) {
  console.log("event  ::", JSON.stringify(event));
  const constants = {
    TITLE: "title",
    DESCRIPTION: "description",
    IMAGE: "image",
  };

  /********************
  input Validation
  *******************/
  if (
    JSON.parse(event.body) &&
    JSON.parse(event.body).url == undefined &&
    JSON.parse(event.body).url.trim() == ""
  ) {
    callback(null, {
      statusCode: 500,
      headers: { "Content-Type": "application/javascript" },
      body: JSON.stringify({ message: "Malformed Input" }),
    });
  }

  // url is web URL passed from Input
  const url = JSON.parse(event.body).url.trim();

  // getOgData uses the metaget library to get the meta informations taht are been set
  getOgData(url).then((dataOgData) => {
    console.log("Returned from getOgData() ::", dataOgData);
    // formMetaObject Forms the JSON Object
    formMetaObject(dataOgData).then((dataMeta) => {
      console.log("Returned from formMetaObject() ::", dataMeta);
      // getHtmlData gets the HTML content of the webpage.
      getHtmlData(url).then((htmldata) => {
        // getHeadTags sets the meta informations whuch are not present undet og:meta
        getHeadTags(htmldata, dataOgData).then((finalData) => {
          callback(null, {
            statusCode: 200,
            body: JSON.stringify(finalData),
            headers: {
              "Content-Type": "application/json",
            },
          });
        });
      });
    });
  });

  function getHtmlData(url) {
    return new Promise((resolve, reject) => {
      request(url, function (error, response, body) {
        if (error) {
          console.error("error:", error);
          callback(null, {
            statusCode: 500,
            headers: { "Content-Type": "application/javascript" },
            body: JSON.stringify({ message: error }),
          });
        } else {
          console.log("statusCode:", response && response.statusCode);
          console.log("body:", body);
          resolve(body);
        }
      });
    });
  }
  function getHeadTags(htmlStr, dataOgData) {
    return new Promise((resolve, reject) => {
      const $ = cheerio.load(htmlStr);
      $("head > *").each((_, elm) => {
        if (
          !dataOgData.description &&
          elm.attribs &&
          elm.attribs.name == constants.DESCRIPTION
        ) {
          dataOgData.description = elm.attribs.content;
        }
        if (!dataOgData.title && elm.name && elm.name == constants.TITLE) {
          dataOgData.title = elm.text;
        }
        if (
          !dataOgData.image &&
          elm.attribs &&
          elm.attribs.itemprop == constants.IMAGE
        ) {
          dataOgData.image = elm.attribs.content;
        }

        if (!dataOgData.script && elm.name && elm.name == constants.SCRIPT) {
          dataOgData.script = elm.attribs.nonce;
        }
      });
      console.log("headTags", dataOgData);
      resolve(dataOgData);
    });
  }

  function getOgData() {
    return new Promise((resolve, reject) => {
      metaget.fetch(url, (err, metaResponse) => {
        if (err) {
          console.log(err);
          callback(null, {
            statusCode: 500,
            headers: { "Content-Type": "application/javascript" },
            body: JSON.stringify({ message: err }),
          });
        } else {
          resolve(metaResponse);
        }
      });
    });
  }

  function formMetaObject(metaResponse) {
    return new Promise((resolve, reject) => {
      console.log("metaResponse ::", metaResponse);
      var resObj = {};
      if (metaResponse["og:title"] && metaResponse["og:title"] != undefined) {
        resObj["title"] = metaResponse["og:title"];
      }

      if (
        metaResponse["og:description"] &&
        metaResponse["og:description"] != undefined
      ) {
        resObj["description"] = metaResponse["og:description"];
      }

      if (metaResponse["og:images"] && metaResponse["og:images"] != undefined) {
        resObj["images"] = metaResponse["og:images"];
      }
      console.log(" resObj ::", resObj);
      resolve(resObj);
    });
  }
};
