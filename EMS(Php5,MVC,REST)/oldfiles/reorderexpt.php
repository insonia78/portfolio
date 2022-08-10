<?php
error_reporting(0);
    header("Content-type: application/octet-stream");
    header("Content-Disposition: attachment; filename=export.xls");
    header("Pragma: no-cache");
    header("Expires: 0");
 include ('config.php');
$sql = "SELECT * FROM reorders";
$rec = mysql_query($sql) or die (mysql_error());

ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);
date_default_timezone_set('Europe/London');
if (PHP_SAPI == 'cli')
	die('This example should only be run from a Web Browser');

/** Include PHPExcel */
require_once ('Classes/PHPExcel.php');

// Create new PHPExcel object
$objPHPExcel = new PHPExcel();

// Set document properties
$objPHPExcel->getProperties()->setCreator("Maarten Balliauw")
							 ->setLastModifiedBy("Maarten Balliauw")
							 ->setTitle("Office 2007 XLSX Test Document")
							 ->setSubject("Office 2007 XLSX Test Document")
							 ->setDescription("Test document for Office 2007 XLSX, generated using PHP classes.")
							 ->setKeywords("office 2007 openxml php")
							 ->setCategory("Test result file");


        $main_title_style = array(
            'font'  => array(
                'bold'  => true,
                'color' => array('rgb' => '31849b'),
                'size'  => 20,
                
            ));
        $smalltitle_style = array(
            'font'  => array(
                'bold'  => true,
                'size'  => 12
            ),
            'alignment' => array(
                    'wrap'       => true
            )
        ); 
$objPHPExcel->getActiveSheet()->getColumnDimension('B')->setAutoSize(true); 
$objPHPExcel->getActiveSheet()->getColumnDimension('C')->setAutoSize(true); 
$objPHPExcel->getActiveSheet()->getColumnDimension('D')->setAutoSize(true); 
$objPHPExcel->getActiveSheet()->getColumnDimension('E')->setAutoSize(true); 
$objPHPExcel->getActiveSheet()->getColumnDimension('F')->setAutoSize(true); 
$objPHPExcel->getActiveSheet()->getColumnDimension('G')->setAutoSize(true); 
$objPHPExcel->getActiveSheet()->getColumnDimension('H')->setAutoSize(true); 
$objPHPExcel->getActiveSheet()->getColumnDimension('I')->setAutoSize(true); 
$objPHPExcel->getActiveSheet()->getColumnDimension('J')->setAutoSize(true);
$objPHPExcel->getActiveSheet()->getColumnDimension('K')->setAutoSize(true);
//////////////////////////////////
        $s=5;
        $objPHPExcel->getDefaultStyle()->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
        $objPHPExcel->setActiveSheetIndex(0)->mergeCells('B2:E2');
        $objPHPExcel->getActiveSheet()->getCell('B2')->setValue('Reorder Report');      
        $objPHPExcel->getActiveSheet()->getCell('B4')->setValue('Reorder Number');
        $objPHPExcel->getActiveSheet()->getCell('C4')->setValue('Job Number');
        $objPHPExcel->getActiveSheet()->getCell('D4')->setValue('Brand');
        $objPHPExcel->getActiveSheet()->getCell('E4')->setValue('Field Sales Representative');
        $objPHPExcel->getActiveSheet()->getCell('F4')->setValue('Participants Names');
        $objPHPExcel->getActiveSheet()->getCell('G4')->setValue('Shoot Date');
        $objPHPExcel->getActiveSheet()->getCell('H4')->setValue('DVD Quantity');
        $objPHPExcel->getActiveSheet()->getCell('I4')->setValue('Display Quantity');
        $objPHPExcel->getActiveSheet()->getCell('J4')->setValue('Notes');
        $objPHPExcel->getActiveSheet()->getCell('K4')->setValue('Shipped');
        $objPHPExcel->getActiveSheet()->getStyle('B4:C4')->applyFromArray($smalltitle_style);
        $objPHPExcel->getActiveSheet()->getStyle('D4:E4')->applyFromArray($smalltitle_style);
        $objPHPExcel->getActiveSheet()->getStyle('F4:G4')->applyFromArray($smalltitle_style);
        $objPHPExcel->getActiveSheet()->getStyle('H4:I4')->applyFromArray($smalltitle_style);
        $objPHPExcel->getActiveSheet()->getStyle('J4:K4')->applyFromArray($smalltitle_style);
        $objPHPExcel->getActiveSheet()->getStyle('B2')->applyFromArray($main_title_style);
        
    while ($row = mysql_fetch_assoc($rec)) {
     $ass_id = $row['AssignID'];
    $query = "select AssignID,therapeuticArea,partname,part2name,shootdate,repcell,repemail,repname from assignments where AssignID =$ass_id";
    $result = mysql_query($query);
    if(mysql_num_rows($result)>0){
        $reorder = mysql_fetch_assoc($result);
    }else{
        $reorder['AssignID'] = '';
        $reorder['therapeuticArea'] = '';
        $reorder['repcell'] = '';
        $reorder['repemail'] = '';
        $reorder['repname'] = '';
        $reorder['partname'] = '';
        $reorder['part2name'] = '';
        $reorder['shootdate'] = '';
    }
            $objPHPExcel->getActiveSheet()->getCell('B'.$s)->setValue($row['reordernum']);
            $objPHPExcel->getActiveSheet()->getCell('C'.$s)->setValue($reorder['AssignID']);
            $objPHPExcel->getActiveSheet()->getCell('D'.$s)->setValue($reorder['therapeuticArea']); 
            $objPHPExcel->getActiveSheet()->getCell('E'.$s)->setValue($reorder['repname'].' '.$reorder['repcell'].' '.$reorder['repemail']);
            $objPHPExcel->getActiveSheet()->getCell('F'.$s)->setValue($reorder['partname'].' '.$reorder['part2name']);
            $objPHPExcel->getActiveSheet()->getCell('G'.$s)->setValue($reorder['shootdate']);
            $objPHPExcel->getActiveSheet()->getCell('H'.$s)->setValue($row['dvdquantity']);
            $objPHPExcel->getActiveSheet()->getCell('I'.$s)->setValue($row['dvdholdersquantity']);
            $objPHPExcel->getActiveSheet()->getCell('J'.$s)->setValue($row['reordernotes']);
            $objPHPExcel->getActiveSheet()->getCell('K'.$s)->setValue($row['shipped']);
     $s++;}
    
     //////////////////////////////////////////////
// Set active sheet index to the first sheet, so Excel opens this as the first sheet
$objPHPExcel->setActiveSheetIndex(0);

// Redirect output to a client’s web browser (Excel5)
header('Content-Type: application/vnd.ms-excel');
header('Content-Disposition: attachment;filename="Reorder Report-'.date('Ymd h_i_s ').'.xls"');
header('Cache-Control: max-age=0');
// If you're serving to IE 9, then the following may be needed
header('Cache-Control: max-age=1');

// If you're serving to IE over SSL, then the following may be needed
header ('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
header ('Last-Modified: '.gmdate('D, d M Y H:i:s').' GMT'); // always modified
header ('Cache-Control: cache, must-revalidate'); // HTTP/1.1
header ('Pragma: public'); // HTTP/1.0

$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
$objWriter->save('php://output');
exit;

?>