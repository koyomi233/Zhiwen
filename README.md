# Zhiwen Han 
# 20082239
Artboard Application

Three models: collection, picture, user

Relationship: “user” has “collection”, “collection” has “picture”

Function

GET

collection.findAll: get all the collections.

collection.findOneById: get one collection by id.

collection.findOneByName: get collections by name(support fuzzy searches).

collection.findCategory: get the category of one collection.

picture.findAll: get all the picture.

picture.findByName: get pictures by name(support fuzzy searches).

picture.findItsCollection: get the collection where the picture exists.

user.findAll: get all the users.

user.findOneById: get one user by id.

user.findByName: get users by name(support fuzzy sarches).

POST

collection.addCollection: add a collection.

picture.addPicture: add a picture, and the size of its collection should + 1.

user.addUser: add a user.

PUT

collection.incrementFollow: change the follow of the collection.

picture.addComment: add a comment to this picture

user.removeFollow: remove a follow from this user, and fan of the user who is followed should decrease.

user.addFollows: add a follow to this user, and the fan of the user who is followed should increase.

user.addBoards: add collections to user.

user.removeBoards: remove collections from user.

DELETE

collection.deleteCollection: delete a collection, and all the pictures in this collection are deleted too.

picture.deletePicture: delete a picture, and the size of its collection should decrease.

user.deleteUser: delete a user.

Persistence approach adopted

Data persistence: MongoDB connection in app.js, line 32. Two databases, whose URL are defined in server/_config.js, one for testing, one for storing data.

Git approach

Git for API testing: Go to the project root directory, and enter “$ git log”on command line.



