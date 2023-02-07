## Profile in Yoldi REST API docs

#### Authorization

<!-- SignIn -->

<details>
<summary> <code>POST</code>  <code>public</code> <code> <b>/v1/auth/login</b> </code> <code>(sign in system)</code> </summary>

##### Headers
- Content-Type: application/json  
  
##### Body

```
  {
    email: string
    password: string
  }
```

##### Responses

Status <b>200</b> (Ok)

```
  {
    user: {
      id: string
      name: string
      nickname: string
      email: string
      description: string
      avatarId: string
      headerId: string
    }
    tokens: {
      accessToken: string
      refreshToken: string
    }
  }
```

Status <b>401</b> (Unauthorized) - invalid input data

```
  {
    statusCode: number
    message: string
  }
```

##### Example cURL

> ```javascript
>  curl --location --request POST 'http://localhost:3000/v1/auth/login' --header 'Content-Type: application/json' --data-raw '{ "email": "email@gmail.com", "password": "password" }'
> ```

</details>

<!-- Logout -->

<details>
<summary> <code>POST</code> <code> <b>/v1/auth/logout</b> </code> <code>(logout from system)</code> </summary>

##### Headers
- Authorization: Bearer
- Content-Type: application/json
  
##### Body

```
  {
    refreshToken: string
    accessToken: string
  }
```

##### Responses

Status <b>200</b> (Ok)

```
  {
    statusCode: number
    message: string
  }
```
  
Status <b>401</b> (Unauthorized) - access token not valid

```
  {
    statusCode: number
    message: string
  }
```

##### Example cURL

> ```javascript
>  curl --location --request POST 'http://localhost:3000/v1/auth/logout' --header 'Authorization: Bearer access-token' --header 'Content-Type: application/json' --data-raw '{ "accessToken": "accessToken", "refreshToken": "refreshToken" }'
> ```

</details>

<!-- Refresh token -->

<details>
<summary> <code>POST</code> <code> <b>/v1/auth/refresh</b> </code> <code>(update access user data)</code> </summary>

##### Headers
- Authorization: Bearer
- Content-Type: application/json  
  
##### Body

```
  {
    refreshToken: string
  }
```

##### Responses

Status <b>200</b> (Ok)

```
  {
    user: {
      id: string
      name: string
      nickname: string
      email: string
      description: string
      avatarId: string
      headerId: string
    }
    tokens: {
      accessToken: string
      refreshToken: string
    }
  }
```

Status <b>403</b> (Forbiddent) - overdue refresh token  

```
  {
    statusCode: number
    message: string
  }
```
  
Status <b>404</b> (Not found) - user not found  

```
  {
    statusCode: number
    message: string
  }
```

##### Example cURL

> ```javascript
>  curl --location --request POST 'http://localhost:3000/v1/auth/login' --header 'Authorization: Bearer access-token' --header 'Content-Type: application/json' --data-raw '{ "refreshToken": "refreshToken" }'
> ```

</details>

------------------------------------------------------------------------------------------

#### Users

<!-- Get users list -->

<details>
<summary> <code>GET</code> <code> <b>/v1/users</b> </code> <code>(get users list)</code> </summary>

##### Parametrs 
  
```
  {
    page: number
    limit: number
  }
```
  
##### Headers
- Authorization: Bearer

##### Responses

Status <b>200</b>

```
  {
    users: {
      id: string
      name: string
      nickname: string
      email: string
      avatarId: string
    }[]
    amount: number
  }
```
  
Status <b>401</b> (Unauthorized) - access token not valid

```
  {
    statusCode: number
    message: string
  }
```

##### Example cURL

> ```javascript
>  curl --location --request GET 'http://localhost:3000/v1/users?page=1&limit=20' --header 'Authorization: Bearer access-token'
> ```

</details>

<!-- Get user -->

<details>
  <summary> <code>GET</code> <code> <b>/v1/users/<i>{nickname}</i></b> </code> <code>(get user by nickname)</code> </summary>

##### Headers
- Authorization: Bearer
  
##### Responses

###### 200 (Ok)

```
  {
    id: string
    name: string
    nickname: string
    email: string
    avatarId: string
    headerId: string
  }
```
  
