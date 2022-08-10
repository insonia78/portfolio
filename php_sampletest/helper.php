<?php
function binarySearch(Array $arr, $x)
{
    // check for empty array
    if (count($arr) === 0) return -1;
    $low = 0;
    $high = count($arr) - 1;
      
    while ($low <= $high) {
          
        // compute middle index
        $mid = floor(($low + $high) / 2);
   
        // element found at mid
        if($arr[$mid]['albumId'] == $x) {
            return $mid;
        }
  
        if ($x < $arr[$mid]['albumId']) {
            // search the left side of the array
            $high = $mid -1;
        }
        else {
            // search the right side of the array
            $low = $mid + 1;
        }
    }
      
    // If we reach here element x doesnt exist
    return -1;
}
function findFirstIndex($index,Array $arr, $x)
{
    if($index != -1)
       return $index;
    $value = 0;
    for($i = $index; $i >=0;$i--)
    {
        if($arr[i]['albumId'] !== $x)
        {
            $value = ++$i;
            break;
        }
        else
        {
          $value = $i;
        }

    }
    return $value;
}
