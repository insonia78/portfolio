<?php
error_reporting(0);
    header("Content-type: application/octet-stream");
    header("Content-Disposition: attachment; filename=export.xls");
    header("Pragma: no-cache");
    header("Expires: 0");
 include ('config.php');
$sql = "SELECT AssignID,AssignStatus,therapeuticArea,repname,repcell,repemail,partname,part2name,shootdate,shoottimehrs,shoottimemins,ampm,practicename,practicestreet,practicecity,practicestate,practicezip,practicephone FROM assignments where AssignStatus = 'filmed'";
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
//////////////////////////////////
        $s=5;
        $objPHPExcel->getDefaultStyle()->getAlignment()->setHorizontal(PHPExcel_Style_Alignment::HORIZONTAL_LEFT);
        $objPHPExcel->setActiveSheetIndex(0)->mergeCells('B2:E2');
        $objPHPExcel->getActiveSheet()->getCell('B2')->setValue('Filmed Report');      
        $objPHPExcel->getActiveSheet()->getCell('B4')->setValue('Number');
        $objPHPExcel->getActiveSheet()->getCell('C4')->setValue('Film Status');
        $objPHPExcel->getActiveSheet()->getCell('D4')->setValue('Brand');
        $objPHPExcel->getActiveSheet()->getCell('E4')->setValue('Branded or Unbranded');
        $objPHPExcel->getActiveSheet()->getCell('F4')->setValue('Field Sales Representative');
        $objPHPExcel->getActiveSheet()->getCell('G4')->setValue('Participants Names');
        $objPHPExcel->getActiveSheet()->getCell('H4')->setValue('Shoot Date');
        $objPHPExcel->getActiveSheet()->getCell('I4')->setValue('Shoot Time');
        $objPHPExcel->getActiveSheet()->getCell('J4')->setValue('Video Shoot Location');
        $objPHPExcel->getActiveSheet()->getStyle('B4:C4')->applyFromArray($smalltitle_style);
        $objPHPExcel->getActiveSheet()->getStyle('D4:E4')->applyFromArray($smalltitle_style);
        $objPHPExcel->getActiveSheet()->getStyle('F4:G4')->applyFromArray($smalltitle_style);
        $objPHPExcel->getActiveSheet()->getStyle('H4:I4')->applyFromArray($smalltitle_style);
        $objPHPExcel->getActiveSheet()->getStyle('J4')->applyFromArray($smalltitle_style);
        $objPHPExcel->getActiveSheet()->getStyle('B2')->applyFromArray($main_title_style);
        
    while ($row = mysql_fetch_assoc($rec)) {
    if($row['therapeuticArea']==''){ $brnd_un = 1;}  else {$brnd_un =$row['therapeuticArea'];}
            $objPHPExcel->getActiveSheet()->getCell('B'.$s)->setValue($row['AssignID']);
            $objPHPExcel->getActiveSheet()->getCell('C'.$s)->setValue($row['AssignStatus']);
            $objPHPExcel->getActiveSheet()->getCell('D'.$s)->setValue($row['therapeuticArea']); 
            $objPHPExcel->getActiveSheet()->getCell('E'.$s)->setValue($brnd_un); 
            $objPHPExcel->getActiveSheet()->getCell('F'.$s)->setValue($row['repname'].' '.$row['repcell'].' '.$row['repemail']);
            $objPHPExcel->getActiveSheet()->getCell('G'.$s)->setValue($row['partname'].' '.$row['part2name']);
            $objPHPExcel->getActiveSheet()->getCell('H'.$s)->setValue($row['shootdate']);
            $objPHPExcel->getActiveSheet()->getCell('I'.$s)->setValue($row['shoottimehrs'].':'.$row['shoottimemins'].':'.$row['ampm']);
            $objPHPExcel->getActiveSheet()->getCell('J'.$s)->setValue($row['practicename'].' '.$row['practicestreet'].' '.$row['practicecity'].','.$row['practicestate'].','.$row['practicezip'].' '.$row['practicephone']);
           
     $s++;}
    
     //////////////////////////////////////////////
// Set active sheet index to the first sheet, so Excel opens this as the first sheet
$objPHPExcel->setActiveSheetIndex(0);

// Redirect output to a client’s web browser (Excel5)
header('Content-Type: application/vnd.ms-excel');
header('Content-Disposition: attachment;filename="filmed Report-'.date('Ymd h_i_s ').'.xls"');
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