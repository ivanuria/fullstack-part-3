# Part 3

[Open the online APP](https://4f6y7l-3001.csb.app/)

This endpoint serve the phonebook app created in previous parts

Exercises 3.1 to 3.21

## PERSON OBJECT

**name**
: *String*, Name of the contact

**number**
: *String*, Phone Number of the contact


## ENDPOINTS

- [GET /info](#get-info)
- [GET /api/persons](#get-api-persons)
- [POST /api/persons](#post-api-persons)
- [GET /api/persons/{id}](#get-api-persons-id)
- [DELETE /api/persons/{id}](#delete-api-persons-id)
- [PUT /api/persons/{id}](#put-api-persons-id)

### <a id="get-info"></a>GET /info
Returns information of the stored contacts

### <a id="get-api-persons"></a>GET /api/persons
Returns all persons

### <a id="post-api-persons"></a>POST /api/persons
Adds new contact to persons

#### **Errors**

- **e0000**:
'name' and 'number' must be specified

- **e0001**:
'name' must be specified

- **e0002**:
'number' must be specified

- **e0003**:
'name' must be at least 3 characters long

- **e0004**:
'number' must be at least 8 characters long

- **e0005**:
'phone' must be of format XX-XXXXX... or XXX-XXXX...

- **e0010**:
'name' must be unique

### <a id="get-api-persons-id"></a>GET /api/persons/{id}
Returns contact with specified id

#### **Errors**

- **e0100**:
Malformed ID

### <a id="delete-api-persons-id"></a>DELETE /api/persons/{id}
Deletes contact with specified id

#### **Errors**

- **e0100**:
Malformed ID

### <a id="put-api-persons-id"></a>PUT /api/persons/{id}
Updates contact with specified id and informed data

#### **Errors**

- **e0000**:
'name' and 'number' must be specified

- **e0001**:
'name' must be specified

- **e0002**:
'number' must be specified

- **e0003**:
'name' must be at least 3 characters long

- **e0100**:
Malformed ID