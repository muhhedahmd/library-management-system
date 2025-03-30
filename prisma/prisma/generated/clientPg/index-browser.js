
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 6.4.1
 * Query Engine version: a9055b89e58b4b5bfb59600785423b1db3d0e75d
 */
Prisma.prismaVersion = {
  client: "6.4.1",
  engine: "a9055b89e58b4b5bfb59600785423b1db3d0e75d"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.NotificationScalarFieldEnum = {
  id: 'id',
  notifierId: 'notifierId',
  notifyingId: 'notifyingId',
  type: 'type',
  read: 'read',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  gender: 'gender',
  name: 'name',
  email: 'email',
  password: 'password',
  role: 'role',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.ProfileScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  bio: 'bio',
  phoneNumber: 'phoneNumber',
  isVerified: 'isVerified',
  birthdate: 'birthdate',
  title: 'title',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  website: 'website'
};

exports.Prisma.ProfilePictureScalarFieldEnum = {
  id: 'id',
  url: 'url',
  publicId: 'publicId',
  assetId: 'assetId',
  width: 'width',
  height: 'height',
  format: 'format',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  secureUrl: 'secureUrl',
  publicUrl: 'publicUrl',
  assetFolder: 'assetFolder',
  displayName: 'displayName',
  tags: 'tags',
  hashBlur: 'hashBlur',
  profileId: 'profileId'
};

exports.Prisma.BookScalarFieldEnum = {
  id: 'id',
  title: 'title',
  description: 'description',
  isbn: 'isbn',
  authorId: 'authorId',
  userId: 'userId',
  publisherId: 'publisherId',
  categoryId: 'categoryId',
  fileUrl: 'fileUrl',
  fileSize: 'fileSize',
  fileFormat: 'fileFormat',
  language: 'language',
  pages: 'pages',
  key: 'key',
  fileHash: 'fileHash',
  publishedAt: 'publishedAt',
  price: 'price',
  available: 'available',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  keywords: 'keywords',
  popularity: 'popularity',
  averageRating: 'averageRating',
  totalRatings: 'totalRatings',
  totalFavorites: 'totalFavorites'
};

exports.Prisma.BookCoverScalarFieldEnum = {
  id: 'id',
  fileUrl: 'fileUrl',
  name: 'name',
  fileSize: 'fileSize',
  width: 'width',
  height: 'height',
  fileFormat: 'fileFormat',
  key: 'key',
  type: 'type',
  fileHash: 'fileHash',
  blurHash: 'blurHash',
  bookId: 'bookId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RatingScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  bookId: 'bookId',
  rating: 'rating',
  review: 'review',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.FavoriteScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  bookId: 'bookId',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.LoanScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  bookId: 'bookId',
  loanDate: 'loanDate',
  dueDate: 'dueDate',
  returnDate: 'returnDate',
  status: 'status'
};

exports.Prisma.AuthorScalarFieldEnum = {
  id: 'id',
  name: 'name',
  bio: 'bio',
  nationality: 'nationality',
  birthdate: 'birthdate',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  popularity: 'popularity'
};

exports.Prisma.PublisherScalarFieldEnum = {
  id: 'id',
  name: 'name',
  website: 'website',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  parentId: 'parentId'
};

exports.Prisma.ReadingHistoryScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  bookId: 'bookId',
  startedAt: 'startedAt',
  lastReadAt: 'lastReadAt',
  finishedAt: 'finishedAt',
  pagesRead: 'pagesRead',
  readingTimeMinutes: 'readingTimeMinutes',
  completed: 'completed',
  abandonedAt: 'abandonedAt',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.UserPreferenceScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  categoryId: 'categoryId',
  authorId: 'authorId',
  weight: 'weight',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.RecommendationLogScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  bookId: 'bookId',
  algorithm: 'algorithm',
  score: 'score',
  clicked: 'clicked',
  interacted: 'interacted',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt'
};

exports.Prisma.PurchaseScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  bookId: 'bookId',
  purchaseDate: 'purchaseDate',
  price: 'price',
  quantity: 'quantity',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  checkoutId: 'checkoutId'
};

exports.Prisma.BillingAddressScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  street: 'street',
  city: 'city',
  state: 'state',
  postalCode: 'postalCode',
  country: 'country',
  CheckoutId: 'CheckoutId'
};

exports.Prisma.CheckoutScalarFieldEnum = {
  id: 'id',
  userId: 'userId',
  checkoutDate: 'checkoutDate',
  dueDate: 'dueDate',
  returnDate: 'returnDate',
  totalPrice: 'totalPrice'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullableJsonNullValueInput = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull
};

exports.Prisma.QueryMode = {
  default: 'default',
  insensitive: 'insensitive'
};

exports.Prisma.JsonNullValueFilter = {
  DbNull: Prisma.DbNull,
  JsonNull: Prisma.JsonNull,
  AnyNull: Prisma.AnyNull
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.NotificationType = exports.$Enums.NotificationType = {
  LIKE: 'LIKE',
  COMMENT: 'COMMENT',
  FOLLOW: 'FOLLOW',
  MESSAGE: 'MESSAGE'
};

exports.GENDER = exports.$Enums.GENDER = {
  MALE: 'MALE',
  FEMALE: 'FEMALE'
};

exports.UserRole = exports.$Enums.UserRole = {
  MEMBER: 'MEMBER',
  ADMIN: 'ADMIN'
};

exports.bookcoverType = exports.$Enums.bookcoverType = {
  THUMBNAIL: 'THUMBNAIL',
  Image: 'Image'
};

exports.LoanStatus = exports.$Enums.LoanStatus = {
  ACTIVE: 'ACTIVE',
  RETURNED: 'RETURNED'
};

exports.Prisma.ModelName = {
  Notification: 'Notification',
  User: 'User',
  Profile: 'Profile',
  ProfilePicture: 'ProfilePicture',
  Book: 'Book',
  bookCover: 'bookCover',
  Rating: 'Rating',
  Favorite: 'Favorite',
  Loan: 'Loan',
  Author: 'Author',
  Publisher: 'Publisher',
  Category: 'Category',
  ReadingHistory: 'ReadingHistory',
  UserPreference: 'UserPreference',
  RecommendationLog: 'RecommendationLog',
  purchase: 'purchase',
  billingAddress: 'billingAddress',
  Checkout: 'Checkout'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
