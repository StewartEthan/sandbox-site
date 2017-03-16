module.exports.buildPath = (keywords, pagination = false, entryCount = 5) => {
  if (typeof keywords !== 'string' || !keywords) keywords = '';

  const basePath = '/services/search/FindingService/v1?';
  const params = [
    'OPERATION-NAME=findItemsByKeywords',
    'SERVICE-VERSION=1.0.0',
    'SECURITY-APPNAME=EthanSte-PriceCom-PRD-12466ad44-5e7a466a',
    'RESPONSE-DATA-FORMAT=JSON',
    'REST-PAYLOAD'
  ];
  if (pagination) {
    params.push(`paginationInput.entriesPerPage=${entryCount}`);
  }

  keywords = require('querystring').escape(keywords);
  params.push(`keywords=${keywords}`);

  return basePath + params.join('&');
}