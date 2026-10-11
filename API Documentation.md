ZUBAIR API Documentation
Comprehensive reference for the ZUBAIR REST API collection.
Base URL: {{URL}} (e.g. https://api.example.com)
Auth: Bearer JWT — set {{JWT}} in your environment. The login endpoint auto-saves the token via a test script.
Content-Type: application/json for all JSON bodies.




Table of Contents
Auth
Address
Upload
USER
Category
Sub Category
Brand
City
Products
Note
Discount
Coupon
Wishlist
Review
Influencer Review
Rating
Order
Config
Classification
SubClass
Zone
My Zone
Consultation
Free Consultation
Routen
Guide
Question
Banner
Suggest
CITY (v2)
Article
Develop
Are Available
Diagnosis
Market
Transaction
Payments




1. Auth
POST — Create Verification Code
POST {{URL}}/api/v1/auth/createVerificationCode
Sends a verification code to the user's phone (or email). No auth required.
Body


JSON








{
  "phone": "+201206703005"
  // OR "email": "user@example.com"
}


FieldTypeRequiredNotesphone





string





one of





E.164 format





email





string





one of





alternative to phone









POST — Create Verification Code Check
POST {{URL}}/api/v1/auth/createVerificationCodeCheck
Checks whether a verification code was already sent (pre-check). No auth required.
Body


JSON








{
  "phone": "+201550806171"
  // OR "email": "user@example.com"
}





POST — Signup (Full)
POST {{URL}}/api/v1/auth/signup
Registers a new user with full profile. No auth required.
Body


JSON








{
  "phone": "+201097980601",
  "name": "John Doe",
  "email": "john@example.com",
  "profileImg": "img-1748174312681.jpeg",
  "password": "123456",
  "role": "user"
}


FieldTypeRequiredNotesphone





string





yes





E.164 format





name





string





yes












email





string





no












profileImg





string





no





filename from Upload endpoint





password





string





yes












role





string





yes





admin, user, influencer, consultation, doctor, dataEntry





market





boolean





no





set true for influencer market









POST — Sign Up User (Simple)
POST {{URL}}/api/v1/auth/signUpUser
Simplified signup for regular users. No auth required.
Body


JSON








{
  "phone": "+201220115401",
  "name": "John",
  "password": "123456"
}





POST — Login
POST {{URL}}/api/v1/auth/login
Authenticates a user and returns an accessToken. The test script automatically saves it to {{JWT}}.
No auth required.
Body


JSON








{
  "phone": "+9647712617606",
  "password": "123456"
}


FieldTypeRequiredphone





string





yes





password





string





yes






Response — saves accessToken → {{JWT}}



POST — Verify Code
POST {{URL}}/api/v1/auth/verify
Verifies the OTP code sent to phone/email. No auth required.
Body


JSON








{
  "phone": "+201220115401",
  "code": "605227"
  // OR "email": "user@example.com"
}





POST — Change Password (Forgot)
POST {{URL}}/api/v1/auth/forgetPassword
Resets password using OTP code. No auth required.
Body


JSON








{
  "phone": "+201220115401",
  "code": "359336",
  "password": "newPassword"
}





POST — Logout
POST {{URL}}/api/v1/token/logout
Auth: Bearer {{JWT}}
Body


JSON








{
  "token": { "$gt": "" }
}





POST — Refresh Token
POST {{URL}}/api/v1/token
Auth: Bearer {{JWT}}
Body


JSON








{
  "token": "<refresh_token_string>"
}





POST — Check Password
POST {{URL}}/api/v1/users/checkPassword
Verifies the current user's password. Auth: Bearer {{JWT}}
Body


JSON








{
  "password": "123456"
}





PUT — Change My Password
PUT {{URL}}/api/v1/users/changeMyPassword
Updates the logged-in user's password. Auth: Bearer {{JWT}}
Body


JSON








{
  "password": "newPassword"
}





GET — Get Me
GET {{URL}}/api/v1/users/getMe
Returns the profile of the currently authenticated user. Auth: Bearer {{JWT}}



POST — Admin Reset Password
POST {{URL}}/api/v1/auth/adminResetPassword
Admin-only: resets any user's password. Auth: Bearer {{JWT}} (admin role)
Body


JSON








{
  "userId": "67c8317bc31eadfc41e016a9",
  "newPassword": "newPass"
}





2. Address
GET — Get User Addresses
GET {{URL}}/api/v1/addresses
Auth: Bearer {{JWT}} — returns addresses for the logged-in user.



POST — Add Address
POST {{URL}}/api/v1/addresses
Auth: Bearer {{JWT}}
Body


JSON








{
  "title": "home",
  "city": "موصل",
  "key": "MOS",
  "region": "سومر",
  "districtId": "1059",
  "description": "22 al street"
}


FieldTypeRequiredtitle





string





yes





city





string





yes





key





string





no





region





string





no





districtId





string





no





description





string





no









PUT — Update Address
PUT {{URL}}/api/v1/addresses/:id
Auth: Bearer {{JWT}} — :id is the address ObjectId.
Body


JSON








{
  "title": "home",
  "city": "baghdad",
  "region": "bable",
  "description": "22 al street"
}





DELETE — Remove Address
DELETE {{URL}}/api/v1/addresses/:id
Auth: Bearer {{JWT}} — :id is the address ObjectId.



3. Upload
POST — Upload Image
POST {{URL}}/api/v1/upload/image
Uploads a single image. No auth required. Returns a filename to use in other endpoints.
Body: form-data
KeyTypeRequiredimage





file





yes









POST — Upload Images (Multiple)
POST {{URL}}/api/v1/upload/images
Uploads multiple images. No auth required.
Body: form-data — multiple image file fields.



POST — Upload PDF
POST {{URL}}/api/v1/upload/pdf
Uploads a single PDF. No auth required.
Body: form-data
KeyTypepdf





file









POST — Upload PDFs (Multiple)
POST {{URL}}/api/v1/upload/pdfs
Uploads multiple PDFs. No auth required.



POST — Resize
POST {{URL}}/api/v1/upload/resize
Resizes an uploaded image. No auth required.



4. USER
All USER endpoints require Auth: Bearer {{JWT}}. Most require admin role.
GET — Get All Users
GET {{URL}}/api/v1/users
Auth: Bearer {{JWT}} (admin)
Query Params
ParamExampleNotesrole





doctor





Filter by role: admin, user, influencer, consultation, doctor, dataEntry





keyword





eslam





Search by name





createdAt[gte]





2025-05-25T13:10:37.510Z





Date range filter





createdAt[lte]





2025-05-25T13:10:37.510Z





Date range filter









GET — Get User by ID
GET {{URL}}/api/v1/users/:id
Auth: Bearer {{JWT}} (admin)



POST — Create User
POST {{URL}}/api/v1/users
Auth: Bearer {{JWT}} (admin)
Query Params
ParamExamplerole





admin









PUT — Update User (Admin)
PUT {{URL}}/api/v1/users/:id
Auth: Bearer {{JWT}} (admin)
Body


JSON








{
  "name": "newName"
}





PUT — Update Me
PUT {{URL}}/api/v1/users/updateMe
Updates the logged-in user's own profile. Auth: Bearer {{JWT}}
Body (partial update)


JSON








{
  "addresses": [
    {
      "titel": "home",
      "governorateAr": "بغداد",
      "governorateEn": "Baghdad",
      "governorateKu": "بەغدا"
    }
  ]
}





DELETE — Delete User (Admin)
DELETE {{URL}}/api/v1/users/:id
Auth: Bearer {{JWT}} (admin)



DELETE — Delete Me
DELETE {{URL}}/api/v1/users/deleteMe
Deletes the currently authenticated user's account. Auth: Bearer {{JWT}}



GET — Count All Users
GET {{URL}}/api/v1/users/count
Auth: Bearer {{JWT}} (admin)



5. Category
GET — Get All Categories
GET {{URL}}/api/v1/categories
No auth required.
Query Params
ParamExampleNoteskeyword





skin





Search by name





sort





-displayOrder,-createdAt





Sort order





brand





<brandId>





Filter by brand ID





limit





20





Results per page





page





1





Page number









POST — Create Category
POST {{URL}}/api/v1/categories
Auth: Bearer {{JWT}} (admin)
Body


JSON








{
  "name": "skin",
  "image": "img-1748174312681.jpeg",
  "description": "Category description"
}





GET — Get Category by ID
GET {{URL}}/api/v1/categories/:id
No auth required.



PUT — Update Category by ID
PUT {{URL}}/api/v1/categories/:id
Auth: Bearer {{JWT}} (admin)
Body


JSON








{
  "name": "Updated Name"
}





DELETE — Delete Category
DELETE {{URL}}/api/v1/categories/:id
Auth: Bearer {{JWT}} (admin)



GET — Get All Categories With Products
GET {{URL}}/api/v1/categories/withProducts
No auth required.



PUT — Bulk Update Products Category
PUT {{URL}}/api/v1/categories/bulkUpdate
Auth: Bearer {{JWT}} (admin)



PUT — Bulk Remove Products Category
PUT {{URL}}/api/v1/categories/bulkRemove
Auth: Bearer {{JWT}} (admin)



6. Sub Category
Same CRUD pattern as Category. Base path: {{URL}}/api/v1/subcategories
MethodEndpointAuthNotesGET





/subcategories





None





Supports keyword, sort, limit, page





POST





/subcategories





Admin JWT





Body: name, image, category (parent ID)





GET





/subcategories/:id





None












PUT





/subcategories/:id





Admin JWT












DELETE





/subcategories/:id





Admin JWT












GET





/subcategories/withCounts





None





Returns subcategories with product counts





PUT





/subcategories/bulkUpdate





Admin JWT
















7. Brand
Base path: {{URL}}/api/v1/brands
MethodEndpointAuthNotesGET





/brands





None





Supports keyword, sort, limit, page





POST





/brands





Admin JWT





Body: name, image





GET





/brands/:id





None












PUT





/brands/:id





Admin JWT












DELETE





/brands/:id





Admin JWT












GET





/brands/withProductCount





None
















8. City
Base path: {{URL}}/api/v1/cities
MethodEndpointAuthNotesGET





/cities





None












POST





/cities





Admin JWT





Body: name, key





GET





/cities/:id





None












PUT





/cities/:id





Admin JWT












DELETE





/cities/:id





Admin JWT












GET





/cities/live





None





Returns only active/live cities









9. Products
GET — Get All Products
GET {{URL}}/api/v1/products
No auth required.
Query Params
ParamExampleNotespage





1





Pagination





limit





20





Results per page





sort





-information.priceAfterDiscount





Sort field





keyword





cream





Full-text search





category





<categoryId>





Filter by category





brand





<brandId>





Filter by brand





discound[exists]





true





Only products with a discount





quantity[lte]





10





Low stock filter





information.price[gte]





1000





Min price





information.price[lte]





9000





Max price





newArrivals





true





New arrivals only









POST — Create Product
POST {{URL}}/api/v1/products
Auth: Bearer {{JWT}} (admin)
Body


JSON








{
  "name": "Product Name",
  "description": "Product description",
  "imageCover": "img-filename.jpeg",
  "images": ["img1.jpeg", "img2.jpeg"],
  "category": ["<categoryId>"],
  "subcategories": "<subcategoryId>",
  "brand": "<brandId>",
  "classification": "<classificationId>",
  "subClass": "<subClassId>",
  "discound": "<discountId>",
  "quantity": 100,
  "sold": 0,
  "price": 200,
  "howToUse": "Apply twice daily.",
  "warning": "For external use only.",
  "qrCode": "https://example.com/qr/product",
  "for": ["Women", "Men"],
  "components": ["Hyaluronic Acid", "Vitamin E"],
  "Skin": ["Dry", "Sensitive"],
  "hair": ["Dry", "Frizzy"],
  "newArriv": true,
  "trusted": true,
  "bestSeller": false,
  "Choose": true,
  "available": true,
  "keyWords": ["moisturizer", "skincare"]
}





GET — Get Product by ID
GET {{URL}}/api/v1/products/:id
No auth required.



PUT — Update Product by ID
PUT {{URL}}/api/v1/products/:id
Auth: Bearer {{JWT}} (admin)
Body — any subset of product fields, e.g.:


JSON








{
  "available": true
}





DELETE — Delete Product
DELETE {{URL}}/api/v1/products/:id
Auth: Bearer {{JWT}} (admin)



GET — Get Product Count
GET {{URL}}/api/v1/products/count
Auth: Bearer {{JWT}} (admin)



GET — Get All Discounts With Products
GET {{URL}}/api/v1/products/discounts
No auth required.



PUT — Update Product Short Link
PUT {{URL}}/api/v1/products/:id/shortlink
Auth: Bearer {{JWT}} (admin)



10. Note
Base path: {{URL}}/api/v1/notes — Auth: Bearer {{JWT}} for all.
MethodEndpointBody FieldsNotesPOST





/notes





title, content, user





Create a note





GET





/notes





—





Get all notes





GET





/notes/:id





—





Get note by ID





PUT





/notes/:id





title, content





Update note





DELETE





/notes/:id





—





Delete note









11. Discount
GET — Get All Discounts
GET {{URL}}/api/v1/discound
No auth required.
Query Params: keyword (search by name)



POST — Create Discount
POST {{URL}}/api/v1/discound
Auth: Bearer {{JWT}} (admin)
Body


JSON








{
  "name": "Summer Sale",
  "discound": "10",
  "image": "img-filename.jpeg",
  "start": "2024/11/8",
  "expire": "2025/12/9",
  "description": "10% off all products"
}


FieldTypeRequiredname





string





yes





discound





string/number





yes





image





string





no





start





date string





yes





expire





date string





yes





description





string





no









GET — Get Discount by ID
GET {{URL}}/api/v1/discound/:id
No auth required.



PUT — Update Discount
PUT {{URL}}/api/v1/discound/:id
Auth: Bearer {{JWT}} (admin)



DELETE — Delete Discount
DELETE {{URL}}/api/v1/discound/:id
Auth: Bearer {{JWT}} (admin)



POST — Validate Discount
POST {{URL}}/api/v1/discound/valid
Auth: Bearer {{JWT}}



GET — Discount Count
GET {{URL}}/api/v1/discound/count
Auth: Bearer {{JWT}} (admin)



12. Coupon
GET — Get All Coupons
GET {{URL}}/api/v1/coupon
Auth: Bearer {{JWT}} (admin)
Query Params: limit (default varies)



POST — Create Coupon
POST {{URL}}/api/v1/coupon
Auth: Bearer {{JWT}} (admin)
Body


JSON








{
  "name": "Summer Coupon",
  "code": "SUMMER10",
  "discound": 10,
  "start": "2024/11/8",
  "expire": "2025/12/9",
  "maxPrice": 1000,
  "maxUse": 3,
  "forAllUsers": true,
  "brand": "<brandId>"
  // "users": ["<userId>"],
  // "products": ["<productId>"],
  // "comtion": 10,
  // "influncer": "<influencerId>"
}


FieldTypeRequiredNotesname





string





yes












code





string





yes





Unique coupon code





discound





number





yes





Percentage





start





date





yes












expire





date





yes












maxPrice





number





no





Max discount amount





maxUse





number





no





Max uses per user





forAllUsers





boolean





no












brand





ObjectId





no





Restrict to brand





users





ObjectId[]





no





Restrict to specific users





products





ObjectId[]





no





Restrict to specific products









GET — Get Coupon by ID
GET {{URL}}/api/v1/coupon/:id
Auth: Bearer {{JWT}}



PUT — Update Coupon
PUT {{URL}}/api/v1/coupon/:id
Auth: Bearer {{JWT}} (admin)



DELETE — Delete Coupon
DELETE {{URL}}/api/v1/coupon/:id
Auth: Bearer {{JWT}} (admin)



GET — Get Coupon by Code
GET {{URL}}/api/v1/coupon/code/:code
Auth: Bearer {{JWT}}



GET — User Coupons
GET {{URL}}/api/v1/coupon/user
Auth: Bearer {{JWT}} — returns coupons available to the logged-in user.



13. Wishlist
GET — Get All Wishlist
GET {{URL}}/api/v1/wishlist
Auth: Bearer {{JWT}} — returns the logged-in user's wishlist.



POST — Add Product to Wishlist
POST {{URL}}/api/v1/wishlist
Auth: Bearer {{JWT}}
Body


JSON








{
  "productId": "<productId>"
}





DELETE — Remove Product from Wishlist
DELETE {{URL}}/api/v1/wishlist/:productId
Auth: Bearer {{JWT}}



14. Review
GET — Get All Reviews
GET {{URL}}/api/v1/reviews
Auth: Bearer {{JWT}}



POST — Create Review
POST {{URL}}/api/v1/reviews
Auth: Bearer {{JWT}}
Body


JSON








{
  "product": "<productId>",
  "name": "Great product",
  "details": "Really loved it",
  "ratings": 4
}


FieldTypeRequiredNotesproduct





ObjectId





yes












name





string





yes





Review title





details





string





no












ratings





number





yes





1–5









GET — Get Review by ID
GET {{URL}}/api/v1/reviews/:id
Auth: Bearer {{JWT}}



PUT — Update Review
PUT {{URL}}/api/v1/reviews/:id
Auth: Bearer {{JWT}} — owner only.



DELETE — Delete Review
DELETE {{URL}}/api/v1/reviews/:id
Auth: Bearer {{JWT}} — owner or admin.



GET — Get Review Stats
GET {{URL}}/api/v1/reviews/stats
Auth: Bearer {{JWT}}



15. Influencer Review
Same structure as Review. Base path: {{URL}}/api/v1/influencerReviews
Auth: Bearer {{JWT}} for all.
MethodEndpointNotesGET





/influencerReviews












POST





/influencerReviews





Body: product, name, details, ratings





GET





/influencerReviews/:id












PUT





/influencerReviews/:id












DELETE





/influencerReviews/:id












GET





/influencerReviews/stats
















16. Rating
GET — Get All Ratings
GET {{URL}}/api/v1/rating
Auth: Bearer {{JWT}}



POST — Create Rating
POST {{URL}}/api/v1/rating
Auth: Bearer {{JWT}}
Body


JSON








{
  "order": "<orderId>",
  "title": "Great service",
  "details": "Very fast delivery",
  "ratings": 4
}


FieldTypeRequiredNotesorder





ObjectId





yes





The order being rated





title





string





yes












details





string





no












ratings





number





yes





1–5









GET — Get Rating by ID
GET {{URL}}/api/v1/rating/:id
Auth: Bearer {{JWT}}



PUT — Update Rating
PUT {{URL}}/api/v1/rating/:id
Auth: Bearer {{JWT}}



DELETE — Delete Rating
DELETE {{URL}}/api/v1/rating/:id
Auth: Bearer {{JWT}}



DELETE — Delete All Ratings
DELETE {{URL}}/api/v1/rating/deleteAll
Auth: Bearer {{JWT}} (admin)



17. Order
GET — Get All Orders
GET {{URL}}/api/v1/orders
Auth: Bearer {{JWT}}
Query Params
ParamExampleNoteslimit





50





Results per page





sort





-createdAt





Sort order





user





<userId>





Filter by user





keyword





NIFFFFFFF





Search by user name





fields





status,user





Select specific fields









GET — Get Order by ID
GET {{URL}}/api/v1/orders/:id
Auth: Bearer {{JWT}}



POST — Create Order
POST {{URL}}/api/v1/orders
Auth: Bearer {{JWT}}
Body


JSON








{
  "address": {
    "title": "Home",
    "city": "موصل",
    "region": "سومر",
    "description": "Street details"
  },
  "cartItems": [
    {
      "product": "<productId>",
      "quantity": 1,
      "price": 7000
    }
  ],
  "calculatedPrice": 7000,
  "shippingPrice": 5000,
  "paymentMethodType": "cash"
}


FieldTypeRequiredNotesaddress





object





yes





Delivery address





cartItems





array





yes





Array of {product, quantity, price}





calculatedPrice





number





yes





Total items price





shippingPrice





number





yes












paymentMethodType





string





yes





cash or online









PUT — Update Order Status
PUT {{URL}}/api/v1/orders/:id/status
Auth: Bearer {{JWT}} (admin)
Body


JSON








{
  "status": "delivered"
}


Status values: pending, processing, shipped, delivered, cancelled



PUT — Update Order
PUT {{URL}}/api/v1/orders/:id
Auth: Bearer {{JWT}} (admin)



GET — Orders Between Dates
GET {{URL}}/api/v1/orders/betweenDates
Auth: Bearer {{JWT}} (admin)
Query Params: startDate, endDate



GET — Count All Orders
GET {{URL}}/api/v1/orders/count
Auth: Bearer {{JWT}} (admin)



GET — Get Order Summary
GET {{URL}}/api/v1/orders/summary
Auth: Bearer {{JWT}} (admin)



GET — Get Dashboard Stats
GET {{URL}}/api/v1/orders/dashboardStats
Auth: Bearer {{JWT}} (admin)



POST — Calculate Price After Coupon
POST {{URL}}/api/v1/orders/calculatePrice
Auth: Bearer {{JWT}}



GET — Get User Dashboard Stats
GET {{URL}}/api/v1/orders/userDashboard
Auth: Bearer {{JWT}}



POST — Create Shipment
POST {{URL}}/api/v1/orders/:id/shipment
Auth: Bearer {{JWT}} (admin)



POST — Create Shipments (All Waiting)
POST {{URL}}/api/v1/orders/shipments/waiting
Auth: Bearer {{JWT}} (admin)



PUT — Update Status and Price
PUT {{URL}}/api/v1/orders/:id/statusAndPrice
Auth: Bearer {{JWT}} (admin)



PUT — Update Waiting to In Progress
PUT {{URL}}/api/v1/orders/waitingToInProgress
Auth: Bearer {{JWT}} (admin)



POST — Retry Payment
POST {{URL}}/api/v1/orders/:id/retryPayment
Auth: Bearer {{JWT}}



18. Config
Base path: {{URL}}/api/v1/config
MethodEndpointAuthNotesGET





/config





None





Get all config





POST





/config





Admin JWT





Create config





GET





/config/:id





None





Get config by ID





PUT





/config/:id





Admin JWT





Update config





DELETE





/config/:id





Admin JWT





Delete config









19. Classification
Base path: {{URL}}/api/v1/classification
MethodEndpointAuthNotesGET





/classification





None












POST





/classification





Admin JWT





Body: name, image





GET





/classification/:id





None












PUT





/classification/:id





Admin JWT












DELETE





/classification/:id





Admin JWT












GET





/classification/withCounts





None





With product counts









20. SubClass
Base path: {{URL}}/api/v1/subclass
MethodEndpointAuthNotesGET





/subclass





None












POST





/subclass





Admin JWT





Body: name, classification





GET





/subclass/:id





None












PUT





/subclass/:id





Admin JWT












DELETE





/subclass/:id





Admin JWT












GET





/subclass/withProductCount





None












PUT





/subclass/bulkUpdate





Admin JWT
















21. Zone
Base path: {{URL}}/api/v1/zone
MethodEndpointAuthNotesGET





/zone





None












POST





/zone





Admin JWT





Body: name, cities





GET





/zone/:id





None












PUT





/zone/:id





Admin JWT












DELETE





/zone/:id





Admin JWT












GET





/zone/stats





Admin JWT





Zone statistics









22. My Zone
Base path: {{URL}}/api/v1/myzone — Auth: Bearer {{JWT}} for all.
MethodEndpointNotesGET





/myzone





Get all zones for logged-in user





POST





/myzone





Create zone assignment





GET





/myzone/:id












PUT





/myzone/:id












DELETE





/myzone/:id
















23. Consultation
GET — Get All Consultations
GET {{URL}}/api/v1/consultation
Auth: Bearer {{JWT}}
Query Params
ParamExampleNoteskeyword





test





Search





doctor





<doctorId>





Filter by doctor





status





completed





completed, pending, scheduled









POST — Create Consultation
POST {{URL}}/api/v1/consultation
Auth: Bearer {{JWT}}
Body


JSON








{
  "name": "Ali",
  "condition": "skin issue",
  "phone": "+201206703005",
  "doctor": "<doctorId>",
  "age": 25,
  "skinProblem": ["dryness", "acne"],
  "skinType": "oily",
  "sensetiveSkin": "yes",
  "hairProblem": ["hair loss"],
  "hairType": "dry",
  "prgnet": "notPregnant",
  "doctorType": ["dermatologist"],
  "brandsUsed": "sunsilk",
  "favoriteBrands": "clear",
  "time": "afternoon",
  "day": "sunday"
}


FieldTypeAllowed ValuessensetiveSkin





string





yes, No, dontKnow





prgnet





string





pregnant, breastfeeding, notPregnant





time





string





morning, afternoon, evening, night





day





string





saturday, sunday, monday, tuesday, wednesday, thursday, friday





status





string





completed, pending, scheduled









GET — Get Consultation by ID
GET {{URL}}/api/v1/consultation/:id
Auth: Bearer {{JWT}}



PUT — Update Consultation
PUT {{URL}}/api/v1/consultation/:id
Auth: Bearer {{JWT}}



DELETE — Delete Consultation
DELETE {{URL}}/api/v1/consultation/:id
Auth: Bearer {{JWT}} (admin)



POST — Create Consultation Payment
POST {{URL}}/api/v1/consultation/payment
Auth: Bearer {{JWT}}
Body


JSON








{
  "consultationId": "<consultationId>"
}





POST — Retry Consultation Payment
POST {{URL}}/api/v1/consultation/retryPayment
Auth: Bearer {{JWT}}



GET — Check Consultation Payment
GET {{URL}}/api/v1/consultation/checkPayment
Auth: Bearer {{JWT}}



24. Free Consultation
Base path: {{URL}}/api/v1/freeConsultation — Auth: Bearer {{JWT}} for all.
MethodEndpointNotesGET





/freeConsultation












POST





/freeConsultation





Body: name, phone, condition, doctor





GET





/freeConsultation/:id












PUT





/freeConsultation/:id












DELETE





/freeConsultation/:id












GET





/freeConsultation/stats





Statistics









25. Routen
Base path: {{URL}}/api/v1/routen — Auth: Bearer {{JWT}} (admin) for write operations.
MethodEndpointNotesGET





/routen












POST





/routen





Body: name, zones





GET





/routen/:id












PUT





/routen/:id












DELETE





/routen/:id
















26. Guide
Base path: {{URL}}/api/v1/guide
MethodEndpointAuthNotesGET





/guide





None












POST





/guide





Admin JWT





Body: title, content, image





GET





/guide/:id





None












PUT





/guide/:id





Admin JWT












DELETE





/guide/:id





Admin JWT
















27. Question
Base path: {{URL}}/api/v1/questions
MethodEndpointAuthNotesGET





/questions





None












POST





/questions





Admin JWT





Body: question, answer





GET





/questions/:id





None












PUT





/questions/:id





Admin JWT












DELETE





/questions/:id





Admin JWT
















28. Banner
Base path: {{URL}}/api/v1/banar
MethodEndpointAuthNotesGET





/banar





None












POST





/banar





Admin JWT





Body: image, link, title





GET





/banar/:id





None












PUT





/banar/:id





Admin JWT












DELETE





/banar/:id





Admin JWT
















29. Suggest
Base path: {{URL}}/api/v1/suggest — Auth: Bearer {{JWT}} for all.
MethodEndpointNotesGET





/suggest












POST





/suggest





Body: title, details





GET





/suggest/:id












PUT





/suggest/:id












DELETE





/suggest/:id
















30. CITY (v2)
Base path: {{URL}}/api/v1/city (second city module)
MethodEndpointAuthNotesGET





/city





None












POST





/city





Admin JWT





Body: name, key





GET





/city/:id





None












PUT





/city/:id





Admin JWT












DELETE





/city/:id





Admin JWT
















31. Article
Base path: {{URL}}/api/v1/articles
MethodEndpointAuthNotesGET





/articles





None












POST





/articles





Admin JWT





Body: title, content, image





GET





/articles/:id





None












PUT





/articles/:id





Admin JWT












DELETE





/articles/:id





Admin JWT
















32. Develop
Base path: {{URL}}/api/v1/develop — Auth: Bearer {{JWT}} (admin) for write.
MethodEndpointNotesGET





/develop












POST





/develop





Body: title, description, image





GET





/develop/:id












PUT





/develop/:id












DELETE





/develop/:id
















33. Are Available
Base path: {{URL}}/api/v1/available — Auth: Bearer {{JWT}} for all.
MethodEndpointNotesGET





/available





Get logged-in user's available products





POST





/available





Body: productId — add product





DELETE





/available/:productId





Remove product from available list









34. Diagnosis
Base path: {{URL}}/api/v1/diagnosis — Auth: Bearer {{JWT}} for all.
MethodEndpointNotesGET





/diagnosis












POST





/diagnosis





Body: user, condition, products





GET





/diagnosis/:id












PUT





/diagnosis/:id












DELETE





/diagnosis/:id
















35. Market
GET — Get All Markets
GET {{URL}}/api/v1/market
Auth: Bearer {{JWT}}



POST — Create Market
POST {{URL}}/api/v1/market
No auth required.
Body


JSON








{
  "user": "<userId>",
  "prodacts": []
}





GET — Get Market by ID
GET {{URL}}/api/v1/market/:id
Auth: Bearer {{JWT}}



PUT — Update Market
PUT {{URL}}/api/v1/market/:id
Auth: Bearer {{JWT}}



DELETE — Delete Market
DELETE {{URL}}/api/v1/market/:id
Auth: Bearer {{JWT}} (admin)



GET — Get Market Products
GET {{URL}}/api/v1/market/:id/products
Auth: Bearer {{JWT}}



POST — Add Product to Market
POST {{URL}}/api/v1/market/:id/products
Auth: Bearer {{JWT}}



GET — Number of Markets
GET {{URL}}/api/v1/market/count
Auth: Bearer {{JWT}} (admin)



36. Transaction
GET — Get All Transactions
GET {{URL}}/api/v1/transaction
Auth: Bearer {{JWT}}
Query Params
ParamExampleNotesuser





<userId>





Filter by user





type





income





income or expense





createdAt[gte]





2025-06-29T08:37:45.701Z





Date range





createdAt[lte]





2025-06-29T08:37:45.701Z





Date range









POST — Create Transaction
POST {{URL}}/api/v1/transaction
Auth: Bearer {{JWT}}
Body


JSON








{
  "user": "<userId>",
  "type": "expense",
  "Amount": 35000,
  "status": true,
  "consultation": ["<consultationId>"]
}


FieldTypeAllowed Valuestype





string





income, expense





status





boolean
















GET — Get Transaction by ID
GET {{URL}}/api/v1/transaction/:id
Auth: Bearer {{JWT}}



PUT — Update Transaction
PUT {{URL}}/api/v1/transaction/:id
Auth: Bearer {{JWT}} (admin)



DELETE — Delete Transaction
DELETE {{URL}}/api/v1/transaction/:id
Auth: Bearer {{JWT}} (admin)



GET — Get Month Growth
GET {{URL}}/api/v1/transaction/monthGrowth
Auth: Bearer {{JWT}}



GET — Get Monthly Income Transactions
GET {{URL}}/api/v1/transaction/monthlyIncome
Auth: Bearer {{JWT}}



GET — Get Doctor Dashboard Stats
GET {{URL}}/api/v1/transaction/doctorStats
Auth: Bearer {{JWT}} (doctor role)



GET — Get Influencer Dashboard Stats
GET {{URL}}/api/v1/transaction/influencerStats
Auth: Bearer {{JWT}} (influencer role)



37. Payments
POST — Payments
POST {{URL}}/api/v1/payments
Auth: Bearer {{JWT}} — initiates a payment flow.



POST — Create Shipments (External)
POST https://tl.logisty-iq.com/tl/webapi/external/create-shipments/
External logistics API — creates shipments via Logisty IQ.



Role Reference
RoleDescriptionadmin





Full access to all endpoints





user





Standard customer





influencer





Can manage market and earn commissions





consultation





Can book and manage consultations





doctor





Handles consultations, has doctor dashboard





dataEntry





Limited data entry access









Environment Variables
VariableDescription{{URL}}





Base API URL (e.g. https://api.example.com)





{{JWT}}





Bearer token — auto-set by the login request test script








