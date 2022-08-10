<?php
require 'vendor/autoload.php';
require_once 'helper.php';
use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

$client = new Client(['base_uri' => 'https://jsonplaceholder.typicode.com']);
$response = $client->get('/albums');

$body = $response->getBody();
$albums = json_decode($body,true);


$response = $client->get('/photos');
$body = $response->getBody();
$photos = json_decode($body,true);
$album_with_photos = array();
foreach($albums as $key => $val)
{
    
    $album = $albums[$key];
    $album['photos'] = array();
    
    //needs a bynary search of the album id with tracking the first id associated to the albumId to optimize time
    //because of the size of the array; 
    $index = binarySearch($photos,$album['userId']);
    $index = findFirstIndex($index,$photos, $album['userId']);
    for($i = $index; $i < count($photos) && $index != -1 ; $i++)
    {
        if($album['userId']  ==  $photos[$i]['albumId'])
        {
            array_push($album['photos'],$photos[$i]);
        }
        else if($album['userId']  > $photos[$i]['albumId'])
            break;
    }
    array_push($album_with_photos,json_encode($album));    
}

print_r($album_with_photos);

$album_with_photos = array();
foreach($albums as $key => $val)
{
    
    $album = $albums[$key];
    
    $response = $client->get("/albums/".$album['userId'].'/photos');
    $body = $response->getBody();
    $album['photos'] = json_decode($body,true);
    
    
    array_push($album_with_photos,json_encode($album));    
}

print_r($album_with_photos);
