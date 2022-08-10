<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->

<?php
defined('BASEPATH') OR exit('No direct script access allowed');

include 'header.php';
// put your code here
?>


<style>

    th {
        background-color: #4CAF50;
        color: white;
    }
    tr:nth-child(even){background-color: #f2f2f2}  

    .keep{

        border:1px inset black;
        position:relative;
        left:80px;
        width:19px;
        height:19px;
    }
    .discard{

        border:1px inset black;
        position:relative;
        left:80px;
        width:19px;
        height:19px;
    }
</style>
<div id="action-buttons">
    <button id="process">Process</button> <button id="fetch-data">Fetch-Data-From-servers</button>
</div>

<div id="ajax-token" value ="<?php echo $ajaxtoken; ?>"></div>
<div id="fetch" value ="<?php echo $fetch; ?>"></div>
<section id="main-left">

    <div class= "center-left" style="overflow-x:auto;" >
        <table style="width:100%;text-align:center;" id="records">
            <tr>
                <th><h3>ID</h3></th>
            <th><h3>Doctor</h3></th>
            <th><h3>Drug</h3></th>
            <th><h3>Q1</h3></th>
            <th><h3>Q2</h3></th>
            <th><h3>Q3</h3></th>
            <th><h3>Q4</h3></th>
            <th><h3>Q5</h3></th>
            <th><h3>Q6</h3></th>
            <th><h3>Q7</h3></th>
            <th><h3>Q8</h3></th>
            <th><h3>Q9</h3></th>
            <th><h3>Q10</h3></th>

            </tr> 
            <?php
            $i = 0;
            $storedId = array();

            while ($data = mysqli_fetch_assoc($result)) {


                echo '<tr id ="data' . $data['id'] . '" >';

                echo'<td id="id" value="' . $data['id'] . '"><h3>' . $data['id'] . '</h3></td>';
                echo'<td><h3>' . $performActionOnDatabaseTables->fetchDoctorFromAssignments($data['code'], $db) . '</h3></td>';
                echo'<td id ="code" value="' . $data['code'] . '"><h3>' . $data['code'] . '</h3></td>';

                echo'<td id="q1" value = "' . $data['q1'] . '"><h3>' . $data['q1'] . '</h3></td>';
                echo'<td id="q2" value = "' . $data['q2'] . '"><h3>' . $data['q2'] . '</h3></td>';
                echo'<td id="q3" value = "' . $data['q3'] . '"><h3>' . $data['q3'] . '</h3></td>';
                echo'<td id="q4" value = "' . $data['q4'] . '" ><h3>' . $data['q4'] . '</h3></td>';
                echo'<td id="q5" value = "' . $data['q5'] . '"><h3>' . $data['q5'] . '</h3></td>';
                echo'<td id="q6" value = "' . $data['q6'] . '"><h3>' . $data['q6'] . '</h3></td>';
                if (count(explode('-', $data['q6']) == 1)) {
                    echo'<td id="q7" value = "' . $data['q7'] . '"><h3>' . $data['q7'] . '</h3></td>';
                    echo'<td id="q8" value = "' . $data['q8'] . '"><h3>' . $data['q8'] . '</h3></td>';
                   
                }

                echo'</tr>';
                $storedId[$i] = $data['id'];

                $i++;
            };
            ?>

        </table> 





    </div>
    <div class="center-right " style="overflow-x:auto;">          

        <table style="width:100%;text-align:center;" id="checkboxes">
            <tr class="header">
                <th><h3>Keep</h3></th>
            <th><h3>Discard</h3></th>                
            </tr>
<?php
$lenght = count($storedId);
for ($y = 0; $y < $lenght; $y++) {


    echo'<tr class ="checkboxes" id="' . $storedId[$y] . '">';
    echo '<td><h3><div class="keep" id="keep' . $storedId[$y] . '"></div></h3></td>';
    echo '<td><div class="discard" id="discard' . $storedId[$y] . '"></div></td>';
    echo '</tr>';
}
?>

        </table>        

        <div class ="numbers-of-fields" id="<?php echo $storedId[$lenght - 1] ?>"></div> 
        <div class ="total-fields-processed" id="<?php echo $i ?>"></div> 
    </div> 
    <div id="missed-fields" >
        <p>
            <span class="ui-icon ui-icon-circle-check" style="float:left; margin:0 7px 50px 0;"></span>
            You have not evaluated all the fields 
        </p>

    </div>

    <div id="compleated-all-fields" >
        <p>
            <span class="ui-icon ui-icon-circle-check" style="float:left; margin:0 7px 50px 0;"></span>
            Are you sure you want to continue???????????????
        </p>

    </div>

</section>

<?php
include_once"footer.php";
?>