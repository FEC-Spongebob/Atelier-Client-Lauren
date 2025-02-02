const dbModel = require('../models/reviewsModel.js');

const convertToNumber = (value, limit, base) => {
  if (value === undefined) { return base; }
  let num = Number(value);
  if (isNaN(num)) { return base; }
  if (num < 0) { return base; }
  if (num > limit) { return limit; }
  return num;
};

const getReviews = (req, res) => {
  let params = {
    product_id: convertToNumber(req.params.product_id, 10000000, 0),
    page: convertToNumber(req.query.page, 500, 1),
    count: convertToNumber(req.query.count, 100, 5),
    sort: req.query.sort || 'newest',
  };

  dbModel.getReviews(params)
    .then((data) => {
      let response = {
        product: params.product_id === 0 ? '' : String(params.product_id),
        page: params.page,
        count: data.rowCount,
        results: data.rows,
      };
      // console.log('getReviews', data);
      res.send(response)
    })
    .catch((err) => console.log('error', err));
};

const getMeta = (req, res) => {
  let product_id = convertToNumber(req.query.product_id, 10000000, 1);

  if (!product_id || product_id < 0) {
    return res.sendStatus(400, 'Bad Request');
  }

  const response = {
    product_id: String(product_id),
    ratings: {},
    recommended: {},
    characteristics: {},
  };


  dbModel.getMeta(product_id)
    .then((data) => {
      if (data[0].rows.length > 0) {
        response.recommended = data[0].rows[0].recommend;
        response.ratings = data[0].rows[0].ratings;

        data[1].rows
        .forEach((row) => {
          response.characteristics[row.name] = {
            id: row.id,
            value: row.value
          }
        });
      }
      res.send(response);

    })
    .catch((err) => console.log('error', err));
}

const updateHelpful = (req, res) => {
  let review_id = convertToNumber(req.params.review_id, 10000000, 1);
  dbModel.updateHelpful(review_id)
    .then((data) => {
      res.sendStatus(204);
    })
    .catch((err) => console.log('error', err));
};

const updateReported = (req, res) => {
  let review_id = convertToNumber(req.params.review_id, 10000000, 1);
  dbModel.updateReported(review_id)
    .then((data) => {
      res.sendStatus(204);
    })
    .catch((err) => console.log('error', err));
};

const postReview = (req, res) => {
  let params = {
    product_id: convertToNumber(req.body?.product_id || 0, 10000000, 0),
    rating: convertToNumber(req.body?.rating, 5, 0),
    summary: req.body?.summary || '',
    body: req.body?.body || '',
    recommend: req.body?.recommend || false,
    name: req.body?.name,
    email: req.body?.email,
    photos: req.body?.photos || [],
    characteristics: req.body?.characteristics || {},
  };

  if (params.product_id <= 0 || params.rating <= 0 || params.rating > 5) {
    return res.sendStatus(400, 'Bad Request');
  }

  dbModel.postReview(params)
    .then((data)=> res.send(201, 'Created'))
    .catch((err) => res.send(400, 'Bad Request'));
};

module.exports = {
  getReviews,
  getMeta,
  updateHelpful,
  updateReported,
  postReview,
};