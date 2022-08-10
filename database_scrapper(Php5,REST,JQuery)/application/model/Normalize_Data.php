<?php

/*
 * File : Normilize_Data.php
 *  it Normilize the data so there is only 1 type of out put , That is integers 
 * 
 * 
 * 
 * 
 */



error_reporting(0);
ini_set('display_errors', '0');

class Normalize_Data {

    //put your code here


    function normalize_data($data) {

        switch ($data) {
            case "Strongly Agree": {
                    return '5';
                    break;
                }
            case "Agree": {
                    return '4';
                    break;
                }
            case "Neutral": {
                    return '3';
                    break;
                }
            case 'Disagree': {
                    return '2';
                    break;
                }
            case 'Strongly Disagree': {
                    return '1';
                    break;
                }

            case 'Yes': {

                    return '1';
                    break;
                }
            case 'No': {

                    return '2';
                    break;
                }
            case '[0]Strongly Agree': {
                    return '5';
                }
            case '[1]Agree': {
                    return '4';
                }
            case "[2]Neutral": {
                    return '3';
                    break;
                }
            case '[3]Disagree': {
                    return '2';
                    break;
                }
            case '[4]Strongly Disagree': {
                    return '1';
                    break;
                }
            case '[0]Yes': {

                    return '1';
                    break;
                }
            case '[1]No': {

                    return '2';
                    break;
                }


            default: {


                    $separated_data = explode(",", $data);

            
                    $number_of_felds = count($separated_data);
                    $splited = false;
                    $string = strlen($separated_data[0]);
                    




                        for ($i = 0; $i < $number_of_felds && $string > 1; $i++) {
                            $splited = true;



                            switch (trim($separated_data[$i])) {
                                /*                                 * ****************************************************Gilead bewell Zydelig***************************************************************** */

                                case 'What Is Relapsed Chronic Lymphocytic Leukemia (CLL)?': {
                                        $result.= 1 . '-';
                                        break;
                                    }
                                case 'What Is Relapsed Follicular B-cell non-Hodgkin Lymphoma (FL)? (if applicable)': {
                                        $result.= 2 . '-';
                                        break;
                                    }
                                case 'Diagnosis and Treatment of Relapsed Disease': {
                                        $result.= 3 . '-';
                                        break;
                                    }
                                case 'Information About ZYDELIG (idelalisib) and Important Safety Information': {
                                        $result.= 4 . '-';
                                        break;
                                    }
                                case 'Patient Support: AccessConnect': {
                                        $result.= 5 . '<text style="font-size:10px;">Patient Support: AccessConnect</text>-';
                                        break;
                                    }
                                case 'Healthy Living Tips': {
                                        $result.= 6 . '-';
                                        break;
                                    }
                                case 'Tips for Caregivers': {
                                        $result.= '<text style="font-size:10px;">Tips for Caregivers</text>-';
                                        break;
                                    }
                                /*                                 * ***************************************End gilead *************************************************** */

                                /*                                 * ******************************************** Simponi ******************************************************* */

                                case '[0]About Rheumatoid Arthritis': {
                                        $result.= 1 . '-';
                                        break;
                                    }
                                case '[1]Living With Rheumatoid Arthritis': {
                                        $result.= 2 . '-';
                                        break;
                                    }
                                case '[2]Infusion Therapy for Moderate to Severe Rheumatoid Arthritis': {
                                        $result.= 3 . '-';
                                        break;
                                    }
                                case '[3]Information about a biologic treatment and Important Safety Information': {
                                        $result.= 4 . '-';
                                        break;
                                    }
                                case '[4]Medication Cost Support and Treatment Support Services': {
                                        $result.= 5 . '-';
                                        break;
                                    }
                                /*                                 * ******************************************************End Simponi *************************************************** */
                                /*                                 * *****************************************************Otezla*********************************************************** */

                                case 'Chapter 2': {
                                        $result.= 1 . '-';
                                        break;
                                    }
                                case 'Chapter 3': {
                                        $result.= 2 . '-';
                                        break;
                                    }
                                case 'Chapter 4': {
                                        $result.= 3 . '-';
                                        break;
                                    }
                                case 'Chapter 5': {
                                        $result.= 4 . '-';
                                        break;
                                    }
                                case 'Chapter 6': {
                                        $result.= 5 . '-';
                                        break;
                                    }
                                case 'What Are Psoriatic Arthritis and Plaque Psoriasis?': {

                                        $result .= 1 . '-';
                                        break;
                                    }
                                case 'Symptoms and Treatment Options': {
                                        $result .= 2 . '-';
                                        break;
                                    }
                                case 'About Otezla': {
                                        $result .= 3 . '-';
                                        break;
                                    }
                                case 'Taking Otezla': {
                                        $result .= 4 . '-';
                                        break;
                                    }
                                case 'Healthy Living Tips': {
                                        $result .= 5 . '-';
                                        break;
                                    }
                                default: {



                                        $result.= $separated_data[$i].'-';
                                        break;
                                    }
                            }//end switch
                        }//end for
                   
                    if ($splited) {

                        $spliced = false;
                        return $result;
                    } else {
                        return $data;
                    }
                    break;
                }//end default
        }//end switch
    }

//end normilie data
}

//end class
?>