

#include "StorageBenefitsThread.h"
#include "ObjectDefinition.h"
#include "ProductionCostNoESS.h"
#include <QFile>
#include <QFileInfo>
#include <QTextStream>
#include <QString>

StorageBenefitsThread::StorageBenefitsThread(glpkLock* glpk, int identifierId, int row_id, DbConnector * database, QObject *parent) : QThread(parent) {
    this->database = database;
    temp_row = row_id;
    this->row_id = &temp_row;
    this->glpk = glpk;
    identifier = QString("StorageBenefitsThread_").append(QString::number(identifierId));
    QObject::connect(this, SIGNAL(_terminateThread()), this, SLOT(DeleteThread()), Qt::QueuedConnection);
    alternativeAnalysisNoESSThread = new AlternativeAnalysisNoESSThread(row_id, database, this);
    productionCostNoESSThread = new ProductionCostNoESSThread(row_id, database, this);
}

StorageBenefitsThread::~StorageBenefitsThread() {
    qDebug() << this << " >> Deleting";
}

void StorageBenefitsThread::run() {
    StorageBenefits(*row_id);
    emit _terminateThread();
    qDebug() << this << " Finished";
}

void StorageBenefitsThread::DeleteThread() {
    this->exit();

    if (!this->wait(3000)) {
        this->terminate();
        this->wait();

    }
    else {
        this->deleteLater();
    }
}

int StorageBenefitsThread::ThreadSleep(int sleepTime) {
    qDebug() << this << " >> Reset locking";
    this->msleep(sleepTime);
    return 1;
}