Status <b>401</b> (Unauthorized) - access token not valid 

```
  {
    statusCode: number
    message: string
  }
```
  
Status <b>404</b> (Not found) - user not found 

```
  {
    statusCode: number
    message: string
  }
```

##### Example cURL

> ```javascript
>  curl --location --request GET 'http://localhost:3000/v1/users' --header 'Authorization: Bearer access-token'
> ```

</details>

<!-- Create -->

<details>
<summary> <code>POST</code> <code>public</code> <code> <b>/v1/users/register</b> </code> <code>(create new user)</code> </summary>

##### Headers
- Content-Type: application/json  
  
##### Body

```
  {
    name: string
    email: string
    password: string
  }
```

##### Responses

Status <b>201</b> (Created)

```
  {
    statusCode: number
    message: string
  }
```
  
Status <b>400</b> (Bad request) - invalid data or a user with this mail already exists

```
  {
    statusCode: number
    message: string
  }
```

##### Example cURL

> ```javascript
>  curl --location --request POST 'http://localhost:3000/v1/users/register' --header 'Content-Type: application/json' --data-raw '{ "email": "email@gmail.com", "name": "name", "password": "password" }'
> ```

</details>

<!-- Update user -->

<details>
<summary> <code>POST</code> <code> <b>/users/update</b> </code> <code>(update user data)</code> </summary>

##### Headers
- Authorization: Bearer
- Content-Type: application/json  
  
##### Body

```
  {
    name?: string
    nickname?: string
    description?: string
  }
```

##### Responses

Status <b>200</b> (Ok)

```
  {
    name: string
    nickname: string
    description: string
  }
```
  
Status <b>400</b> (Bad request) - invalid data or a user with this nickname already exists

```
  {
    statusCode: number
    message: string
  }
```
  
Status <b>401</b> (Unauthorized) - access token not valid   

```
  {
    statusCode: number
    message: string
  }
```
  
Status <b>404</b> (Not found) - user not found   

```
  {
    statusCode: number
    message: string
  }
```
  
  
##### Example cURL

> ```javascript
>  curl --location --request POST 'http://localhost:3000/v1/users/update' --header 'Authorization: Bearer access-token' --header 'Content-Type: application/json' --data-raw '{ "name": "name", "nickname": "nickname", "description": "description" }'
> ```

</details>

<!-- Update avatar -->

<details>
<summary> <code>POST</code> <code> <b>/v1/users/update/avatar</b> </code> <code>(update avatar image)</code> </summary>

##### Headers
- Authorization: Bearer
- Content-Type: application/json  
  
##### Form

```
  {
    avatar: file
  }
```

##### Responses

Status <b>200</b> (Ok) 

```
  {
    statusCode: number
    message: string
  }
```
  
Status <b>401</b> (Unauthorized) - access token not valid   

```
  {
    statusCode: number
    message: string
  }
```
  
Status <b>404</b> (Not found) - user not found   

```
  {
    statusCode: number
    message: string
  }
```

##### Example cURL

> ```javascript
> curl --location --request POST 'http://localhost:3000/v1/users/update/avatar' --header 'Authorization: Bearer access-token' --form 'avatar=@"image.jpg"'
> ```

</details>

<!-- Update header -->

<details>
<summary> <code>POST</code> <code> <b>/v1/users/update/header</b> </code> <code>(update header image)</code> </summary>

##### Headers
- Authorization: Bearer
- Content-Type: application/json  
  
##### Form

```
  {
    header: file
  }
```

##### Responses

Status <b>200</b> (Ok) 

```
  {
    statusCode: number
    message: string
  }
```
  
Status <b>401</b> (Unauthorized) - access token not valid  

```
  {
    statusCode: number
    message: string
  }
```
  
Status <b>404</b> (Not found) - user not found   

```
  {
    statusCode: number
    message: string
  }
```

##### Example cURL

> ```javascript
> curl --location --request POST 'http://localhost:3000/v1/usersupdate/header' --header 'Authorization: Bearer access-token' --form 'avatar=@"image.jpg"'
> ```

</details>
