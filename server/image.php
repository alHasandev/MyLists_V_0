<?php

// dir path
$dir = '../assets/images/User_Avatars/';

const exclude = [
  '.',
  '..'
];

// get user request parameter
function getParam($param)
{
  return isset($_GET[$param]) ? $_GET[$param] : false;
}


if (!isset($_GET['path'])) {
  $with_path = 'false';
} else {
  $with_path = $_GET['path'];
}

// prepare dummy data
$dummy = [
  [
    'Name' => 'user-grey.png',
    'size' => '20013',
    'resolution' => '320x320'
  ],
  [
    'Name' => 'user-black.png',
    'size' => '40212',
    'resolution' => '320x320'
  ],
  [
    'Name' => 'user-transparent.png',
    'size' => '10313',
    'resolution' => '320x320'
  ]
];

// return param
// echo getParam('get-image');
// echo json_encode($dummy);

function getImages($dir, $path = 'false')
{
  $images = glob($dir . '*.png');
  $images = array_merge($images, glob($dir . '*.jpg'));
  // $images = array_values(array_diff($images, exclude));
  // $images = getBaseNames($images);
  // print_r($images);
  return $path === 'true' ? $images : getBaseNames($images);
}

function getBaseNames($paths)
{
  $result = [];
  foreach ($paths as $path) {
    array_push($result, basename($path));
    // echo $path;
    // print_r($path);
  }

  return $result;
}

// return json
echo json_encode(getImages($dir, $with_path));