int StorageBenefitsThread::StorageBenefits(int scenario_and_cases_row_id) {
    int year = 1;
    std::vector<std::string> stotype,stotypeNoESS;
    std::vector<std::string> thermtype,thermtypeNoESS;
    
    //AA results
    std::vector<double> SolPR, SolPEE, SolPD, SolPS, SolPPeak, SolPH, SolES;
    std::vector<double> SolPRNoESS, SolPEENoESS, SolPDNoESS, SolPSNoESS, SolPPeakNoESS, SolPHNoESS, SolESNoESS;
    
    //PC metrics
    std::vector<double> FuelCost, VOMCost, FOMCost, PRCost, SRCost, TRCost, VOMsCost, FOMsCost, PRsCost, SRsCost, TRsCost, EACost;
    std::vector<double> FuelCostNoESS, VOMCostNoESS, FOMCostNoESS, PRCostNoESS, SRCostNoESS, TRCostNoESS, VOMsCostNoESS, FOMsCostNoESS, PRsCostNoESS, SRsCostNoESS, TRsCostNoESS, EACostNoESS;

    sql::Connection *con = NULL;
    sql::ResultSet *res;
    sql::PreparedStatement *pstmt;
    int count = 0;
    int64_t start = performaceTime.currentMSecsSinceEpoch();
    while (con == NULL) {
        if (count == 1) {
            count = 0;
            ThreadSleep(1000);
        }
        con = database->getStorageBenefitsCon("irena_storage_benefits_tool", con);
        count++;
    }
    try {
        //Read installed ESS power capacity
        qDebug() << this << " >> installed_capacity_output_es_cap_tables";
        pstmt = con->prepareStatement("SELECT * FROM installed_capacity_output_es_cap_tables WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        while (res->next()) {
            SolPS.push_back(res->getDouble("outinst" + std::to_string(year)));
        }
        delete res;
        delete pstmt;
        for (unsigned int i = 0; i < SolPS.size(); i++) {
            qDebug() << "ES power investment: " << SolPS[i];
        }
        //Read demand side installed capacity
        qDebug() << this << " >> demand_side_output_installed_cap_tables";
        pstmt = con->prepareStatement("SELECT * FROM demand_side_output_installed_cap_tables WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        delete pstmt;
        while (res->next()) {
            SolPEE.push_back(res->getDouble("outeff" + std::to_string(year)));
            SolPD.push_back(res->getDouble("outdem" + std::to_string(year)));
        }
        delete res;
        //        for (int i = 0; i < SolPEE.size(); i++){
        //            qDebug() << "EE investment: " << SolPEE[i];
        //            qDebug() << "DR investment: " << SolPD[i];
        //        }
        //Read ESS installed energy capacity
        qDebug() << this << " >> energy_capacity_output_es_cap_tables";
        pstmt = con->prepareStatement("SELECT * FROM energy_capacity_output_es_cap_tables WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        while (res->next()) {
            SolES.push_back(res->getDouble("outener" + std::to_string(year)));
        }
        delete res;
        delete pstmt;
        //        for (int i = 0; i < SolES.size(); i++){
        //            qDebug() << "ES energy investment: " << SolPS[i];
        //        }
        //Read hydro dam installed capacity
        qDebug() << this << " >> hydro_generation_output_installed_cap_tables";
        pstmt = con->prepareStatement("SELECT * FROM hydro_generation_output_installed_cap_tables WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        while (res->next()) {
            SolPH.push_back(res->getDouble("outdam" + std::to_string(year)));
        }
        delete res;
        delete pstmt;
        int NHyd = SolPH.size();
        //        for (int i = 0; i < SolPH.size(); i++){
        //            qDebug() << "Hyd investment: " << SolPH[i];
        //        }
        //Read Thermal installed capacity
        qDebug() << this << " >> thermal_generation_output_installed_cap_tables";
        pstmt = con->prepareStatement("SELECT * FROM thermal_generation_output_installed_cap_tables WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        while (res->next()) {
            SolPPeak.push_back(res->getDouble("outthermgen" + std::to_string(year)));
        }
        delete res;
        delete pstmt;
        int NGen = SolPPeak.size();
        for (unsigned int i = 0; i < SolPPeak.size(); i++) {
            qDebug() << "Thermal investment: " << SolPPeak[i];
        }
        //Read installed renewable capacity
        qDebug() << this << " >> renewables_output_installed_cap_table";
        pstmt = con->prepareStatement("SELECT * FROM renewables_output_installed_cap_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        while (res->next()) {
            SolPR.push_back(res->getDouble("outwind" + std::to_string(year)));
            SolPR.push_back(res->getDouble("outsolarpv" + std::to_string(year)));
        }
        delete res;
        delete pstmt;
        int NR = SolPR.size();
        for (unsigned int i = 0; i < SolPR.size(); i++) {
            qDebug() << "Ren investment: " << SolPR[i];
        }
        //Read Metrics
        qDebug() << this << " >> generator_calculated_metrics";
        pstmt = con->prepareStatement("SELECT * FROM generator_calculated_metrics WHERE ess_or_noess = 1 AND scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        int counter = 0;
        while (res->next()) {
            if(counter<NGen+NR/2+NHyd){
                FuelCost.push_back(res->getDouble("fuel_cost"));
                VOMCost.push_back(res->getDouble("vom_cost"));
                FOMCost.push_back(res->getDouble("fom_cost"));
                PRCost.push_back(res->getDouble("generation_primary_reserve_cost"));
                SRCost.push_back(res->getDouble("generation_secondary_reserve_cost"));
                TRCost.push_back(res->getDouble("generation_tertiary_reserve_cost"));
                thermtype.push_back(res->getString("generator"));
            }
            else{
                VOMsCost.push_back(res->getDouble("vom_cost"));
                FOMsCost.push_back(res->getDouble("fom_cost"));
                EACost.push_back(res->getDouble("storage_energy_revenue"));
                PRsCost.push_back(res->getDouble("storage_primary_reserve_cost"));
                SRsCost.push_back(res->getDouble("storage_secondary_reserve_cost"));
                TRsCost.push_back(res->getDouble("storage_tertiary_reserve_cost"));
                stotype.push_back(res->getString("generator"));
            }
            counter++;
        }
        delete res;
        delete pstmt;
        //--------------NO ESS---------
        //Read installed ESS power capacity
        qDebug() << this << " >> installed_capacity_output_noess_cap_tables";
        pstmt = con->prepareStatement("SELECT * FROM installed_capacity_output_noess_cap_tables WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        while (res->next()) {
            SolPSNoESS.push_back(res->getDouble("outinst" + std::to_string(year)));
        }
        delete res;
        delete pstmt;
        for (unsigned int i = 0; i < SolPSNoESS.size(); i++) {
            qDebug() << "ES power investment: " << SolPSNoESS[i];
        }
        //Read demand side installed capacity
        qDebug() << this << " >> demand_side_output_installed_cap_noess_tables";
        pstmt = con->prepareStatement("SELECT * FROM demand_side_output_installed_cap_noess_tables WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        delete pstmt;
        while (res->next()) {
            SolPEENoESS.push_back(res->getDouble("outeff" + std::to_string(year)));
            SolPDNoESS.push_back(res->getDouble("outdem" + std::to_string(year)));
        }
        delete res;
        //        for (int i = 0; i < SolPEE.size(); i++){
        //            qDebug() << "EE investment: " << SolPEE[i];
        //            qDebug() << "DR investment: " << SolPD[i];
        //        }
        //Read ESS installed energy capacity
        qDebug() << this << " >> energy_capacity_output_noess_cap_tables";
        pstmt = con->prepareStatement("SELECT * FROM energy_capacity_output_noess_cap_tables WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        while (res->next()) {
            SolESNoESS.push_back(res->getDouble("outener" + std::to_string(year)));
        }
        delete res;
        delete pstmt;
        //        for (int i = 0; i < SolES.size(); i++){
        //            qDebug() << "ES energy investment: " << SolPS[i];
        //        }
        //Read hydro dam installed capacity
        qDebug() << this << " >> hydro_generation_output_installed_cap_noess_tables";
        pstmt = con->prepareStatement("SELECT * FROM hydro_generation_output_installed_cap_noess_tables WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        while (res->next()) {
            SolPHNoESS.push_back(res->getDouble("outdam" + std::to_string(year)));
        }
        delete res;
        delete pstmt;
        //        for (int i = 0; i < SolPH.size(); i++){
        //            qDebug() << "Hyd investment: " << SolPH[i];
        //        }
        //Read Thermal installed capacity
        qDebug() << this << " >> thermal_generation_output_installed_cap_noess_tables";
        pstmt = con->prepareStatement("SELECT * FROM thermal_generation_output_installed_cap_noess_tables WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        while (res->next()) {
            SolPPeakNoESS.push_back(res->getDouble("outthermgen" + std::to_string(year)));
        }
        delete res;
        delete pstmt;
        for (unsigned int i = 0; i < SolPPeakNoESS.size(); i++) {
            qDebug() << "Thermal investment: " << SolPPeakNoESS[i];
        }
        //Read installed renewable capacity
        qDebug() << this << " >> renewables_output_installed_cap_noess_table";
        pstmt = con->prepareStatement("SELECT * FROM renewables_output_installed_cap_noess_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        while (res->next()) {
            SolPRNoESS.push_back(res->getDouble("outwind" + std::to_string(year)));
            SolPRNoESS.push_back(res->getDouble("outsolarpv" + std::to_string(year)));
        }
        delete res;
        delete pstmt;
        for (unsigned int i = 0; i < SolPRNoESS.size(); i++) {
            qDebug() << "Ren investment: " << SolPRNoESS[i];
        }
        //Read Metrics
        qDebug() << this << " >> generator_calculated_metrics";
        pstmt = con->prepareStatement("SELECT * FROM generator_calculated_metrics WHERE  ess_or_noess = 0 AND scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        counter = 0;
        while (res->next()) {
            if(counter<NGen+NR/2+NHyd){
                FuelCostNoESS.push_back(res->getDouble("fuel_cost"));
                VOMCostNoESS.push_back(res->getDouble("vom_cost"));
                FOMCostNoESS.push_back(res->getDouble("fom_cost"));
                PRCostNoESS.push_back(res->getDouble("generation_primary_reserve_cost"));
                SRCostNoESS.push_back(res->getDouble("generation_secondary_reserve_cost"));
                TRCostNoESS.push_back(res->getDouble("generation_tertiary_reserve_cost"));
                thermtypeNoESS.push_back(res->getString("generator"));
            }
            else{
                VOMsCostNoESS.push_back(res->getDouble("vom_cost"));
                FOMsCostNoESS.push_back(res->getDouble("fom_cost"));
                EACostNoESS.push_back(res->getDouble("storage_energy_revenue"));
                PRsCostNoESS.push_back(res->getDouble("storage_primary_reserve_cost"));
                SRsCostNoESS.push_back(res->getDouble("storage_secondary_reserve_cost"));
                TRsCostNoESS.push_back(res->getDouble("storage_tertiary_reserve_cost"));
                stotypeNoESS.push_back(res->getString("generator"));
            }
            counter++;
        }
        delete res;
        delete pstmt;

    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        std::string query2("UPDATE scenarios_and_cases SET stacked_benefits_calculation_status = 'ERROR_QUERY', stacked_benefits_calculation_date =CURRENT_TIMESTAMP() WHERE row_id = ?;");
        pstmt = con->prepareStatement(query2);
        pstmt->setInt(1, scenario_and_cases_row_id);
        pstmt->execute();
        delete pstmt;
        delete con;

        return 1;
    }

    int NGen = SolPPeak.size();
    int NR = SolPR.size();
    int NHyd = SolPH.size();
    qDebug() << "NGen: " << NGen << ", NR: " << NR/2 << ", NHyd: " << NHyd << ".";
    for (unsigned int i=0;i<thermtype.size();i++){
        std::string gen(thermtype[i]);
        qDebug() << "Thermal type = " << gen.c_str();
    }
    for(unsigned int i=0;i<stotype.size();i++){
        std::string sto(stotype[i]);
        qDebug() << "Storage type = " << sto.c_str();
    }

    //Fuel Cost Savings
    double TotalFuelCost, TotalFuelCostNoESS;
    TotalFuelCost = std::accumulate(FuelCost.begin(), FuelCost.end(), 0.0);
    TotalFuelCostNoESS = std::accumulate(FuelCostNoESS.begin(), FuelCostNoESS.end(), 0.0);
    double FCS = TotalFuelCostNoESS - TotalFuelCost;

    //VOM Savings
    //Thermal
    double TotalVOMCost, TotalVOMCostNoESS;
    TotalVOMCost = std::accumulate(VOMCost.begin(), VOMCost.end(), 0.0);
    TotalVOMCostNoESS = std::accumulate(VOMCostNoESS.begin(), VOMCostNoESS.end(), 0.0);
    double VCS = TotalVOMCostNoESS - TotalVOMCost;
    //Storage
    double TotalStoVOMCost, TotalStoVOMCostNoESS;
    TotalStoVOMCost = std::accumulate(VOMsCost.begin(), VOMsCost.end(), 0.0);
    TotalStoVOMCostNoESS = std::accumulate(VOMsCostNoESS.begin(), VOMsCostNoESS.end(), 0.0);
    double SVCS = TotalStoVOMCostNoESS - TotalStoVOMCost;
    //Total
    double TVCS = VCS + SVCS;

    //Primary reserve savings
    //Thermal
    double TotalRPCost, TotalRPCostNoESS;
    TotalRPCost = std::accumulate(PRCost.begin(), PRCost.end(), 0.0);
    TotalRPCostNoESS = std::accumulate(PRCostNoESS.begin(), PRCostNoESS.end(), 0.0);
    double PRS = TotalRPCostNoESS - TotalRPCost;
//    //Hydro
//    double TotalHydRPCost, TotalHydRPCostNoESS;
//    TotalHydRPCost = std::accumulate(HydRPCost.begin(), HydRPCost.end(), 0.0);
//    TotalHydRPCostNoESS = std::accumulate(HydRPCostNoESS.begin(), HydRPCostNoESS.end(), 0.0);
//    double HPRS = TotalHydRPCostNoESS - TotalHydRPCost;
    //Storage
    double TotalStoRPCost, TotalStoRPCostNoESS;
    TotalStoRPCost = std::accumulate(PRsCost.begin(), PRsCost.end(), 0.0);
    TotalStoRPCostNoESS = std::accumulate(PRsCostNoESS.begin(), PRsCostNoESS.end(), 0.0);
    double SPRS = TotalStoRPCostNoESS - TotalStoRPCost;
    //DemResp
    /*std::vector<double> DemPR, DemPRNoESS;
    DemPR.reserve(ND);DemPRNoESS.reserve(ND);
    for (int i = 0; i < ND; i++){
        DemPR[i] = std::accumulate(StackBenIn.PC_results.RP_dem[i*NH], StackBenIn.PC_results.RP_dem[NH*(i+1)], 0.0);
        DemPRNoESS[i] = std::accumulate(PCNoESS.RP_dem[i*NH],PCNoESS.RP_dem[NH*(i+1)],0.0);
    }
    std::vector<double> DemRPCost,DemRPCostNoESS;
    DemRPCost.reserve(ND);DemRPCostNoESS.reserve(ND);
    for (int i = 0; i < ND; i++){
        DemRPCost[i] = DemPR[i] * StackBenIn.common_data.PResCd[i];
        DemRPCostNoESS[i] = DemPRNoESS[i] * StackBenIn.common_data.PResCd[i];
    }
    double TotalDemRPCost,TotalDemRPCostNoESS;
    TotalDemRPCost = std::accumulate(DemRPCost.begin(),DemRPCost.end(),0.0);
    TotalDemRPCostNoESS = std::accumulate(DemRPCostNoESS.begin(),DemRPCostNoESS.end(),0.0);
    double DPRS = TotalDemRPCostNoESS - TotalDemRPCost;*/
    double TPRS = PRS + SPRS; // + HPRS + DPRS;

    //Secondary reserve savings
    //Thermal
    double TotalRSCost, TotalRSCostNoESS;
    TotalRSCost = std::accumulate(SRCost.begin(), SRCost.end(), 0.0);
    TotalRSCostNoESS = std::accumulate(SRCostNoESS.begin(), SRCostNoESS.end(), 0.0);
    double SRS = TotalRSCostNoESS - TotalRSCost;
//    //Hydro
//    double TotalHydRSCost, TotalHydRSCostNoESS;
//    TotalHydRSCost = std::accumulate(HydRSCost.begin(), HydRSCost.end(), 0.0);
//    TotalHydRSCostNoESS = std::accumulate(HydRSCostNoESS.begin(), HydRSCostNoESS.end(), 0.0);
//    double HSRS = TotalHydRSCostNoESS - TotalHydRSCost;
    //Storage
    double TotalStoRSCost, TotalStoRSCostNoESS;
    TotalStoRSCost = std::accumulate(SRsCost.begin(), SRsCost.end(), 0.0);
    TotalStoRSCostNoESS = std::accumulate(SRsCostNoESS.begin(), SRsCostNoESS.end(), 0.0);
    double SSRS = TotalStoRSCostNoESS - TotalStoRSCost;
    //DemResp
    /*std::vector<double> DemSR,DemSRNoESS;
    DemSR.reserve(ND);DemSRNoESS.reserve(ND);
    for (int i = 0; i < ND; i++){
        DemSR[i] = std::accumulate(StackBenIn.PC_results.RS_dem[i*NH], StackBenIn.PC_results.RS_dem[NH*(i+1)], 0.0);
        DemSRNoESS[i] = std::accumulate(PCNoESS.RS_dem[i*NH],PCNoESS.RS_dem[NH*(i+1)],0.0);
    }
    std::vector<double> DemRSCost,DemRSCostNoESS;
    DemRSCost.reserve(ND);DemRSCostNoESS.reserve(ND);
    for (int i = 0; i < ND; i++){
        DemRSCost[i] = DemSR[i] * StackBenIn.common_data.SResCd[i];
        DemRSCostNoESS[i] = DemSRNoESS[i] * StackBenIn.common_data.SResCd[i];
    }
    double TotalDemRSCost,TotalDemRSCostNoESS;
    TotalDemRSCost = std::accumulate(DemRSCost.begin(),DemRSCost.end(),0.0);
    TotalDemRSCostNoESS = std::accumulate(DemRSCostNoESS.begin(),DemRSCostNoESS.end(),0.0);
    double DSRS = TotalDemRSCostNoESS - TotalDemRSCost;*/
    double TSRS = SRS + SSRS; // + HSRS + DSRS;

    //Tertiary reserve savings
    //Thermal
    double TotalRTCost, TotalRTCostNoESS;
    TotalRTCost = std::accumulate(TRCost.begin(), TRCost.end(), 0.0);
    TotalRTCostNoESS = std::accumulate(TRCostNoESS.begin(), TRCostNoESS.end(), 0.0);
    double TRS = TotalRTCostNoESS - TotalRTCost;
//    //Hydro
//    double TotalHydRTCost, TotalHydRTCostNoESS;
//    TotalHydRTCost = std::accumulate(HydRTCost.begin(), HydRTCost.end(), 0.0);
//    TotalHydRTCostNoESS = std::accumulate(HydRTCostNoESS.begin(), HydRTCostNoESS.end(), 0.0);
//    double HTRS = TotalHydRTCostNoESS - TotalHydRTCost;
    //Storage
    double TotalStoRTCost, TotalStoRTCostNoESS;
    TotalStoRTCost = std::accumulate(TRsCost.begin(), TRsCost.end(), 0.0);
    TotalStoRTCostNoESS = std::accumulate(TRsCostNoESS.begin(), TRsCostNoESS.end(), 0.0);
    double STRS = TotalStoRTCostNoESS - TotalStoRTCost;
    //DemResp
    /*std::vector<double> DemTR,DemTRNoESS;
    DemTR.reserve(ND);DemTRNoESS.reserve(ND);
    for (int i = 0; i < ND; i++){
        DemTR[i] = std::accumulate(StackBenIn.PC_results.RT_dem[i*NH], StackBenIn.PC_results.RT_dem[NH*(i+1)], 0.0);
        DemTRNoESS[i] = std::accumulate(PCNoESS.RT_dem[i*NH],PCNoESS.RT_dem[NH*(i+1)],0.0);
    }
    std::vector<double> DemRTCost,DemRTCostNoESS;
    DemRTCost.reserve(ND);DemRTCostNoESS.reserve(ND);
    for (int i = 0; i < ND; i++){
        DemRTCost[i] = DemTR[i] * StackBenIn.common_data.TResCd[i];
        DemRTCostNoESS[i] = DemTRNoESS[i] * StackBenIn.common_data.TResCd[i];
    }
    double TotalDemRTCost,TotalDemRTCostNoESS;
    TotalDemRTCost = std::accumulate(DemRTCost.begin(),DemRTCost.end(),0.0);
    TotalDemRTCostNoESS = std::accumulate(DemRTCostNoESS.begin(),DemRTCostNoESS.end(),0.0);
    double DTRS = TotalDemRTCostNoESS - TotalDemRTCost;*/
    double TTRS = TRS + STRS; // + HTRS + DTRS;

//    //Renewable curtailment
//    std::vector<double> RenGen, RenGenNoESS;
//    RenGen.reserve(NR);
//    RenGenNoESS.reserve(NR);
//    for (int i = 0; i < NR; i++) {
//        RenGen.push_back(std::accumulate(StackBenIn.PC_results.G_ren.begin() + i*NH, StackBenIn.PC_results.G_ren.begin() + (NH * (i + 1)), 0.0));
//        RenGenNoESS.push_back(std::accumulate(PCNoESS.G_ren.begin() + i*NH, PCNoESS.G_ren.begin() + (NH * (i + 1)), 0.0));
//    }
//    std::vector<double> MaxRenGen, MaxRenGenNoESS;
//    MaxRenGen.reserve(NR);
//    MaxRenGenNoESS.reserve(NR);
//    for (int i = 0; i < NR; i++) {
//        MaxRenGen.push_back(std::accumulate(StackBenIn.common_data.ResourceR.begin() + i*NH, StackBenIn.common_data.ResourceR.begin() + (NH * (i + 1)), 0.0) * StackBenIn.PC_data.SolPr[i]);
//        MaxRenGenNoESS.push_back(std::accumulate(StackBenIn.common_data.ResourceR.begin() + i*NH, StackBenIn.common_data.ResourceR.begin() + (NH * (i + 1)), 0.0) * AANoESS.P_R[i]);
//    }
//    std::vector<double> RenCurt, RenCurtNoESS;
//    RenCurt.reserve(NR);
//    RenCurtNoESS.reserve(NR);
//    for (int i = 0; i < NR; i++) {
//        RenCurt.push_back(MaxRenGen[i] - RenGen[i]);
//        RenCurtNoESS.push_back(MaxRenGenNoESS[i] - RenGenNoESS[i]);
//    }
//    double TotRenCurt, TotRenCurtNoESS;
//    TotRenCurt = std::accumulate(RenCurt.begin(), RenCurt.end(), 0.0);
//    TotRenCurtNoESS = std::accumulate(RenCurtNoESS.begin(), RenCurtNoESS.end(), 0.0);
//    double TRCS = TotRenCurtNoESS - TotRenCurt;

    //Energy arbitrage
    double TEA, TEANoESS;
    TEA = std::accumulate(EACost.begin(), EACost.end(), 0.0);
    TEANoESS = std::accumulate(EACostNoESS.begin(), EACostNoESS.end(), 0.0);
    double TEAS = TEANoESS - TEA;
    for (unsigned int s=0;s<EACost.size();s++){
        qDebug()<<"Storage " << s <<" energy revenue: "<<EACost[s];
        qDebug()<<"NoESS Storage " << s <<" energy revenue: "<<EACostNoESS[s];
    }

    //Reduced peak
//    std::vector<double> StoDc, StoDcNoESS, StoCh, StoChNoESS;
//    StoDc.reserve(NH);
//    StoDcNoESS.reserve(NH);
//    StoCh.reserve(NH);
//    StoChNoESS.reserve(NH);
//    for (int t = 0; t < NH; t++) {
//        StoDc.push_back(0);
//        StoCh.push_back(0);
//        StoDcNoESS.push_back(0);
//        StoChNoESS.push_back(0);
//        for (int i = 0; i < NS; i++) {
//            StoDc[t] += StackBenIn.PC_results.G_DS[i * NH + t];
//            StoCh[t] += StackBenIn.PC_results.G_CS[i * NH + t];
//            StoDcNoESS[t] += PCNoESS.G_DS[i * NH + t];
//            StoChNoESS[t] += PCNoESS.G_CS[i * NH + t];
//        }
//    }
//    std::vector<double> DemDN, DemDNNoESS, DemUP, DemUPNoESS;
//    DemDN.reserve(NH);
//    DemDNNoESS.reserve(NH);
//    DemUP.reserve(NH);
//    DemUPNoESS.reserve(NH);
//    for (int t = 0; t < NH; t++) {
//        DemDN.push_back(0);
//        DemUP.push_back(0);
//        DemDNNoESS.push_back(0);
//        DemUPNoESS.push_back(0);
//        for (int i = 0; i < ND; i++) {
//            DemDN[t] += StackBenIn.PC_results.DR_dn[i * NH + t];
//            DemUP[t] += StackBenIn.PC_results.DR_up[i * NH + t];
//            DemDNNoESS[t] += PCNoESS.DR_dn[i * NH + t];
//            DemUPNoESS[t] += PCNoESS.DR_up[i * NH + t];
//        }
//    }
//    std::vector<double> NetDemand, NetDemandNoESS;
//    NetDemand.reserve(NH);
//    NetDemandNoESS.reserve(NH);
//    for (int t = 0; t < NH; t++) {
//        NetDemand.push_back(StackBenIn.common_data.demand[t] + StoCh[t] - StoDc[t] + DemUP[t] - DemDN[t]);
//        NetDemandNoESS.push_back(StackBenIn.common_data.demand[t] + StoChNoESS[t] - StoDcNoESS[t] + DemUPNoESS[t] - DemDNNoESS[t]);
//    }
//    double peak_demand = *std::max_element(NetDemand.begin(), NetDemand.end());
//    double peak_demandNoESS = *std::max_element(NetDemandNoESS.begin(), NetDemandNoESS.end());
//    double CapCost = peak_demand * AANoESS.CapacityPrice;
//    double CapCostNoESS = peak_demandNoESS * AANoESS.CapacityPrice;
//    double TRDS = CapCostNoESS - CapCost;


    //Export of results
    try {

        //Write installed ESS power capacity
        qDebug() << this << "Query benefits_buckets_outputs_es_buckets_table";
        pstmt = con->prepareStatement("DELETE FROM benefit_buckets_output_es_buckets_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        //INSERT
        delete pstmt;
        delete res;
        pstmt = con->prepareStatement("INSERT INTO benefit_buckets_output_es_buckets_table(outfueldol1,outvomdol1,outprimresdol1,outsecresdol1,outterresdol1,outfreqresdol1,outreacpowdol1,outblacksavdol1,outenerarbdol1,outredpeakdol1,outforcerrdol1,outaddsavdol1,outtddefdol1,scenario_and_cases_row_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)");
        pstmt->setDouble(1, FCS);
        pstmt->setDouble(2, TVCS);
        pstmt->setDouble(3, TPRS);
        pstmt->setDouble(4, TSRS);
        pstmt->setDouble(5, TTRS);
        pstmt->setDouble(6, 500);
        pstmt->setDouble(7, 500.1);
        pstmt->setDouble(8, 500.2);
        pstmt->setDouble(9, TEAS);
        pstmt->setDouble(10, 600);
        pstmt->setDouble(11, 600);
        pstmt->setDouble(12, 500.3);
        pstmt->setDouble(13, 500.4);
        pstmt->setInt(14, scenario_and_cases_row_id);
        pstmt->executeUpdate();
        delete pstmt;
    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        std::string query2("UPDATE scenarios_and_cases SET stacked_benefits_calculation_status = 'ERROR_QUERY', stacked_benefits_calculation_date =CURRENT_TIMESTAMP() WHERE row_id = ?;");
        pstmt = con->prepareStatement(query2);
        pstmt->setInt(1, scenario_and_cases_row_id);
        pstmt->execute();
        delete pstmt;
        delete con;

        return 0;
    }
    int64_t end = performaceTime.currentMSecsSinceEpoch();
    int64_t time = end - start;
    int status = 5001;
    std::string query2("UPDATE scenarios_and_cases SET stacked_benefits_calculation_time = " + std::to_string(time) + ", stacked_benefits_calculation_status = 'COMPLETE', stacked_benefits_calculation_date =CURRENT_TIMESTAMP() WHERE row_id = ?;");

    pstmt = con->prepareStatement(query2);
    pstmt->setInt(1, scenario_and_cases_row_id);
    pstmt->execute();
    delete pstmt;
    delete con;
    return status;
}