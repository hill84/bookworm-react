import PropTypes from 'prop-types';

const { arrayOf, bool, func, shape, number,/*  oneOf, */ string } = PropTypes;

export const funcType = func;

export const stringType = string;

export const userType = shape({
  creationTime: string.isRequired,
  displayName: string.isRequired,
  email: string.isRequired,
  birth_date: string,
  continent: string,
  country: string,
  city: string,
  languages: arrayOf(string),
  photoURL: string,
  sex: string,
  stats: shape({
    //followed_num: number.isRequired,
    followers_num: number.isRequired,
    ratings_num: number.isRequired,
    reviews_num: number.isRequired,
    shelf_num: number.isRequired,
    wishlist_num: number.isRequired
  }).isRequired
});

export const bookType = shape({
  bid: string.isRequired,
  ISBN_num: number.isRequired,
  title: string.isRequired,
  title_sort: string.isRequired,
  subtitle: string,
  authors: arrayOf(string).isRequired,
  format: string,
  covers: arrayOf(string),
  pages_num: number.isRequired,
  publisher: string.isRequired,
  publication: string,
  edition_num: number,
  genres: arrayOf(string),
  languages: arrayOf(string),
  description: string,
  incipit: string,
  readers_num: number.isRequired,
  reviews_num: number.isRequired,
  ratings_num: number.isRequired,
  rating_num: number.isRequired
});

export const coverType = shape({
  bid: string.isRequired,
  title: string.isRequired,
  subtitle: string,
  authors: arrayOf(string).isRequired,
  format: string,
  covers: arrayOf(string),
  publisher: string.isRequired,
  incipit: string
});

export const userBookType = shape({
  review: string.isRequired,
  readingState: string.isRequired,
  rating_num: number.isRequired,
  bookInShelf: bool.isRequired,
  bookInWishlist: bool.isRequired 
});

export const ratingsType = shape({
  rating_num: number.isRequired,
  ratings_num: number
});