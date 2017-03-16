/**
 * Builds the URL for searching with the eBay API.
 * I may at some point abstract this to work with multiple use cases
 * 
 * @param  {String}  keywords       the keywords to search for
 * @param  {Boolean} limitResults   whether to limit the number of limitResults
 * @param  {Number}  maxResultCount the maximum number of results to return
 * 
 * @return {String}  the URL to retrieve search results from the eBay API
 */
module.exports.buildUrl = (keywords, limitResults = false, maxResultCount = 5) => {
  if (typeof keywords !== 'string') keywords = '';

  const basePath = 'http://open.api.ebay.com/shopping?'
  const params = [
    'callname=FindProducts',
    'responseencoding=JSON',
    'appid=EthanSte-PriceCom-PRD-12466ad44-5e7a466a',
    'siteid=0',
    'version=967',
    'AvailableItemsOnly=true'
  ];
  if (limitResults) {
    params.push(`MaxEntries=${maxResultCount}`);
  }

  keywords = require('querystring').escape(keywords);
  params.push(`QueryKeywords=${keywords}`);

  return basePath + params.join('&');
}