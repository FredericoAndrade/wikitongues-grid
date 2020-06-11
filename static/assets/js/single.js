'use strict';
var Airtable = require('airtable');
function query(obj) {
  new Dotenv({
    path: './.env', // Path to .env file (this is the default)
    safe: true // load .env.example (defaults to "false" which does not use dotenv-safe)
  });
  require('dotenv').config({ path: local+"/.env" });
  var single = obj;
  var base = new Airtable({apiKey: process.env.APIKEY}).base(process.env.BASE);

  base('🍩 Oral Histories').select({
      view: ".LOCMetadataView",
      cellFormat: "string",
      timeZone: "America/New_York",
      userLocale: "en-ca",
      filterByFormula: "Identifier='"+single+"'",
      fields: [
        "IDv2"
        // "Identifier"
        // "Languages: ISO Code (639-3)",
        // "Language names",
        // "Languages: Speaker preferred names",
        // "Contributor: Speakers",
        // ".self?",
        // "Creator",
        // "Subject: Language Nation of Origin",
        // "Coverage: Video Territory",
        // "Description",
        // "Rights",
        // "Youtube Publish Date",
        // "Wikimedia Eligibility",
        // "Wiki Commons URL"
      ]
  }).eachPage(function page(records, fetchNextPage) {
    if (!Array.isArray(records) || !!records.length) {
      records.forEach(function(record) {
          const content = [record.get('IDv2')]
          return content
      });
      fetchNextPage();
    } else {
      console.log(`\x1b[31mWarning! ID '${single}' not found on airtable.`)
    }
  }, function done(err) {
      if (err) { console.error(err); return; }
  });
}