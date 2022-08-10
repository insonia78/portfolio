<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/
$api = app('Dingo\Api\Routing\Router');

// Publicly accessible routes
$api->version('v1', [], function ($api) {
    // route that returns details about the current logged in user
    $api->get('/user-context', ['uses' => 'App\Http\Controllers\UserContextController@details', 'middleware' => 'auth']);
  
  /**
   * Show all centers
   *
   * Get a JSON representation of all centers
   *
   * @Get("/centers")
   * @Transaction({
   *     @Response(200, attributes={
   *          @Attribute("id", type="number", description="The id of the center.", sample=1),
   *          @Attribute("label", type="string", description="The label of the center.  Used for identification and url generation.", sample="example-center"),
   *          @Attribute("name", type="string", description="The name of the center.", sample="Example Center"),
   *          @Attribute("type", type="string", description="The type of center. Either local or online.", sample="local"),
   *          @Attribute("streetAddress", type="string", description="The street address of the center.", sample="123 Main St."),
   *          @Attribute("city", type="string", description="The city in which the center is located.", sample="Philadelphia"),
   *          @Attribute("state", type="string", description="The locality (state, province, etc.) in which the center is located. Presented as the ISO 3166-2 abbreviation without the Country prefix.", sample="PA"),
   *          @Attribute("postalCode", type="string", description="The postal code of the center.", sample="16841"),
   *          @Attribute("country", type="string", description="The country in which the center is located.  Presented as the ISO 3166-2 abbreviation.", sample="US"),
   *          @Attribute("phone", type="string", description="The primary phone number of the center.", sample="444-555-6666"),
   *          @Attribute("fax", type="string", description="The fax number of the center.", sample="444-555-6666"),
   *          @Attribute("email", type="string", description="The contact email for the center.", sample="example@centerspidersmart.com"),
   *          @Attribute("facebook", type="string", description="The facebook page of the center.  This is the suffix part of the url for the facebook page.", sample="example-center"),
   *          @Attribute("twitter", type="string", description="The twitter handle of the center twitter account.  This will not include the '@' symbol.", sample="example-center"),
   *          @Attribute("dateFrom", type="date", description="The date on which this center became active.", sample="2018-01-01"),
   *          @Attribute("dateTo", type="date", description="The date on which this center became inactive.", sample="2018-01-01"),
   *          @Attribute("active", type="boolean", description="The current active status of the center.", sample="true"),
   *          @Attribute("books", type="array", description="The array of books that are currently in the center inventory. Please see [url] for more information.", sample="http://www.google.com/array")
   *     }),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->get('/centers', ['resolver' => 'Center@getAll', 'uses' => 'App\Http\Controllers\RestController@retrieve']);

  /**
   * Show a center
   *
   * Get a JSON representation of one center given an id
   *
   * @Get("/centers/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the center to retrieve."),
   *     @Parameter("showDeleted", type="boolean", required=false, description="If the query parameter 'showDeleted' is set to true, it will show deleted information (enrollments, books, etc.) about the center as well.")
   * })
   * @Transaction({
   *     @Request("id=1"),
   *     @Response(200, attributes={
   *          @Attribute("id", type="number", description="The id of the center.", sample=1),
   *          @Attribute("label", type="string", description="The label of the center.  Used for identification and url generation.", sample="example-center"),
   *          @Attribute("name", type="string", description="The name of the center.", sample="Example Center"),
   *          @Attribute("type", type="string", description="The type of center. Either local or online.", sample="local"),
   *          @Attribute("streetAddress", type="string", description="The street address of the center.", sample="123 Main St."),
   *          @Attribute("city", type="string", description="The city in which the center is located.", sample="Philadelphia"),
   *          @Attribute("state", type="string", description="The locality (state, province, etc.) in which the center is located. Presented as the ISO 3166-2 abbreviation without the Country prefix.", sample="PA"),
   *          @Attribute("postalCode", type="string", description="The postal code of the center.", sample="16841"),
   *          @Attribute("country", type="string", description="The country in which the center is located.  Presented as the ISO 3166-2 abbreviation.", sample="US"),
   *          @Attribute("phone", type="string", description="The primary phone number of the center.", sample="444-555-6666"),
   *          @Attribute("fax", type="string", description="The fax number of the center.", sample="444-555-6666"),
   *          @Attribute("email", type="string", description="The contact email for the center.", sample="example@centerspidersmart.com"),
   *          @Attribute("facebook", type="string", description="The facebook page of the center.  This is the suffix part of the url for the facebook page.", sample="example-center"),
   *          @Attribute("twitter", type="string", description="The twitter handle of the center twitter account.  This will not include the '@' symbol.", sample="example-center"),
   *          @Attribute("dateFrom", type="date", description="The date on which this center became active.", sample="2018-01-01"),
   *          @Attribute("dateTo", type="date", description="The date on which this center became inactive.", sample="2018-01-01"),
   *          @Attribute("active", type="boolean", description="The current active status of the center.", sample="true"),
   *          @Attribute("books", type="array", description="The array of books that are currently in the center inventory. Please see [url] for more information.", sample="http://www.google.com/array")
   *     }),
   *     @Response(400, body={"message": "No identifier was provided for the entity lookup or it was of invalid type."}),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->get('/centers/{id}', ['resolver' => 'Center@get', 'uses' => 'App\Http\Controllers\RestController@retrieve']);

  /**
   * Create new center
   *
   * Create a new center with given details
   *
   * @Post("/centers")
   * @Transaction({
   *     @Request(attributes={
   *          @Attribute("label", type="string", description="The label of the center.  Used for identification and url generation.", sample="example-center"),
   *          @Attribute("name", type="string", description="The name of the center.", sample="Example Center"),
   *          @Attribute("type", type="string", description="The type of center. Either local or online.", sample="local"),
   *          @Attribute("streetAddress", type="string", description="The street address of the center.", sample="123 Main St."),
   *          @Attribute("city", type="string", description="The city in which the center is located.", sample="Philadelphia"),
   *          @Attribute("state", type="string", description="The locality (state, province, etc.) in which the center is located. Presented as the ISO 3166-2 abbreviation without the Country prefix.", sample="PA"),
   *          @Attribute("postalCode", type="string", description="The postal code of the center.", sample="16841"),
   *          @Attribute("country", type="string", description="The country in which the center is located.  Presented as the ISO 3166-2 abbreviation.", sample="US"),
   *          @Attribute("phone", type="string", description="The primary phone number of the center.", sample="444-555-6666"),
   *          @Attribute("fax", type="string", description="The fax number of the center.", sample="444-555-6666"),
   *          @Attribute("email", type="string", description="The contact email for the center.", sample="example@centerspidersmart.com"),
   *          @Attribute("facebook", type="string", description="The facebook page of the center.  This is the suffix part of the url for the facebook page.", sample="example-center"),
   *          @Attribute("twitter", type="string", description="The twitter handle of the center twitter account.  This will not include the '@' symbol.", sample="example-center"),
   *          @Attribute("active", type="boolean", description="The current active status of the center.", sample="true"),
   *          @Attribute("books", type="array", description="The array of books that are currently in the center inventory. Please see [url] for more information.", sample="http://www.google.com/array")
   *     }),
   *     @Response(201, body="http://api.spidersmart.com/1"),
   *     @Response(422, body={"message": "The entity could not be created.", "errors": VALIDATION_ERROR_DOCUMENTATION })
   * })
   */
  $api->post('/centers', ['resolver' => 'Center@create', 'uses' => 'App\Http\Controllers\RestController@create']);

  /**
   * Update center
   *
   * Updates a given center with given information
   *
   * @Put("/centers/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the center to update.")
   * })
   * @Transaction({
   *     @Request("id=1", attributes={
   *          @Attribute("label", type="string", description="The label of the center.  Used for identification and url generation.", sample="example-center", required=true),
   *          @Attribute("name", type="string", description="The name of the center.", sample="Example Center", required=true),
   *          @Attribute("type", type="string", description="The type of center. Either local or online.", sample="local", required=true),
   *          @Attribute("streetAddress", type="string", description="The street address of the center.", sample="123 Main St.", required=true),
   *          @Attribute("city", type="string", description="The city in which the center is located.", sample="Philadelphia", required=true),
   *          @Attribute("state", type="string", description="The locality (state, province, etc.) in which the center is located. Presented as the ISO 3166-2 abbreviation without the Country prefix.", sample="PA", required=true),
   *          @Attribute("postalCode", type="string", description="The postal code of the center.", sample="16841", required=true),
   *          @Attribute("country", type="string", description="The country in which the center is located.  Presented as the ISO 3166-2 abbreviation.", sample="US", required=true),
   *          @Attribute("phone", type="string", description="The primary phone number of the center.", sample="444-555-6666", required=true),
   *          @Attribute("fax", type="string", description="The fax number of the center.", sample="444-555-6666"),
   *          @Attribute("email", type="string", description="The contact email for the center.", sample="example@centerspidersmart.com", required=true),
   *          @Attribute("facebook", type="string", description="The facebook page of the center.  This is the suffix part of the url for the facebook page.", sample="example-center"),
   *          @Attribute("twitter", type="string", description="The twitter handle of the center twitter account.  This will not include the '@' symbol.", sample="example-center"),
   *          @Attribute("active", type="boolean", description="The current active status of the center.", sample="true"),
   *          @Attribute("books", type="array", description="The array of books that are currently in the center inventory. Please see [url] for more information.", sample="http://www.google.com/array")
   *     }),
   *     @Response(204),
   *     @Response(422, body={"message": "The entity could not be created.", "errors": VALIDATION_ERROR_DOCUMENTATION }),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->put('/centers/{id}', ['resolver' => 'Center@update', 'uses' => 'App\Http\Controllers\RestController@update']);

  /**
   * Delete center
   *
   * Deletes a given center
   *
   * @Delete("/centers/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the center to delete.")
   * })
   * @Transaction({
   *     @Request("id=1"),
   *     @Response(204),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->delete('/centers/{id}', ['resolver' => 'Center@delete', 'uses' => 'App\Http\Controllers\RestController@delete']);

  /**
   * Show all users
   *
   * Get a JSON representation of all users
   *
   * @Get("/users")
   * @Transaction({
   *     @Response(200, attributes={
   *          @Attribute("id", type="number", description="The id of the center.", sample=1),
   *          @Attribute("label", type="string", description="The label of the center.  Used for identification and url generation.", sample="example-center"),
   *          @Attribute("name", type="string", description="The name of the center.", sample="Example Center"),
   *          @Attribute("type", type="string", description="The type of center. Either local or online.", sample="local"),
   *          @Attribute("streetAddress", type="string", description="The street address of the center.", sample="123 Main St."),
   *          @Attribute("city", type="string", description="The city in which the center is located.", sample="Philadelphia"),
   *          @Attribute("state", type="string", description="The locality (state, province, etc.) in which the center is located. Presented as the ISO 3166-2 abbreviation without the Country prefix.", sample="PA"),
   *          @Attribute("postalCode", type="string", description="The postal code of the center.", sample="16841"),
   *          @Attribute("country", type="string", description="The country in which the center is located.  Presented as the ISO 3166-2 abbreviation.", sample="US"),
   *          @Attribute("phone", type="string", description="The primary phone number of the center.", sample="444-555-6666"),
   *          @Attribute("fax", type="string", description="The fax number of the center.", sample="444-555-6666"),
   *          @Attribute("email", type="string", description="The contact email for the center.", sample="example@centerspidersmart.com"),
   *          @Attribute("facebook", type="string", description="The facebook page of the center.  This is the suffix part of the url for the facebook page.", sample="example-center"),
   *          @Attribute("twitter", type="string", description="The twitter handle of the center twitter account.  This will not include the '@' symbol.", sample="example-center"),
   *          @Attribute("dateFrom", type="date", description="The date on which this center became active.", sample="2018-01-01"),
   *          @Attribute("dateTo", type="date", description="The date on which this center became inactive.", sample="2018-01-01"),
   *          @Attribute("active", type="boolean", description="The current active status of the center.", sample="true"),
   *          @Attribute("books", type="array", description="The array of books that are currently in the center inventory. Please see [url] for more information.", sample="http://www.google.com/array")
   *     }),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->get('/users', ['resolver' => 'User@getAll', 'uses' => 'App\Http\Controllers\RestController@retrieve']);

  /**
   * Show a user
   *
   * Get a JSON representation of one user given an id
   *
   * @Get("/users/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the center to retrieve."),
   *     @Parameter("showDeleted", type="boolean", required=false, description="If the query parameter 'showDeleted' is set to true, it will show deleted information (enrollments, books, etc.) about the center as well.")
   * })
   * @Transaction({
   *     @Request("id=1"),
   *     @Response(200, attributes={
   *          @Attribute("id", type="number", description="The id of the center.", sample=1),
   *          @Attribute("label", type="string", description="The label of the center.  Used for identification and url generation.", sample="example-center"),
   *          @Attribute("name", type="string", description="The name of the center.", sample="Example Center"),
   *          @Attribute("type", type="string", description="The type of center. Either local or online.", sample="local"),
   *          @Attribute("streetAddress", type="string", description="The street address of the center.", sample="123 Main St."),
   *          @Attribute("city", type="string", description="The city in which the center is located.", sample="Philadelphia"),
   *          @Attribute("state", type="string", description="The locality (state, province, etc.) in which the center is located. Presented as the ISO 3166-2 abbreviation without the Country prefix.", sample="PA"),
   *          @Attribute("postalCode", type="string", description="The postal code of the center.", sample="16841"),
   *          @Attribute("country", type="string", description="The country in which the center is located.  Presented as the ISO 3166-2 abbreviation.", sample="US"),
   *          @Attribute("phone", type="string", description="The primary phone number of the center.", sample="444-555-6666"),
   *          @Attribute("fax", type="string", description="The fax number of the center.", sample="444-555-6666"),
   *          @Attribute("email", type="string", description="The contact email for the center.", sample="example@centerspidersmart.com"),
   *          @Attribute("facebook", type="string", description="The facebook page of the center.  This is the suffix part of the url for the facebook page.", sample="example-center"),
   *          @Attribute("twitter", type="string", description="The twitter handle of the center twitter account.  This will not include the '@' symbol.", sample="example-center"),
   *          @Attribute("dateFrom", type="date", description="The date on which this center became active.", sample="2018-01-01"),
   *          @Attribute("dateTo", type="date", description="The date on which this center became inactive.", sample="2018-01-01"),
   *          @Attribute("active", type="boolean", description="The current active status of the center.", sample="true"),
   *          @Attribute("books", type="array", description="The array of books that are currently in the center inventory. Please see [url] for more information.", sample="http://www.google.com/array")
   *     }),
   *     @Response(400, body={"message": "No identifier was provided for the entity lookup or it was of invalid type."}),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->get('/users/{id}', ['resolver' => 'User@get', 'uses' => 'App\Http\Controllers\RestController@retrieve']);

  /**
   * Create new user
   *
   * Create a new user with given details
   *
   * @Post("/users")
   * @Transaction({
   *     @Request(attributes={
   *          @Attribute("label", type="string", description="The label of the center.  Used for identification and url generation.", sample="example-center"),
   *          @Attribute("name", type="string", description="The name of the center.", sample="Example Center"),
   *          @Attribute("type", type="string", description="The type of center. Either local or online.", sample="local"),
   *          @Attribute("streetAddress", type="string", description="The street address of the center.", sample="123 Main St."),
   *          @Attribute("city", type="string", description="The city in which the center is located.", sample="Philadelphia"),
   *          @Attribute("state", type="string", description="The locality (state, province, etc.) in which the center is located. Presented as the ISO 3166-2 abbreviation without the Country prefix.", sample="PA"),
   *          @Attribute("postalCode", type="string", description="The postal code of the center.", sample="16841"),
   *          @Attribute("country", type="string", description="The country in which the center is located.  Presented as the ISO 3166-2 abbreviation.", sample="US"),
   *          @Attribute("phone", type="string", description="The primary phone number of the center.", sample="444-555-6666"),
   *          @Attribute("fax", type="string", description="The fax number of the center.", sample="444-555-6666"),
   *          @Attribute("email", type="string", description="The contact email for the center.", sample="example@centerspidersmart.com"),
   *          @Attribute("facebook", type="string", description="The facebook page of the center.  This is the suffix part of the url for the facebook page.", sample="example-center"),
   *          @Attribute("twitter", type="string", description="The twitter handle of the center twitter account.  This will not include the '@' symbol.", sample="example-center"),
   *          @Attribute("active", type="boolean", description="The current active status of the center.", sample="true"),
   *          @Attribute("books", type="array", description="The array of books that are currently in the center inventory. Please see [url] for more information.", sample="http://www.google.com/array")
   *     }),
   *     @Response(201, body="http://api.spidersmart.com/1"),
   *     @Response(422, body={"message": "The entity could not be created.", "errors": VALIDATION_ERROR_DOCUMENTATION })
   * })
   */
  $api->post('/users', ['resolver' => 'User@create', 'uses' => 'App\Http\Controllers\RestController@create']);

  /**
   * Update user
   *
   * Updates a given user with given information
   *
   * @Put("/users/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the center to update.")
   * })
   * @Transaction({
   *     @Request("id=1", attributes={
   *          @Attribute("label", type="string", description="The label of the center.  Used for identification and url generation.", sample="example-center", required=true),
   *          @Attribute("name", type="string", description="The name of the center.", sample="Example Center", required=true),
   *          @Attribute("type", type="string", description="The type of center. Either local or online.", sample="local", required=true),
   *          @Attribute("streetAddress", type="string", description="The street address of the center.", sample="123 Main St.", required=true),
   *          @Attribute("city", type="string", description="The city in which the center is located.", sample="Philadelphia", required=true),
   *          @Attribute("state", type="string", description="The locality (state, province, etc.) in which the center is located. Presented as the ISO 3166-2 abbreviation without the Country prefix.", sample="PA", required=true),
   *          @Attribute("postalCode", type="string", description="The postal code of the center.", sample="16841", required=true),
   *          @Attribute("country", type="string", description="The country in which the center is located.  Presented as the ISO 3166-2 abbreviation.", sample="US", required=true),
   *          @Attribute("phone", type="string", description="The primary phone number of the center.", sample="444-555-6666", required=true),
   *          @Attribute("fax", type="string", description="The fax number of the center.", sample="444-555-6666"),
   *          @Attribute("email", type="string", description="The contact email for the center.", sample="example@centerspidersmart.com", required=true),
   *          @Attribute("facebook", type="string", description="The facebook page of the center.  This is the suffix part of the url for the facebook page.", sample="example-center"),
   *          @Attribute("twitter", type="string", description="The twitter handle of the center twitter account.  This will not include the '@' symbol.", sample="example-center"),
   *          @Attribute("active", type="boolean", description="The current active status of the center.", sample="true"),
   *          @Attribute("books", type="array", description="The array of books that are currently in the center inventory. Please see [url] for more information.", sample="http://www.google.com/array")
   *     }),
   *     @Response(204),
   *     @Response(422, body={"message": "The entity could not be created.", "errors": VALIDATION_ERROR_DOCUMENTATION }),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->put('/users/{id}', ['resolver' => 'User@update', 'uses' => 'App\Http\Controllers\RestController@update']);

  /**
   * Delete user
   *
   * Deletes a given user
   *
   * @Delete("/users/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the center to delete.")
   * })
   * @Transaction({
   *     @Request("id=1"),
   *     @Response(204),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->delete('/users/{id}', ['resolver' => 'User@delete', 'uses' => 'App\Http\Controllers\RestController@delete']);





  /**
   * Show all authors
   *
   * Get a JSON representation of all authors
   *
   * @Get("/authors")
   * @Transaction({
   *     @Response(200, attributes={
   *          @Attribute("id", type="number", description="The id of the center.", sample=1),
   *          @Attribute("label", type="string", description="The label of the center.  Used for identification and url generation.", sample="example-center"),
   *          @Attribute("name", type="string", description="The name of the center.", sample="Example Center"),
   *          @Attribute("type", type="string", description="The type of center. Either local or online.", sample="local"),
   *          @Attribute("streetAddress", type="string", description="The street address of the center.", sample="123 Main St."),
   *          @Attribute("city", type="string", description="The city in which the center is located.", sample="Philadelphia"),
   *          @Attribute("state", type="string", description="The locality (state, province, etc.) in which the center is located. Presented as the ISO 3166-2 abbreviation without the Country prefix.", sample="PA"),
   *          @Attribute("postalCode", type="string", description="The postal code of the center.", sample="16841"),
   *          @Attribute("country", type="string", description="The country in which the center is located.  Presented as the ISO 3166-2 abbreviation.", sample="US"),
   *          @Attribute("phone", type="string", description="The primary phone number of the center.", sample="444-555-6666"),
   *          @Attribute("fax", type="string", description="The fax number of the center.", sample="444-555-6666"),
   *          @Attribute("email", type="string", description="The contact email for the center.", sample="example@centerspidersmart.com"),
   *          @Attribute("facebook", type="string", description="The facebook page of the center.  This is the suffix part of the url for the facebook page.", sample="example-center"),
   *          @Attribute("twitter", type="string", description="The twitter handle of the center twitter account.  This will not include the '@' symbol.", sample="example-center"),
   *          @Attribute("dateFrom", type="date", description="The date on which this center became active.", sample="2018-01-01"),
   *          @Attribute("dateTo", type="date", description="The date on which this center became inactive.", sample="2018-01-01"),
   *          @Attribute("active", type="boolean", description="The current active status of the center.", sample="true"),
   *          @Attribute("books", type="array", description="The array of books that are currently in the center inventory. Please see [url] for more information.", sample="http://www.google.com/array")
   *     }),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */




  $api->get('/authors', ['resolver' => 'Author@getAll', 'uses' => 'App\Http\Controllers\RestController@retrieve']);


  /**
   * Show a author
   *
   * Get a JSON representation of one author given an id
   *
   * @Get("/author/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the author to retrieve."),
   *     @Parameter("showDeleted", type="boolean", required=false, description="If the query parameter 'showDeleted' is set to true, it will show deleted information (enrollments, books, etc.) about the author as well.")
   * })
   * @Transaction({
   *     @Request("id=1"),
   *     @Response(200, attributes={
   *          @Attribute("id", type="number", description="The id of the center.", sample=1),
   *          @Attribute("label", type="string", description="The label of the center.  Used for identification and url generation.", sample="example-center"),
   *          @Attribute("name", type="string", description="The name of the center.", sample="Example Center"),
   *          @Attribute("type", type="string", description="The type of center. Either local or online.", sample="local"),
   *          @Attribute("streetAddress", type="string", description="The street address of the center.", sample="123 Main St."),
   *          @Attribute("city", type="string", description="The city in which the center is located.", sample="Philadelphia"),
   *          @Attribute("state", type="string", description="The locality (state, province, etc.) in which the center is located. Presented as the ISO 3166-2 abbreviation without the Country prefix.", sample="PA"),
   *          @Attribute("postalCode", type="string", description="The postal code of the center.", sample="16841"),
   *          @Attribute("country", type="string", description="The country in which the center is located.  Presented as the ISO 3166-2 abbreviation.", sample="US"),
   *          @Attribute("phone", type="string", description="The primary phone number of the center.", sample="444-555-6666"),
   *          @Attribute("fax", type="string", description="The fax number of the center.", sample="444-555-6666"),
   *          @Attribute("email", type="string", description="The contact email for the center.", sample="example@centerspidersmart.com"),
   *          @Attribute("facebook", type="string", description="The facebook page of the center.  This is the suffix part of the url for the facebook page.", sample="example-center"),
   *          @Attribute("twitter", type="string", description="The twitter handle of the center twitter account.  This will not include the '@' symbol.", sample="example-center"),
   *          @Attribute("dateFrom", type="date", description="The date on which this center became active.", sample="2018-01-01"),
   *          @Attribute("dateTo", type="date", description="The date on which this center became inactive.", sample="2018-01-01"),
   *          @Attribute("active", type="boolean", description="The current active status of the center.", sample="true"),
   *          @Attribute("books", type="array", description="The array of books that are currently in the center inventory. Please see [url] for more information.", sample="http://www.google.com/array")
   *     }),
   *     @Response(400, body={"message": "No identifier was provided for the entity lookup or it was of invalid type."}),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->get('/author/{id}', ['resolver' => 'Author@get', 'uses' => 'App\Http\Controllers\RestController@retrieve']);

  /**
   * Create new author
   *
   * Create a new author with given details
   *
   * @Post("/authors")
   * @Transaction({
   *     @Request(attributes={
   *          @Attribute("label", type="string", description="The label of the center.  Used for identification and url generation.", sample="example-center"),
   *          @Attribute("name", type="string", description="The name of the center.", sample="Example Center"),
   *          @Attribute("type", type="string", description="The type of center. Either local or online.", sample="local"),
   *          @Attribute("streetAddress", type="string", description="The street address of the center.", sample="123 Main St."),
   *          @Attribute("city", type="string", description="The city in which the center is located.", sample="Philadelphia"),
   *          @Attribute("state", type="string", description="The locality (state, province, etc.) in which the center is located. Presented as the ISO 3166-2 abbreviation without the Country prefix.", sample="PA"),
   *          @Attribute("postalCode", type="string", description="The postal code of the center.", sample="16841"),
   *          @Attribute("country", type="string", description="The country in which the center is located.  Presented as the ISO 3166-2 abbreviation.", sample="US"),
   *          @Attribute("phone", type="string", description="The primary phone number of the center.", sample="444-555-6666"),
   *          @Attribute("fax", type="string", description="The fax number of the center.", sample="444-555-6666"),
   *          @Attribute("email", type="string", description="The contact email for the center.", sample="example@centerspidersmart.com"),
   *          @Attribute("facebook", type="string", description="The facebook page of the center.  This is the suffix part of the url for the facebook page.", sample="example-center"),
   *          @Attribute("twitter", type="string", description="The twitter handle of the center twitter account.  This will not include the '@' symbol.", sample="example-center"),
   *          @Attribute("active", type="boolean", description="The current active status of the center.", sample="true"),
   *          @Attribute("books", type="array", description="The array of books that are currently in the center inventory. Please see [url] for more information.", sample="http://www.google.com/array")
   *     }),
   *     @Response(201, body="http://api.spidersmart.com/1"),
   *     @Response(422, body={"message": "The entity could not be created.", "errors": VALIDATION_ERROR_DOCUMENTATION })
   * })
   */
  $api->post('/authors', ['resolver' => 'Author@create', 'uses' => 'App\Http\Controllers\RestController@create']);

  /**
   * Update author
   *
   * Updates a given author with given information
   *
   * @Put("/author/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the author to update.")
   * })
   * @Transaction({
   *     @Request("id=1", attributes={
   *          @Attribute("label", type="string", description="The label of the center.  Used for identification and url generation.", sample="example-center", required=true),
   *          @Attribute("name", type="string", description="The name of the center.", sample="Example Center", required=true),
   *          @Attribute("type", type="string", description="The type of center. Either local or online.", sample="local", required=true),
   *          @Attribute("streetAddress", type="string", description="The street address of the center.", sample="123 Main St.", required=true),
   *          @Attribute("city", type="string", description="The city in which the center is located.", sample="Philadelphia", required=true),
   *          @Attribute("state", type="string", description="The locality (state, province, etc.) in which the center is located. Presented as the ISO 3166-2 abbreviation without the Country prefix.", sample="PA", required=true),
   *          @Attribute("postalCode", type="string", description="The postal code of the center.", sample="16841", required=true),
   *          @Attribute("country", type="string", description="The country in which the center is located.  Presented as the ISO 3166-2 abbreviation.", sample="US", required=true),
   *          @Attribute("phone", type="string", description="The primary phone number of the center.", sample="444-555-6666", required=true),
   *          @Attribute("fax", type="string", description="The fax number of the center.", sample="444-555-6666"),
   *          @Attribute("email", type="string", description="The contact email for the center.", sample="example@centerspidersmart.com", required=true),
   *          @Attribute("facebook", type="string", description="The facebook page of the center.  This is the suffix part of the url for the facebook page.", sample="example-center"),
   *          @Attribute("twitter", type="string", description="The twitter handle of the center twitter account.  This will not include the '@' symbol.", sample="example-center"),
   *          @Attribute("active", type="boolean", description="The current active status of the center.", sample="true"),
   *          @Attribute("books", type="array", description="The array of books that are currently in the center inventory. Please see [url] for more information.", sample="http://www.google.com/array")
   *     }),
   *     @Response(204),
   *     @Response(422, body={"message": "The entity could not be created.", "errors": VALIDATION_ERROR_DOCUMENTATION }),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->put('/author/{id}', ['resolver' => 'Author@update', 'uses' => 'App\Http\Controllers\RestController@update']);

  /**
   * Delete author
   *
   * Deletes a given author
   *
   * @Delete("/author/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the author to delete.")
   * })
   * @Transaction({
   *     @Request("id=1"),
   *     @Response(204),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->delete('/author/{id}', ['resolver' => 'Author@delete', 'uses' => 'App\Http\Controllers\RestController@delete']);


  /**
   * Show all genres
   *
   * Get a JSON representation of all genres
   *
   * @Get("/genres")
   * @Transaction({
   *     @Response(200, attributes={
   *          @Attribute("id", type="number", description="The id of the center.", sample=1),
   *          @Attribute("label", type="string", description="The label of the center.  Used for identification and url generation.", sample="example-center"),
   *          @Attribute("name", type="string", description="The name of the center.", sample="Example Center"),
   *          @Attribute("type", type="string", description="The type of center. Either local or online.", sample="local"),
   *          @Attribute("streetAddress", type="string", description="The street address of the center.", sample="123 Main St."),
   *          @Attribute("city", type="string", description="The city in which the center is located.", sample="Philadelphia"),
   *          @Attribute("state", type="string", description="The locality (state, province, etc.) in which the center is located. Presented as the ISO 3166-2 abbreviation without the Country prefix.", sample="PA"),
   *          @Attribute("postalCode", type="string", description="The postal code of the center.", sample="16841"),
   *          @Attribute("country", type="string", description="The country in which the center is located.  Presented as the ISO 3166-2 abbreviation.", sample="US"),
   *          @Attribute("phone", type="string", description="The primary phone number of the center.", sample="444-555-6666"),
   *          @Attribute("fax", type="string", description="The fax number of the center.", sample="444-555-6666"),
   *          @Attribute("email", type="string", description="The contact email for the center.", sample="example@centerspidersmart.com"),
   *          @Attribute("facebook", type="string", description="The facebook page of the center.  This is the suffix part of the url for the facebook page.", sample="example-center"),
   *          @Attribute("twitter", type="string", description="The twitter handle of the center twitter account.  This will not include the '@' symbol.", sample="example-center"),
   *          @Attribute("dateFrom", type="date", description="The date on which this center became active.", sample="2018-01-01"),
   *          @Attribute("dateTo", type="date", description="The date on which this center became inactive.", sample="2018-01-01"),
   *          @Attribute("active", type="boolean", description="The current active status of the center.", sample="true"),
   *          @Attribute("books", type="array", description="The array of books that are currently in the center inventory. Please see [url] for more information.", sample="http://www.google.com/array")
   *     }),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */



  $api->get('/genres', ['resolver' => 'Genre@getAll', 'uses' => 'App\Http\Controllers\RestController@retrieve']);


  /**
   * Show a genre
   *
   * Get a JSON representation of one genre given an id
   *
   * @Get("/genre/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the genre to retrieve."),
   *     @Parameter("showDeleted", type="boolean", required=false, description="If the query parameter 'showDeleted' is set to true, it will show deleted information (enrollments, books, etc.) about the genre as well.")
   * })
   * @Transaction({
   *     @Request("id=1"),
   *     @Response(200, attributes={
   *          @Attribute("id", type="number", description="The id of the center.", sample=1),
   *          @Attribute("label", type="string", description="The label of the center.  Used for identification and url generation.", sample="example-center"),
   *          @Attribute("name", type="string", description="The name of the center.", sample="Example Center"),
   *          @Attribute("type", type="string", description="The type of center. Either local or online.", sample="local"),
   *          @Attribute("streetAddress", type="string", description="The street address of the center.", sample="123 Main St."),
   *          @Attribute("city", type="string", description="The city in which the center is located.", sample="Philadelphia"),
   *          @Attribute("state", type="string", description="The locality (state, province, etc.) in which the center is located. Presented as the ISO 3166-2 abbreviation without the Country prefix.", sample="PA"),
   *          @Attribute("postalCode", type="string", description="The postal code of the center.", sample="16841"),
   *          @Attribute("country", type="string", description="The country in which the center is located.  Presented as the ISO 3166-2 abbreviation.", sample="US"),
   *          @Attribute("phone", type="string", description="The primary phone number of the center.", sample="444-555-6666"),
   *          @Attribute("fax", type="string", description="The fax number of the center.", sample="444-555-6666"),
   *          @Attribute("email", type="string", description="The contact email for the center.", sample="example@centerspidersmart.com"),
   *          @Attribute("facebook", type="string", description="The facebook page of the center.  This is the suffix part of the url for the facebook page.", sample="example-center"),
   *          @Attribute("twitter", type="string", description="The twitter handle of the center twitter account.  This will not include the '@' symbol.", sample="example-center"),
   *          @Attribute("dateFrom", type="date", description="The date on which this center became active.", sample="2018-01-01"),
   *          @Attribute("dateTo", type="date", description="The date on which this center became inactive.", sample="2018-01-01"),
   *          @Attribute("active", type="boolean", description="The current active status of the center.", sample="true"),
   *          @Attribute("books", type="array", description="The array of books that are currently in the center inventory. Please see [url] for more information.", sample="http://www.google.com/array")
   *     }),
   *     @Response(400, body={"message": "No identifier was provided for the entity lookup or it was of invalid type."}),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->get('/genre/{id}', ['resolver' => 'Genre@get', 'uses' => 'App\Http\Controllers\RestController@retrieve']);

  /**
   * Create new genre
   *
   * Create a new genre with given details
   *
   * @Post("/genres")
   * @Transaction({
   *     @Request(attributes={
   *          @Attribute("label", type="string", description="The label of the center.  Used for identification and url generation.", sample="example-center"),
   *          @Attribute("name", type="string", description="The name of the center.", sample="Example Center"),
   *          @Attribute("type", type="string", description="The type of center. Either local or online.", sample="local"),
   *          @Attribute("streetAddress", type="string", description="The street address of the center.", sample="123 Main St."),
   *          @Attribute("city", type="string", description="The city in which the center is located.", sample="Philadelphia"),
   *          @Attribute("state", type="string", description="The locality (state, province, etc.) in which the center is located. Presented as the ISO 3166-2 abbreviation without the Country prefix.", sample="PA"),
   *          @Attribute("postalCode", type="string", description="The postal code of the center.", sample="16841"),
   *          @Attribute("country", type="string", description="The country in which the center is located.  Presented as the ISO 3166-2 abbreviation.", sample="US"),
   *          @Attribute("phone", type="string", description="The primary phone number of the center.", sample="444-555-6666"),
   *          @Attribute("fax", type="string", description="The fax number of the center.", sample="444-555-6666"),
   *          @Attribute("email", type="string", description="The contact email for the center.", sample="example@centerspidersmart.com"),
   *          @Attribute("facebook", type="string", description="The facebook page of the center.  This is the suffix part of the url for the facebook page.", sample="example-center"),
   *          @Attribute("twitter", type="string", description="The twitter handle of the center twitter account.  This will not include the '@' symbol.", sample="example-center"),
   *          @Attribute("active", type="boolean", description="The current active status of the center.", sample="true"),
   *          @Attribute("books", type="array", description="The array of books that are currently in the center inventory. Please see [url] for more information.", sample="http://www.google.com/array")
   *     }),
   *     @Response(201, body="http://api.spidersmart.com/1"),
   *     @Response(422, body={"message": "The entity could not be created.", "errors": VALIDATION_ERROR_DOCUMENTATION })
   * })
   */
  $api->post('/genres', ['resolver' => 'Genre@create', 'uses' => 'App\Http\Controllers\RestController@create']);

  /**
   * Update genre
   *
   * Updates a given genre with given information
   *
   * @Put("/genre/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the genre to update.")
   * })
   * @Transaction({
   *     @Request("id=1", attributes={
   *          @Attribute("label", type="string", description="The label of the center.  Used for identification and url generation.", sample="example-center", required=true),
   *          @Attribute("name", type="string", description="The name of the center.", sample="Example Center", required=true),
   *          @Attribute("type", type="string", description="The type of center. Either local or online.", sample="local", required=true),
   *          @Attribute("streetAddress", type="string", description="The street address of the center.", sample="123 Main St.", required=true),
   *          @Attribute("city", type="string", description="The city in which the center is located.", sample="Philadelphia", required=true),
   *          @Attribute("state", type="string", description="The locality (state, province, etc.) in which the center is located. Presented as the ISO 3166-2 abbreviation without the Country prefix.", sample="PA", required=true),
   *          @Attribute("postalCode", type="string", description="The postal code of the center.", sample="16841", required=true),
   *          @Attribute("country", type="string", description="The country in which the center is located.  Presented as the ISO 3166-2 abbreviation.", sample="US", required=true),
   *          @Attribute("phone", type="string", description="The primary phone number of the center.", sample="444-555-6666", required=true),
   *          @Attribute("fax", type="string", description="The fax number of the center.", sample="444-555-6666"),
   *          @Attribute("email", type="string", description="The contact email for the center.", sample="example@centerspidersmart.com", required=true),
   *          @Attribute("facebook", type="string", description="The facebook page of the center.  This is the suffix part of the url for the facebook page.", sample="example-center"),
   *          @Attribute("twitter", type="string", description="The twitter handle of the center twitter account.  This will not include the '@' symbol.", sample="example-center"),
   *          @Attribute("active", type="boolean", description="The current active status of the center.", sample="true"),
   *          @Attribute("books", type="array", description="The array of books that are currently in the center inventory. Please see [url] for more information.", sample="http://www.google.com/array")
   *     }),
   *     @Response(204),
   *     @Response(422, body={"message": "The entity could not be created.", "errors": VALIDATION_ERROR_DOCUMENTATION }),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->put('/genre/{id}', ['resolver' => 'Genre@update', 'uses' => 'App\Http\Controllers\RestController@update']);


  /**
   * Delete genre
   *
   * Deletes a given genre
   *
   * @Delete("/genre/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the genre to delete.")
   * })
   * @Transaction({
   *     @Request("id=1"),
   *     @Response(204),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->delete('/genre/{id}', ['resolver' => 'Genre@delete', 'uses' => 'App\Http\Controllers\RestController@delete']);






  /**
   * Show all assignments
   *
   * Get a JSON representation of all assignments
   *
   * @Get("/assignments")
   * @Transaction({
   *     @Response(200, attributes={
   *          @Attribute("questions", type="array", description="An array that holds the questions of the assignment.", sample="[q1, q2, q3]", required=true),
   *          @Attribute("questionCategories", type="array", description="An array of categories that indicate which the question belongs to.", sample="[qc1, qc2, qc3]", required=true),
   *          @Attribute("title", type="string", description="The title of the assignment.", sample="Homework 1", required=true),
   *          @Attribute("description", type="string", description="The description of the assignment.", sample="Homework 1 is about...", required=true),
   *             }),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */



  $api->get('/assignments', ['resolver' => 'Assignment@getAll', 'uses' => 'App\Http\Controllers\RestController@retrieve']);


  /**
   * Show a assignment
   *
   * Get a JSON representation of one assignment given an id
   *
   * @Get("/assignment/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the assignment to retrieve."),
   *     @Parameter("showDeleted", type="boolean", required=false, description="If the query parameter 'showDeleted' is set to true, it will show deleted information (enrollments, books, etc.) about the assignment as well.")
   * })
   * @Transaction({
   *     @Request("id=1"),
   *     @Response(200, attributes={
   *        @Attribute("questions", type="array", description="An array that holds the questions of the assignment.", sample="[q1, q2, q3]", required=true),
   *          @Attribute("questionCategories", type="array", description="An array of categories that indicate which the question belongs to.", sample="[qc1, qc2, qc3]", required=true),
   *          @Attribute("title", type="string", description="The title of the assignment.", sample="Homework 1", required=true),
   *          @Attribute("description", type="string", description="The description of the assignment.", sample="Homework 1 is about...", required=true),
   *            }),
   *     @Response(400, body={"message": "No identifier was provided for the entity lookup or it was of invalid type."}),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->get('/assignment/{id}', ['resolver' => 'Assignment@get', 'uses' => 'App\Http\Controllers\RestController@retrieve']);

  /**
   * Create new assignment
   *
   * Create a new assignment with given details
   *
   * @Post("/assignments")
   * @Transaction({
   *     @Request(attributes={
   *          @Attribute("questions", type="array", description="An array that holds the questions of the assignment.", sample="[q1, q2, q3]", required=true),
   *          @Attribute("questionCategories", type="array", description="An array of categories that indicate which the question belongs to.", sample="[qc1, qc2, qc3]", required=true),
   *          @Attribute("title", type="string", description="The title of the assignment.", sample="Homework 1", required=true),
   *          @Attribute("description", type="string", description="The description of the assignment.", sample="Homework 1 is about...", required=true),
   *             }),
   *     @Response(201, body="http://api.spidersmart.com/1"),
   *     @Response(422, body={"message": "The entity could not be created.", "errors": VALIDATION_ERROR_DOCUMENTATION })
   * })
   */
  $api->post('/assignments', ['resolver' => 'Assignment@create', 'uses' => 'App\Http\Controllers\RestController@create']);

  /**
   * Update assignment
   *
   * Updates a given assignment with given information
   *
   * @Put("/assignment/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the assignment to update.")
   * })
   * @Transaction({
   *     @Request("id=1", attributes={
   *          @Attribute("questions", type="array", description="An array that holds the questions of the assignment.", sample="[q1, q2, q3]", required=true),
   *          @Attribute("questionCategories", type="array", description="An array of categories that indicate which the question belongs to.", sample="[qc1, qc2, qc3]", required=true),
   *          @Attribute("title", type="string", description="The title of the assignment.", sample="Homework 1", required=true),
   *          @Attribute("description", type="string", description="The description of the assignment.", sample="Homework 1 is about...", required=true),
   *           }),
   *     @Response(204),
   *     @Response(422, body={"message": "The entity could not be created.", "errors": VALIDATION_ERROR_DOCUMENTATION }),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->put('/assignment/{id}', ['resolver' => 'Assignment@update', 'uses' => 'App\Http\Controllers\RestController@update']);


  /**
   * Delete assignment
   *
   * Deletes a given assignment
   *
   * @Delete("/assignment/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the assignment to delete.")
   * })
   * @Transaction({
   *     @Request("id=1"),
   *     @Response(204),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->delete('/assignment/{id}', ['resolver' => 'Assignment@delete', 'uses' => 'App\Http\Controllers\RestController@delete']);






  /**
   * Show all levels
   *
   * Get a JSON representation of all levels
   *
   * @Get("/levels")
   * @Transaction({
   *     @Response(200, attributes={
   *          @Attribute("subject", type="array", description="An array that holds the subjects of the level.", sample="[s1, s2, s3]", required=true),
   *          @Attribute("name", type="string", description="The name of the level", sample="Level 1", required=true),
   *          @Attribute("description", type="string", description="The description of the level.", sample=" Level 1 is about...", required=true),
   *          @Attribute("enrollments", type="array", description=" An array of enrollments that indicate which the level belongs to. ", sample="[e1, e2, e3]", required=true),
   *             }),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */



  $api->get('/levels', ['resolver' => 'Level@getAll', 'uses' => 'App\Http\Controllers\RestController@retrieve']);


  /**
   * Show a level
   *
   * Get a JSON representation of one level given an id
   *
   * @Get("/level/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the level to retrieve."),
   *     @Parameter("showDeleted", type="boolean", required=false, description="If the query parameter 'showDeleted' is set to true, it will show deleted information (enrollments, books, etc.) about the level as well.")
   * })
   * @Transaction({
   *     @Request("id=1"),
   *     @Response(200, attributes={
   *         @Attribute("subject", type="array", description="An array that holds the subjects of the level.", sample="[s1, s2, s3]", required=true),
   *          @Attribute("name", type="string", description="The name of the level", sample="Level 1", required=true),
   *          @Attribute("description", type="string", description="The description of the level.", sample=" Level 1 is about...", required=true),
   *          @Attribute("enrollments", type="array", description=" An array of enrollments that indicate which the level belongs to. ", sample="[e1, e2, e3]", required=true),
   *               }),
   *     @Response(400, body={"message": "No identifier was provided for the entity lookup or it was of invalid type."}),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->get('/level/{id}', ['resolver' => 'Level@get', 'uses' => 'App\Http\Controllers\RestController@retrieve']);

  /**
   * Create new level
   *
   * Create a new level with given details
   *
   * @Post("/levels")
   * @Transaction({
   *     @Request(attributes={
   *          @Attribute("subject", type="array", description="An array that holds the subjects of the level.", sample="[s1, s2, s3]", required=true),
   *          @Attribute("name", type="string", description="The name of the level", sample="Level 1", required=true),
   *          @Attribute("description", type="string", description="The description of the level.", sample=" Level 1 is about...", required=true),
   *          @Attribute("enrollments", type="array", description=" An array of enrollments that indicate which the level belongs to. ", sample="[e1, e2, e3]", required=true),
   *             }),
   *     @Response(201, body="http://api.spidersmart.com/1"),
   *     @Response(422, body={"message": "The entity could not be created.", "errors": VALIDATION_ERROR_DOCUMENTATION })
   * })
   */
  $api->post('/levels', ['resolver' => 'Level@create', 'uses' => 'App\Http\Controllers\RestController@create']);

  /**
   * Update level
   *
   * Updates a given level with given information
   *
   * @Put("/level/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the level to update.")
   * })
   * @Transaction({
   *     @Request("id=1", attributes={
   *          @Attribute("subject", type="array", description="An array that holds the subjects of the level.", sample="[s1, s2, s3]", required=true),
   *          @Attribute("name", type="string", description="The name of the level", sample="Level 1", required=true),
   *          @Attribute("description", type="string", description="The description of the level.", sample=" Level 1 is about...", required=true),
   *          @Attribute("enrollments", type="array", description=" An array of enrollments that indicate which the level belongs to. ", sample="[e1, e2, e3]", required=true),
   *             }),
   *     @Response(204),
   *     @Response(422, body={"message": "The entity could not be created.", "errors": VALIDATION_ERROR_DOCUMENTATION }),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->put('/level/{id}', ['resolver' => 'Level@update', 'uses' => 'App\Http\Controllers\RestController@update']);


  /**
   * Delete level
   *
   * Deletes a given level
   *
   * @Delete("/level/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the level to delete.")
   * })
   * @Transaction({
   *     @Request("id=1"),
   *     @Response(204),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->delete('/level/{id}', ['resolver' => 'Level@delete', 'uses' => 'App\Http\Controllers\RestController@delete']);







  /**
   * Show all subjects
   *
   * Get a JSON representation of all subjects
   *
   * @Get("/subjects")
   * @Transaction({
   *     @Response(200, attributes={
   *        @Attribute("name", type="string", description="The name of the subject", sample="Math 1", required=true),
   *          @Attribute("description", type="string", description="The description of the subject.", sample=" math 1 is about...", required=true),
   *          @Attribute("centers", type="array", description=" An array of centers that indicate which the subject belongs to. ", sample="[c1, c2, c3]", required=true),
   *          @Attribute("levels", type="array", description=" An array of levels that indicate which the subject belongs to. ", sample="[l1, l2, l3]", required=true),      
   *     }),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */



  $api->get('/subjects', ['resolver' => 'Subject@getAll', 'uses' => 'App\Http\Controllers\RestController@retrieve']);


  /**
   * Show a subject
   *
   * Get a JSON representation of one subject given an id
   *
   * @Get("/subject/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the subject to retrieve."),
   *     @Parameter("showDeleted", type="boolean", required=false, description="If the query parameter 'showDeleted' is set to true, it will show deleted information (enrollments, books, etc.) about the subject as well.")
   * })
   * @Transaction({
   *     @Request("id=1"),
   *     @Response(200, attributes={
   *               @Attribute("name", type="string", description="The name of the subject", sample="Math 1", required=true),
   *          @Attribute("description", type="string", description="The description of the subject.", sample=" math 1 is about...", required=true),
   *          @Attribute("centers", type="array", description=" An array of centers that indicate which the subject belongs to. ", sample="[c1, c2, c3]", required=true),
   *          @Attribute("levels", type="array", description=" An array of levels that indicate which the subject belongs to. ", sample="[l1, l2, l3]", required=true),      
   *             }),
   *     @Response(400, body={"message": "No identifier was provided for the entity lookup or it was of invalid type."}),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->get('/subject/{id}', ['resolver' => 'Subject@get', 'uses' => 'App\Http\Controllers\RestController@retrieve']);

  /**
   * Create new subject
   *
   * Create a new subject with given details
   *
   * @Post("/subjects")
   * @Transaction({
   *     @Request(attributes={
   *               @Attribute("name", type="string", description="The name of the subject", sample="Math 1", required=true),
   *          @Attribute("description", type="string", description="The description of the subject.", sample=" math 1 is about...", required=true),
   *          @Attribute("centers", type="array", description=" An array of centers that indicate which the subject belongs to. ", sample="[c1, c2, c3]", required=true),
   *          @Attribute("levels", type="array", description=" An array of levels that indicate which the subject belongs to. ", sample="[l1, l2, l3]", required=true),      
   *                 }),
   *     @Response(201, body="http://api.spidersmart.com/1"),
   *     @Response(422, body={"message": "The entity could not be created.", "errors": VALIDATION_ERROR_DOCUMENTATION })
   * })
   */
  $api->post('/subjects', ['resolver' => 'Subject@create', 'uses' => 'App\Http\Controllers\RestController@create']);

  /**
   * Update subject
   *
   * Updates a given subject with given information
   *
   * @Put("/subject/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the subject to update.")
   * })
   * @Transaction({
   *     @Request("id=1", attributes={
   *               @Attribute("name", type="string", description="The name of the subject", sample="Math 1", required=true),
   *          @Attribute("description", type="string", description="The description of the subject.", sample=" math 1 is about...", required=true),
   *          @Attribute("centers", type="array", description=" An array of centers that indicate which the subject belongs to. ", sample="[c1, c2, c3]", required=true),
   *          @Attribute("levels", type="array", description=" An array of levels that indicate which the subject belongs to. ", sample="[l1, l2, l3]", required=true),      
   *          }),
   *     @Response(204),
   *     @Response(422, body={"message": "The entity could not be created.", "errors": VALIDATION_ERROR_DOCUMENTATION }),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->put('/subject/{id}', ['resolver' => 'Subject@update', 'uses' => 'App\Http\Controllers\RestController@update']);


  /**
   * Delete subject
   *
   * Deletes a given subject
   *
   * @Delete("/subject/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the subject to delete.")
   * })
   * @Transaction({
   *     @Request("id=1"),
   *     @Response(204),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->delete('/subject/{id}', ['resolver' => 'Subject@delete', 'uses' => 'App\Http\Controllers\RestController@delete']);




  /**
   * Show all books
   *
   * Get a JSON representation of all books
   *
   * @Get("/books")
   * @Transaction({
   *     @Response(200, attributes={
   *          @Attribute("levels", type="array", description=" An array of levels that indicate which the book belongs to. ", sample="[l1, l2, l3]", required=true),  
   *          @Attribute("title", type="string", description="The title of the book", sample="Math 1", required=true),
   *          @Attribute("description", type="string", description="The description of the book.", sample=" math 1 is about...", required=true),
   *          @Attribute("isbn", type="string", description="The isnb identification number of of the book", sample="123123123", required=true),
   *          @Attribute("coverImage", type="string", description="The Cover image identification number of of the book", sample="base64:sddsjhjhgshd", required=true),
   *          @Attribute("authors", type="array", description=" An array of authors who have written the book. ", sample="[a1, a2, a3]", required=true),
   *          @Attribute("genres", type="array", description=" An array of genres that indicate which the book belongs to. ", sample="[g1, g2, g3]", required=true),
   *          @Attribute("publishers", type="array", description=" An array of publishers that publishes the book. ", sample="[g1, g2, g3]", required=true),      
   *     }),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */



  $api->get('/books', ['resolver' => 'Book@getAll', 'uses' => 'App\Http\Controllers\RestController@retrieve']);


  /**
   * Show a book
   *
   * Get a JSON representation of one book given an id
   *
   * @Get("/book/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the book to retrieve."),
   *     @Parameter("showDeleted", type="boolean", required=false, description="If the query parameter 'showDeleted' is set to true, it will show deleted information (enrollments, books, etc.) about the boook as well.")
   * })
   * @Transaction({
   *     @Request("id=1"),
   *     @Response(200, attributes={
   *        @Attribute("levels", type="array", description=" An array of levels that indicate which the book belongs to. ", sample="[l1, l2, l3]", required=true),  
   *          @Attribute("title", type="string", description="The title of the book", sample="Math 1", required=true),
   *          @Attribute("description", type="string", description="The description of the book.", sample=" math 1 is about...", required=true),
   *          @Attribute("isbn", type="string", description="The isnb identification number of of the book", sample="123123123", required=true),
   *          @Attribute("coverImage", type="string", description="The Cover image identification number of of the book", sample="base64:sddsjhjhgshd", required=true),
   *          @Attribute("authors", type="array", description=" An array of authors who have written the book. ", sample="[a1, a2, a3]", required=true),
   *          @Attribute("genres", type="array", description=" An array of genres that indicate which the book belongs to. ", sample="[g1, g2, g3]", required=true),
   *          @Attribute("publishers", type="array", description=" An array of publishers that publishes the book. ", sample="[g1, g2, g3]", required=true),      
   *        }),
   *     @Response(400, body={"message": "No identifier was provided for the entity lookup or it was of invalid type."}),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->get('/book/{id}', ['resolver' => 'Book@get', 'uses' => 'App\Http\Controllers\RestController@retrieve']);

  /**
   * Create new book
   *
   * Create a new book with given details
   *
   * @Post("/book")
   * @Transaction({
   *     @Request(attributes={
   *        @Attribute("levels", type="array", description=" An array of levels that indicate which the book belongs to. ", sample="[l1, l2, l3]", required=true),  
   *          @Attribute("title", type="string", description="The title of the book", sample="Math 1", required=true),
   *          @Attribute("description", type="string", description="The description of the book.", sample=" math 1 is about...", required=true),
   *          @Attribute("isbn", type="string", description="The isnb identification number of of the book", sample="123123123", required=true),
   *          @Attribute("coverImage", type="string", description="The Cover image identification number of of the book", sample="base64:sddsjhjhgshd", required=true),
   *          @Attribute("authors", type="array", description=" An array of authors who have written the book. ", sample="[a1, a2, a3]", required=true),
   *          @Attribute("genres", type="array", description=" An array of genres that indicate which the book belongs to. ", sample="[g1, g2, g3]", required=true),
   *          @Attribute("publishers", type="array", description=" An array of publishers that publishes the book. ", sample="[g1, g2, g3]", required=true),      
   *               }),
   *     @Response(201, body="http://api.spidersmart.com/1"),
   *     @Response(422, body={"message": "The entity could not be created.", "errors": VALIDATION_ERROR_DOCUMENTATION })
   * })
   */
  $api->post('/books', ['resolver' => 'Book@create', 'uses' => 'App\Http\Controllers\RestController@create']);

  /**
   * Update book
   *
   * Updates a given book with given information
   *
   * @Put("/book/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the book to update.")
   * })
   * @Transaction({
   *     @Request("id=1", attributes={
   *       @Attribute("levels", type="array", description=" An array of levels that indicate which the book belongs to. ", sample="[l1, l2, l3]", required=true),  
   *          @Attribute("title", type="string", description="The title of the book", sample="Math 1", required=true),
   *          @Attribute("description", type="string", description="The description of the book.", sample=" math 1 is about...", required=true),
   *          @Attribute("isbn", type="string", description="The isnb identification number of of the book", sample="123123123", required=true),
   *          @Attribute("coverImage", type="string", description="The Cover image identification number of of the book", sample="base64:sddsjhjhgshd", required=true),
   *          @Attribute("authors", type="array", description=" An array of authors who have written the book. ", sample="[a1, a2, a3]", required=true),
   *          @Attribute("genres", type="array", description=" An array of genres that indicate which the book belongs to. ", sample="[g1, g2, g3]", required=true),
   *          @Attribute("publishers", type="array", description=" An array of publishers that publishes the book. ", sample="[g1, g2, g3]", required=true),      
   *                }),
   *     @Response(204),
   *     @Response(422, body={"message": "The entity could not be created.", "errors": VALIDATION_ERROR_DOCUMENTATION }),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->put('/book/{id}', ['resolver' => 'Book@update', 'uses' => 'App\Http\Controllers\RestController@update']);


  /**
   * Delete book
   *
   * Deletes a given book
   *
   * @Delete("/book/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the book to delete.")
   * })
   * @Transaction({
   *     @Request("id=1"),
   *     @Response(204),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->delete('/book/{id}', ['resolver' => 'Book@delete', 'uses' => 'App\Http\Controllers\RestController@delete']);




  /**
   * Show all publishers
   *
   * Get a JSON representation of all publishers
   *
   * @Get("/publishers")
   * @Transaction({
   *     @Response(200, attributes={
   *          @Attribute("id", type="number", description="The id of the publishers.", sample=1),
   *          @Attribute("name", type="string", description="The name of the publishers.", sample="Example Center"),
   *          @Attribute("type", type="string", description="The type of publishers. Either local or online.", sample="local"),
   *          @Attribute("dateFrom", type="date", description="The date on which this publishers became active.", sample="2018-01-01"),
   *          @Attribute("dateTo", type="date", description="The date on which this publishers became inactive.", sample="2018-01-01"),
   *          @Attribute("active", type="boolean", description="The current active status of the center.", sample="true"),
   *          @Attribute("books", type="array", description="The array of books that are currently in the publishers inventory. Please see [url] for more information.", sample="http://www.google.com/array")
   *     }),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
   


  $api->get('/publishers', ['resolver' => 'Publisher@getAll', 'uses' => 'App\Http\Controllers\RestController@retrieve']);


  /**
   * Show a publisher
   *
   * Get a JSON representation of one publisher given an id
   *
   * @Get("/publisher/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the genre to retrieve."),
   *     @Parameter("showDeleted", type="boolean", required=false, description="If the query parameter 'showDeleted' is set to true, it will show deleted information (enrollments, books, etc.) about the genre as well.")
   * })
   * @Transaction({
   *     @Request("id=1"),
   *     @Response(200, attributes={
   *          @Attribute("id", type="number", description="The id of the publishers.", sample=1),
   *          @Attribute("name", type="string", description="The name of the publishers.", sample="Example Center"),
   *          @Attribute("type", type="string", description="The type of publishers. Either local or online.", sample="local"),
   *          @Attribute("dateFrom", type="date", description="The date on which this publishers became active.", sample="2018-01-01"),
   *          @Attribute("dateTo", type="date", description="The date on which this publishers became inactive.", sample="2018-01-01"),
   *          @Attribute("active", type="boolean", description="The current active status of the center.", sample="true"),
   *          @Attribute("books", type="array", description="The array of books that are currently in the publishers inventory. Please see [url] for more information.", sample="http://www.google.com/array")
   *      }),
   *     @Response(400, body={"message": "No identifier was provided for the entity lookup or it was of invalid type."}),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->get('/publisher/{id}', ['resolver' => 'Publisher@get', 'uses' => 'App\Http\Controllers\RestController@retrieve']);

  /**
   * Create new publisher
   *
   * Create a new publisher with given details
   *
   * @Post("/publishers")
   * @Transaction({
   *     @Request(attributes={
   *          @Attribute("id", type="number", description="The id of the publishers.", sample=1),
   *          @Attribute("name", type="string", description="The name of the publishers.", sample="Example Center"),
   *          @Attribute("type", type="string", description="The type of publishers. Either local or online.", sample="local"),
   *          @Attribute("dateFrom", type="date", description="The date on which this publishers became active.", sample="2018-01-01"),
   *          @Attribute("dateTo", type="date", description="The date on which this publishers became inactive.", sample="2018-01-01"),
   *          @Attribute("active", type="boolean", description="The current active status of the center.", sample="true"),
   *          @Attribute("books", type="array", description="The array of books that are currently in the publishers inventory. Please see [url] for more information.", sample="http://www.google.com/array")
   *      }),
   *     @Response(201, body="http://api.spidersmart.com/1"),
   *     @Response(422, body={"message": "The entity could not be created.", "errors": VALIDATION_ERROR_DOCUMENTATION })
   * })
   */
  $api->post('/publishers', ['resolver' => 'Publisher@create', 'uses' => 'App\Http\Controllers\RestController@create']);

  /**
   * Update publisher
   *
   * Updates a given publisher with given information
   *
   * @Put("/publisher/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the genre to update.")
   * })
   * @Transaction({
   *     @Request("id=1", attributes={
   *          @Attribute("id", type="number", description="The id of the publishers.", sample=1),
   *          @Attribute("name", type="string", description="The name of the publishers.", sample="Example Center"),
   *          @Attribute("type", type="string", description="The type of publishers. Either local or online.", sample="local"),
   *          @Attribute("dateFrom", type="date", description="The date on which this publishers became active.", sample="2018-01-01"),
   *          @Attribute("dateTo", type="date", description="The date on which this publishers became inactive.", sample="2018-01-01"),
   *          @Attribute("active", type="boolean", description="The current active status of the center.", sample="true"),
   *          @Attribute("books", type="array", description="The array of books that are currently in the publishers inventory. Please see [url] for more information.", sample="http://www.google.com/array")
   *      }),
   *     @Response(204),
   *     @Response(422, body={"message": "The entity could not be created.", "errors": VALIDATION_ERROR_DOCUMENTATION }),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->put('/publisher/{id}', ['resolver' => 'Publisher@update', 'uses' => 'App\Http\Controllers\RestController@update']);


  /**
   * Delete publisher
   *
   * Deletes a given publisher
   *
   * @Delete("/publisher/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the genre to delete.")
   * })
   * @Transaction({
   *     @Request("id=1"),
   *     @Response(204),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->delete('/publisher/{id}', ['resolver' => 'Publisher@delete', 'uses' => 'App\Http\Controllers\RestController@delete']);
   
  /**
   * Show all users
   *
   * Get a JSON representation of all users
   *
   * @Get("/teacher")
   * @Transaction({
   *     @Response(200, attributes={
   *          @Attribute("id", type="number", description="The id of the teacher.", sample=1),
   *          @Attribute("type", type="string", description="The type of teacher. Either local or online.", sample="local"),
   *          @Attribute("email", type="string", description="The contact email for the teacher.", sample="example@teacherspidersmart.com"),
   *          @Attribute("prefix", type="string', description="The prefix for the teacher.", sample="Mr."),
   *          @Attribute("firstName", type="String",description="The first name of the teacher",sample="John"),
   *          @Attribute("middleName", type="String",description="The middle name of the teacher",sample="Edwin"),
   *          @Attribute("lastName",type="String",description="The last name of the teacer",sample="Doe"),
   *          @Attribute("suffix",type="String",description="The suffex of the teacher",sample=""),
   *          @Attribute("verified",type="Boolean",description="The verification of the techear",sample=""),
   *          @Attribute("dateFrom",type="DateTime",description="The date from the start of the service of the teacher",sample=""),
   *          @Attribute("dateTo",type="DateTime", description="The date to the service of the teacher is done",sample=""),
   *          @Attribute("active",type="Boolean",description="The status of the teahcer",sample=""),
   *          @Attribute("school",type="String",description="The school associated with the teacher", sample=""),
   *          @Attribute("student",type="Student",description="The student assigned to the teahcer",sample=""),
   *          @Attribute("addresses",type="[UserAddress]", description="The addresses of the teacher",sample=""),
   *          @Attribute("contacts",type="[UserContact]",description="the contacts of the teacher", sample="")          
   *          
   *     }),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  
  
  $api->get('/teachers', ['resolver' => 'Teachers@getAll', 'uses' => 'App\Http\Controllers\RestController@retrieve']);


  /**
   * Show a teacher
   *
   * Get a JSON representation of one teacher given an id
   *
   * @Get("/teacher/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the genre to retrieve."),
   *     @Parameter("showDeleted", type="boolean", required=false, description="If the query parameter 'showDeleted' is set to true, it will show deleted information (enrollments, books, etc.) about the genre as well.")
   * })
   * @Transaction({
   *     @Request("id=1"),
   *     @Response(200, attributes={
   *         @Attribute("id", type="number", description="The id of the teacher.", sample=1),
   *          @Attribute("type", type="string", description="The type of teacher. Either local or online.", sample="local"),
   *          @Attribute("email", type="string", description="The contact email for the teacher.", sample="example@teacherspidersmart.com"),
   *          @Attribute("prefix", type="string', description="The prefix for the teacher.", sample="Mr."),
   *          @Attribute("firstName", type="String",description="The first name of the teacher",sample="John"),
   *          @Attribute("middleName", type="String",description="The middle name of the teacher",sample="Edwin"),
   *          @Attribute("lastName",type="String",description="The last name of the teacer",sample="Doe"),
   *          @Attribute("suffix",type="String",description="The suffex of the teacher",sample=""),
   *          @Attribute("verified",type="Boolean",description="The verification of the techear",sample=""),
   *          @Attribute("dateFrom",type="DateTime",description="The date from the start of the service of the teacher",sample=""),
   *          @Attribute("dateTo",type="DateTime", description="The date to the service of the teacher is done",sample=""),
   *          @Attribute("active",type="Boolean",description="The status of the teahcer",sample=""),
   *          @Attribute("student",type="Student",description="The student assigned to the teahcer",sample=""),
   *          @Attribute("addresses",type="[UserAddress]", description="The addresses of the teacher",sample=""),
   *          @Attribute("contacts",type="[UserContact]",description="the contacts of the teacher", sample="")   
   * 
   *     }),
   *     @Response(400, body={"message": "No identifier was provided for the entity lookup or it was of invalid type."}),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->get('/teacher/{id}', ['resolver' => 'Teacher@get', 'uses' => 'App\Http\Controllers\RestController@retrieve']);

  /**
   * Create new teacher
   *
   * Create a new teacher with given details
   *
   * @Post("/teachers")
   * @Transaction({
   *     @Request(attributes={
   *          @Attribute("id", type="number", description="The id of the teacher.", sample=1),
   *          @Attribute("type", type="string", description="The type of teacher. Either local or online.", sample="local"),
   *          @Attribute("email", type="string", description="The contact email for the teacher.", sample="example@teacherspidersmart.com"),
   *          @Attribute("prefix", type="string', description="The prefix for the teacher.", sample="Mr."),
   *          @Attribute("firstName", type="String",description="The first name of the teacher",sample="John"),
   *          @Attribute("middleName", type="String",description="The middle name of the teacher",sample="Edwin"),
   *          @Attribute("lastName",type="String",description="The last name of the teacer",sample="Doe"),
   *          @Attribute("suffix",type="String",description="The suffex of the teacher",sample=""),
   *          @Attribute("verified",type="Boolean",description="The verification of the techear",sample=""),
   *          @Attribute("dateFrom",type="DateTime",description="The date from the start of the service of the teacher",sample=""),
   *          @Attribute("dateTo",type="DateTime", description="The date to the service of the teacher is done",sample=""),
   *          @Attribute("active",type="Boolean",description="The status of the teahcer",sample=""),
   *          @Attribute("student",type="Student",description="The student assigned to the teahcer",sample=""),
   *          @Attribute("addresses",type="[UserAddress]", description="The addresses of the teacher",sample=""),
   *          @Attribute("contacts",type="[UserContact]",description="the contacts of the teacher", sample="")   
   * 
   *     }),
   *     @Response(201, body="http://api.spidersmart.com/1"),
   *     @Response(422, body={"message": "The entity could not be created.", "errors": VALIDATION_ERROR_DOCUMENTATION })
   * })
   */
  $api->post('/teachers', ['resolver' => 'Teacher@create', 'uses' => 'App\Http\Controllers\RestController@create']);

  /**
   * Update teacher
   *
   * Updates a given teacher with given information
   *
   * @Put("/teacher/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the genre to update.")
   * })
   * @Transaction({
   *     @Request("id=1", attributes={
   *         @Attribute("id", type="number", description="The id of the teacher.", sample=1),
   *          @Attribute("type", type="string", description="The type of teacher. Either local or online.", sample="local"),
   *          @Attribute("email", type="string", description="The contact email for the teacher.", sample="example@teacherspidersmart.com"),
   *          @Attribute("prefix", type="string', description="The prefix for the teacher.", sample="Mr."),
   *          @Attribute("firstName", type="String",description="The first name of the teacher",sample="John"),
   *          @Attribute("middleName", type="String",description="The middle name of the teacher",sample="Edwin"),
   *          @Attribute("lastName",type="String",description="The last name of the teacer",sample="Doe"),
   *          @Attribute("suffix",type="String",description="The suffex of the teacher",sample=""),
   *          @Attribute("verified",type="Boolean",description="The verification of the techear",sample=""),
   *          @Attribute("dateFrom",type="DateTime",description="The date from the start of the service of the teacher",sample=""),
   *          @Attribute("dateTo",type="DateTime", description="The date to the service of the teacher is done",sample=""),
   *          @Attribute("active",type="Boolean",description="The status of the teahcer",sample=""),
   *          @Attribute("student",type="Student",description="The student assigned to the teahcer",sample=""),
   *          @Attribute("addresses",type="[UserAddress]", description="The addresses of the teacher",sample=""),
   *          @Attribute("contacts",type="[UserContact]",description="the contacts of the teacher", sample="")   
   * 
   *     }),
   *     @Response(204),
   *     @Response(422, body={"message": "The entity could not be created.", "errors": VALIDATION_ERROR_DOCUMENTATION }),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->put('/teacher/{id}', ['resolver' => 'Teacher@update', 'uses' => 'App\Http\Controllers\RestController@update']);


  /**
   * Delete teacher
   *
   * Deletes a given teacher
   *
   * @Delete("/teacher/{id}")
   * @Parameters({
   *     @Parameter("id", type="integer", required=true, description="The id of the genre to delete.")
   * })
   * @Transaction({
   *     @Request("id=1"),
   *     @Response(204),
   *     @Response(404, body={"message": "The entity could not be found.", "status": 404})
   * })
   */
  $api->delete('/teacher/{id}', ['resolver' => 'Teacher@delete', 'uses' => 'App\Http\Controllers\RestController@delete']);



});
