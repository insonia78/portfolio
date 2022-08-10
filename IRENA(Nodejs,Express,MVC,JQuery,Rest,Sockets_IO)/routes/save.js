/*
 * Copyright 2018 Acelerex Inc.
 */
const PATH_SEP = "/";
const mkdirp = require('mkdirp');
const fs2 = require('fs-extra');
var path = require('path');

var APIconfig = require('./config');


exports.es_save_to_db = function (req, callback) {
  try {
    console.log('Starting Save to DB');
    console.log('Validating Data');
    //console.log(req.body);
    //var db_username = req.body.username;
    {
      var db_username = req.bodyusername;
      var db_project = req.bodyproject;
      var db_run = req.bodyrun;
      var db_country = req.bodycountry;
      var db_eneffpower = req.bodyeneffpower;
      var db_eneffeng = req.bodyeneffeng;
      var db_eneffcost = req.bodyeneffcost;
      var db_demrespower = req.bodydemrespower;
      var db_demreseng = req.bodydemreseng;
      var db_demrescost = req.bodydemrescost;
      var db_distpvpower = req.bodydistpvpower;
      var db_distpveng = req.bodydistpveng;
      var db_distpvcost = req.bodydistpvcost;
      var db_windcost = req.bodywindcost;
      var db_solarcost = req.bodysolarcost;
      var db_basewind = req.bodybasewind;
      var db_userbasewind = req.bodyuserbasewind;
      var db_windpeakcap = req.bodywindpeakcap;
      var db_basesolar = req.bodybasesolar;
      var db_userbasesolar = req.bodyuserbasesolar;
      var db_solarpeakcap = req.bodysolarpeakcap;
      var db_hydrores1 = 0;
      var db_hydrores2 = 0;
      var db_hydrores3 = 0;
      var db_p_reserves = 0;
      var db_s_reserves = 0;
      var db_t_reserves = 0;
      var db_esrt2c = req.bodyesrt2c;
      var db_esrt1c = req.bodyesrt1c;
      var db_esrt5c = req.bodyesrt5c;
      var db_esrt25c = req.bodyesrt25c;
      var db_escost2c = req.bodyescost2c;
      var db_escost1c = req.bodyescost1c;
      var db_escost5c = req.bodyescost5c;
      var db_escost25c = req.bodyescost25c;
      var db_esfom2c = req.bodyesfom2c;
      var db_esfom1c = req.bodyesfom1c;
      var db_esfom5c = req.bodyesfom5c;
      var db_esfom25c = req.bodyesfom25c;
      var db_esvom2c = req.bodyesvom2c;
      var db_esvom1c = req.bodyesvom1c;
      var db_esvom5c = req.bodyesvom5c;
      var db_esvom25c = req.bodyesvom25c;
      var db_popul = req.bodypopul;
      var db_carboncost = req.bodycarboncost;
      var db_translength = req.bodytranslength;
      var db_distlength = req.bodydistlength;
      var db_planresmargin = req.bodyplanresmargin;
      var db_transcongind = req.bodytranscongind;
      var db_demforrisk = req.bodydemforrisk;
      var db_geodivind = req.bodygeodivind;
      var db_outageIndices = req.bodyoutageIndices;
      var db_vallossload = req.bodyvallossload;
      var db_renoutforrisk = req.bodyrenoutforrisk;
      var db_freregvalue = 0;
      var db_peakcapital = 0;
      var db_convfactor = 0;
      var db_demandprofile1 = req.bodydemandprofile1;
      var db_demandprofile2 = req.bodydemandprofile2;
      var db_userdemandprofile1 = req.bodyuserdemandprofile1;
      var db_userdemandprofile2 = req.bodyuserdemandprofile2;


      var db_inputpeak1 = 0;
      var db_inputpeak2 = 0;
      var db_inputenergy1 = 0;
      var db_inputenergy2 = 0;
      var db_peakdemgrowrt1 = 0;
      var db_peakdemgrowrt2 = 0;
      var db_energydemgrowrt1 = 0;
      var db_energydemgrowrt2 = 0;
      var db_windcappol1 = 0;
      var db_windcappol2 = 0;
      var db_solarcappol1 = 0;
      var db_solarcappol2 = 0;
      var db_windcap1 = 0;
      var db_windcap2 = 0;
      var db_solarcap1 = 0;
      var db_solarcap2 = 0;
      var db_hypmax1 = 0;
      var db_hypmax2 = 0;
      var db_hydroEng0101 = 0;
      var db_hydroEng0102 = 0;
      var db_hydroEng0103 = 0;
      var db_hydroEng0104 = 0;
      var db_hydroEng0105 = 0;
      var db_hydroEng0106 = 0;
      var db_hydroEng0107 = 0;
      var db_hydroEng0108 = 0;
      var db_hydroEng0109 = 0;
      var db_hydroEng0110 = 0;
      var db_hydroEng0111 = 0;
      var db_hydroEng0112 = 0;
      var db_hydroEng0201 = 0;
      var db_hydroEng0202 = 0;
      var db_hydroEng0203 = 0;
      var db_hydroEng0204 = 0;
      var db_hydroEng0205 = 0;
      var db_hydroEng0206 = 0;
      var db_hydroEng0207 = 0;
      var db_hydroEng0208 = 0;
      var db_hydroEng0209 = 0;
      var db_hydroEng0210 = 0;
      var db_hydroEng0211 = 0;
      var db_hydroEng0212 = 0;

      //    if (req.body.eneffpower == "") { db_eneffpower = 0; } else { if (isNaN(req.body.eneffpower)) { db_eneffpower = 0; } else { db_eneffpower = req.body.eneffpower; } }
      //    if (req.body.eneffeng == "") { db_eneffeng = 0; } else { if (isNaN(req.body.eneffeng)) { db_eneffeng = 0; } else { db_eneffeng = req.body.eneffeng; } }
      //    if (req.body.eneffcost == "") { db_eneffcost = 0; } else { if (isNaN(req.body.eneffcost)) { db_eneffcost = 0; } else { db_eneffcost = req.body.eneffcost; } }
      //    if (req.body.demrespower == "") { db_demrespower = 0; } else { if (isNaN(req.body.demrespower)) { db_demrespower = 0; } else { db_demrespower = req.body.demrespower; } }
      //    if (req.body.demreseng == "") { db_demreseng = 0; } else { if (isNaN(req.body.demreseng)) { db_demreseng = 0; } else { db_demreseng = req.body.demreseng; } }
      //    if (req.body.demrescost == "") { db_demrescost = 0; } else { if (isNaN(req.body.demrescost)) { db_demrescost = 0; } else { db_demrescost = req.body.demrescost; } }
      //    if (req.body.distpvpower == "") { db_distpvpower = 0; } else { if (isNaN(req.body.distpvpower)) { db_distpvpower = 0; } else { db_distpvpower = req.body.distpvpower; } }
      //    if (req.body.distpveng == "") { db_distpveng = 0; } else { if (isNaN(req.body.distpveng)) { db_distpveng = 0; } else { db_distpveng = req.body.distpveng; } }
      //    if (req.body.distpvcost == "") { db_distpvcost = 0; } else { if (isNaN(req.body.distpvcost)) { db_distpvcost = 0; } else { db_distpvcost = req.body.distpvcost; } }
      //    if (req.body.windcost == "") { db_windcost = 0; } else { if (isNaN(req.body.windcost)) { db_windcost = 0; } else { db_windcost = req.body.windcost; } }
      //    if (req.body.solarcost == "") { db_solarcost = 0; } else { if (isNaN(req.body.solarcost)) { db_solarcost = 0; } else { db_solarcost = req.body.solarcost; } }
      //    if (req.body.windpeakcap == "") { db_windpeakcap = 0; } else { if (isNaN(req.body.windpeakcap)) { db_windpeakcap = 0; } else { db_windpeakcap = req.body.windpeakcap; } }
      //    if (req.body.solarpeakcap == "") { db_solarpeakcap = 0; } else { if (isNaN(req.body.solarpeakcap)) { db_solarpeakcap = 0; } else { db_solarpeakcap = req.body.solarpeakcap; } }
      if (req.bodyhydrores1 == "") { db_hydrores1 = 0; } else { if (isNaN(req.bodyhydrores1)) { db_hydrores1 = 0; } else { db_hydrores1 = req.bodyhydrores1; } }
      if (req.bodyhydrores2 == "") { db_hydrores2 = 0; } else { if (isNaN(req.bodyhydrores2)) { db_hydrores2 = 0; } else { db_hydrores2 = req.bodyhydrores2; } }
      if (req.bodyhydrores3 == "") { db_hydrores3 = 0; } else { if (isNaN(req.bodyhydrores3)) { db_hydrores3 = 0; } else { db_hydrores3 = req.bodyhydrores3; } }
      if (req.bodyp_reserves == "") { db_p_reserves = 0; } else { if (isNaN(req.bodyp_reserves)) { db_p_reserves = 0; } else { db_p_reserves = req.bodyp_reserves; } }
      if (req.bodys_reserves == "") { db_s_reserves = 0; } else { if (isNaN(req.bodys_reserves)) { db_s_reserves = 0; } else { db_s_reserves = req.bodys_reserves; } }
      if (req.bodyt_reserves == "") { db_t_reserves = 0; } else { if (isNaN(req.bodyt_reserves)) { db_t_reserves = 0; } else { db_t_reserves = req.bodyt_reserves; } }
      //    if (req.body.esrt2c == "") { db_esrt2c = 0; } else { if (isNaN(req.body.esrt2c)) { db_esrt2c = 0; } else { db_esrt2c = req.body.esrt2c; } }
      //    if (req.body.esrt1c == "") { db_esrt1c = 0; } else { if (isNaN(req.body.esrt1c)) { db_esrt1c = 0; } else { db_esrt1c = req.body.esrt1c; } }
      //    if (req.body.esrt5c == "") { db_esrt5c = 0; } else { if (isNaN(req.body.esrt5c)) { db_esrt5c = 0; } else { db_esrt5c = req.body.esrt5c; } }
      //    if (req.body.esrt25c == "") { db_esrt25c = 0; } else { if (isNaN(req.body.esrt25c)) { db_esrt25c = 0; } else { db_esrt25c = req.body.esrt25c; } }
      //    if (req.body.escost2c == "") { db_escost2c = 0; } else { if (isNaN(req.body.escost2c)) { db_escost2c = 0; } else { db_escost2c = req.body.escost2c; } }
      //    if (req.body.escost1c == "") { db_escost1c = 0; } else { if (isNaN(req.body.escost1c)) { db_escost1c = 0; } else { db_escost1c = req.body.escost1c; } }
      //    if (req.body.escost5c == "") { db_escost5c = 0; } else { if (isNaN(req.body.escost5c)) { db_escost5c = 0; } else { db_escost5c = req.body.escost5c; } }
      //    if (req.body.escost25c == "") { db_escost25c = 0; } else { if (isNaN(req.body.escost25c)) { db_escost25c = 0; } else { db_escost25c = req.body.escost25c; } }
      //    if (req.body.carboncost == "") { db_carboncost = 0; } else { if (isNaN(req.body.carboncost)) { db_carboncost = 0; } else { db_carboncost = req.body.carboncost; } }
      //    if (req.body.translength == "") { db_translength = 0; } else { if (isNaN(req.body.translength)) { db_translength = 0; } else { db_translength = req.body.translength; } }
      //    if (req.body.distlength == "") { db_distlength = 0; } else { if (isNaN(req.body.distlength)) { db_distlength = 0; } else { db_distlength = req.body.distlength; } }
      //    if (req.body.planresmargin == "") { db_planresmargin = 0; } else { if (isNaN(req.body.planresmargin)) { db_planresmargin = 0; } else { db_planresmargin = req.body.planresmargin; } }
      //    if (req.body.transcongind == "") { db_transcongind = 0; } else { if (isNaN(req.body.transcongind)) { db_transcongind = 0; } else { db_transcongind = req.body.transcongind; } }
      //    if (req.body.demforrisk == "") { db_demforrisk = 0; } else { if (isNaN(req.body.demforrisk)) { db_demforrisk = 0; } else { db_demforrisk = req.body.demforrisk; } }
      //    if (req.body.geodivind == "") { db_geodivind = 0; } else { if (isNaN(req.body.geodivind)) { db_geodivind = 0; } else { db_geodivind = req.body.geodivind; } }
      //    if (req.body.outageIndices == "") { db_outageIndices = 0; } else { if (isNaN(req.body.outageIndices)) { db_outageIndices = 0; } else { db_outageIndices = req.body.outageIndices; } }
      //    if (req.body.vallossload == "") { db_vallossload = 0; } else { if (isNaN(req.body.vallossload)) { db_vallossload = 0; } else { db_vallossload = req.body.vallossload; } }
      //    if (req.body.renoutforrisk == "") { db_renoutforrisk = 0; } else { if (isNaN(req.body.renoutforrisk)) { db_renoutforrisk = 0; } else { db_renoutforrisk = req.body.renoutforrisk; } }
      if (req.bodyfreregvalue == "") { db_freregvalue = 0; } else { if (isNaN(req.bodyfreregvalue)) { db_freregvalue = 0; } else { db_freregvalue = req.bodyfreregvalue; } }
      if (req.bodypeakcapital == "") { db_peakcapital = 0; } else { if (isNaN(req.bodypeakcapital)) { db_peakcapital = 0; } else { db_peakcapital = req.bodypeakcapital; } }
      if (req.bodyconvfactor == "") { db_convfactor = 0; } else { if (isNaN(req.bodyconvfactor)) { db_convfactor = 0; } else { db_convfactor = req.bodyconvfactor; } }
      if (req.bodyinputpeak1 == "") { db_inputpeak1 = 0; } else { if (isNaN(req.bodyinputpeak1)) { db_inputpeak1 = 0; } else { db_inputpeak1 = req.bodyinputpeak1; } }
      if (req.bodyinputpeak2 == "") { db_inputpeak2 = 0; } else { if (isNaN(req.bodyinputpeak2)) { db_inputpeak2 = 0; } else { db_inputpeak2 = req.bodyinputpeak2; } }
      if (req.bodyinputenergy1 == "") { db_inputenergy1 = 0; } else { if (isNaN(req.bodyinputenergy1)) { db_inputenergy1 = 0; } else { db_inputenergy1 = req.bodyinputenergy1; } }
      if (req.bodyinputenergy2 == "") { db_inputenergy2 = 0; } else { if (isNaN(req.bodyinputenergy2)) { db_inputenergy2 = 0; } else { db_inputenergy2 = req.bodyinputenergy2; } }
      if (req.bodypeakdemgrowrt1 == "") { db_peakdemgrowrt1 = 0; } else { if (isNaN(req.bodypeakdemgrowrt1)) { db_peakdemgrowrt1 = 0; } else { db_peakdemgrowrt1 = req.bodypeakdemgrowrt1; } }
      if (req.bodypeakdemgrowrt2 == "") { db_peakdemgrowrt2 = 0; } else { if (isNaN(req.bodypeakdemgrowrt2)) { db_peakdemgrowrt2 = 0; } else { db_peakdemgrowrt2 = req.bodypeakdemgrowrt2; } }
      if (req.bodyenergydemgrowrt1 == "") { db_energydemgrowrt1 = 0; } else { if (isNaN(req.bodyenergydemgrowrt1)) { db_energydemgrowrt1 = 0; } else { db_energydemgrowrt1 = req.bodyenergydemgrowrt1; } }
      if (req.bodyenergydemgrowrt2 == "") { db_energydemgrowrt2 = 0; } else { if (isNaN(req.bodyenergydemgrowrt2)) { db_energydemgrowrt2 = 0; } else { db_energydemgrowrt2 = req.bodyenergydemgrowrt2; } }
      if (req.bodywindcappol1 == "") { db_windcappol1 = 0; } else { if (isNaN(req.bodywindcappol1)) { db_windcappol1 = 0; } else { db_windcappol1 = req.bodywindcappol1; } }
      if (req.bodywindcappol2 == "") { db_windcappol2 = 0; } else { if (isNaN(req.bodywindcappol2)) { db_windcappol2 = 0; } else { db_windcappol2 = req.bodywindcappol2; } }
      if (req.bodysolarcappol1 == "") { db_solarcappol1 = 0; } else { if (isNaN(req.bodysolarcappol1)) { db_solarcappol1 = 0; } else { db_solarcappol1 = req.bodysolarcappol1; } }
      if (req.bodysolarcappol2 == "") { db_solarcappol2 = 0; } else { if (isNaN(req.bodysolarcappol2)) { db_solarcappol2 = 0; } else { db_solarcappol2 = req.bodysolarcappol2; } }
      if (req.bodywindcap1 == "") { db_windcap1 = 0; } else { if (isNaN(req.bodywindcap1)) { db_windcap1 = 0; } else { db_windcap1 = req.bodywindcap1; } }
      if (req.bodywindcap2 == "") { db_windcap2 = 0; } else { if (isNaN(req.bodywindcap2)) { db_windcap2 = 0; } else { db_windcap2 = req.bodywindcap2; } }
      if (req.bodysolarcap1 == "") { db_solarcap1 = 0; } else { if (isNaN(req.bodysolarcap1)) { db_solarcap1 = 0; } else { db_solarcap1 = req.bodysolarcap1; } }
      if (req.bodysolarcap2 == "") { db_solarcap2 = 0; } else { if (isNaN(req.bodysolarcap2)) { db_solarcap2 = 0; } else { db_solarcap2 = req.bodysolarcap2; } }
      if (req.bodyhypmax1 == "") { db_hypmax1 = 0; } else { if (isNaN(req.bodyhypmax1)) { db_hypmax1 = 0; } else { db_hypmax1 = req.bodyhypmax1; } }
      if (req.bodyhypmax2 == "") { db_hypmax2 = 0; } else { if (isNaN(req.bodyhypmax2)) { db_hypmax2 = 0; } else { db_hypmax2 = req.bodyhypmax2; } }
      if (req.bodyhydroEng0101 == "") { db_hydroEng0101 = 0; } else { if (isNaN(req.bodyhydroEng0101)) { db_hydroEng0101 = 0; } else { db_hydroEng0101 = req.bodyhydroEng0101; } }
      if (req.bodyhydroEng0102 == "") { db_hydroEng0102 = 0; } else { if (isNaN(req.bodyhydroEng0102)) { db_hydroEng0102 = 0; } else { db_hydroEng0102 = req.bodyhydroEng0102; } }
      if (req.bodyhydroEng0103 == "") { db_hydroEng0103 = 0; } else { if (isNaN(req.bodyhydroEng0103)) { db_hydroEng0103 = 0; } else { db_hydroEng0103 = req.bodyhydroEng0103; } }
      if (req.bodyhydroEng0104 == "") { db_hydroEng0104 = 0; } else { if (isNaN(req.bodyhydroEng0104)) { db_hydroEng0104 = 0; } else { db_hydroEng0104 = req.bodyhydroEng0104; } }
      if (req.bodyhydroEng0105 == "") { db_hydroEng0105 = 0; } else { if (isNaN(req.bodyhydroEng0105)) { db_hydroEng0105 = 0; } else { db_hydroEng0105 = req.bodyhydroEng0105; } }
      if (req.bodyhydroEng0106 == "") { db_hydroEng0106 = 0; } else { if (isNaN(req.bodyhydroEng0106)) { db_hydroEng0106 = 0; } else { db_hydroEng0106 = req.bodyhydroEng0106; } }
      if (req.bodyhydroEng0107 == "") { db_hydroEng0107 = 0; } else { if (isNaN(req.bodyhydroEng0107)) { db_hydroEng0107 = 0; } else { db_hydroEng0107 = req.bodyhydroEng0107; } }
      if (req.bodyhydroEng0108 == "") { db_hydroEng0108 = 0; } else { if (isNaN(req.bodyhydroEng0108)) { db_hydroEng0108 = 0; } else { db_hydroEng0108 = req.bodyhydroEng0108; } }
      if (req.bodyhydroEng0109 == "") { db_hydroEng0109 = 0; } else { if (isNaN(req.bodyhydroEng0109)) { db_hydroEng0109 = 0; } else { db_hydroEng0109 = req.bodyhydroEng0109; } }
      if (req.bodyhydroEng0110 == "") { db_hydroEng0110 = 0; } else { if (isNaN(req.bodyhydroEng0110)) { db_hydroEng0110 = 0; } else { db_hydroEng0110 = req.bodyhydroEng0110; } }
      if (req.bodyhydroEng0111 == "") { db_hydroEng0111 = 0; } else { if (isNaN(req.bodyhydroEng0111)) { db_hydroEng0111 = 0; } else { db_hydroEng0111 = req.bodyhydroEng0111; } }
      if (req.bodyhydroEng0112 == "") { db_hydroEng0112 = 0; } else { if (isNaN(req.bodyhydroEng0112)) { db_hydroEng0112 = 0; } else { db_hydroEng0112 = req.bodyhydroEng0112; } }
      if (req.bodyhydroEng0201 == "") { db_hydroEng0201 = 0; } else { if (isNaN(req.bodyhydroEng0201)) { db_hydroEng0201 = 0; } else { db_hydroEng0201 = req.bodyhydroEng0201; } }
      if (req.bodyhydroEng0202 == "") { db_hydroEng0202 = 0; } else { if (isNaN(req.bodyhydroEng0202)) { db_hydroEng0202 = 0; } else { db_hydroEng0202 = req.bodyhydroEng0202; } }
      if (req.bodyhydroEng0203 == "") { db_hydroEng0203 = 0; } else { if (isNaN(req.bodyhydroEng0203)) { db_hydroEng0203 = 0; } else { db_hydroEng0203 = req.bodyhydroEng0203; } }
      if (req.bodyhydroEng0204 == "") { db_hydroEng0204 = 0; } else { if (isNaN(req.bodyhydroEng0204)) { db_hydroEng0204 = 0; } else { db_hydroEng0204 = req.bodyhydroEng0204; } }
      if (req.bodyhydroEng0205 == "") { db_hydroEng0205 = 0; } else { if (isNaN(req.bodyhydroEng0205)) { db_hydroEng0205 = 0; } else { db_hydroEng0205 = req.bodyhydroEng0205; } }
      if (req.bodyhydroEng0206 == "") { db_hydroEng0206 = 0; } else { if (isNaN(req.bodyhydroEng0206)) { db_hydroEng0206 = 0; } else { db_hydroEng0206 = req.bodyhydroEng0206; } }
      if (req.bodyhydroEng0207 == "") { db_hydroEng0207 = 0; } else { if (isNaN(req.bodyhydroEng0207)) { db_hydroEng0207 = 0; } else { db_hydroEng0207 = req.bodyhydroEng0207; } }
      if (req.bodyhydroEng0208 == "") { db_hydroEng0208 = 0; } else { if (isNaN(req.bodyhydroEng0208)) { db_hydroEng0208 = 0; } else { db_hydroEng0208 = req.bodyhydroEng0208; } }
      if (req.bodyhydroEng0209 == "") { db_hydroEng0209 = 0; } else { if (isNaN(req.bodyhydroEng0209)) { db_hydroEng0209 = 0; } else { db_hydroEng0209 = req.bodyhydroEng0209; } }
      if (req.bodyhydroEng0210 == "") { db_hydroEng0210 = 0; } else { if (isNaN(req.bodyhydroEng0210)) { db_hydroEng0210 = 0; } else { db_hydroEng0210 = req.bodyhydroEng0210; } }
      if (req.bodyhydroEng0211 == "") { db_hydroEng0211 = 0; } else { if (isNaN(req.bodyhydroEng0211)) { db_hydroEng0211 = 0; } else { db_hydroEng0211 = req.bodyhydroEng0211; } }
      if (req.bodyhydroEng0212 == "") { db_hydroEng0212 = 0; } else { if (isNaN(req.bodyhydroEng0212)) { db_hydroEng0212 = 0; } else { db_hydroEng0212 = req.bodyhydroEng0212; } }

      //   if (req.body? == "") { db_? = 0;} else {if (isNaN(req.body?)) {db_? = 0;} else {db_? = req.body?;}} 

      //    if (req.bodydemrespower == "") { db_demrespower = 0; } else { if (isNaN(req.bodydemrespower)) { db_demrespower = 0; } else { db_demrespower = req.bodydemrespower; } }
      //    if (req.bodydemreseng == "") { db_demreseng = 0; } else { if (isNaN(req.bodydemreseng)) { db_demreseng = 0; } else { db_demreseng = req.bodydemreseng; } }
      //    if (req.bodydemrescost == "") { db_demrescost = 0; } else { if (isNaN(req.bodydemrescost)) { db_demrescost = 0; } else { db_demrescost = req.bodydemrescost; } }
      //    if (req.bodydistpvpower == "") { db_distpvpower = 0; } else { if (isNaN(req.bodydistpvpower)) { db_distpvpower = 0; } else { db_distpvpower = req.bodydistpvpower; } }
      //    if (req.bodydistpveng == "") { db_distpveng = 0; } else { if (isNaN(req.bodydistpveng)) { db_distpveng = 0; } else { db_distpveng = req.bodydistpveng; } }
      //    if (req.bodydistpvcost == "") { db_distpvcost = 0; } else { if (isNaN(req.bodydistpvcost)) { db_distpvcost = 0; } else { db_distpvcost = req.bodydistpvcost; } }
      //    if (req.bodywindcost == "") { db_windcost = 0; } else { if (isNaN(req.bodywindcost)) { db_windcost = 0; } else { db_windcost = req.bodywindcost; } }
      //    if (req.bodysolarcost == "") { db_solarcost = 0; } else { if (isNaN(req.bodysolarcost)) { db_solarcost = 0; } else { db_solarcost = req.bodysolarcost; } }
      //    if (req.bodywindpeakcap == "") { db_windpeakcap = 0; } else { if (isNaN(req.bodywindpeakcap)) { db_windpeakcap = 0; } else { db_windpeakcap = req.bodywindpeakcap; } }
      //    if (req.bodysolarpeakcap == "") { db_solarpeakcap = 0; } else { if (isNaN(req.bodysolarpeakcap)) { db_solarpeakcap = 0; } else { db_solarpeakcap = req.bodysolarpeakcap; } }

      //
      //handle the csv files
      //
      //console.log(APIconfig.datafiles.path); 
    };
    var outputPath = APIconfig.datafiles.path + PATH_SEP + db_username + PATH_SEP + db_project + PATH_SEP + db_run;
    var inputPath = APIconfig.datafiles.inpath + PATH_SEP + "data" + PATH_SEP;// + "Generation" + PATH_SEP;
    var infile = ""
    var outfile = ""
    //console.log(inputPath);
    mkdirp(outputPath + PATH_SEP + 'wind', function (err) {

      console.log('Copying README.txt file11!!!!!!!!')
      
      fs2.copy(path.join(inputPath,'README.txt'), path.join(outputPath,'README.txt'), function (error) {
        console.log('Copying README.txt file!!!!!!!!')
        console.log(path.join(inputPath,'README.txt'));
        console.log(path.join(outputPath,'README.txt'));
        if (error) {
          console.log('Error copying readme file !!! ')
          callback(error);
          err = error;
          return;
        }
      });

      if (err) {
        console.log('failed to create directory');
        callback(err);
        return;
      }
      //Copy Readme file



      console.log('Created wind directory');
      mkdirp(outputPath + PATH_SEP + 'solar', function (err) {
        if (err) {
          console.log('failed to create directory');
          callback(err); return;
        }
        console.log('Created solar directory');
        mkdirp(outputPath + PATH_SEP + 'yr1', function (err) {
          if (err) {
            console.log('failed to create directory');
            callback(err); return;
          }
          console.log('Created yr1 directory');

          mkdirp(outputPath + PATH_SEP + 'yr2', function (err) {
            if (err) {
              console.log('failed to create directory');
              callback(err); return;
            }
            console.log('Created yr2 directory');
            console.log("All directories created");
            var fullname = "";
            var configSave = {
              option: db_basewind,
              type: 'Wind',
              year: 'yr1'
            }
            handlefiles(configSave, infile, outfile, inputPath, outputPath, db_userbasewind, function (err, fullname) {
              db_basewind = fullname;
              //console.log(db_basewind);
              if (err) {
                console.log('handeling wind !!!');
                console.log('failed store .csv files');
                callback(err);
                return;
              }
              var configSave = {
                option: db_basesolar,
                type: 'Solar',
                year: 'yr1'
              }
              handlefiles(configSave, infile, outfile, inputPath, outputPath, db_userbasesolar, function (err, fullname) {
                db_basesolar = fullname;
                //console.log(db_basesolar);
                if (err) {
                  console.log('failed store .csv files');
                  callback(err);
                  return;
                }

                var configSave = {
                  option: db_demandprofile1,
                  type: 'Demand',
                  year: 'yr1'
                }
                handlefiles(configSave, infile, outfile, inputPath, outputPath, db_userdemandprofile1, function (err, fullname) {
                  db_demandprofile1 = fullname;
                  //console.log(db_demandprofile1);
                  if (err) {
                    console.log('failed store .csv files');
                    callback(err); return;
                  }

                  var configSave = {
                    option: db_demandprofile2,
                    type: 'Demand',
                    year: 'yr2'
                  }
                  handlefiles(configSave, infile, outfile, inputPath, outputPath, db_userdemandprofile2, function (err, fullname) {
                    {
                      db_demandprofile2 = fullname;
                      //console.log(db_demandprofile2);
                      if (err) {
                        console.log('failed store .csv files');
                        callback(err);
                        return;
                      }

                      console.log("All CSV files created");

                      console.log("Creating JSON String");
                      //create the json request string
                      var slt_input = '{ ';
                      slt_input += ' "action": "REQ_SAVE_DATA", ';
                      slt_input += ' "username": "' + db_username + '", ';
                      slt_input += ' "project": "' + db_project + '", ';
                      slt_input += ' "run": "' + db_run + '", ';
                      slt_input += ' "inputs": ';
                      slt_input += '  { ';
                      slt_input += '   "country": "' + db_country + '", ';
                      //slt_input += '   "eneffpower":' + db_eneffpower + ', ';
                      if (db_eneffpower != "") { slt_input += '   "eneffpower":' + parseFloat(db_eneffpower) + ', '; }
                      if (db_eneffeng != "") { slt_input += '   "eneffeng":' + parseFloat(db_eneffeng) + ', '; }
                      if (db_eneffcost != "") { slt_input += '   "eneffcost":' + parseFloat(db_eneffcost) + ', '; }
                      if (db_demrespower != "") { slt_input += '   "demrespower":' + parseFloat(db_demrespower) + ', '; }
                      if (db_demreseng != "") { slt_input += '   "demreseng":' + parseFloat(db_demreseng) + ', '; }
                      if (db_demrescost != "") { slt_input += '   "demrescost":' + parseFloat(db_demrescost) + ', '; }
                      if (db_distpvpower != "") { slt_input += '   "distpvpower":' + parseFloat(db_distpvpower) + ', '; }
                      if (db_distpveng != "") { slt_input += '   "distpveng":' + parseFloat(db_distpveng) + ', '; }
                      if (db_distpvcost != "") { slt_input += '   "distpvcost":' + parseFloat(db_distpvcost) + ', '; }
                      if (db_windcost != "") { slt_input += '   "windcost":' + parseFloat(db_windcost) + ', '; }
                      if (db_solarcost != "") { slt_input += '   "solarcost":' + parseFloat(db_solarcost) + ', '; }
                      if (db_basewind != "") { slt_input += '   "basewind": "' + db_basewind + '", '; }
                      if (db_windpeakcap != "") { slt_input += '   "windpeakcap":' + parseFloat(db_windpeakcap) + ', '; }
                      if (db_basesolar != "") { slt_input += '   "basesolar": "' + db_basesolar + '", '; }
                      if (db_solarpeakcap != "") { slt_input += '   "solarpeakcap":' + parseFloat(db_solarpeakcap) + ', '; }
                      slt_input += '   "hydrores": [' + parseFloat(db_hydrores1) + ',' + parseFloat(db_hydrores2) + ',' + parseFloat(db_hydrores3) + ']' + ', ';
                      if (db_p_reserves != "") { slt_input += '   "p_reserves":' + parseFloat(db_p_reserves) + ', '; }
                      if (db_s_reserves != "") { slt_input += '   "s_reserves":' + parseFloat(db_s_reserves) + ', '; }
                      if (db_t_reserves != "") { slt_input += '   "t_reserves":' + parseFloat(db_t_reserves) + ', '; }
                      if (db_esrt2c != "") { slt_input += '   "esrt2c":' + parseFloat(db_esrt2c) + ', '; }
                      if (db_esrt1c != "") { slt_input += '   "esrt1c":' + parseFloat(db_esrt1c) + ', '; }
                      if (db_esrt5c != "") { slt_input += '   "esrt5c":' + parseFloat(db_esrt5c) + ', '; }
                      if (db_esrt25c != "") { slt_input += '   "esrt25c":' + parseFloat(db_esrt25c) + ', '; }
                      if (db_escost2c != "") { slt_input += '   "escost2c":' + parseFloat(db_escost2c) + ', '; }
                      if (db_escost1c != "") { slt_input += '   "escost1c":' + parseFloat(db_escost1c) + ', '; }
                      if (db_escost5c != "") { slt_input += '   "escost5c":' + parseFloat(db_escost5c) + ', '; }
                      if (db_escost25c != "") { slt_input += '   "escost25c":' + parseFloat(db_escost25c) + ', '; }
                      if (db_esfom2c != "") { slt_input += '   "esfom2c":' + parseFloat(db_esfom2c) + ', '; }
                      if (db_esfom1c != "") { slt_input += '   "esfom1c":' + parseFloat(db_esfom1c) + ', '; }
                      if (db_esfom5c != "") { slt_input += '   "esfom5c":' + parseFloat(db_esfom5c) + ', '; }
                      if (db_esfom25c != "") { slt_input += '   "esfom25c":' + parseFloat(db_esfom25c) + ', '; }
                      if (db_esvom2c != "") { slt_input += '   "esvom2c":' + parseFloat(db_esvom2c) + ', '; }
                      if (db_esvom1c != "") { slt_input += '   "esvom1c":' + parseFloat(db_esvom1c) + ', '; }
                      if (db_esvom5c != "") { slt_input += '   "esvom5c":' + parseFloat(db_esvom5c) + ', '; }
                      if (db_esvom25c != "") { slt_input += '   "esvom25c":' + parseFloat(db_esvom25c) + ', '; }
                      if (db_popul != "") { slt_input += '   "popul":' + parseFloat(db_popul) + ', '; }
                      if (db_carboncost != "") { slt_input += '   "carboncost":' + parseFloat(db_carboncost) + ', '; }
                      if (db_translength != "") { slt_input += '   "translength":' + parseFloat(db_translength) + ', '; }
                      if (db_distlength != "") { slt_input += '   "distlength":' + parseFloat(db_distlength) + ', '; }
                      if (db_planresmargin != "") { slt_input += '   "planresmargin":' + parseFloat(db_planresmargin) + ', '; }
                      if (db_transcongind != "") { slt_input += '   "transcongind":' + parseFloat(db_transcongind) + ', '; }
                      if (db_demforrisk != "") { slt_input += '   "demforrisk":' + parseFloat(db_demforrisk) + ', '; }
                      if (db_geodivind != "") { slt_input += '   "geodivind":' + parseFloat(db_geodivind) + ', '; }
                      if (db_outageIndices != "") { slt_input += '   "outageIndices":' + parseFloat(db_outageIndices) + ', '; }
                      if (db_vallossload != "") { slt_input += '   "vallossload":' + parseFloat(db_vallossload) + ', '; }
                      if (db_renoutforrisk != "") { slt_input += '   "renoutforrisk":' + parseFloat(db_renoutforrisk) + ', '; }
                      if (db_freregvalue != "") { slt_input += '   "freregvalue":' + parseFloat(db_freregvalue) + ', '; }
                      if (db_peakcapital != "") { slt_input += '   "peakcapital":' + parseFloat(db_peakcapital) + ', '; }
                      if (db_convfactor != "") { slt_input += '   "convfactor":' + parseFloat(db_convfactor) + ', '; }
                      slt_input += '   "yearly": ';
                      slt_input += '    [ ';
                      slt_input += '     { ';
                      slt_input += '      "year": 1, ';
                      if (db_demandprofile1 != "") { slt_input += '      "demandprofile": "' + db_demandprofile1 + '", '; }
                      if (db_inputpeak1 != "") { slt_input += '      "inputpeak":' + parseFloat(db_inputpeak1) + ', '; }
                      if (db_inputenergy1 != "") { slt_input += '      "inputenergy":' + parseFloat(db_inputenergy1) + ', '; }
                      if (db_peakdemgrowrt1 != "") { slt_input += '      "peakdemgrowrt":' + parseFloat(db_peakdemgrowrt1) + ', '; }
                      if (db_energydemgrowrt1 != "") { slt_input += '      "energydemgrowrt":' + parseFloat(db_energydemgrowrt1) + ', '; }
                      if (db_windcap1 != "") { slt_input += '      "windcap":' + parseFloat(db_windcap1) + ', '; }
                      if (db_solarcap1 != "") { slt_input += '      "solarcap":' + parseFloat(db_solarcap1) + ', '; }
                      if (db_windcappol1 != "") { slt_input += '      "windcappol":' + parseFloat(db_windcappol1) + ', '; }
                      if (db_solarcappol1 != "") { slt_input += '      "solarcappol":' + parseFloat(db_solarcappol1) + ', '; }
                      slt_input += '      "hydroEng": [' + parseFloat(db_hydroEng0101) + ',' + parseFloat(db_hydroEng0102) + ',' + parseFloat(db_hydroEng0103) + ','
                      slt_input += parseFloat(db_hydroEng0104) + ',' + parseFloat(db_hydroEng0105) + ',' + parseFloat(db_hydroEng0106) + ','
                      slt_input += parseFloat(db_hydroEng0107) + ',' + parseFloat(db_hydroEng0108) + ',' + parseFloat(db_hydroEng0109) + ','
                      slt_input += parseFloat(db_hydroEng0110) + ',' + parseFloat(db_hydroEng0111) + ',' + parseFloat(db_hydroEng0112) + ']' + ', ';
                      slt_input += '      "hypmax":' + parseFloat(db_hypmax1) + '  ';
                      slt_input += '     } ';
                      if (db_demandprofile2 != "") {
                        slt_input += '     ,{ ';
                        slt_input += '      "year": 2, ';
                        if (db_demandprofile2 != "") { slt_input += '      "demandprofile": "' + db_demandprofile2 + '", '; }
                        if (db_inputpeak2 != "") { slt_input += '      "inputpeak":' + parseFloat(db_inputpeak2) + ', '; }
                        if (db_inputenergy2 != "") { slt_input += '      "inputenergy":' + parseFloat(db_inputenergy2) + ', '; }
                        if (db_peakdemgrowrt2 != "") { slt_input += '      "peakdemgrowrt":' + parseFloat(db_peakdemgrowrt2) + ', '; }
                        if (db_windcap2 != "") { slt_input += '      "windcap":' + parseFloat(db_windcap2) + ', '; }
                        if (db_solarcap2 != "") { slt_input += '      "solarcap":' + parseFloat(db_solarcap2) + ', '; }
                        if (db_windcappol2 != "") { slt_input += '      "windcappol":' + parseFloat(db_windcappol2) + ', '; }
                        if (db_solarcappol2 != "") { slt_input += '      "solarcappol":' + parseFloat(db_solarcappol2) + ', '; }
                        slt_input += '      "hydroEng": [' + parseFloat(db_hydroEng0201) + ',' + parseFloat(db_hydroEng0202) + ',' + parseFloat(db_hydroEng0203) + ','
                        slt_input += parseFloat(db_hydroEng0204) + ',' + parseFloat(db_hydroEng0205) + ',' + parseFloat(db_hydroEng0206) + ','
                        slt_input += parseFloat(db_hydroEng0207) + ',' + parseFloat(db_hydroEng0208) + ',' + parseFloat(db_hydroEng0209) + ','
                        slt_input += parseFloat(db_hydroEng0210) + ',' + parseFloat(db_hydroEng0211) + ',' + parseFloat(db_hydroEng0212) + ']' + ', ';
                        slt_input += '      "hypmax":' + parseFloat(db_hypmax2) + ' ';
                        slt_input += '     } ';
                      }
                      slt_input += '    ], ';
                      slt_input += '   "slt_conventional_generation":  ';
                      slt_input += '    [ ';
                      var i = 0;
                      var db_fuel_type = "";
                      var db_unit_type = "";
                      var db_pconcap1 = 0;
                      var db_pconcap2 = 0;
                      var db_fuelprice1 = 0;
                      var db_fuelprice2 = 0;
                      var db_heatrate = 0;
                      var db_vom = 0;
                      var db_p_reserve = 0;
                      var db_s_reserve = 0;
                      var db_t_reserve = 0;
                      var db_carbon_rate = 0;
                      conventional = req.body['Conventional[' + i + '][]'];
                      do {
                        if (i > 0) { slt_input += '     }, '; }
                        //console.log(conventional);
                        db_fuel_type = conventional[0];
                        db_unit_type = conventional[1];
                        if (conventional[2] == "") { db_pconcap1 = ""; } else { if (isNaN(conventional[2])) { db_pconcap1 = 0; } else { db_pconcap1 = conventional[2]; } }
                        if (conventional[3] == "") { db_pconcap2 = ""; } else { if (isNaN(conventional[3])) { db_pconcap2 = 0; } else { db_pconcap2 = conventional[3]; } }
                        if (conventional[4] == "") { db_fuelprice1 = ""; } else { if (isNaN(conventional[4])) { db_fuelprice1 = 0; } else { db_fuelprice1 = conventional[4]; } }
                        if (conventional[5] == "") { db_fuelprice2 = ""; } else { if (isNaN(conventional[5])) { db_fuelprice2 = 0; } else { db_fuelprice2 = conventional[5]; } }
                        if (conventional[6] == "") { db_heatrate = ""; } else { if (isNaN(conventional[6])) { db_heatrate = 0; } else { db_heatrate = conventional[6]; } }
                        if (conventional[7] == "") { db_vom = ""; } else { if (isNaN(conventional[7])) { db_vom = 0; } else { db_vom = conventional[7]; } }
                        if (conventional[8] == "") { db_p_reserve = ""; } else { if (isNaN(conventional[8])) { db_p_reserve = 0; } else { db_p_reserve = conventional[8]; } }
                        if (conventional[9] == "") { db_s_reserve = ""; } else { if (isNaN(conventional[9])) { db_s_reserve = 0; } else { db_s_reserve = conventional[9]; } }
                        if (conventional[10] == "") { db_t_reserve = ""; } else { if (isNaN(conventional[10])) { db_t_reserve = 0; } else { db_t_reserve = conventional[10]; } }
                        if (conventional[11] == "") { db_carbon_rate = ""; } else { if (isNaN(conventional[11])) { db_carbon_rate = 0; } else { db_carbon_rate = conventional[11]; } }
                        slt_input += '     { ';
                        if (db_fuel_type != "") { slt_input += '      "gen_type":"' + db_fuel_type + '",'; }
                        if (db_unit_type != "") { slt_input += '      "unit_type":"' + db_unit_type + '",'; }
                        if (db_heatrate != "") { slt_input += '      "heatrate":' + parseFloat(db_heatrate) + ','; }
                        if (db_carbon_rate != "") { slt_input += '      "carbon_rate":' + parseFloat(db_carbon_rate) + ','; }
                        if (db_vom != "") { slt_input += '      "vom":' + parseFloat(db_vom) + ','; }
                        if (db_p_reserve != "") { slt_input += '      "p_reserve":' + parseFloat(db_p_reserve) + ','; }
                        if (db_s_reserve != "") { slt_input += '      "s_reserve":' + parseFloat(db_s_reserve) + ','; }
                        if (db_t_reserve != "") { slt_input += '      "t_reserve":' + parseFloat(db_t_reserve) + ','; }
                        slt_input += '      "yearly": ';
                        slt_input += '       [ ';
                        slt_input += '        { ';
                        slt_input += '         "year": 1,';
                        if (db_pconcap1 != "") { slt_input += '         "pconcap":' + parseFloat(db_pconcap1) + ','; }
                        if (db_fuelprice1 != "") { slt_input += '         "fuelprice":' + parseFloat(db_fuelprice1) + ' '; }
                        slt_input += '        } ';

                        //      if ((db_pconcap2 != "") || (db_fuelprice2 != "")) {
                        if (db_demandprofile2 != "") {
                          slt_input += ', ';
                          slt_input += '        { ';
                          slt_input += '         "year":2,';
                          if (db_pconcap2 != "") { slt_input += '         "pconcap":' + parseFloat(db_pconcap2) + ','; }
                          if (db_fuelprice2 != "") { slt_input += '         "fuelprice":' + parseFloat(db_fuelprice2) + ' '; }
                          slt_input += '        } ';
                        }
                        slt_input += '       ] ';
                        i += 1;
                        conventional = req.body['Conventional[' + i + '][]'];
                      } while (conventional != undefined);
                      slt_input += '     } ';
                      slt_input += '    ] ';
      
                      var l = 0;
                      var existingstoragefound = 0;
                      existing = req.body['Existing[' + l + '][]'];
                      do 
                       {
                        if (existing[0] != "Select Storage Type") {existingstoragefound = 1;}
                        l += 1;
                        existing = req.body['Existing[' + l + '][]'];
                       } while (existing != undefined);
                      if (existingstoragefound == 1)
                      {
                       console.log("existing storage found");
                       l = 0;
                       var rowcount = 0;
                       existing = req.body['Existing[' + l + '][]'];
                       var db_storagetype = "";
                       var db_espcap = 0;
                       var db_esecap = 0;
                       slt_input += '     , ';
                       slt_input += '   "slt_existing_storage":  ';
                       slt_input += '    [';
                       do {
                         if (existing[0] != "Select Storage Type") 
                         {
      
                          if (rowcount > 0) { slt_input += '     }, '; }                         
                          db_storagetype = existing[0];
                          if (existing[1] == "") { db_espcap = ""; } else { if (isNaN(existing[1])) { db_espcap = 0; } else { db_espcap = existing[1]; } }
                          if (existing[2] == "") { db_esecap = ""; } else { if (isNaN(existing[2])) { db_esecap = 0; } else { db_esecap = existing[2]; } }
                          slt_input += '     { ';
                          if (db_storagetype != "") { slt_input += '      "storagetype":"' + db_storagetype + '",'; }
                          if (db_espcap != "") { slt_input += '         "espcap":' + parseFloat(db_espcap) + ', '; }
                          if (db_esecap != "") { slt_input += '         "esecap":' + parseFloat(db_esecap) + ' '; }
                          rowcount +=1;
                         } 
                         l += 1;
                         existing = req.body['Existing[' + l + '][]'];
                       } while (existing != undefined);
                       slt_input += '     } ';
                       slt_input += '    ] ';                      
                      
                      }//if (existingstoragefound == 1)
                      
                      slt_input += '  } '; //end inputs
                      slt_input += '} '; //end main json
                    }
                    //return slt_input;
                    console.log (slt_input);
                    callback(undefined, slt_input);

                  }); // handledemandprofile2
                }); // handledemandprofile1
              }); // handlebasesolar
            }); // handlebasewind
          }); //create yr2 directorys
        }); //create yr1 directory
      }); //create solar directory
    }); //create wind directory
  }
  catch (e) {
    console.log("Failed:", e);
    callback(e);
  }
  //if (typeof callback == "function") callback();
}



function handlefiles(config, infile, outfile, inputPath, outputPath, db_userbasewind, callback) {
  // write a file in the directory
  // var config = {
  //   option: 'High',
  //   type: 'Wind',
  //   year: 'yr1'
  // }
  var folders = {

    to: {
      Wind: "wind" + PATH_SEP,
      Solar: "solar" + PATH_SEP,
      Demand: config['year'] + PATH_SEP
    },
    from: {
      Wind: "Generation" + PATH_SEP,
      Solar: "Generation" + PATH_SEP,
      Demand: ""
    }
  }

  console.log(config);
  var error;


  infile = inputPath + folders['from'][config['type']] + config['type'] + PATH_SEP + config['option'] + ".csv";
  outfile = outputPath + PATH_SEP + folders['to'][config['type']] + config['option'] + ".csv";

  if (config['option'] == "User" && db_userbasewind != "") {
    infile = db_userbasewind;
  }


  if (infile === outfile) {
    callback(undefined, outfile);
    return;
  }

  fs2.copy(infile, outfile, function (err) {
    if (err) {
      console.log('inside Error: !!! ')
      callback(err, null);
      //callback(console.log('failed:' + err));
      error = err;
      return;
    }
    callback(undefined, outfile);
  });

  //basewind
}

