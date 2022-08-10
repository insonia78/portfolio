
#include "AlternativeAnalysisMultiYearThread.h"
#include <QFileInfo>
#include <complex>

AlternativeAnalysisMultiYearThread::AlternativeAnalysisMultiYearThread(glpkLock* glpk, int identifierId, int row_id, DbConnector * database, QObject *parent) : QThread(parent) {
    identifier = QString("AlternativeAnalysisMultiYearThread_").append(QString::number(identifierId));
    this->database = database;
    temp_row = row_id;
    this->glpk = glpk;
    this->row_id = &temp_row;
    QObject::connect(this, SIGNAL(_terminateThread()), this, SLOT(DeleteThread()), Qt::QueuedConnection);
}

AlternativeAnalysisMultiYearThread::~AlternativeAnalysisMultiYearThread() {
    qDebug() << this << " >> Deleting";
}

void AlternativeAnalysisMultiYearThread::run() {
    qDebug() << this << " Start";
    AlternativeAnalysisMultiYear(*row_id, 2);

    emit _terminateThread();
    qDebug() << this << " Finished";
}

void AlternativeAnalysisMultiYearThread::DeleteThread() {
    this->exit();

    if (!this->wait(3000)) {
        this->terminate();
        this->wait();

    } else {
        this->deleteLater();
    }
}

int AlternativeAnalysisMultiYearThread::AlternativeAnalysisMultiYear(int scenario_and_cases_row_id, int NY) {//,int NY) {
    std::vector<double> peakdemand, energydemand;
    std::vector<std::vector<double>> demandprofile(NY);
    double windfirmpower, solarfirmpower, windfixedOM, solarfixedOM;
    std::vector<double> windinvcost, solarinvcost;
    std::vector<std::vector<double>> basewind(NY), basesolar(NY);
    std::vector<double> hydrocap, hydroinvcost;
    double hydrores1, hydrores2, hydrores3, hydrovomcost, hydrofomcost;
    std::vector<std::vector<double>> hydroEng(NY);
    double capplan1, lostload1;
    std::vector<double> primaryres, secondres, tertiaryres;
    std::vector<double> windcap, solarcap;
    std::vector<std::vector<double>> invcostpow(NY), invcostener(NY), voms(NY), eat(NY), mcd(NY), powcap(NY), enercaps(NY);
    std::vector<double> chargeeff, dischargeeff, firmpow, fixedoms, esramprate, esduration;
    std::vector<std::string> stotype;
    std::vector<double> heatrate, vom, p_reserve, s_reserve, t_reserve, carbon_rate, fixedom, sumderate, winderate, convramprate;
    std::vector<std::vector<double>> pconcap(NY), fuelprice(NY), invcost(NY);
    std::vector<std::string> thermtype;
    std::vector<double> enercap, demrescap, enercost, demrescost, enerinv, demresinv, enermax, demresmax;
    double enersav; //, demresPRC, demresSRC, demresTRC;
    int alt_an_years;
    double discount_rate;

    sql::Connection *con = NULL;
    sql::ResultSet *res;
    sql::PreparedStatement *pstmt;
    int count = 0;
    while (con == NULL) {
        if (count == 1) {
            count = 0;
            ThreadSleep(1000);
        }
        con = database->getAlternativeAnalysisCon("irena_storage_benefits_tool", con);
        count++;
    }

    try {
        //Read Calculation settings table
        pstmt = con->prepareStatement("SELECT * FROM calculation_settings_table WHERE scenario_and_cases_row_id = ?");
        qDebug() << "int " << scenario_and_cases_row_id;
        pstmt->setInt(1, scenario_and_cases_row_id);
        res = pstmt->executeQuery();
        while (res->next()) {
            alt_an_years = std::stoi(res->getString("alt_an_years")); //Convert string to int
            discount_rate = res->getDouble("discount_rate");
        }
        delete res;
        delete pstmt;
        NY = alt_an_years;
        //Read demand table
        pstmt = con->prepareStatement("SELECT * FROM demand_table WHERE scenario_and_cases_row_id = ?");
        qDebug() << "int " << scenario_and_cases_row_id;
        pstmt->setInt(1, scenario_and_cases_row_id);
        res = pstmt->executeQuery();

        std::string file_temp;
        while (res->next()) {
            for (int y = 1; y < NY + 1; y++) {
                file_temp = res->getString("userdemandprofile" + std::to_string(y));
                qDebug() << QString::fromStdString(file_temp);

                QFileInfo check_file("/home/gonzales1609/IRENA/SBT/data/Demand/North.csv");
                QFileInfo check_file1(QString::fromStdString(file_temp));
                qDebug() << check_file.exists();
                qDebug() << check_file1.exists();
                QFile file(QString::fromStdString(file_temp));

                if (!file.open(QIODevice::ReadOnly | QIODevice::Text)) {
                    qDebug() << this << "Demand " << y << " File has not opened";
                    std::string query3("UPDATE scenarios_and_cases SET alternative_analysis_calculation_status = 'ERROR in FILE'  WHERE row_id = ?;");
                    pstmt = con->prepareStatement(query3);
                    pstmt->setInt(1, scenario_and_cases_row_id);
                    pstmt->execute();
                    delete pstmt;
                    delete con;
                    return 1;
                } else
                    qDebug() << this << "File Opened";

                QTextStream in(&file);
                while (!in.atEnd()) {
                    QString line = in.readLine();
                    demandprofile[y - 1].push_back(line.toDouble());
                }
                peakdemand.push_back(res->getDouble("peakdemand" + std::to_string(y)));
                energydemand.push_back(res->getDouble("energydemand" + std::to_string(y)));
            }
        }
        delete res;
        delete pstmt;
        //Read Renewables table
        pstmt = con->prepareStatement("SELECT * FROM generation_renewables_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        while (res->next()) {
            for (int y = 1; y < NY + 1; y++) {
                std::string file_temp;
                file_temp = res->getString("userbasewind" + std::to_string(y));
                QFile file3(QString::fromStdString(file_temp));
                if (!file3.open(QIODevice::ReadOnly | QIODevice::Text)) {
                    qDebug() << this << "Wind File " << y << " has not opened";
                    std::string query3("UPDATE scenarios_and_cases SET alternative_analysis_calculation_status = 'ERROR in FILE'  WHERE row_id = ?;");
                    pstmt = con->prepareStatement(query3);
                    pstmt->setInt(1, scenario_and_cases_row_id);
                    pstmt->execute();
                    delete pstmt;
                    delete con;
                    return 1;
                } else
                    qDebug() << this << "File Opened";

                QTextStream in3(&file3);
                while (!in3.atEnd()) {
                    QString line3 = in3.readLine();
                    basewind[y - 1].push_back(line3.toDouble());
                }
                file_temp = res->getString("userbasesolar" + std::to_string(y));
                QFile file4(QString::fromStdString(file_temp));
                if (!file4.open(QIODevice::ReadOnly | QIODevice::Text)) {
                    qDebug() << this << "Solar File " << y << " has not opened";
                    std::string query3("UPDATE scenarios_and_cases SET alternative_analysis_calculation_status = 'ERROR in FILE'  WHERE row_id = ?;");
                    pstmt = con->prepareStatement(query3);
                    pstmt->setInt(1, scenario_and_cases_row_id);
                    pstmt->execute();
                    delete pstmt;
                    delete con;
                    return 1;
                } else
                    qDebug() << this << "File Opened";

                QTextStream in4(&file4);
                while (!in4.atEnd()) {
                    QString line4 = in4.readLine();
                    basesolar[y - 1].push_back(line4.toDouble());
                }


                windinvcost.push_back(res->getDouble("windinvcost" + std::to_string(y)));
                solarinvcost.push_back(res->getDouble("solarinvcost" + std::to_string(y)));

            }
            windfirmpower = res->getDouble("windfirmpower");
            solarfirmpower = res->getDouble("solarfirmpower");
            windfixedOM = res->getDouble("windfixedOM");
            solarfixedOM = res->getDouble("solarfixedOM");
        }

        delete res;
        delete pstmt;
        //Read Hydro table
        pstmt = con->prepareStatement("SELECT * FROM generation_hydro_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();

        while (res->next()) {
            for (int y = 1; y < NY + 1; y++) {
                hydrocap.push_back(res->getDouble("hydrocap" + std::to_string(y)));
                hydroinvcost.push_back(res->getDouble("hydroinvcost" + std::to_string(y)));
            }
            hydrores1 = res->getDouble("hydrores1");
            hydrores2 = res->getDouble("hydrores2");
            hydrores3 = res->getDouble("hydrores3");
            hydrovomcost = res->getDouble("hydrovomcost");
            hydrofomcost = res->getDouble("hydrofomcost");
            //hydroramprate = res->getDouble("hydroramprate");
        }
        delete res;
        delete pstmt;
        //Read Hydro energy table
        pstmt = con->prepareStatement("SELECT * FROM hydro_monthly_energy_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        while (res->next()) {
            for (int y = 1; y < NY + 1; y++) {
                for (int m = 1; m < 13; m++) {
                    hydroEng[y - 1].push_back(res->getDouble("hydroEng" + std::to_string(y) + "_" + std::to_string(m)));
                }
            }
        }
        delete res;
        delete pstmt;
        //Read Planning criteria table
        pstmt = con->prepareStatement("SELECT * FROM programs_planning_criteria_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();

        while (res->next()) {
            capplan1 = res->getDouble("capplan1");
            lostload1 = res->getDouble("lostload1");
            for (int y = 1; y < NY + 1; y++) {
                primaryres.push_back(res->getDouble("primaryres" + std::to_string(y)));
                secondres.push_back(res->getDouble("secondres" + std::to_string(y)));
                tertiaryres.push_back(res->getDouble("tertiaryres" + std::to_string(y)));
            }
        }
        delete res;
        delete pstmt;
        //Read Renewable programme table
        pstmt = con->prepareStatement("SELECT * FROM programs_renewables_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        while (res->next()) {
            for (int y = 1; y < NY + 1; y++) {
                windcap.push_back(res->getDouble("windcappol" + std::to_string(y)));

                solarcap.push_back(res->getDouble("solarcappol" + std::to_string(y)));
            }
        }
        delete res;
        delete pstmt;
        //Read Demand side programme table
        pstmt = con->prepareStatement("SELECT * FROM programs_demand_side_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        while (res->next()) {
            for (int y = 1; y < NY + 1; y++) {
                enercap.push_back(res->getDouble("enercap_ds" + std::to_string(y)));
                demrescap.push_back(res->getDouble("demrescap_ds" + std::to_string(y)));
                enercost.push_back(res->getDouble("enercost_ds" + std::to_string(y)));
                demrescost.push_back(res->getDouble("demrescost_ds" + std::to_string(y)));
                enerinv.push_back(res->getDouble("enerinv_ds" + std::to_string(y)));
                demresinv.push_back(res->getDouble("demresinv_ds" + std::to_string(y)));
                enermax.push_back(res->getDouble("enermax_ds" + std::to_string(y)));
                demresmax.push_back(res->getDouble("demresmax_ds" + std::to_string(y)));
            }
            enersav = res->getDouble("enersav_ds");
            /*demresPRC = res->getDouble("demresPRC_ds");
            demresSRC = res->getDouble("demresSRC_ds");
            demresTRC = res->getDouble("demresTRC_ds");*/

        }
        delete res;
        delete pstmt;
        //Read energy storage dynamic table
        pstmt = con->prepareStatement("SELECT * FROM energy_storage_dynamic_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();

        while (res->next()) {
            for (int y = 1; y < NY + 1; y++) {
                enercaps[y - 1].push_back(res->getDouble("enercap" + std::to_string(y)));
                powcap[y - 1].push_back(res->getDouble("powcap" + std::to_string(y)));
            }
            chargeeff.push_back(res->getDouble("chargeeff"));
            dischargeeff.push_back(res->getDouble("dischargeeff"));
            esramprate.push_back(res->getDouble("esramprate"));
            esduration.push_back(res->getDouble("esduration"));
            stotype.push_back(res->getString("storage_options"));
        }
        delete res;
        delete pstmt;
        for (unsigned int i = 0; i < esduration.size(); i++) {
            qDebug() << "Duration" << esduration[i];
        }
        //Read energy storage cost dynamic table
        pstmt = con->prepareStatement("SELECT * FROM energy_storage_cost_dynamic_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();

        while (res->next()) {
            for (int y = 1; y < NY + 1; y++) {
                invcostpow[y - 1].push_back(res->getDouble("invcostpow" + std::to_string(y)));
                invcostener[y - 1].push_back(res->getDouble("invcostener" + std::to_string(y)));
                voms[y - 1].push_back(res->getDouble("vom" + std::to_string(y)));
                eat[y - 1].push_back(res->getDouble("esenerarb" + std::to_string(y)));
                mcd[y - 1].push_back(res->getDouble("esmargcost" + std::to_string(y)));
            }
            firmpow.push_back((res->getDouble("firmpow")) / 100);
            fixedoms.push_back(res->getDouble("esfixedom"));
        }
        delete res;
        delete pstmt;
        //Read fuelprice forecast table
        pstmt = con->prepareStatement("SELECT * FROM fuel_price_forecast_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();

        while (res->next()) {
            for (int y = 1; y < NY + 1; y++) {
                fuelprice[y - 1].push_back(res->getDouble("fuelprice" + std::to_string(y)));
            }
        }
        delete pstmt;
        delete res;
        //Read conventional generation dynamic table
        pstmt = con->prepareStatement("SELECT * FROM generation_conventional_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();

        while (res->next()) {
            for (int y = 1; y < NY + 1; y++) {
                pconcap[y - 1].push_back(res->getDouble("pconcap" + std::to_string(y)));
            }
            heatrate.push_back(res->getDouble("heatrate"));
            p_reserve.push_back(res->getDouble("p_reserve"));
            s_reserve.push_back(res->getDouble("s_reserve"));
            t_reserve.push_back(res->getDouble("t_reserve"));
            carbon_rate.push_back(res->getDouble("carbon_rate"));
            sumderate.push_back(res->getDouble("sumderate"));
            winderate.push_back(res->getDouble("winderate"));
            convramprate.push_back(res->getDouble("convramprate"));
            thermtype.push_back(res->getString("fuel_options"));
        }
        //Read tech capital dynamic table
        pstmt = con->prepareStatement("SELECT * FROM tech_capital_dynamic_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        while (res->next()) {
            fixedom.push_back(res->getDouble("fixedom"));
            vom.push_back(res->getDouble("vom"));
            for (int y = 1; y < NY + 1; y++) {
                invcost[y - 1].push_back(res->getDouble("invcost" + std::to_string(y)));
            }
        }

    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        std::string query2("UPDATE scenarios_and_cases SET alternative_analysis_calculation_status = 'ERROR_QUERY', alternative_analysis_calculation_date =CURRENT_TIMESTAMP()  WHERE row_id = ?;");
        pstmt = con->prepareStatement(query2);
        pstmt->setInt(1, scenario_and_cases_row_id);
        pstmt->execute();
        delete pstmt;
        delete con;

        return 0;
    }

    //Demand scaling
    std::vector<double> scalar, energy, peak;
    for (int y = 0; y < NY; y++) {
        energy.push_back(std::accumulate(demandprofile[y].begin(), demandprofile[y].end(), 0.0));
        peak.push_back(*std::max_element(demandprofile[y].begin(), demandprofile[y].end()));
    }
    for (int y = 0; y < NY; y++) {
        scalar.push_back((energydemand[y]*1000 - peakdemand[y]) / (energy[y] - peak[y]));
    }
    qDebug() << "Scalar 1" << scalar[0];
    qDebug() << "Scalar 2" << scalar[1];
    for (int y = 0; y < NY; y++) {
        for (unsigned int i = 0; i < demandprofile[y].size(); i++) {
            demandprofile[y][i] = demandprofile[y][i] * scalar[y];
        }
    }
    //Input data conversion
    AAMY_inputs input_data;
    input_data.NGen = fixedom.size();
    input_data.PexEE = enercap;
    input_data.PexD = demrescap;
    input_data.PexS = powcap;
    for (int y = 0; y < NY; y++) {
        for (unsigned int t = 0; t < demandprofile[y].size(); t++) {
            input_data.demand.push_back(demandprofile[y][t]);
        }
    }
    qDebug() << input_data.demand.size();
    input_data.Pl = pconcap;
    input_data.Ph = hydrocap;
    input_data.Ad = demresinv;
    input_data.Aee = enerinv;
    input_data.Ah = hydroinvcost;
    input_data.Ai = invcost;
    input_data.FOM = fixedom;
    for (int y = 0; y < NY; y++) {
        input_data.Ar.push_back(windinvcost[y]);
    }
    for (int y = 0; y < NY; y++) {
        input_data.Ar.push_back(solarinvcost[y]);
    }
    input_data.As = invcostpow;
    input_data.Duration = esduration;
    input_data.EAT = eat;
    input_data.ETACs = chargeeff;
    input_data.ETADs = dischargeeff;
    input_data.Emissions = carbon_rate;
    input_data.FOMs = fixedoms;
    input_data.FPh = {0.8};
    input_data.FPr = {windfirmpower / 100, solarfirmpower / 100};
    input_data.FOMr = {windfixedOM,solarfixedOM};
    input_data.FOMh = {hydrofomcost};
    input_data.PexR.reserve(NY);
    for (int y = 0; y < NY; y++) {
        std::vector<double> rencap;
        rencap.push_back(windcap[y]);
        rencap.push_back(solarcap[y]);
        input_data.PexR.push_back(rencap);
        rencap.clear();
    }
    input_data.FPs = firmpow;
    input_data.Fee = {enersav/100};
    input_data.FuelCost = fuelprice;
    input_data.Heat_Rates = heatrate;
    input_data.MCD = mcd;

    input_data.PResC = p_reserve;
    input_data.PResCh = {hydrores1};
    input_data.PeeM = enermax;
    input_data.RCs = invcostener;
    input_data.ReserveDuration = {0.25, 0.5, 1};
    for (int y = 0; y < NY; y++) {
        input_data.ReserveRequirements.push_back(primaryres[y]);
    }
    for (int y = 0; y < NY; y++) {
        input_data.ReserveRequirements.push_back(secondres[y]);
    }
    for (int y = 0; y < NY; y++) {
        input_data.ReserveRequirements.push_back(tertiaryres[y]);
    }
    for (int y = 0; y < NY; y++) {
        for (int i = 0; i < 12; i++) {
            input_data.ResourceH.push_back(hydroEng[y][i]*1000);
        }
    }
    input_data.SResC = s_reserve;
    input_data.SResCh = {hydrores2};
    input_data.SafetyFactor = capplan1 / 100;
    input_data.DiscRate = discount_rate / 100;
    input_data.TResC = t_reserve;
    input_data.TResCh = {hydrores3};
    input_data.VCd = {demrescost};
    input_data.VOM = vom;
    input_data.VOMs = voms;
    input_data.NEE = 1; //input_data.PexEE.size();
    input_data.ND = 1; //input_data.PexD.size();
    input_data.NR = input_data.PexR[0].size();
    input_data.NHyd = 1; //input_data.Ph.size();
    input_data.NS = input_data.PexS[0].size();

    const int NGen = input_data.NGen; //Number of peaking generators
    const int NH = 24; //Number of hours
    const int NHyd = input_data.NHyd; //Number of hydro generators
    const int NEE = input_data.NEE; //Energy efficiency measures
    const int ND = input_data.ND; //Demand response technologies
    const int NR = input_data.NR; //Renewable Sources
    const int NS = input_data.NS; //Storage Technologies
    for (int y = 0; y < NY; y++) {
        std::vector<double> sto_rescost;
        for (int s = 0; s < NS; s++) {
            sto_rescost.push_back(0.0);
        }
        input_data.PResCs.push_back(sto_rescost);
        input_data.SResCs.push_back(sto_rescost);
        input_data.TResCs.push_back(sto_rescost);
    }
    //    for(int i =0; i < NGen;i++){
    //        input_data.PResC.push_back(5*(i+1));
    //        input_data.SResC.push_back(5*(i+1));
    //        input_data.TResC.push_back(5*(i+1));
    //    }
    std::cout << "NGen: " << NGen << ", NHyd: " << NHyd << ", NEE: " << NEE << std::endl;
    std::cout << "ND: " << ND << ", NR: " << NR << ", NS: " << NS << std::endl;
    for (int y = 0; y < NY; y++) {
        for (unsigned int i = 0; i < basewind[y].size(); i++) {
            input_data.ResourceR.push_back(basewind[y][i]);
        }
    }
    for (int y = 0; y < NY; y++) {
        for (unsigned int i = 0; i < basesolar[y].size(); i++) {
            input_data.ResourceR.push_back(basesolar[y][i]);
        }
    }
    std::cout << "Resource R size: " << input_data.ResourceR.size() << std::endl;
    const int DaysperMonth[12] = {31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
    std::vector<double> HoursperMonth;
    HoursperMonth.reserve(12);
    int HoursLimits[13] = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
    for (int i = 0; i < 12; i++) {
        HoursperMonth[i] = 24 * DaysperMonth[i];
    }
    for (int i = 1; i < 13; i++) {
        for (int j = 0; j < i; j++) {
            HoursLimits[i] = HoursLimits[i] + HoursperMonth[j];
        }
    }
    std::vector<double> demand;
    demand.reserve(NH * NY);
    std::vector<double> max_demand;
    for (int y = 0; y < NY; y++) {
        max_demand.push_back(*std::max_element(input_data.demand.begin() + y*NH, input_data.demand.begin()+(y + 1) * NH));
    }
    //Obtaining and saving maximum and minimum demands for each month.
    std::vector<std::vector<double>> dem_min(NY);
    for (int y = 0; y < NY; y++) {
        for (int m = 0; m < 12; m++) {
            dem_min[y].push_back(max_demand[y]);
        }
    }
    std::vector<std::vector<double>> dem_max(NY);
    for (int y = 0; y < NY; y++) {
        for (int m = 0; m < 12; m++) {
            dem_max[y].push_back(0.0);
        }
    }
    int dem_min_pos[NY][12], dem_max_pos[NY][12];
    for (int y = 0; y < NY; y++) {
        for (int i = 0; i < 12; i++) {
            for (int t = HoursLimits[i]; t < HoursLimits[i + 1]; t++) {
                if (input_data.demand[t] <= dem_min[y][i]) {
                    dem_min[y][i] = input_data.demand[y * 8760 + t];
                    dem_min_pos[y][i] = t;
                }
                if (input_data.demand[t] >= dem_max[y][i]) {
                    dem_max[y][i] = input_data.demand[y * 8760 + t];
                    dem_max_pos[y][i] = t;
                }
            }
        }
    }
    //Definition of demand curve
    for (int y = 0; y < NY; y++) {
        for (int i = 0; i < 12; i++) {
            demand[y * NH + 2 * i] = dem_min[y][i];
            demand[y * NH + 2 * i + 1] = dem_max[y][i];
        }
    }
    input_data.demand.clear();
    //Definition of renewable resources
    double windres[NH * NY], solres[NH * NY];
    for (int y = 0; y < NY; y++) {
        for (int t = 0; t < 12; t++) {
            windres[y * NH + t * 2] = input_data.ResourceR[y * 8760 + dem_min_pos[y][t]];
            windres[y * NH + t * 2 + 1] = input_data.ResourceR[y * 8760 + dem_max_pos[y][t]];
            solres[y * NH + t * 2] = input_data.ResourceR[basewind[0].size() + y * 8760 + dem_min_pos[y][t]];
            solres[y * NH + t * 2 + 1] = input_data.ResourceR[basewind[0].size() + y * 8760 + dem_max_pos[y][t]];
        }
    }
    input_data.ResourceR.clear();
    for (int t = 0; t < NH * NY; t++) {
        input_data.ResourceR.push_back(windres[t]);
    }
    for (int t = 0; t < NH * NY; t++) {
        input_data.ResourceR.push_back(solres[t]);
    }


    //Sum of existing plant capacity
    std::vector<std::vector<double>> CapCredESS(NY), CapCredREN(NY);
    for (int y = 0; y < NY; y++) {
        for (int s = 0; s < NS; s++) {
            CapCredESS[y].push_back(input_data.PexS[y][s] * input_data.FPs[s]);
        }
        for (int r = 0; r < NR; r++) {
            CapCredREN[y].push_back(input_data.PexR[y][r] * input_data.FPr[r]);
        }
    }
    std::vector<double> Existing_Cap;
    for (int y = 0; y < NY; y++) {
        Existing_Cap.push_back(std::accumulate(input_data.Pl[y].begin(), input_data.Pl[y].end(), 0.0) + input_data.Ph[y] * input_data.FPh[0] + std::accumulate(CapCredESS[y].begin(), CapCredESS[y].end(), 0.0) + std::accumulate(CapCredREN[y].begin(), CapCredREN[y].end(), 0.0));
    }
    std::vector<double> Fix_Cap;
    //Fixed capacity for short and mid-short storage (MW)
    Fix_Cap.push_back(0.25 * 0.25 * input_data.ReserveRequirements[0]);
    Fix_Cap.push_back(0.25 * 0.75 * input_data.ReserveRequirements[0]);

    //Input data conversion
    std::vector<std::vector<double>> VCi(NY); //Variable costs of thermal generators ($/MWh);
    std::vector<double> EmissionFactor;
    EmissionFactor.reserve(NGen); //Emissions Cost($/MWh)
    for (int y = 0; y < NY; y++) {
        for (int i = 0; i < NGen; i++) {
            VCi[y].push_back((input_data.FuelCost[y][i] * input_data.Heat_Rates[i] + input_data.VOM[i] + input_data.Emissions[i] * input_data.Heat_Rates[i] * input_data.CarbonPrice) / std::pow((1 + input_data.DiscRate), y));
            EmissionFactor[i] = input_data.Emissions[i] * input_data.Heat_Rates[i] * input_data.CarbonPrice;
        }
    }
    std::vector<std::vector<double>> VCF(NY);
    for (int y = 0; y < NY; y++) {
        for (int i = 0; i < (NGen); i++) {
            for (int t = 0; t < NH; t++) {
                VCF[y].push_back(VCi[y][i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22)));
            }
        }
    }
    std::vector<std::vector<double>> PRCost(NY), SRCost(NY), TRCost(NY);
    for (int y = 0; y < NY; y++) {
        for (int i = 0; i < (NGen); i++) {
            for (int t = 0; t < NH; t++) {
                PRCost[y].push_back((input_data.PResC[i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22))) / std::pow(1 + input_data.DiscRate, y));
                SRCost[y].push_back((input_data.SResC[i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22))) / std::pow(1 + input_data.DiscRate, y));
                TRCost[y].push_back((input_data.TResC[i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22))) / std::pow(1 + input_data.DiscRate, y));
            }
        }
    }
    std::vector<std::vector<double>> VCDF(NY);
    for (int y = 0; y < NY; y++) {
        for (int i = 0; i < ND; i++) {
            for (int t = 0; t < NH; t++) {
                VCDF[y].push_back((input_data.VCd[i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22))) / std::pow(1 + input_data.DiscRate, y));
            }
        }
    }
    std::vector<std::vector<double>> VCRF(NY);
    for (int y = 0; y < NY; y++) {
        for (int i = 0; i < NR; i++) {
            for (int t = 0; t < NH; t++) {
                VCRF[y].push_back(0.0);
            }
        }
    }
    std::vector<std::vector<double>> VCHF(NY);
    for (int y = 0; y < NY; y++) {
        for (int i = 0; i < NHyd; i++) {
            for (int t = 0; t < NH; t++) {
                VCHF[y].push_back(hydrovomcost);
            }
        }
    }
    std::vector<std::vector<double>> PRCostHyd(NY), SRCostHyd(NY), TRCostHyd(NY);
    for (int y = 0; y < NY; y++) {
        for (int i = 0; i < NHyd; i++) {
            for (int t = 0; t < NH; t++) {
                PRCostHyd[y].push_back((input_data.PResCh[i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22))) / std::pow(1 + input_data.DiscRate, y));
                SRCostHyd[y].push_back((input_data.SResCh[i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22))) / std::pow(1 + input_data.DiscRate, y));
                TRCostHyd[y].push_back((input_data.TResCh[i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22))) / std::pow(1 + input_data.DiscRate, y));
            }
        }
    }
    std::vector<std::vector<double>> VCSF(NY);
    for (int y = 0; y < NY; y++) {
        for (int i = 0; i < NS; i++) {
            for (int t = 0; t < NH; t++) {
                VCSF[y].push_back((input_data.VOMs[y][i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22))) / std::pow(1 + input_data.DiscRate, y));
            }
        }
    }
    std::vector<std::vector<double>> PRCosts(NY), SRCosts(NY), TRCosts(NY);
    for (int y = 0; y < NY; y++) {
        for (int i = 0; i < NS; i++) {
            for (int t = 0; t < NH; t++) {
                PRCosts[y].push_back((input_data.PResCs[y][i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22))) / std::pow(1 + input_data.DiscRate, y));
                SRCosts[y].push_back((input_data.SResCs[y][i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22))) / std::pow(1 + input_data.DiscRate, y));
                TRCosts[y].push_back((input_data.TResCs[y][i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22))) / std::pow(1 + input_data.DiscRate, y));
            }
        }
    }
    std::vector<std::vector<double>> VCSEF(NY);
    for (int y = 0; y < NY; y++) {
        for (int i = 0; i < NS; i++) {
            for (int t = 0; t < NH; t++) {
                VCSEF[y].push_back(0.0);
            }
        }
    }
    std::vector<std::vector<double>> As(NY);
    for (int y = 0; y < NY; y++) {
        for (int i = 0; i < NS; i++) {
            As[y].push_back((input_data.As[y][i] + input_data.FOMs[i] - input_data.MCD[y][i] - input_data.EAT[y][i]) / std::pow(1 + input_data.DiscRate, y));
        }
    }
    int ret;
    AAMY_outputs results;
    results.E_S.reserve(NY);
    results.P_S.reserve(NY);
    results.P_H.reserve(NY);
    results.P_R.reserve(NY);
    results.P_DR.reserve(NY);
    results.P_ee.reserve(NY);
    int glpkCount = 0;
    while (!glpk->__tryLocking(false)) {
        if (glpkCount == 1) {
            glpkCount = 0;
            ThreadSleep(1000);
        }
        glpkCount++;
    }
    std::vector<glp_prob *> PROBLEM_VECTOR;
    for (int y = 0; y < NY; y++) {
        PROBLEM_VECTOR.push_back(glp_create_prob());
    }
    //Problem formulation
    for (int y = 0; y < NY; y++) {
        int NR_VARIABLES = NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + 2 * ND + NR + NHyd + NS * 3 + (NGen) * 3 + NHyd * 3 + NS * 3) + NH;
        glp_set_prob_name(PROBLEM_VECTOR[y], "AlternativeAnalysisMultiYear");
        glp_set_obj_dir(PROBLEM_VECTOR[y], GLP_MIN);
        glp_add_cols(PROBLEM_VECTOR[y], NR_VARIABLES);

        //Cost Vector definition
        std::vector<double> CostCoefficients;
        for (int i = 0; i < NGen; i++) {
            CostCoefficients.push_back((input_data.Ai[y][i] + input_data.FOM[i])*1000 / std::pow(1 + input_data.DiscRate, y));
        }
        for (int i = 0; i < NEE; i++) {
            CostCoefficients.push_back(input_data.Aee[y]*1000 / std::pow(1 + input_data.DiscRate, y));
        }
        for (int i = 0; i < ND; i++) {
            CostCoefficients.push_back(input_data.Ad[y]*1000 / std::pow(1 + input_data.DiscRate, y));
        }
        for (int i = 0; i < NR; i++) {
            CostCoefficients.push_back((input_data.Ar[y * NY + i] + input_data.FOMr[i])*1000 / std::pow(1 + input_data.DiscRate, y));
        }
        for (int i = 0; i < NHyd; i++) {
            CostCoefficients.push_back((input_data.Ah[y] + input_data.FOMh[i])*1000 / std::pow(1 + input_data.DiscRate, y));
        }
        for (int i = 0; i < NS; i++) {
            CostCoefficients.push_back(As[y][i]*1000);
        }
        for (int i = 0; i < NS; i++) {
            CostCoefficients.push_back(0.0); //No energy capacity costs
        }
        for (int i = 0; i < NH * NGen; i++) {
            CostCoefficients.push_back(VCF[y][i]);
        }
        for (int i = 0; i < NH * ND; i++) {
            CostCoefficients.push_back(VCDF[y][i]);
        }
        for (int i = 0; i < NH * ND; i++) {
            CostCoefficients.push_back(VCDF[y][i]);
        }
        for (int i = 0; i < NH * NR; i++) {
            CostCoefficients.push_back(VCRF[y][i]);
        }
        for (int i = 0; i < NH * NHyd; i++) {
            CostCoefficients.push_back(VCHF[y][i]);
        }
        for (int i = 0; i < NH * NS; i++) {
            CostCoefficients.push_back(VCSF[y][i]);
        }
        for (int i = 0; i < NH * NS; i++) {
            CostCoefficients.push_back(VCSF[y][i]);
        }
        for (int i = 0; i < NH * NS; i++) {
            CostCoefficients.push_back(VCSEF[y][i]);
        }
        for (int i = 0; i < NH * NGen; i++) {
            CostCoefficients.push_back(PRCost[y][i]);
        }
        for (int i = 0; i < NH * NGen; i++) {
            CostCoefficients.push_back(SRCost[y][i]);
        }
        for (int i = 0; i < NH * NGen; i++) {
            CostCoefficients.push_back(TRCost[y][i]);
        }
        for (int i = 0; i < NH * NHyd; i++) {
            CostCoefficients.push_back(PRCostHyd[y][i]);
        }
        for (int i = 0; i < NH * NHyd; i++) {
            CostCoefficients.push_back(SRCostHyd[y][i]);
        }
        for (int i = 0; i < NH * NHyd; i++) {
            CostCoefficients.push_back(TRCostHyd[y][i]);
        }
        for (int i = 0; i < NH * NS; i++) {
            CostCoefficients.push_back(PRCosts[y][i]);
        }
        for (int i = 0; i < NH * NS; i++) {
            CostCoefficients.push_back(SRCosts[y][i]);
        }
        for (int i = 0; i < NH * NS; i++) {
            CostCoefficients.push_back(TRCosts[y][i]);
        }
        for (int i = 0; i < NH; i++) {
            CostCoefficients.push_back(lostload1 / std::pow(input_data.DiscRate, y));
        }
        std::cout << "CCsize: " << CostCoefficients.size() << std::endl;

        //Structural variables (Columns).
        /*	
        Peaking Capacity			NGen
        Energy Efficiency Investments       NEE
        Demand Response Capacity		ND
        Renewables Capacity			NR
        Hydro Capacity				NHyd
        Storage Power Capacity			NS
        Storage Energy Capacity			NS
        Peaking Generation			NH * NGen
        Demand Response Up Shifts		NH * ND
        Demand Response Down Shifts		NH * ND
        Renewable Generation			NH * NR
        Hydro generation			NH * NHyd
        Storage Charging			NH * NS
        Storage Discharging			NH * NS
        Stored energy				NH * NS
        Primary reserve thermal                 NH * NGen
        Secondary reserve thermal		NH * NGen
        Tertiary reserve thermal		NH * NGen
        Primary reserve hydro			NH * NHyd
        Secondary reserve hydro			NH * NHyd
        Tertiary reserve hydro			NH * NHyd
        Primary reserve storage			NH * NS
        Secondary reserve storage		NH * NS
        Tertiary reserve storage		NH * NS
        Lost Load                               NH
        NGen+NEE+ND+NR+NHyd+NS*2+NH*(NGen+2*ND+NR+NHyd+NS*3+(NGen)*3+NHyd*3+NS*3)+NH
         */

        std::cout << "NR of variables: " << NR_VARIABLES << std::endl;
        int counter = 0;
        for (int i = 0; i < NGen; ++i) {
            glp_set_col_bnds(PROBLEM_VECTOR[y], i + 1 + counter, GLP_LO, input_data.Pl[y][i], 0.0);
            glp_set_obj_coef(PROBLEM_VECTOR[y], i + 1 + counter, CostCoefficients[i + counter]);
            qDebug() << "LO Column:" << i + counter << ", lb: " << input_data.Pl[y][i] << " ub: " << 0 << " cc: " << CostCoefficients[i + counter];
        }
        counter += NGen;
        for (int i = 0; i < NEE; i++) {
            glp_set_col_bnds(PROBLEM_VECTOR[y], i + 1 + counter, GLP_DB, input_data.PexEE[y], input_data.PeeM[y]);
            glp_set_obj_coef(PROBLEM_VECTOR[y], i + 1 + counter, CostCoefficients[i + counter]);
            qDebug() << "DB Column:" << i + counter << ", lb: " << input_data.PexEE[y] << " ub: " << input_data.PeeM[i] << " cc: " << CostCoefficients[i + counter];
        }
        counter += NEE;
        for (int i = 0; i < ND; i++) {
            glp_set_col_bnds(PROBLEM_VECTOR[y], i + 1 + counter, GLP_LO, input_data.PexD[y], 0.0);
            glp_set_obj_coef(PROBLEM_VECTOR[y], i + 1 + counter, CostCoefficients[i + counter]);
            qDebug() << "LO Column:" << i + counter << ", lb: " << input_data.PexD[y] << " ub: " << 0 << " cc: " << CostCoefficients[i + counter];
        }
        counter += ND;
        for (int i = 0; i < NR; i++) {
            glp_set_col_bnds(PROBLEM_VECTOR[y], i + 1 + counter, GLP_LO, input_data.PexR[y][i], 0.0);
            glp_set_obj_coef(PROBLEM_VECTOR[y], i + 1 + counter, CostCoefficients[i + counter]);
            qDebug() << "LO Column:" << i + counter << ", lb: " << input_data.PexR[y][i] << " ub: " << 0 << " cc: " << CostCoefficients[i + counter];
        }
        counter += NR;
        for (int i = 0; i < NHyd; i++) {
            glp_set_col_bnds(PROBLEM_VECTOR[y], i + 1 + counter, GLP_LO, input_data.Ph[i], 0.0);
            glp_set_obj_coef(PROBLEM_VECTOR[y], i + 1 + counter, CostCoefficients[i + counter]);
            qDebug() << "LO Column:" << i + counter << ", lb: " << input_data.Ph[i] << " ub: " << 0 << " cc: " << CostCoefficients[i + counter];
        }
        counter += NHyd;
        /*if (NS <= 2) {
            for (int i = 0; i < NS; i++) {
                glp_set_col_bnds(PROBLEM_VECTOR[y], i + 1 + counter, GLP_FX, Fix_Cap[i], Fix_Cap[i]);
                glp_set_obj_coef(PROBLEM_VECTOR[y], i + 1 + counter, CostCoefficients[i + counter]);
            }
            counter += NS;
        } else {
            for (int i = 0; i < 2; i++) {
                glp_set_col_bnds(PROBLEM_VECTOR[y], i + 1 + counter, GLP_FX, Fix_Cap[i], Fix_Cap[i]);
                glp_set_obj_coef(PROBLEM_VECTOR[y], i + 1 + counter, CostCoefficients[i + counter]);
            }
            for (int i = 2; i < NS; i++) {
                glp_set_col_bnds(PROBLEM_VECTOR[y], i + 1 + counter, GLP_LO, input_data.PexS[i], 0.0);
                glp_set_obj_coef(PROBLEM_VECTOR[y], i + 1 + counter, CostCoefficients[i + counter]);
            }
            counter += NS;
        }*/
        //Storage Capacity Variables
        for (int i = 0; i < NS; i++) {
            glp_set_col_bnds(PROBLEM_VECTOR[y], i + 1 + counter, GLP_LO, input_data.PexS[y][i], 0.0);
            glp_set_obj_coef(PROBLEM_VECTOR[y], i + 1 + counter, CostCoefficients[i + counter]);
            qDebug() << "LO Column:" << i + counter << ", lb: " << input_data.PexS[y][i] << " ub: " << 0 << " cc: " << CostCoefficients[i + counter];
        }
        counter += NS;
        for (int i = 0; i < NS + NGen * NH; i++) {
            glp_set_col_bnds(PROBLEM_VECTOR[y], i + 1 + counter, GLP_LO, 0.0, 0.0);
            glp_set_obj_coef(PROBLEM_VECTOR[y], i + 1 + counter, CostCoefficients[i + counter]);
        }
        counter += NS + NGen * NH;
        for (int i = 0; i < ND * 2 * NH + NR * NH + NHyd * NH + NS * NH * 3 + (NGen) * 3 * NH + NS * NH * 3 + NHyd * NH * 3 + NH; i++) {
            glp_set_col_bnds(PROBLEM_VECTOR[y], i + 1 + counter, GLP_LO, 0.0, 0.0);
            glp_set_obj_coef(PROBLEM_VECTOR[y], i + 1 + counter, CostCoefficients[i + counter]);
        }
        counter += ND * 2 * NH + NR * NH + NHyd * NH + NS * NH * 3 + (NGen) * 3 * NH + NS * NH * 3 + NHyd * NH * 3 + NH;
        std::cout << "Variable counter: " << counter << std::endl;

        //Rows definitions
        /*	
        Sufficiency				1			(>=)
        Hourly Balance			NH			(=)
        Final Energy Storage		NS			(=)
        DR Neutrality			ND			(=)
        Storage Inventory			NH * NS			(=)
        Storage fixed sizes			NS			(=)
        Thermal Capacity			NH * NGen		(<=)
        Storage Charge/Discharge Capacity	2 * NH * NS		(<=)
        Storage Energy Capacity		NH * NS			(<=)
        Demand Response Up/Down Capacity	2 * NH * ND		(<=)
        Renewable Capacity			NH * NR			(<=)
        Hydro capacity			NH * NHyd		(<=)
        Hydro energy			12			(<=)
        Sufficient energy for reserves	NH * NS			(<=)
        Maximum storage capacity		1			(<=)
        Hourly reserve provision		NH * 3			(>=)
        14+NH*4+NS*2+ND+NH*NS*5+NH*NGen+2*NH*ND+NH*NR+NH*NHyd
         */

        int PROBLEM_SIZE = 14 + NH * 4 + NS * 2 + ND + NH * NS * 5 + NH * NGen + 2 * NH * ND + NH * NR + NH*NHyd;
        std::cout << "Problem size is: " << PROBLEM_SIZE << std::endl;
        glp_add_rows(PROBLEM_VECTOR[y], PROBLEM_SIZE);

        std::vector<double> Lower_Bounds;
        Lower_Bounds.reserve(PROBLEM_SIZE);
        std::vector<double> Upper_Bounds;
        Upper_Bounds.reserve(PROBLEM_SIZE);
        int rowv_counter = 0;
        //Sufficiency
        Lower_Bounds[rowv_counter] = max_demand[y] * (1 + input_data.SafetyFactor);
        Upper_Bounds[rowv_counter] = 0.0;
        rowv_counter += 1;
        //Hourly balance
        for (int i = 0; i < NH; i++) {
            Lower_Bounds[i + rowv_counter] = demand[y * NH + i];
            Upper_Bounds[i + rowv_counter] = demand[y * NH + i];
            qDebug() << "Demand " << i << ":" << demand[y * NH + i];
        }
        rowv_counter += NH;
        //Final ESS, DR Neutrality, ESS Fixed sizes, ESS Inv, ESS Cap, Therm cap, DR Cap, Ren Cap, Hydro Cap
        for (int i = 0; i < NS * 2 + ND + NH * (NS * 4 + NGen + ND * 2 + NR + NHyd); i++) {
            Lower_Bounds[i + rowv_counter] = 0.0;
            Upper_Bounds[i + rowv_counter] = 0.0;
        }
        rowv_counter += NS * 2 + ND + NH * (NS * 4 + NGen + ND * 2 + NR + NHyd);
        //Hydro monthly energy
        for (int i = 0; i < 12; i++) {
            Lower_Bounds[i + rowv_counter] = 0.0;
            Upper_Bounds[i + rowv_counter] = input_data.ResourceH[y * 12 + i];
            qDebug() << "Resource hydro" << i << ":" << input_data.ResourceH[y * 12 + i];
        }
        rowv_counter += 12;
        //ESS sufficient energy
        for (int i = 0; i < NH * NS; i++) {
            Lower_Bounds[i + rowv_counter] = 0.0;
            Upper_Bounds[i + rowv_counter] = 0.0;
        }
        rowv_counter += NS * NH;
        //ESS max capacity
        Lower_Bounds[rowv_counter] = 0.0;
        Upper_Bounds[rowv_counter] = 0.1 * max_demand[y] * (1 + input_data.SafetyFactor);
        qDebug() << "Maximum demand: " << max_demand;
        rowv_counter += 1;
        //Reserve provision
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < NH; j++) {
                Lower_Bounds[rowv_counter + i * NH + j] = input_data.ReserveRequirements[i * NY + y];
                Upper_Bounds[rowv_counter + i * NH + j] = 0.0;
            }
        }
        rowv_counter += NH * 3;
        qDebug() << "Nr of bounds is: " << rowv_counter;
        int rowb_counter = 0;
        glp_set_row_bnds(PROBLEM_VECTOR[y], rowb_counter + 1, GLP_LO, Lower_Bounds[rowb_counter], Upper_Bounds[rowb_counter]);
        qDebug() << "LO Restriction: " << 1 << " lb: " << Lower_Bounds[rowb_counter] << " ub: " << Upper_Bounds[rowb_counter];
        rowb_counter += 1;
        for (int i = 0; i < NH + NS + ND + NH * NS + NS; i++) {
            glp_set_row_bnds(PROBLEM_VECTOR[y], rowb_counter + 1 + i, GLP_FX, Lower_Bounds[i + rowb_counter], Upper_Bounds[i + rowb_counter]);
            qDebug() << "FX Restriction: " << i + rowb_counter + 1 << " lb: " << Lower_Bounds[i + rowb_counter] << " ub: " << Upper_Bounds[i + rowb_counter];
        }
        rowb_counter += NH + NS + ND + NH * NS + NS;
        for (int i = 0; i < 13 + NH * (NGen + NS * 4 + ND * 2 + NR + NHyd); i++) {
            glp_set_row_bnds(PROBLEM_VECTOR[y], rowb_counter + 1 + i, GLP_UP, Lower_Bounds[i + rowb_counter], Upper_Bounds[i + rowb_counter]);
            qDebug() << "UP Restriction: " << i + rowb_counter + 1 << " lb: " << Lower_Bounds[i + rowb_counter] << " ub: " << Upper_Bounds[i + rowb_counter];
        }
        rowb_counter += 13 + NH * (NGen + NS * 4 + ND * 2 + NR + NHyd);
        for (int i = 0; i < NH * 3; i++) {
            glp_set_row_bnds(PROBLEM_VECTOR[y], rowb_counter + 1 + i, GLP_LO, Lower_Bounds[i + rowb_counter], Upper_Bounds[i + rowb_counter]);
            qDebug() << "LO Restriction: " << i + rowb_counter + 1 << " lb: " << Lower_Bounds[i + rowb_counter] << " ub: " << Upper_Bounds[i + rowb_counter];
        }
        rowb_counter += NH * 3;
        qDebug() << "Nr of GL bounds: " << rowb_counter;

        //Matrix definition. Same order as rows and columns.
        //Rows
        /*					Non Zero Elements
        Sufficiency				NGen+NR+NS+NHyd				(>=)
        Hourly Balance				NH * (NGen+NR+NS*2+ND*2+NEE+NHyd)	(=)
        Final Energy Storage			NS * 2					(=)
        DR Neutrality				ND * (NH*2)				(=)
        Storage Inventory			NS * NH * 4				(=)
        Storage fixed sizes			NS * 2					(=)
        Peaking Capacity			NH * NGen * 5				(<=)
        Storage Charge/Discharge Capacity	NH * NS * 8				(<=)
        Storage Energy Capacity			NH * NS * 2				(<=)
        Demand Response Up/Down Capacity	NH * ND * 2 * 2				(<=)
        Renewable Capacity			NH * NR * 2				(<=)
        Hydro capacity				NH * NHyd * 5				(<=)
        Hydro energy				12 * NHyd * 2				(<=)
        Sufficient energy for reserves		NH * NS * 5				(<=)
        Maximum storage capacity		NS					(<=)
        Hourly reserve provision		NH * 3	* (NGen+NS+NHyd)		(>=)
         */

        const int NonZeroElements = NGen + NR + NS + NHyd + NH * (NGen + NR + NS * 2 + ND * 2 + NEE + NHyd) + NS * 5 + ND * NH * 2 + NS * NH * 19 + NH * NGen * 5 + NH * ND * 4 + NH * NR * 2 + NH * NHyd * 5 + 12 * NHyd * 2 + 3 * (NH * (NGen + NS + NHyd)); //Number of NZE of matrix
        std::cout << "NZE: " << NonZeroElements << std::endl;
        int Row_Indexes[NonZeroElements + 1], Col_Indexes[NonZeroElements + 1];
        //std::array<int,NonZeroElements> Row_Indexes, Col_Indexes;
        double Mat_Elements[NonZeroElements + 1];
        //std::array<double,NonZeroElements> Mat_Elements;
        int NZEcounter = 0;
        int ROWcounter = 0;
        //std::cout << "NGen: " <<NGen << ", NHyd: " << NHyd << ", NEE: " << NEE << std::endl;
        //std::cout << "ND: " << ND << ", NR: " << NR << ", NS: " << NS << ", NGenE: " << NGenE << std::endl;
        Row_Indexes[0] = 0;
        Col_Indexes[0] = 0;
        Mat_Elements[0] = 0;
        //System adequacy
        for (int i = 0; i < NGen; i++) {
            Row_Indexes[i + 1 + NZEcounter] = 1;
            Col_Indexes[i + 1 + NZEcounter] = i + 1;
            Mat_Elements[i + 1 + NZEcounter] = 1.0;
        }
        NZEcounter += NGen;
        for (int i = 0; i < NR; i++) {
            Row_Indexes[i + 1 + NZEcounter] = 1;
            Col_Indexes[i + 1 + NZEcounter] = i + 1 + NGen + NEE + ND;
            Mat_Elements[i + 1 + NZEcounter] = input_data.FPr[i];
        }
        NZEcounter += NR;
        for (int i = 0; i < NS; i++) {
            Row_Indexes[i + 1 + NZEcounter] = 1;
            Col_Indexes[i + 1 + NZEcounter] = i + 1 + NGen + NEE + ND + NR + NHyd;
            Mat_Elements[i + 1 + NZEcounter] = input_data.FPs[i];
        }
        NZEcounter += NS;
        for (int i = 0; i < NHyd; i++) {
            Row_Indexes[i + 1 + NZEcounter] = 1;
            Col_Indexes[i + 1 + NZEcounter] = i + 1 + NGen + NEE + ND + NR;
            Mat_Elements[i + 1 + NZEcounter] = input_data.FPh[i];
        }
        NZEcounter += NHyd;
        ROWcounter += 1;
        std::cout << "NZEcounter: " << NZEcounter << std::endl;
        std::cout << "ROWcounter: " << ROWcounter << std::endl;

        //Hourly Balance
        for (int i = 0; i < NH; i++) {
            for (int j = 0; j < NEE; j++) {
                Row_Indexes[j + 1 + NZEcounter] = ROWcounter + 1;
                Col_Indexes[j + 1 + NZEcounter] = NGen + 1 + j;
                Mat_Elements[j + 1 + NZEcounter] = demand[i] * (input_data.Fee[j] / input_data.PeeM[j]);
            }
            NZEcounter += NEE;
            for (int j = 0; j < NGen; j++) {
                Row_Indexes[j + 1 + NZEcounter] = ROWcounter + 1;
                Col_Indexes[j + 1 + NZEcounter] = NGen + NEE + ND + NR + NHyd + NS * 2 + 1 + j * NH + i;
                Mat_Elements[j + 1 + NZEcounter] = 1.0;
            }
            NZEcounter += NGen;
            for (int j = 0; j < ND; j++) {
                Row_Indexes[j + 1 + NZEcounter] = ROWcounter + 1;
                Col_Indexes[j + 1 + NZEcounter] = NGen + NEE + ND + NR + NHyd + NS * 2 + NGen * NH + 1 + j * NH + i;
                Mat_Elements[j + 1 + NZEcounter] = -1.0;
            }
            NZEcounter += ND;
            for (int j = 0; j < ND; j++) {
                Row_Indexes[j + 1 + NZEcounter] = ROWcounter + 1;
                Col_Indexes[j + 1 + NZEcounter] = NGen + NEE + ND + NR + NHyd + NS * 2 + NGen * NH + ND * NH + 1 + j * NH + i;
                Mat_Elements[j + 1 + NZEcounter] = 1.0;
            }
            NZEcounter += ND;
            for (int j = 0; j < NR; j++) {
                Row_Indexes[j + 1 + NZEcounter] = ROWcounter + 1;
                Col_Indexes[j + 1 + NZEcounter] = NGen + NEE + ND + NR + NHyd + NS * 2 + NGen * NH + ND * NH * 2 + 1 + j * NH + i;
                Mat_Elements[j + 1 + NZEcounter] = 1.0;
            }
            NZEcounter += NR;
            for (int j = 0; j < NHyd; j++) {
                Row_Indexes[j + 1 + NZEcounter] = ROWcounter + 1;
                Col_Indexes[j + 1 + NZEcounter] = NGen + NEE + ND + NR + NHyd + NS * 2 + NGen * NH + ND * NH * 2 + NR * NH + 1 + j * NH + i;
                Mat_Elements[j + 1 + NZEcounter] = -1.0;
            }
            NZEcounter += NHyd;
            for (int j = 0; j < NS; j++) {
                Row_Indexes[j + 1 + NZEcounter] = ROWcounter + 1;
                Col_Indexes[j + 1 + NZEcounter] = NGen + NEE + ND + NR + NHyd + NS * 2 + NGen * NH + ND * NH * 2 + NR * NH + NHyd * NH + 1 + j * NH + i;
                Mat_Elements[j + 1 + NZEcounter] = -1.0;
            }
            NZEcounter += NS;
            for (int j = 0; j < NS; j++) {
                Row_Indexes[j + 1 + NZEcounter] = ROWcounter + 1;
                Col_Indexes[j + 1 + NZEcounter] = NGen + NEE + ND + NR + NHyd + NS * 2 + NGen * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH + 1 + j * NH + i;
                Mat_Elements[j + 1 + NZEcounter] = 1.0;
            }
            NZEcounter += NS;
            ROWcounter += 1;
        }
        std::cout << "NZEcounter: " << NZEcounter << std::endl;
        std::cout << "ROWcounter: " << ROWcounter << std::endl;
        //Final Energy Storage
        for (int i = 0; i < NS; i++) {
            Row_Indexes[NZEcounter + 1] = ROWcounter + 1 + i;
            Row_Indexes[NZEcounter + 2] = ROWcounter + 1 + i;
            Col_Indexes[NZEcounter + 1] = NGen + NEE + ND + NR + NHyd + NS + i + 1;
            Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 2) + NH * (i + 1) - 1;
            Mat_Elements[NZEcounter + 1] = 0.5;
            Mat_Elements[NZEcounter + 2] = -1.0;
            NZEcounter = NZEcounter + 2;
        }
        ROWcounter = ROWcounter + NS;
        std::cout << "FES NZEcounter: " << NZEcounter << std::endl;
        std::cout << "ROWcounter: " << ROWcounter << std::endl;

        //DR Neutrality
        for (int i = 0; i < ND; i++) {
            for (int j = 0; j < NH * 2; j++) {
                Row_Indexes[NZEcounter + 1 + j] = ROWcounter + 1 + i;
                if (j < NH) {
                    Col_Indexes[NZEcounter + 1 + j] = NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + NH * i + j + 1;
                    Mat_Elements[NZEcounter + 1 + j] = 1.0;
                } else {
                    Mat_Elements[NZEcounter + 1 + j] = -1.0;
                    Col_Indexes[NZEcounter + 1 + j] = NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + NH * i + j + NH * (ND - 1) + 1;
                }
            }
            NZEcounter = NZEcounter + 2 * NH;
        }
        ROWcounter = ROWcounter + ND;
        std::cout << "DRNeut NZEcounter: " << NZEcounter << std::endl;
        std::cout << "ROWcounter: " << ROWcounter << std::endl;

        //Storage Inventory
        for (int i = 0; i < NS; i++) {
            for (int j = 0; j < NH; j++) {
                for (int k = 0; k < 4; k++) {
                    Row_Indexes[NZEcounter + 1 + k] = ROWcounter + 1;
                }
                if (j == 0) {
                    Col_Indexes[NZEcounter + 1] = NGen + NEE + ND + NR + NHyd + NS + i + 1;
                    Col_Indexes[NZEcounter + 2] = NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NH * i + 1;
                    Col_Indexes[NZEcounter + 3] = NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH + NH * i + 1;
                    Col_Indexes[NZEcounter + 4] = NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH * 2 + NH * i + 1;
                    Mat_Elements[NZEcounter + 1] = -0.5;
                    Mat_Elements[NZEcounter + 2] = -input_data.ETACs[i];
                    Mat_Elements[NZEcounter + 3] = 1 / input_data.ETADs[i];
                    Mat_Elements[NZEcounter + 4] = 1.0;
                } else {
                    Col_Indexes[NZEcounter + 1] = NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * 2 * NH + NR * NH + NHyd * NH + (i) * NH + j + 1;
                    Col_Indexes[NZEcounter + 2] = NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * 2 * NH + NR * NH + NHyd * NH + (i) * NH + j + 1 + NS * NH;
                    Col_Indexes[NZEcounter + 3] = NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * 2 * NH + NR * NH + NHyd * NH + (i) * NH + j + 1 + NS * NH * 2;
                    Col_Indexes[NZEcounter + 4] = NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * 2 * NH + NR * NH + NHyd * NH + (i) * NH + j + 1 + NS * NH * 2 - 1;
                    Mat_Elements[NZEcounter + 1] = -input_data.ETACs[i];
                    Mat_Elements[NZEcounter + 2] = 1 / input_data.ETADs[i];
                    Mat_Elements[NZEcounter + 3] = 1.0;
                    Mat_Elements[NZEcounter + 4] = -1.0;
                }
                NZEcounter = NZEcounter + 4;
                ROWcounter = ROWcounter + 1;
            }
        }
        std::cout << "SI NZEcounter: " << NZEcounter << std::endl;
        std::cout << "ROWcounter: " << ROWcounter << std::endl;

        //Storage fixed sizes
        for (int i = 0; i < NS; i++) {
            Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
            Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
            Col_Indexes[NZEcounter + 1] = NGen + NEE + ND + NR + NHyd + i + 1;
            Col_Indexes[NZEcounter + 2] = NGen + NEE + ND + NR + NHyd + NS + i + 1;
            Mat_Elements[NZEcounter + 1] = input_data.Duration[i];
            Mat_Elements[NZEcounter + 2] = -1.0;
            qDebug() << "Duration" << input_data.Duration[i];
            NZEcounter = NZEcounter + 2;
            ROWcounter = ROWcounter + 1;
        }
        std::cout << "SFS NZEcounter: " << NZEcounter << std::endl;
        std::cout << "ROWcounter: " << ROWcounter << std::endl;

        //Thermal Capacity
        for (int i = 0; i < NGen; i++) {
            for (int j = 0; j < NH; j++) {
                Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 3] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 4] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 5] = ROWcounter + 1;
                Col_Indexes[NZEcounter + 1] = i + 1;
                Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + i * NH + j;
                Col_Indexes[NZEcounter + 3] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 3) + i * NH + j;
                Col_Indexes[NZEcounter + 4] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 3) + NH * (NGen) + i * NH + j;
                Col_Indexes[NZEcounter + 5] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 3) + NH * (NGen) * 2 + i * NH + j;
                Mat_Elements[NZEcounter + 1] = -1.0;
                Mat_Elements[NZEcounter + 2] = 1.0;
                Mat_Elements[NZEcounter + 3] = 1.0;
                Mat_Elements[NZEcounter + 4] = 1.0;
                Mat_Elements[NZEcounter + 5] = 1.0;
                NZEcounter = NZEcounter + 5;
                ROWcounter = ROWcounter + 1;
            }
        }
        std::cout << "TCap NZEcounter: " << NZEcounter << std::endl;
        std::cout << "ROWcounter: " << ROWcounter << std::endl;

        //Storage Charge / Discharge Capacity
        for (int i = 0; i < NS; i++) {
            for (int j = 0; j < NH; j++) {
                Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
                Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + NR + NHyd + i;
                Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + i * NH + j;
                Mat_Elements[NZEcounter + 1] = -1.0;
                Mat_Elements[NZEcounter + 2] = 1.0;
                NZEcounter = NZEcounter + 2;
                ROWcounter = ROWcounter + 1;
            }
        }
        for (int i = 0; i < NS; i++) {
            for (int j = 0; j < NH; j++) {
                Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 3] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 4] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 5] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 6] = ROWcounter + 1;
                Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + NR + NHyd + i;
                Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH + i * NH + j;
                Col_Indexes[NZEcounter + 3] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH * 3 + NH * (NGen) * 3 + NHyd * NH * 3 + i * NH + j;
                Col_Indexes[NZEcounter + 4] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH * 3 + NH * (NGen) * 3 + NHyd * NH * 3 + NS * NH + i * NH + j;
                Col_Indexes[NZEcounter + 5] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH * 3 + NH * (NGen) * 3 + NHyd * NH * 3 + NS * NH * 2 + i * NH + j;
                Col_Indexes[NZEcounter + 6] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + i * NH + j;
                Mat_Elements[NZEcounter + 1] = -1.0;
                Mat_Elements[NZEcounter + 2] = 1.0;
                Mat_Elements[NZEcounter + 3] = 1.0;
                Mat_Elements[NZEcounter + 4] = 1.0;
                Mat_Elements[NZEcounter + 5] = 1.0;
                Mat_Elements[NZEcounter + 6] = -1.0;
                NZEcounter = NZEcounter + 6;
                ROWcounter = ROWcounter + 1;
            }
        }
        std::cout << "SCap NZEcounter: " << NZEcounter << std::endl;
        std::cout << "ROWcounter: " << ROWcounter << std::endl;

        //Storage Energy Capacity
        for (int i = 0; i < NS; i++) {
            for (int j = 0; j < NH; j++) {
                Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
                Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + NR + NHyd + NS + i;
                Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH * 2 + i * NH + j;
                Mat_Elements[NZEcounter + 1] = -1.0;
                Mat_Elements[NZEcounter + 2] = 1.0;
                NZEcounter = NZEcounter + 2;
                ROWcounter = ROWcounter + 1;
            }
        }
        std::cout << "SECap NZEcounter: " << NZEcounter << std::endl;
        std::cout << "ROWcounter: " << ROWcounter << std::endl;

        //Demand Response Up / Down Capacity
        for (int i = 0; i < ND; i++) {
            for (int j = 0; j < NH; j++) {
                Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
                Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + i;
                Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + i * NH + j;
                Mat_Elements[NZEcounter + 1] = -1.0;
                Mat_Elements[NZEcounter + 2] = 1.0;
                NZEcounter = NZEcounter + 2;
                ROWcounter = ROWcounter + 1;
            }
        }
        for (int i = 0; i < ND; i++) {
            for (int j = 0; j < NH; j++) {
                Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
                Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + i;
                Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH + i * NH + j;
                Mat_Elements[NZEcounter + 1] = -1.0;
                Mat_Elements[NZEcounter + 2] = 1.0;
                NZEcounter = NZEcounter + 2;
                ROWcounter = ROWcounter + 1;
            }
        }
        std::cout << "DRCap NZEcounter: " << NZEcounter << std::endl;
        std::cout << "ROWcounter: " << ROWcounter << std::endl;

        //Renewable Capacity
        for (int i = 0; i < NR; i++) {
            for (int j = 0; j < NH; j++) {
                Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
                Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + i;
                Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + i * NH + j;
                Mat_Elements[NZEcounter + 1] = -1.0 * input_data.ResourceR[y * NH + i * NH + j];
                Mat_Elements[NZEcounter + 2] = 1.0;
                NZEcounter = NZEcounter + 2;
                ROWcounter = ROWcounter + 1;
            }
        }
        std::cout << "RCap NZEcounter: " << NZEcounter << std::endl;
        std::cout << "ROWcounter: " << ROWcounter << std::endl;

        //Hydro capacity
        for (int i = 0; i < NHyd; i++) {
            for (int j = 0; j < NH; j++) {
                Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 3] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 4] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 5] = ROWcounter + 1;
                Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + NR + i;
                Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + i * NH + j;
                Col_Indexes[NZEcounter + 3] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH * 3 + NGen * NH * 3 + i * NH + j;
                Col_Indexes[NZEcounter + 4] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH * 3 + NGen * NH * 3 + NHyd * NH + i * NH + j;
                Col_Indexes[NZEcounter + 5] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH * 3 + NGen * NH * 3 + NHyd * NH * 2 + i * NH + j;
                Mat_Elements[NZEcounter + 1] = -1.0;
                Mat_Elements[NZEcounter + 2] = 1.0;
                Mat_Elements[NZEcounter + 3] = 1.0;
                Mat_Elements[NZEcounter + 4] = 1.0;
                Mat_Elements[NZEcounter + 5] = 1.0;
                NZEcounter = NZEcounter + 5;
                ROWcounter = ROWcounter + 1;
            }
        }
        std::cout << "HCap NZEcounter: " << NZEcounter << std::endl;
        std::cout << "ROWcounter: " << ROWcounter << std::endl;

        //Hydro energy
        for (int i = 0; i < 12; i++) {
            Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
            Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
            Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR) + i * 2 + 1;
            Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR) + i * 2 + 2;
            Mat_Elements[NZEcounter + 1] = 1.0;
            Mat_Elements[NZEcounter + 2] = 1.0;
            NZEcounter += 2;
            ROWcounter++;
        }
        std::cout << "HEn NZEcounter: " << NZEcounter << std::endl;
        std::cout << "ROWcounter: " << ROWcounter << std::endl;

        //Sufficient energy for reserves
        for (int i = 0; i < NS; i++) {
            for (int j = 0; j < NH; j++) {
                Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 3] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 4] = ROWcounter + 1;
                Row_Indexes[NZEcounter + 5] = ROWcounter + 1;
                Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS) + NH * i + j;
                Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 3 + (NGen + NHyd) * 3) + NH * i + j;
                Col_Indexes[NZEcounter + 3] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 3 + (NGen + NHyd) * 3 + NS) + NH * i + j;
                Col_Indexes[NZEcounter + 4] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 3 + (NGen + NHyd) * 3 + NS * 2) + NH * i + j;
                Col_Indexes[NZEcounter + 5] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 2) + NH * i + j;
                Mat_Elements[NZEcounter + 1] = 1.0;
                Mat_Elements[NZEcounter + 2] = input_data.ReserveDuration[0];
                Mat_Elements[NZEcounter + 3] = input_data.ReserveDuration[1];
                Mat_Elements[NZEcounter + 4] = input_data.ReserveDuration[2];
                Mat_Elements[NZEcounter + 5] = -1.0;
                NZEcounter = NZEcounter + 5;
                ROWcounter = ROWcounter + 1;
            }
        }
        std::cout << "SEne NZEcounter: " << NZEcounter << std::endl;
        std::cout << "ROWcounter: " << ROWcounter << std::endl;

        //Max Storage Capacity
        for (int i = 0; i < NS; i++) {
            Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
            Col_Indexes[NZEcounter + 1] = NGen + NEE + ND + NR + NHyd + i + 1;
            Mat_Elements[NZEcounter + 1] = 1.0;
            NZEcounter += 1;
        }
        ROWcounter++;
        std::cout << "SMCap NZEcounter: " << NZEcounter << std::endl;
        std::cout << "ROWcounter: " << ROWcounter << std::endl;

        //Hourly reserve provision
        for (int i = 0; i < 3; i++) {
            for (int t = 0; t < NH; t++) {
                for (int j = 0; j < NGen; j++) {
                    Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
                    Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 3 + (NGen) * i) + j * NH + t;
                    Mat_Elements[NZEcounter + 1] = 1.0;
                    NZEcounter = NZEcounter + 1;
                }
                for (int j = 0; j < NHyd; j++) {
                    Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
                    Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 3 + (NGen) * 3) + NH * NHyd * i + j * NH + t;
                    Mat_Elements[NZEcounter + 1] = 1.0;
                    NZEcounter = NZEcounter + 1;
                }
                for (int j = 0; j < NS; j++) {
                    Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
                    Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 3 + (NGen) * 3 + NHyd * 3 + NS * i) + j * NH + t;
                    Mat_Elements[NZEcounter + 1] = 1.0;
                    NZEcounter = NZEcounter + 1;
                }
                ROWcounter = ROWcounter + 1;
            }
        }
        std::cout << "HRes NZEcounter: " << NZEcounter << std::endl;
        std::cout << "ROWcounter: " << ROWcounter << std::endl;

        //const int * Row_Ind, *Col_Ind;
        //const double *Mat_Ele;
        //Row_Ind = &Row_Indexes[0];
        //Col_Ind = &Col_Indexes[0];
        //Mat_Ele = &Mat_Elements[0];
        qDebug() << "Number of Non Zero: " << NZEcounter;
        glp_load_matrix(PROBLEM_VECTOR[y], NZEcounter, Row_Indexes, Col_Indexes, Mat_Elements);

        glp_smcp param;
        glp_init_smcp(&param);
        param.msg_lev = GLP_MSG_ALL;
        param.meth = GLP_DUAL;
        param.pricing = GLP_PT_PSE;
        param.r_test = GLP_RT_HAR;
        param.tol_bnd = 1e-7;
        param.tol_dj = 1e-7;
        param.tol_piv = 1e-10;
        param.out_frq = 500;
        param.out_dly = 0;
        param.presolve = GLP_OFF;
        param.excl = GLP_ON;
        param.shift = GLP_ON;
        param.aorn = GLP_USE_AT;

        ret = glp_simplex(PROBLEM_VECTOR[y], &param);
        qDebug() << "year " << y << " simplex status:" << ret;

        int solution_status = glp_get_status(PROBLEM_VECTOR[y]);
        qDebug() << "solution status:" << solution_status;

        double temp_objective_value = glp_get_obj_val(PROBLEM_VECTOR[y]);
        if (!(temp_objective_value != temp_objective_value)) //temp_objective_value is not NaN 
            results.objective_value = temp_objective_value;

        std::vector<double> variables;
        //Obtaining optimal values of variables
        for (int i = 0; i < NR_VARIABLES; ++i) {
            variables.push_back(glp_get_col_prim(PROBLEM_VECTOR[y], i + 1));
        }
        double capprice = glp_get_row_dual(PROBLEM_VECTOR[y], 1);
        std::cout << "Variables size: " << variables.size() << std::endl;
        int extract_counter = 0;
        std::vector<double> thermcap;
        for (int i = 0; i < NGen; i++) //Thermal plants capacity
        {
            thermcap.push_back(variables[extract_counter]);
            std::cout << "Ppeak " << i << ": " << variables[extract_counter] << std::endl;
            extract_counter = extract_counter + 1;
        }
        results.P_peak.push_back(thermcap);

        for (int i = 0; i < NEE; i++) //Energy efficiency capacity
        {
            results.P_ee.push_back(variables[i + extract_counter]);
        }
        extract_counter = extract_counter + NEE;
        for (int i = 0; i < ND; i++) //Demand response capacity
        {
            results.P_DR.push_back(variables[i + extract_counter]);
        }
        extract_counter = extract_counter + ND;
        std::vector<double> rencapsol;
        for (int i = 0; i < NR; i++) //Renewable capacity
        {
            rencapsol.push_back(variables[i + extract_counter]);
        }
        results.P_R.push_back(rencapsol);
        extract_counter = extract_counter + NR;
        std::vector<double> hydcapsol;
        for (int i = 0; i < NHyd; i++) //Hydro capacity
        {
            hydcapsol.push_back(variables[i + extract_counter]);
        }
        results.P_H.push_back(hydcapsol);
        extract_counter = extract_counter + NHyd;
        std::vector<double> stocapsol;
        for (int i = 0; i < NS; i++) //Storage capacity
        {
            stocapsol.push_back(variables[i + extract_counter]);
        }
        results.P_S.push_back(stocapsol);
        for (int i = 0; i < NS; i++) {
            qDebug() << "Psto " << i << ": " << results.P_S[y][i];
            qDebug() << "Psto " << i << ": " << results.P_S[y].size();
        }
        extract_counter = extract_counter + NS;
        std::vector<double> enercapsol;
        for (int i = 0; i < NS; i++) //Storage energy capacity
        {
            enercapsol.push_back(variables[i + extract_counter]);
        }
        results.E_S.push_back(enercapsol);
        extract_counter = extract_counter + NS;
        //        results.G_peak.reserve(NGen * NH);
        //        for (int i = 0; i < NGen * NH; i++) //Peaking plants generation
        //        {
        //            results.G_peak[i] = variables[i + extract_counter];
        //        }
        //        extract_counter = extract_counter + NGen * NH;
        //        results.DR_up.reserve(ND * NH);
        //        results.DR_dn.reserve(ND * NH);
        //        for (int i = 0; i < ND * NH; i++) //Demand response up-shifts
        //        {
        //            results.DR_up[i] = variables[i + extract_counter];
        //        }
        //        extract_counter = extract_counter + ND * NH;
        //        for (int i = 0; i < ND * NH; i++) //Demand response down-shifts
        //        {
        //            results.DR_dn[i] = variables[i + extract_counter];
        //        }
        //        extract_counter = extract_counter + ND * NH;
        //        results.G_ren.reserve(NR * NH);
        //        for (int i = 0; i < NR * NH; i++) //Renewables generation
        //        {
        //            results.G_ren[i] = variables[i + extract_counter];
        //        }
        //        extract_counter = extract_counter + NR * NH;
        //        for (int i = 0; i < NHyd * NH; i++) //Storage charging
        //        {
        //            results.G_H.push_back(variables[i + extract_counter]);
        //        }
        //        extract_counter += NH*NHyd;
        //        results.G_CS.reserve(NS * NH);
        //        results.G_DS.reserve(NS * NH);
        //        results.E_ST.reserve(NS * NH);
        //        for (int i = 0; i < NS * NH; i++) //Storage charging
        //        {
        //            results.G_CS[i] = variables[i + extract_counter];
        //        }
        //        extract_counter = extract_counter + NS * NH;
        //        for (int i = 0; i < NS * NH; i++) //Storage discharging
        //        {
        //            results.G_DS[i] = variables[i + extract_counter];
        //        }
        //        extract_counter = extract_counter + NS * NH;
        //        for (int i = 0; i < NS * NH; i++) //Stored energy
        //        {
        //            results.E_ST[i] = variables[i + extract_counter];
        //        }
        //        extract_counter = extract_counter + NS * NH;
        //        results.RP_peak.reserve(NGen * NH);
        //        results.RP_hyd.reserve(NHyd * NH);
        //        results.RP_sto.reserve(NS * NH);
        //        for (int i = 0; i < NGen * NH; i++) //Peaking plants primary reserve
        //        {
        //            results.RP_peak[i] = variables[i + extract_counter];
        //        }
        //        extract_counter = extract_counter + NGen * NH;
        //        results.RS_hyd.reserve(NHyd * NH);
        //        results.RS_peak.reserve(NGen * NH);
        //        results.RS_sto.reserve(NS * NH);
        //        for (int i = 0; i < NGen * NH; i++) //Peaking plants secondary reserve
        //        {
        //            results.RS_peak[i] = variables[i + extract_counter];
        //        }
        //        extract_counter = extract_counter + NGen * NH;
        //        results.RT_hyd.reserve(NHyd * NH);
        //        results.RT_peak.reserve(NGen * NH);
        //        results.RT_sto.reserve(NS * NH);
        //        for (int i = 0; i < NGen * NH; i++) //Peaking plants tertiary reserve
        //        {
        //            results.RT_peak[i] = variables[i + extract_counter];
        //        }
        //        extract_counter = extract_counter + NGen * NH;
        //        for (int i = 0; i < NHyd * NH; i++) //Hydro plants primary reserve
        //        {
        //            results.RP_hyd[i] = variables[i + extract_counter];
        //        }
        //        extract_counter = extract_counter + NHyd * NH;
        //        for (int i = 0; i < NHyd * NH; i++) //Hydro plants secondary reserve
        //        {
        //            results.RS_hyd[i] = variables[i + extract_counter];
        //        }
        //        extract_counter = extract_counter + NHyd * NH;
        //        for (int i = 0; i < NHyd * NH; i++) //Hydro plants tertiary reserve
        //        {
        //            results.RT_hyd[i] = variables[i + extract_counter];
        //        }
        //        extract_counter = extract_counter + NS * NH;
        //        for (int i = 0; i < NS * NH; i++) //Storage plants primary reserve
        //        {
        //            results.RP_sto[i] = variables[i + extract_counter];
        //        }
        //        extract_counter = extract_counter + NS * NH;
        //        for (int i = 0; i < NS * NH; i++) //Storage plants secondary reserve
        //        {
        //            results.RS_sto[i] = variables[i + extract_counter];
        //        }
        //        extract_counter = extract_counter + NS * NH;
        //        for (int i = 0; i < NS * NH; i++) //Storage plants tertiary reserve
        //        {
        //            results.RT_sto[i] = variables[i + extract_counter];
        //        }
        //        extract_counter = extract_counter + NS * NH;

        //Obtaining dual variables
        results.CapacityPrice.push_back(capprice);
        results.max_ES_cap.push_back(glp_get_row_dual(PROBLEM_VECTOR[y], 1 + PROBLEM_SIZE - NH * 3 - 1));
        //        results.energyPrice.reserve(NH);
        //        results.RP_price.reserve(NH);
        //        results.RS_price.reserve(NH);
        //        results.RT_price.reserve(NH);
        //        for (int i = 0; i < NH; ++i) {
        //            results.energyPrice[i] = glp_get_row_dual(PROBLEM_VECTOR[y], i + 2);
        //            results.RP_price[i] = glp_get_row_dual(PROBLEM_VECTOR[y], 1 + PROBLEM_SIZE - NH * 3 + i);
        //            results.RS_price[i] = glp_get_row_dual(PROBLEM_VECTOR[y], 1 + PROBLEM_SIZE - NH * 2 + i);
        //            results.RT_price[i] = glp_get_row_dual(PROBLEM_VECTOR[y], 1 + PROBLEM_SIZE - NH * 1 + i);
        //        }
        //        for (int t = 0; t < NH; t++) {
        //            qDebug() << results.E_ST[y][t] << "," << results.E_ST[y][NH + t] << "," << results.E_ST[y][NH * 2 + t] << "," << results.E_ST[y][NH * 3 + t];
        //        }
        glp_delete_prob(PROBLEM_VECTOR[y]);
    }
    glpk->unLocking();
    //    //Problem formulation
    //    int nr_variables = NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + 2 * ND + NR + NHyd + NS * 3 + (NGen) * 3 + NHyd * 3 + NS * 3) + NH;
    //    int NR_VARIABLES = NY * nr_variables;
    //    emit _tryLockingGlpk(identifier);
    //    while (!*tryGlpkLocking) {
    //        QCoreApplication::processEvents();
    //    }
    //    resetGlpkLocking();
    //    glp_prob* lp = glp_create_prob();
    //    glp_set_prob_name(lp, "AlternativeAnalysisMultiYear");
    //    glp_set_obj_dir(lp, GLP_MIN);
    //    glp_add_cols(lp, NR_VARIABLES);
    //
    //    //Cost Vector definition
    //    std::vector<double> CostCoefficients;
    //    for (int y = 0; y < NY; y++) {
    //        for (int i = 0; i < NGen; i++) {
    //            CostCoefficients.push_back(input_data.Ai[y][i]*1000);
    //        }
    //        for (int i = 0; i < NEE; i++) {
    //            CostCoefficients.push_back(input_data.Aee[y]*1000);
    //        }
    //        for (int i = 0; i < ND; i++) {
    //            CostCoefficients.push_back(input_data.Ad[y]*1000);
    //        }
    //        for (int i = 0; i < NR; i++) {
    //            CostCoefficients.push_back(input_data.Ar[y * NY + i]*1000);
    //        }
    //        for (int i = 0; i < NHyd; i++) {
    //            CostCoefficients.push_back(input_data.Ah[y]*1000);
    //        }
    //        for (int i = 0; i < NS; i++) {
    //            CostCoefficients.push_back(As[y][i]*1000);
    //        }
    //        for (int i = 0; i < NS; i++) {
    //            CostCoefficients.push_back(0.0); //No energy capacity costs
    //        }
    //        for (int i = 0; i < NH * NGen; i++) {
    //            CostCoefficients.push_back(VCF[y][i]);
    //        }
    //        for (int i = 0; i < NH * ND; i++) {
    //            CostCoefficients.push_back(VCDF[y][i]);
    //        }
    //        for (int i = 0; i < NH * ND; i++) {
    //            CostCoefficients.push_back(VCDF[y][i]);
    //        }
    //        for (int i = 0; i < NH * NR; i++) {
    //            CostCoefficients.push_back(VCRF[y][i]);
    //        }
    //        for (int i = 0; i < NH * NHyd; i++) {
    //            CostCoefficients.push_back(VCHF[y][i]);
    //        }
    //        for (int i = 0; i < NH * NS; i++) {
    //            CostCoefficients.push_back(VCSF[y][i]);
    //        }
    //        for (int i = 0; i < NH * NS; i++) {
    //            CostCoefficients.push_back(VCSF[y][i]);
    //        }
    //        for (int i = 0; i < NH * NS; i++) {
    //            CostCoefficients.push_back(VCSEF[y][i]);
    //        }
    //        for (int i = 0; i < NH * NGen; i++) {
    //            CostCoefficients.push_back(PRCost[y][i]);
    //        }
    //        for (int i = 0; i < NH * NGen; i++) {
    //            CostCoefficients.push_back(SRCost[y][i]);
    //        }
    //        for (int i = 0; i < NH * NGen; i++) {
    //            CostCoefficients.push_back(TRCost[y][i]);
    //        }
    //        for (int i = 0; i < NH * NHyd; i++) {
    //            CostCoefficients.push_back(PRCostHyd[y][i]);
    //        }
    //        for (int i = 0; i < NH * NHyd; i++) {
    //            CostCoefficients.push_back(SRCostHyd[y][i]);
    //        }
    //        for (int i = 0; i < NH * NHyd; i++) {
    //            CostCoefficients.push_back(TRCostHyd[y][i]);
    //        }
    //        for (int i = 0; i < NH * NS; i++) {
    //            CostCoefficients.push_back(PRCosts[y][i]);
    //        }
    //        for (int i = 0; i < NH * NS; i++) {
    //            CostCoefficients.push_back(SRCosts[y][i]);
    //        }
    //        for (int i = 0; i < NH * NS; i++) {
    //            CostCoefficients.push_back(TRCosts[y][i]);
    //        }
    //        for (int i = 0; i < NH; i++) {
    //            CostCoefficients.push_back(lostload1);
    //        }
    //    }
    //    std::cout << "CCsize: " << CostCoefficients.size() << std::endl;
    //
    //    //Structural variables (Columns).
    //    /*	
    //    Peaking Capacity			NGen
    //    Energy Efficiency Investments       NEE
    //    Demand Response Capacity		ND
    //    Renewables Capacity			NR
    //    Hydro Capacity				NHyd
    //    Storage Power Capacity			NS
    //    Storage Energy Capacity			NS
    //    Peaking Generation			NH * NGen
    //    Demand Response Up Shifts		NH * ND
    //    Demand Response Down Shifts		NH * ND
    //    Renewable Generation			NH * NR
    //    Hydro generation			NH * NHyd
    //    Storage Charging			NH * NS
    //    Storage Discharging			NH * NS
    //    Stored energy				NH * NS
    //    Primary reserve thermal                 NH * NGen
    //    Secondary reserve thermal		NH * NGen
    //    Tertiary reserve thermal		NH * NGen
    //    Primary reserve hydro			NH * NHyd
    //    Secondary reserve hydro			NH * NHyd
    //    Tertiary reserve hydro			NH * NHyd
    //    Primary reserve storage			NH * NS
    //    Secondary reserve storage		NH * NS
    //    Tertiary reserve storage		NH * NS
    //    Lost Load                               NH
    //    NGen+NEE+ND+NR+NHyd+NS*2+NH*(NGen+2*ND+NR+NHyd+NS*3+(NGen)*3+NHyd*3+NS*3)+NH
    //     */
    //
    //    qDebug() << "NR of variables: " << NR_VARIABLES;
    //    int counter = 0;
    //    for (int y = 0; y < NY; y++) {
    //        for (int i = 0; i < NGen; ++i) {
    //            glp_set_col_bnds(lp, i + 1 + counter, GLP_LO, input_data.Pl[y][i], 0.0);
    //            glp_set_obj_coef(lp, i + 1 + counter, CostCoefficients[i + counter]);
    //            qDebug() << "LO Column:" << i + counter << ", lb: " << input_data.Pl[y][i] << " ub: " << 0 << " cc: " << CostCoefficients[i + counter];
    //        }
    //        counter += NGen;
    //        for (int i = 0; i < NEE; i++) {
    //            glp_set_col_bnds(lp, i + 1 + counter, GLP_DB, input_data.PexEE[y], input_data.PeeM[y]);
    //            glp_set_obj_coef(lp, i + 1 + counter, CostCoefficients[i + counter]);
    //            qDebug() << "DB Column:" << i + counter << ", lb: " << input_data.PexEE[y] << " ub: " << input_data.PeeM[i] << " cc: " << CostCoefficients[i + counter];
    //        }
    //        counter += NEE;
    //        for (int i = 0; i < ND; i++) {
    //            glp_set_col_bnds(lp, i + 1 + counter, GLP_LO, input_data.PexD[y], 0.0);
    //            glp_set_obj_coef(lp, i + 1 + counter, CostCoefficients[i + counter]);
    //            qDebug() << "LO Column:" << i + counter << ", lb: " << input_data.PexD[y] << " ub: " << 0 << " cc: " << CostCoefficients[i + counter];
    //        }
    //        counter += ND;
    //        for (int i = 0; i < NR; i++) {
    //            glp_set_col_bnds(lp, i + 1 + counter, GLP_LO, input_data.PexR[y][i], 0.0);
    //            glp_set_obj_coef(lp, i + 1 + counter, CostCoefficients[i + counter]);
    //            qDebug() << "LO Column:" << i + counter << ", lb: " << input_data.PexR[y][i] << " ub: " << 0 << " cc: " << CostCoefficients[i + counter];
    //        }
    //        counter += NR;
    //        for (int i = 0; i < NHyd; i++) {
    //            glp_set_col_bnds(lp, i + 1 + counter, GLP_LO, input_data.Ph[i], 0.0);
    //            glp_set_obj_coef(lp, i + 1 + counter, CostCoefficients[i + counter]);
    //            qDebug() << "LO Column:" << i + counter << ", lb: " << input_data.Ph[i] << " ub: " << 0 << " cc: " << CostCoefficients[i + counter];
    //        }
    //        counter += NHyd;
    //        /*if (NS <= 2) {
    //            for (int i = 0; i < NS; i++) {
    //                glp_set_col_bnds(lp, i + 1 + counter, GLP_FX, Fix_Cap[i], Fix_Cap[i]);
    //                glp_set_obj_coef(lp, i + 1 + counter, CostCoefficients[i + counter]);
    //            }
    //            counter += NS;
    //        } else {
    //            for (int i = 0; i < 2; i++) {
    //                glp_set_col_bnds(lp, i + 1 + counter, GLP_FX, Fix_Cap[i], Fix_Cap[i]);
    //                glp_set_obj_coef(lp, i + 1 + counter, CostCoefficients[i + counter]);
    //            }
    //            for (int i = 2; i < NS; i++) {
    //                glp_set_col_bnds(lp, i + 1 + counter, GLP_LO, input_data.PexS[i], 0.0);
    //                glp_set_obj_coef(lp, i + 1 + counter, CostCoefficients[i + counter]);
    //            }
    //            counter += NS;
    //        }*/
    //        for (int i = 0; i < NS; i++) {
    //            glp_set_col_bnds(lp, i + 1 + counter, GLP_LO, input_data.PexS[y][i], 0.0);
    //            glp_set_obj_coef(lp, i + 1 + counter, CostCoefficients[i + counter]);
    //            qDebug() << "LO Column:" << i + counter << ", lb: " << input_data.PexS[y][i] << " ub: " << 0 << " cc: " << CostCoefficients[i + counter];
    //        }
    //        counter += NS;
    //        for (int i = 0; i < NS + NGen * NH; i++) {
    //            glp_set_col_bnds(lp, i + 1 + counter, GLP_LO, 0.0, 0.0);
    //            glp_set_obj_coef(lp, i + 1 + counter, CostCoefficients[i + counter]);
    //        }
    //        counter += NS + NGen * NH;
    //        for (int i = 0; i < ND * 2 * NH + NR * NH + NHyd * NH + NS * NH * 3 + (NGen) * 3 * NH + NS * NH * 3 + NHyd * NH * 3 + NH; i++) {
    //            glp_set_col_bnds(lp, i + 1 + counter, GLP_LO, 0.0, 0.0);
    //            glp_set_obj_coef(lp, i + 1 + counter, CostCoefficients[i + counter]);
    //        }
    //        counter += ND * 2 * NH + NR * NH + NHyd * NH + NS * NH * 3 + (NGen) * 3 * NH + NS * NH * 3 + NHyd * NH * 3 + NH;
    //    }
    //    qDebug() << "Variable counter: " << counter;
    //
    //    //Rows definitions
    //    /*	
    //    Sufficiency				1			(>=)
    //    Hourly Balance			NH			(=)
    //    Final Energy Storage		NS			(=)
    //    DR Neutrality			ND			(=)
    //    Storage Inventory			NH * NS			(=)
    //    Storage fixed sizes			NS			(=)
    //    Thermal Capacity			NH * NGen		(<=)
    //    Storage Charge/Discharge Capacity	2 * NH * NS		(<=)
    //    Storage Energy Capacity		NH * NS			(<=)
    //    Demand Response Up/Down Capacity	2 * NH * ND		(<=)
    //    Renewable Capacity			NH * NR			(<=)
    //    Hydro capacity			NH * NHyd		(<=)
    //    Hydro energy			12			(<=)
    //    Sufficient energy for reserves	NH * NS			(<=)
    //    Maximum storage capacity		1			(<=)
    //    Hourly reserve provision		NH * 3			(>=)
    //    14+NH*4+NS*2+ND+NH*NS*5+NH*NGen+2*NH*ND+NH*NR+NH*NHyd
    //     */
    //
    //    int problem_size = 14 + NH * 4 + NS * 2 + ND + NH * NS * 5 + NH * NGen + 2 * NH * ND + NH * NR + NH*NHyd;
    //    int PROBLEM_SIZE = NY * problem_size;
    //    qDebug() << "Problem size is: " << PROBLEM_SIZE;
    //    glp_add_rows(lp, PROBLEM_SIZE);
    //
    //    std::vector<double> Lower_Bounds;
    //    Lower_Bounds.reserve(PROBLEM_SIZE);
    //    std::vector<double> Upper_Bounds;
    //    Upper_Bounds.reserve(PROBLEM_SIZE);
    //    int rowv_counter = 0;
    //    for (int y = 0; y < NY; y++) {
    //        //Sufficiency
    //        Lower_Bounds[rowv_counter] = max_demand[y] * (1 + input_data.SafetyFactor);
    //        Upper_Bounds[rowv_counter] = 0.0;
    //        rowv_counter += 1;
    //        //Hourly balance
    //        for (int i = 0; i < NH; i++) {
    //            Lower_Bounds[i + rowv_counter] = demand[y * NH + i];
    //            Upper_Bounds[i + rowv_counter] = demand[y * NH + i];
    //            qDebug() << "Demand " << i << ":" << demand[y * NH + i];
    //        }
    //        rowv_counter += NH;
    //        //Final ESS, DR Neutrality, ESS Fixed sizes, ESS Inv, ESS Cap, Therm cap, DR Cap, Ren Cap, Hydro Cap
    //        for (int i = 0; i < NS * 2 + ND + NH * (NS * 4 + NGen + ND * 2 + NR + NHyd); i++) {
    //            Lower_Bounds[i + rowv_counter] = 0.0;
    //            Upper_Bounds[i + rowv_counter] = 0.0;
    //        }
    //        rowv_counter += NS * 2 + ND + NH * (NS * 4 + NGen + ND * 2 + NR + NHyd);
    //        //Hydro monthly energy
    //        for (int i = 0; i < 12; i++) {
    //            Lower_Bounds[i + rowv_counter] = 0.0;
    //            Upper_Bounds[i + rowv_counter] = input_data.ResourceH[y * 12 + i];
    //            qDebug() << "Resource hydro" << i << ":" << input_data.ResourceH[y * 12 + i];
    //        }
    //        rowv_counter += 12;
    //        //ESS sufficient energy
    //        for (int i = 0; i < NH * NS; i++) {
    //            Lower_Bounds[i + rowv_counter] = 0.0;
    //            Upper_Bounds[i + rowv_counter] = 0.0;
    //        }
    //        rowv_counter += NS * NH;
    //        //ESS max capacity
    //        Lower_Bounds[rowv_counter] = 0.0;
    //        Upper_Bounds[rowv_counter] = 0.1 * max_demand[y] * (1 + input_data.SafetyFactor);
    //        qDebug() << "Maximum demand: " << max_demand;
    //        rowv_counter += 1;
    //        //Reserve provision
    //        for (int i = 0; i < 3; i++) {
    //            for (int j = 0; j < NH; j++) {
    //                Lower_Bounds[rowv_counter + i * NH + j] = input_data.ReserveRequirements[i * NY + y];
    //                Upper_Bounds[rowv_counter + i * NH + j] = 0.0;
    //            }
    //        }
    //        rowv_counter += NH * 3;
    //    }
    //    qDebug() << "Nr of bounds is: " << rowv_counter;
    //    int rowb_counter = 0;
    //    for (int y = 0; y < NY; y++) {
    //        glp_set_row_bnds(lp, rowb_counter + 1, GLP_LO, Lower_Bounds[rowb_counter], Upper_Bounds[rowb_counter]);
    //        qDebug() << "LO Restriction: " << 1 << " lb: " << Lower_Bounds[rowb_counter] << " ub: " << Upper_Bounds[rowb_counter];
    //        rowb_counter += 1;
    //        for (int i = 0; i < NH + NS + ND + NH * NS + NS; i++) {
    //            glp_set_row_bnds(lp, rowb_counter + 1 + i, GLP_FX, Lower_Bounds[i + rowb_counter], Upper_Bounds[i + rowb_counter]);
    //            qDebug() << "FX Restriction: " << i + rowb_counter + 1 << " lb: " << Lower_Bounds[i + rowb_counter] << " ub: " << Upper_Bounds[i + rowb_counter];
    //        }
    //        rowb_counter += NH + NS + ND + NH * NS + NS;
    //        for (int i = 0; i < 13 + NH * (NGen + NS * 4 + ND * 2 + NR + NHyd); i++) {
    //            glp_set_row_bnds(lp, rowb_counter + 1 + i, GLP_UP, Lower_Bounds[i + rowb_counter], Upper_Bounds[i + rowb_counter]);
    //            qDebug() << "UP Restriction: " << i + rowb_counter + 1 << " lb: " << Lower_Bounds[i + rowb_counter] << " ub: " << Upper_Bounds[i + rowb_counter];
    //        }
    //        rowb_counter += 13 + NH * (NGen + NS * 4 + ND * 2 + NR + NHyd);
    //        for (int i = 0; i < NH * 3; i++) {
    //            glp_set_row_bnds(lp, rowb_counter + 1 + i, GLP_LO, Lower_Bounds[i + rowb_counter], Upper_Bounds[i + rowb_counter]);
    //            qDebug() << "LO Restriction: " << i + rowb_counter + 1 << " lb: " << Lower_Bounds[i + rowb_counter] << " ub: " << Upper_Bounds[i + rowb_counter];
    //        }
    //        rowb_counter += NH * 3;
    //    }
    //    qDebug() << "Nr of GL bounds: " << rowb_counter;
    //
    //    //Matrix definition. Same order as rows and columns.
    //    //Rows
    //    /*					Non Zero Elements
    //    Sufficiency				NGen+NR+NS+NHyd				(>=)
    //    Hourly Balance				NH * (NGen+NR+NS*2+ND*2+NEE+NHyd)	(=)
    //    Final Energy Storage			NS * 2					(=)
    //    DR Neutrality				ND * (NH*2)				(=)
    //    Storage Inventory			NS * NH * 4				(=)
    //    Storage fixed sizes			NS * 2					(=)
    //    Peaking Capacity			NH * NGen * 5				(<=)
    //    Storage Charge/Discharge Capacity	NH * NS * 8				(<=)
    //    Storage Energy Capacity			NH * NS * 2				(<=)
    //    Demand Response Up/Down Capacity	NH * ND * 2 * 2				(<=)
    //    Renewable Capacity			NH * NR * 2				(<=)
    //    Hydro capacity				NH * NHyd * 5				(<=)
    //    Hydro energy				12 * NHyd * 2				(<=)
    //    Sufficient energy for reserves		NH * NS * 5				(<=)
    //    Maximum storage capacity		NS					(<=)
    //    Hourly reserve provision		NH * 3	* (NGen+NS+NHyd)		(>=)
    //     */
    //
    //    const int nonzeroelements = NGen + NR + NS + NHyd + NH * (NGen + NR + NS * 2 + ND * 2 + NEE + NHyd) + NS * 5 + ND * NH * 2 + NS * NH * 19 + NH * NGen * 5 + NH * ND * 4 + NH * NR * 2 + NH * NHyd * 5 + 12 * NHyd * 2 + 3 * (NH * (NGen + NS + NHyd)); //Number of NZE of matrix
    //    const int NonZeroElements = NY*nonzeroelements;
    //    qDebug() << "NZE: " << NonZeroElements;
    //    int Row_Indexes[NonZeroElements + 1], Col_Indexes[NonZeroElements + 1];
    //    //std::array<int,NonZeroElements> Row_Indexes, Col_Indexes;
    //    double Mat_Elements[NonZeroElements + 1];
    //    //std::array<double,NonZeroElements> Mat_Elements;
    //    int NZEcounter = 0;
    //    int ROWcounter = 0;
    //    //std::cout << "NGen: " <<NGen << ", NHyd: " << NHyd << ", NEE: " << NEE << std::endl;
    //    //std::cout << "ND: " << ND << ", NR: " << NR << ", NS: " << NS << ", NGenE: " << NGenE << std::endl;
    //    Row_Indexes[0] = 0;
    //    Col_Indexes[0] = 0;
    //    Mat_Elements[0] = 0;
    //    int COLcounter=0;
    //    for (int y = 0; y < NY; y++) {
    //        //System adequacy
    //        for (int i = 0; i < NGen; i++) {
    //            Row_Indexes[i + 1 + NZEcounter] = ROWcounter + 1;
    //            Col_Indexes[i + 1 + NZEcounter] = COLcounter + i + 1;
    //            Mat_Elements[i + 1 + NZEcounter] = 1.0;
    //        }
    //        NZEcounter += NGen;
    //        for (int i = 0; i < NR; i++) {
    //            Row_Indexes[i + 1 + NZEcounter] = ROWcounter + 1;
    //            Col_Indexes[i + 1 + NZEcounter] = COLcounter + i + 1 + NGen + NEE + ND;
    //            Mat_Elements[i + 1 + NZEcounter] = input_data.FPr[i];
    //        }
    //        NZEcounter += NR;
    //        for (int i = 0; i < NS; i++) {
    //            Row_Indexes[i + 1 + NZEcounter] = ROWcounter + 1;
    //            Col_Indexes[i + 1 + NZEcounter] = COLcounter + i + 1 + NGen + NEE + ND + NR + NHyd;
    //            Mat_Elements[i + 1 + NZEcounter] = input_data.FPs[i];
    //        }
    //        NZEcounter += NS;
    //        for (int i = 0; i < NHyd; i++) {
    //            Row_Indexes[i + 1 + NZEcounter] = ROWcounter + 1;
    //            Col_Indexes[i + 1 + NZEcounter] = COLcounter + i + 1 + NGen + NEE + ND + NR;
    //            Mat_Elements[i + 1 + NZEcounter] = input_data.FPh[i];
    //        }
    //        NZEcounter += NHyd;
    //        ROWcounter += 1;
    //        std::cout << "NZEcounter: " << NZEcounter << std::endl;
    //        std::cout << "ROWcounter: " << ROWcounter << std::endl;
    //
    //        //Hourly Balance
    //        for (int i = 0; i < NH; i++) {
    //            for (int j = 0; j < NEE; j++) {
    //                Row_Indexes[j + 1 + NZEcounter] = ROWcounter + 1;
    //                Col_Indexes[j + 1 + NZEcounter] = COLcounter + NGen + 1 + j;
    //                Mat_Elements[j + 1 + NZEcounter] = demand[i] * (input_data.Fee[j] / input_data.PeeM[j]);
    //            }
    //            NZEcounter += NEE;
    //            for (int j = 0; j < NGen; j++) {
    //                Row_Indexes[j + 1 + NZEcounter] = ROWcounter + 1;
    //                Col_Indexes[j + 1 + NZEcounter] = COLcounter + NGen + NEE + ND + NR + NHyd + NS * 2 + 1 + j * NH + i;
    //                Mat_Elements[j + 1 + NZEcounter] = 1.0;
    //            }
    //            NZEcounter += NGen;
    //            for (int j = 0; j < ND; j++) {
    //                Row_Indexes[j + 1 + NZEcounter] = ROWcounter + 1;
    //                Col_Indexes[j + 1 + NZEcounter] = COLcounter + NGen + NEE + ND + NR + NHyd + NS * 2 + NGen * NH + 1 + j * NH + i;
    //                Mat_Elements[j + 1 + NZEcounter] = -1.0;
    //            }
    //            NZEcounter += ND;
    //            for (int j = 0; j < ND; j++) {
    //                Row_Indexes[j + 1 + NZEcounter] = ROWcounter + 1;
    //                Col_Indexes[j + 1 + NZEcounter] = COLcounter + NGen + NEE + ND + NR + NHyd + NS * 2 + NGen * NH + ND * NH + 1 + j * NH + i;
    //                Mat_Elements[j + 1 + NZEcounter] = 1.0;
    //            }
    //            NZEcounter += ND;
    //            for (int j = 0; j < NR; j++) {
    //                Row_Indexes[j + 1 + NZEcounter] = ROWcounter + 1;
    //                Col_Indexes[j + 1 + NZEcounter] = COLcounter + NGen + NEE + ND + NR + NHyd + NS * 2 + NGen * NH + ND * NH * 2 + 1 + j * NH + i;
    //                Mat_Elements[j + 1 + NZEcounter] = 1.0;
    //            }
    //            NZEcounter += NR;
    //            for (int j = 0; j < NHyd; j++) {
    //                Row_Indexes[j + 1 + NZEcounter] = ROWcounter + 1;
    //                Col_Indexes[j + 1 + NZEcounter] = COLcounter + NGen + NEE + ND + NR + NHyd + NS * 2 + NGen * NH + ND * NH * 2 + NR * NH + 1 + j * NH + i;
    //                Mat_Elements[j + 1 + NZEcounter] = -1.0;
    //            }
    //            NZEcounter += NHyd;
    //            for (int j = 0; j < NS; j++) {
    //                Row_Indexes[j + 1 + NZEcounter] = ROWcounter + 1;
    //                Col_Indexes[j + 1 + NZEcounter] = COLcounter + NGen + NEE + ND + NR + NHyd + NS * 2 + NGen * NH + ND * NH * 2 + NR * NH + NHyd * NH + 1 + j * NH + i;
    //                Mat_Elements[j + 1 + NZEcounter] = -1.0;
    //            }
    //            NZEcounter += NS;
    //            for (int j = 0; j < NS; j++) {
    //                Row_Indexes[j + 1 + NZEcounter] = ROWcounter + 1;
    //                Col_Indexes[j + 1 + NZEcounter] = COLcounter + NGen + NEE + ND + NR + NHyd + NS * 2 + NGen * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH + 1 + j * NH + i;
    //                Mat_Elements[j + 1 + NZEcounter] = 1.0;
    //            }
    //            NZEcounter += NS;
    //            ROWcounter += 1;
    //        }
    //        std::cout << "NZEcounter: " << NZEcounter << std::endl;
    //        std::cout << "ROWcounter: " << ROWcounter << std::endl;
    //        //Final Energy Storage
    //        for (int i = 0; i < NS; i++) {
    //            Row_Indexes[NZEcounter + 1] = ROWcounter + 1 + i;
    //            Row_Indexes[NZEcounter + 2] = ROWcounter + 1 + i;
    //            Col_Indexes[NZEcounter + 1] = COLcounter + NGen + NEE + ND + NR + NHyd + NS + i + 1;
    //            Col_Indexes[NZEcounter + 2] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 2) + NH * (i + 1) - 1;
    //            Mat_Elements[NZEcounter + 1] = 0.5;
    //            Mat_Elements[NZEcounter + 2] = -1.0;
    //            NZEcounter = NZEcounter + 2;
    //        }
    //        ROWcounter = ROWcounter + NS;
    //        std::cout << "FES NZEcounter: " << NZEcounter << std::endl;
    //        std::cout << "ROWcounter: " << ROWcounter << std::endl;
    //
    //        //DR Neutrality
    //        for (int i = 0; i < ND; i++) {
    //            for (int j = 0; j < NH * 2; j++) {
    //                Row_Indexes[NZEcounter + 1 + j] = ROWcounter + 1 + i;
    //                if (j < NH) {
    //                    Col_Indexes[NZEcounter + 1 + j] = COLcounter + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + NH * i + j + 1;
    //                    Mat_Elements[NZEcounter + 1 + j] = 1.0;
    //                } else {
    //                    Mat_Elements[NZEcounter + 1 + j] = -1.0;
    //                    Col_Indexes[NZEcounter + 1 + j] = COLcounter + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + NH * i + j + NH * (ND - 1) + 1;
    //                }
    //            }
    //            NZEcounter = NZEcounter + 2 * NH;
    //        }
    //        ROWcounter = ROWcounter + ND;
    //        std::cout << "DRNeut NZEcounter: " << NZEcounter << std::endl;
    //        std::cout << "ROWcounter: " << ROWcounter << std::endl;
    //
    //        //Storage Inventory
    //        for (int i = 0; i < NS; i++) {
    //            for (int j = 0; j < NH; j++) {
    //                for (int k = 0; k < 4; k++) {
    //                    Row_Indexes[NZEcounter + 1 + k] = ROWcounter + 1;
    //                }
    //                if (j == 0) {
    //                    Col_Indexes[NZEcounter + 1] = COLcounter + NGen + NEE + ND + NR + NHyd + NS + i + 1;
    //                    Col_Indexes[NZEcounter + 2] = COLcounter + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NH * i + 1;
    //                    Col_Indexes[NZEcounter + 3] = COLcounter + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH + NH * i + 1;
    //                    Col_Indexes[NZEcounter + 4] = COLcounter + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH * 2 + NH * i + 1;
    //                    Mat_Elements[NZEcounter + 1] = -0.5;
    //                    Mat_Elements[NZEcounter + 2] = -input_data.ETACs[i];
    //                    Mat_Elements[NZEcounter + 3] = 1 / input_data.ETADs[i];
    //                    Mat_Elements[NZEcounter + 4] = 1.0;
    //                } else {
    //                    Col_Indexes[NZEcounter + 1] = COLcounter + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * 2 * NH + NR * NH + NHyd * NH + (i) * NH + j + 1;
    //                    Col_Indexes[NZEcounter + 2] = COLcounter + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * 2 * NH + NR * NH + NHyd * NH + (i) * NH + j + 1 + NS * NH;
    //                    Col_Indexes[NZEcounter + 3] = COLcounter + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * 2 * NH + NR * NH + NHyd * NH + (i) * NH + j + 1 + NS * NH * 2;
    //                    Col_Indexes[NZEcounter + 4] = COLcounter + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * 2 * NH + NR * NH + NHyd * NH + (i) * NH + j + 1 + NS * NH * 2 - 1;
    //                    Mat_Elements[NZEcounter + 1] = -input_data.ETACs[i];
    //                    Mat_Elements[NZEcounter + 2] = 1 / input_data.ETADs[i];
    //                    Mat_Elements[NZEcounter + 3] = 1.0;
    //                    Mat_Elements[NZEcounter + 4] = -1.0;
    //                }
    //                NZEcounter = NZEcounter + 4;
    //                ROWcounter = ROWcounter + 1;
    //            }
    //        }
    //        std::cout << "SI NZEcounter: " << NZEcounter << std::endl;
    //        std::cout << "ROWcounter: " << ROWcounter << std::endl;
    //
    //        //Storage fixed sizes
    //        for (int i = 0; i < NS; i++) {
    //            Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
    //            Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
    //            Col_Indexes[NZEcounter + 1] = COLcounter + NGen + NEE + ND + NR + NHyd + i + 1;
    //            Col_Indexes[NZEcounter + 2] = COLcounter + NGen + NEE + ND + NR + NHyd + NS + i + 1;
    //            Mat_Elements[NZEcounter + 1] = input_data.Duration[i];
    //            Mat_Elements[NZEcounter + 2] = -1.0;
    //            qDebug() << "Duration" << input_data.Duration[i];
    //            NZEcounter = NZEcounter + 2;
    //            ROWcounter = ROWcounter + 1;
    //        }
    //        std::cout << "SFS NZEcounter: " << NZEcounter << std::endl;
    //        std::cout << "ROWcounter: " << ROWcounter << std::endl;
    //
    //        //Thermal Capacity
    //        for (int i = 0; i < NGen; i++) {
    //            for (int j = 0; j < NH; j++) {
    //                Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 3] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 4] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 5] = ROWcounter + 1;
    //                Col_Indexes[NZEcounter + 1] = COLcounter + i + 1;
    //                Col_Indexes[NZEcounter + 2] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + i * NH + j;
    //                Col_Indexes[NZEcounter + 3] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 3) + i * NH + j;
    //                Col_Indexes[NZEcounter + 4] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 3) + NH * (NGen) + i * NH + j;
    //                Col_Indexes[NZEcounter + 5] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 3) + NH * (NGen) * 2 + i * NH + j;
    //                Mat_Elements[NZEcounter + 1] = -1.0;
    //                Mat_Elements[NZEcounter + 2] = 1.0;
    //                Mat_Elements[NZEcounter + 3] = 1.0;
    //                Mat_Elements[NZEcounter + 4] = 1.0;
    //                Mat_Elements[NZEcounter + 5] = 1.0;
    //                NZEcounter = NZEcounter + 5;
    //                ROWcounter = ROWcounter + 1;
    //            }
    //        }
    //        std::cout << "TCap NZEcounter: " << NZEcounter << std::endl;
    //        std::cout << "ROWcounter: " << ROWcounter << std::endl;
    //
    //        //Storage Charge / Discharge Capacity
    //        for (int i = 0; i < NS; i++) {
    //            for (int j = 0; j < NH; j++) {
    //                Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
    //                Col_Indexes[NZEcounter + 1] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + i;
    //                Col_Indexes[NZEcounter + 2] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + i * NH + j;
    //                Mat_Elements[NZEcounter + 1] = -1.0;
    //                Mat_Elements[NZEcounter + 2] = 1.0;
    //                NZEcounter = NZEcounter + 2;
    //                ROWcounter = ROWcounter + 1;
    //            }
    //        }
    //        for (int i = 0; i < NS; i++) {
    //            for (int j = 0; j < NH; j++) {
    //                Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 3] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 4] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 5] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 6] = ROWcounter + 1;
    //                Col_Indexes[NZEcounter + 1] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + i;
    //                Col_Indexes[NZEcounter + 2] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH + i * NH + j;
    //                Col_Indexes[NZEcounter + 3] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH * 3 + NH * (NGen) * 3 + NHyd * NH * 3 + i * NH + j;
    //                Col_Indexes[NZEcounter + 4] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH * 3 + NH * (NGen) * 3 + NHyd * NH * 3 + NS * NH + i * NH + j;
    //                Col_Indexes[NZEcounter + 5] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH * 3 + NH * (NGen) * 3 + NHyd * NH * 3 + NS * NH * 2 + i * NH + j;
    //                Col_Indexes[NZEcounter + 6] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + i * NH + j;
    //                Mat_Elements[NZEcounter + 1] = -1.0;
    //                Mat_Elements[NZEcounter + 2] = 1.0;
    //                Mat_Elements[NZEcounter + 3] = 1.0;
    //                Mat_Elements[NZEcounter + 4] = 1.0;
    //                Mat_Elements[NZEcounter + 5] = 1.0;
    //                Mat_Elements[NZEcounter + 6] = -1.0;
    //                NZEcounter = NZEcounter + 6;
    //                ROWcounter = ROWcounter + 1;
    //            }
    //        }
    //        std::cout << "SCap NZEcounter: " << NZEcounter << std::endl;
    //        std::cout << "ROWcounter: " << ROWcounter << std::endl;
    //
    //        //Storage Energy Capacity
    //        for (int i = 0; i < NS; i++) {
    //            for (int j = 0; j < NH; j++) {
    //                Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
    //                Col_Indexes[NZEcounter + 1] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS + i;
    //                Col_Indexes[NZEcounter + 2] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH * 2 + i * NH + j;
    //                Mat_Elements[NZEcounter + 1] = -1.0;
    //                Mat_Elements[NZEcounter + 2] = 1.0;
    //                NZEcounter = NZEcounter + 2;
    //                ROWcounter = ROWcounter + 1;
    //            }
    //        }
    //        std::cout << "SECap NZEcounter: " << NZEcounter << std::endl;
    //        std::cout << "ROWcounter: " << ROWcounter << std::endl;
    //
    //        //Demand Response Up / Down Capacity
    //        for (int i = 0; i < ND; i++) {
    //            for (int j = 0; j < NH; j++) {
    //                Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
    //                Col_Indexes[NZEcounter + 1] = COLcounter + 1 + NGen + NEE + i;
    //                Col_Indexes[NZEcounter + 2] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + i * NH + j;
    //                Mat_Elements[NZEcounter + 1] = -1.0;
    //                Mat_Elements[NZEcounter + 2] = 1.0;
    //                NZEcounter = NZEcounter + 2;
    //                ROWcounter = ROWcounter + 1;
    //            }
    //        }
    //        for (int i = 0; i < ND; i++) {
    //            for (int j = 0; j < NH; j++) {
    //                Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
    //                Col_Indexes[NZEcounter + 1] = COLcounter + 1 + NGen + NEE + i;
    //                Col_Indexes[NZEcounter + 2] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH + i * NH + j;
    //                Mat_Elements[NZEcounter + 1] = -1.0;
    //                Mat_Elements[NZEcounter + 2] = 1.0;
    //                NZEcounter = NZEcounter + 2;
    //                ROWcounter = ROWcounter + 1;
    //            }
    //        }
    //        std::cout << "DRCap NZEcounter: " << NZEcounter << std::endl;
    //        std::cout << "ROWcounter: " << ROWcounter << std::endl;
    //
    //        //Renewable Capacity
    //        for (int i = 0; i < NR; i++) {
    //            for (int j = 0; j < NH; j++) {
    //                Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
    //                Col_Indexes[NZEcounter + 1] = COLcounter + 1 + NGen + NEE + ND + i;
    //                Col_Indexes[NZEcounter + 2] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + i * NH + j;
    //                Mat_Elements[NZEcounter + 1] = -1.0 * input_data.ResourceR[i * NH + j];
    //                Mat_Elements[NZEcounter + 2] = 1.0;
    //                NZEcounter = NZEcounter + 2;
    //                ROWcounter = ROWcounter + 1;
    //            }
    //        }
    //        std::cout << "RCap NZEcounter: " << NZEcounter << std::endl;
    //        std::cout << "ROWcounter: " << ROWcounter << std::endl;
    //
    //        //Hydro capacity
    //        for (int i = 0; i < NHyd; i++) {
    //            for (int j = 0; j < NH; j++) {
    //                Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 3] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 4] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 5] = ROWcounter + 1;
    //                Col_Indexes[NZEcounter + 1] = COLcounter + 1 + NGen + NEE + ND + NR + i;
    //                Col_Indexes[NZEcounter + 2] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + i * NH + j;
    //                Col_Indexes[NZEcounter + 3] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH * 3 + NGen * NH * 3 + i * NH + j;
    //                Col_Indexes[NZEcounter + 4] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH * 3 + NGen * NH * 3 + NHyd * NH + i * NH + j;
    //                Col_Indexes[NZEcounter + 5] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH * 3 + NGen * NH * 3 + NHyd * NH * 2 + i * NH + j;
    //                Mat_Elements[NZEcounter + 1] = -1.0;
    //                Mat_Elements[NZEcounter + 2] = 1.0;
    //                Mat_Elements[NZEcounter + 3] = 1.0;
    //                Mat_Elements[NZEcounter + 4] = 1.0;
    //                Mat_Elements[NZEcounter + 5] = 1.0;
    //                NZEcounter = NZEcounter + 5;
    //                ROWcounter = ROWcounter + 1;
    //            }
    //        }
    //        std::cout << "HCap NZEcounter: " << NZEcounter << std::endl;
    //        std::cout << "ROWcounter: " << ROWcounter << std::endl;
    //
    //        //Hydro energy
    //        for (int i = 0; i < 12; i++) {
    //            Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
    //            Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
    //            Col_Indexes[NZEcounter + 1] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR) + i * 2 + 1;
    //            Col_Indexes[NZEcounter + 2] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR) + i * 2 + 2;
    //            Mat_Elements[NZEcounter + 1] = 1.0;
    //            Mat_Elements[NZEcounter + 2] = 1.0;
    //            NZEcounter += 2;
    //            ROWcounter++;
    //        }
    //        std::cout << "HEn NZEcounter: " << NZEcounter << std::endl;
    //        std::cout << "ROWcounter: " << ROWcounter << std::endl;
    //
    //        //Sufficient energy for reserves
    //        for (int i = 0; i < NS; i++) {
    //            for (int j = 0; j < NH; j++) {
    //                Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 3] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 4] = ROWcounter + 1;
    //                Row_Indexes[NZEcounter + 5] = ROWcounter + 1;
    //                Col_Indexes[NZEcounter + 1] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS) + NH * i + j;
    //                Col_Indexes[NZEcounter + 2] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 3 + (NGen + NHyd) * 3) + NH * i + j;
    //                Col_Indexes[NZEcounter + 3] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 3 + (NGen + NHyd) * 3 + NS) + NH * i + j;
    //                Col_Indexes[NZEcounter + 4] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 3 + (NGen + NHyd) * 3 + NS * 2) + NH * i + j;
    //                Col_Indexes[NZEcounter + 5] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 2) + NH * i + j;
    //                Mat_Elements[NZEcounter + 1] = 1.0;
    //                Mat_Elements[NZEcounter + 2] = input_data.ReserveDuration[0];
    //                Mat_Elements[NZEcounter + 3] = input_data.ReserveDuration[1];
    //                Mat_Elements[NZEcounter + 4] = input_data.ReserveDuration[2];
    //                Mat_Elements[NZEcounter + 5] = -1.0;
    //                NZEcounter = NZEcounter + 5;
    //                ROWcounter = ROWcounter + 1;
    //            }
    //        }
    //        std::cout << "SEne NZEcounter: " << NZEcounter << std::endl;
    //        std::cout << "ROWcounter: " << ROWcounter << std::endl;
    //
    //        //Max Storage Capacity
    //        for (int i = 0; i < NS; i++) {
    //            Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
    //            Col_Indexes[NZEcounter + 1] = COLcounter + NGen + NEE + ND + NR + NHyd + i + 1;
    //            Mat_Elements[NZEcounter + 1] = 1.0;
    //            NZEcounter += 1;
    //        }
    //        ROWcounter++;
    //        std::cout << "SMCap NZEcounter: " << NZEcounter << std::endl;
    //        std::cout << "ROWcounter: " << ROWcounter << std::endl;
    //
    //        //Hourly reserve provision
    //        for (int i = 0; i < 3; i++) {
    //            for (int t = 0; t < NH; t++) {
    //                for (int j = 0; j < NGen; j++) {
    //                    Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
    //                    Col_Indexes[NZEcounter + 1] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 3 + (NGen) * i) + j * NH + t;
    //                    Mat_Elements[NZEcounter + 1] = 1.0;
    //                    NZEcounter = NZEcounter + 1;
    //                }
    //                for (int j = 0; j < NHyd; j++) {
    //                    Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
    //                    Col_Indexes[NZEcounter + 1] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 3 + (NGen) * 3) + NH * NHyd * i + j * NH + t;
    //                    Mat_Elements[NZEcounter + 1] = 1.0;
    //                    NZEcounter = NZEcounter + 1;
    //                }
    //                for (int j = 0; j < NS; j++) {
    //                    Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
    //                    Col_Indexes[NZEcounter + 1] = COLcounter + 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + ND * 2 + NR + NHyd + NS * 3 + (NGen) * 3 + NHyd * 3 + NS * i) + j * NH + t;
    //                    Mat_Elements[NZEcounter + 1] = 1.0;
    //                    NZEcounter = NZEcounter + 1;
    //                }
    //                ROWcounter = ROWcounter + 1;
    //            }
    //        }
    //        std::cout << "HRes NZEcounter: " << NZEcounter << std::endl;
    //        std::cout << "ROWcounter: " << ROWcounter << std::endl;
    //        COLcounter += nr_variables;
    //    }
    //    //const int * Row_Ind, *Col_Ind;
    //    //const double *Mat_Ele;
    //    //Row_Ind = &Row_Indexes[0];
    //    //Col_Ind = &Col_Indexes[0];
    //    //Mat_Ele = &Mat_Elements[0];
    //
    //    glp_load_matrix(lp, NZEcounter, Row_Indexes, Col_Indexes, Mat_Elements);
    //    
    //    int simplex = 0,ret = 0;
    //    if (simplex) {
    //        glp_smcp param;
    //        glp_init_smcp(&param);
    //        param.msg_lev = GLP_MSG_ALL;
    //        param.meth = GLP_DUAL;
    //        param.pricing = GLP_PT_PSE;
    //        param.r_test = GLP_RT_HAR;
    //        param.tol_bnd = 1e-7;
    //        param.tol_dj = 1e-7;
    //        param.tol_piv = 1e-10;
    //        param.out_frq = 500;
    //        param.out_dly = 0;
    //        param.presolve = GLP_OFF;
    //        param.excl = GLP_ON;
    //        param.shift = GLP_ON;
    //        param.aorn = GLP_USE_AT;
    //        ret = glp_simplex(lp, &param);
    //    } else {
    //        glp_iptcp param;
    //        glp_init_iptcp(&param);
    //        ret = glp_interior(lp, &param);
    //    }
    //
    //    
    //    qDebug() << "simplex status:" << ret;
    //
    //    int solution_status = glp_get_status(lp);
    //    qDebug() << "solution status:" << solution_status;
    //
    //    std::vector<double> variables;
    //    //Obtaining optimal values of variables
    //    for (int i = 0; i < NR_VARIABLES; ++i) {
    //        variables.push_back(glp_get_col_prim(lp, i + 1));
    //    }
    //    std::cout << "Variables size: " << variables.size() << std::endl;
    //    int extract_counter = 0;
    //    AAMY_outputs results;
    //    results.P_peak.reserve(NY);
    //    for (int y = 0; y < NY; y++) {
    //        for (int i = 0; i < NGen; i++) //Peaking plants capacity
    //        {
    //            results.P_peak[y].push_back(variables[extract_counter]);
    //            std::cout << "Ppeak " << i << ": " << variables[extract_counter] << std::endl;
    //            extract_counter = extract_counter + 1;
    //        }
    //        results.P_ee.reserve(NY);
    //        for (int i = 0; i < NEE; i++) //Energy efficiency capacity
    //        {
    //            results.P_ee.push_back(variables[i + extract_counter]);
    //        }
    //        extract_counter = extract_counter + NEE;
    //        results.P_DR.reserve(NY);
    //        for (int i = 0; i < ND; i++) //Demand response capacity
    //        {
    //            results.P_DR.push_back(variables[i + extract_counter]);
    //        }
    //        extract_counter = extract_counter + ND;
    //        results.P_R.reserve(NY);
    //        for (int i = 0; i < NR; i++) //Renewables capacity
    //        {
    //            results.P_R[y].push_back(variables[i + extract_counter]);
    //        }
    //        extract_counter = extract_counter + NR;
    //        results.P_H.reserve(NY);
    //        for (int i = 0; i < NHyd; i++) //Hydro capacity
    //        {
    //            results.P_H[y].push_back(variables[i + extract_counter]);
    //        }
    //        extract_counter = extract_counter + NHyd;
    //        results.P_S.reserve(NY);
    //        for (int i = 0; i < NS; i++) //Storage capacity
    //        {
    //            results.P_S[y].push_back(variables[i + extract_counter]);
    //        }
    //        for (int i = 0; i < NS; i++) {
    //            qDebug() << "Psto " << i << ": " << results.P_S[y][i];
    //            qDebug() << "Psto " << i << ": " << results.P_S[y].size();
    //        }
    //        extract_counter = extract_counter + NS;
    //        results.E_S.reserve(NY);
    //        for (int i = 0; i < NS; i++) //Storage energy capacity
    //        {
    //            results.E_S[y].push_back(variables[i + extract_counter]);
    //        }
    //        extract_counter = extract_counter + NS;
    ////        results.G_peak.reserve(NGen * NH);
    ////        for (int i = 0; i < NGen * NH; i++) //Peaking plants generation
    ////        {
    ////            results.G_peak[i] = variables[i + extract_counter];
    ////        }
    ////        extract_counter = extract_counter + NGen * NH;
    ////        results.DR_up.reserve(ND * NH);
    ////        results.DR_dn.reserve(ND * NH);
    ////        for (int i = 0; i < ND * NH; i++) //Demand response up-shifts
    ////        {
    ////            results.DR_up[i] = variables[i + extract_counter];
    ////        }
    ////        extract_counter = extract_counter + ND * NH;
    ////        for (int i = 0; i < ND * NH; i++) //Demand response down-shifts
    ////        {
    ////            results.DR_dn[i] = variables[i + extract_counter];
    ////        }
    ////        extract_counter = extract_counter + ND * NH;
    ////        results.G_ren.reserve(NR * NH);
    ////        for (int i = 0; i < NR * NH; i++) //Renewables generation
    ////        {
    ////            results.G_ren[i] = variables[i + extract_counter];
    ////        }
    ////        extract_counter = extract_counter + NR * NH;
    ////        for (int i = 0; i < NHyd * NH; i++) //Storage charging
    ////        {
    ////            results.G_H.push_back(variables[i + extract_counter]);
    ////        }
    ////        extract_counter += NH*NHyd;
    ////        results.G_CS.reserve(NS * NH);
    ////        results.G_DS.reserve(NS * NH);
    ////        results.E_ST.reserve(NS * NH);
    ////        for (int i = 0; i < NS * NH; i++) //Storage charging
    ////        {
    ////            results.G_CS[i] = variables[i + extract_counter];
    ////        }
    ////        extract_counter = extract_counter + NS * NH;
    ////        for (int i = 0; i < NS * NH; i++) //Storage discharging
    ////        {
    ////            results.G_DS[i] = variables[i + extract_counter];
    ////        }
    ////        extract_counter = extract_counter + NS * NH;
    ////        for (int i = 0; i < NS * NH; i++) //Stored energy
    ////        {
    ////            results.E_ST[i] = variables[i + extract_counter];
    ////        }
    ////        extract_counter = extract_counter + NS * NH;
    ////        results.RP_peak.reserve(NGen * NH);
    ////        results.RP_hyd.reserve(NHyd * NH);
    ////        results.RP_sto.reserve(NS * NH);
    ////        for (int i = 0; i < NGen * NH; i++) //Peaking plants primary reserve
    ////        {
    ////            results.RP_peak[i] = variables[i + extract_counter];
    ////        }
    ////        extract_counter = extract_counter + NGen * NH;
    ////        results.RS_hyd.reserve(NHyd * NH);
    ////        results.RS_peak.reserve(NGen * NH);
    ////        results.RS_sto.reserve(NS * NH);
    ////        for (int i = 0; i < NGen * NH; i++) //Peaking plants secondary reserve
    ////        {
    ////            results.RS_peak[i] = variables[i + extract_counter];
    ////        }
    ////        extract_counter = extract_counter + NGen * NH;
    ////        results.RT_hyd.reserve(NHyd * NH);
    ////        results.RT_peak.reserve(NGen * NH);
    ////        results.RT_sto.reserve(NS * NH);
    ////        for (int i = 0; i < NGen * NH; i++) //Peaking plants tertiary reserve
    ////        {
    ////            results.RT_peak[i] = variables[i + extract_counter];
    ////        }
    ////        extract_counter = extract_counter + NGen * NH;
    ////        for (int i = 0; i < NHyd * NH; i++) //Hydro plants primary reserve
    ////        {
    ////            results.RP_hyd[i] = variables[i + extract_counter];
    ////        }
    ////        extract_counter = extract_counter + NHyd * NH;
    ////        for (int i = 0; i < NHyd * NH; i++) //Hydro plants secondary reserve
    ////        {
    ////            results.RS_hyd[i] = variables[i + extract_counter];
    ////        }
    ////        extract_counter = extract_counter + NHyd * NH;
    ////        for (int i = 0; i < NHyd * NH; i++) //Hydro plants tertiary reserve
    ////        {
    ////            results.RT_hyd[i] = variables[i + extract_counter];
    ////        }
    ////        extract_counter = extract_counter + NS * NH;
    ////        for (int i = 0; i < NS * NH; i++) //Storage plants primary reserve
    ////        {
    ////            results.RP_sto[i] = variables[i + extract_counter];
    ////        }
    ////        extract_counter = extract_counter + NS * NH;
    ////        for (int i = 0; i < NS * NH; i++) //Storage plants secondary reserve
    ////        {
    ////            results.RS_sto[i] = variables[i + extract_counter];
    ////        }
    ////        extract_counter = extract_counter + NS * NH;
    ////        for (int i = 0; i < NS * NH; i++) //Storage plants tertiary reserve
    ////        {
    ////            results.RT_sto[i] = variables[i + extract_counter];
    ////        }
    ////        extract_counter = extract_counter + NS * NH;
    //
    //        //Obtaining dual variables
    //        for (int y = 0; y < NY; y++) {
    //            results.CapacityPrice.push_back(glp_get_row_dual(lp, y*problem_size+1));
    //            results.max_ES_cap.push_back(glp_get_row_dual(lp, y*problem_size + 1 + problem_size - NH * 3 - 1));
    //        }
    ////        results.energyPrice.reserve(NH);
    ////        results.RP_price.reserve(NH);
    ////        results.RS_price.reserve(NH);
    ////        results.RT_price.reserve(NH);
    ////        for (int i = 0; i < NH; ++i) {
    ////            results.energyPrice[i] = glp_get_row_dual(lp, i + 2);
    ////            results.RP_price[i] = glp_get_row_dual(lp, 1 + PROBLEM_SIZE - NH * 3 + i);
    ////            results.RS_price[i] = glp_get_row_dual(lp, 1 + PROBLEM_SIZE - NH * 2 + i);
    ////            results.RT_price[i] = glp_get_row_dual(lp, 1 + PROBLEM_SIZE - NH * 1 + i);
    ////        }
    ////        for (int t = 0; t < NH; t++) {
    ////            qDebug() << results.E_ST[y][t] << "," << results.E_ST[y][NH + t] << "," << results.E_ST[y][NH * 2 + t] << "," << results.E_ST[y][NH * 3 + t];
    ////        }
    //    }
    //    glp_delete_prob(lp);
    //    emit _unLockingGlpk();
    //    int status = 5001;
    //    emit _tryLocking(identifier);
    //    while (!*tryLocking) {
    //        QCoreApplication::processEvents();
    //    }
    //    resetLocking();
    //

    try {
        qDebug() << this << "Query calculation_results_table";
        pstmt = con->prepareStatement("DELETE FROM calculation_results_table WHERE calculation_id = 'Alternative Analysis' AND scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        delete pstmt;
        delete res;

        if (results.objective_value != 0) {
            pstmt = con->prepareStatement("INSERT INTO calculation_results_table(scenario_and_cases_row_id,objective_value,calculation_id) VALUES (?,?,?)");
            pstmt->setInt(1, scenario_and_cases_row_id);
            pstmt->setDouble(2, results.objective_value);
            pstmt->setString(3, "Alternative Analysis");
            pstmt->executeUpdate();
        }
        delete pstmt;

        //Write installed ESS power capacity
        qDebug() << this << "Query installed_capacity_output_es_cap_tables";
        pstmt = con->prepareStatement("DELETE FROM installed_capacity_output_es_cap_tables WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        delete res;
        delete pstmt;
        /*for (int y = 0; y < NY; y++) {
            for (unsigned int i = 0; i < results.P_S[y].size(); i++) {
                //INSERT
                pstmt = con->prepareStatement("INSERT INTO installed_capacity_output_es_cap_tables(outinst1,storage_type,scenario_and_cases_row_id,year_id) VALUES (?,?,?,?)");
                pstmt->setDouble(1, results.P_S[y][i]);
                pstmt->setString(2, stotype[i]);
                pstmt->setInt(3, scenario_and_cases_row_id);
                pstmt->setInt(4, y);
                pstmt->executeUpdate();
                delete pstmt;
            }
        }*/

        int y = 0;
        for (int i = 0; i < results.P_S[y].size(); i++) {
                //INSERT
                pstmt = con->prepareStatement("INSERT INTO installed_capacity_output_es_cap_tables(outinst1,outinst2,storage_type,scenario_and_cases_row_id,year_id) VALUES (?,?,?,?,?)");
                pstmt->setDouble(1, results.P_S[y][i]);
                pstmt->setDouble(2, results.P_S[y + 1][i]);
                pstmt->setString(3, stotype[i]);
                pstmt->setInt(4, scenario_and_cases_row_id);
                pstmt->setInt(5,y);
                pstmt->executeUpdate();
                delete pstmt;
            }
         
        //Write demand side installed capacity
        qDebug() << this << "Query demand_side_output_installed_cap_tables";
        pstmt = con->prepareStatement("DELETE FROM demand_side_output_installed_cap_tables WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        delete pstmt;
        //for (int y = 0; y < NY; y++) {
        //INSERT
        pstmt = con->prepareStatement("INSERT INTO demand_side_output_installed_cap_tables(outeff1,outdem1,outeff2,outdem2,scenario_and_cases_row_id,year_id) VALUES (?,?,?,?,?,?)");
        pstmt->setDouble(1, results.P_ee[y]);
        pstmt->setDouble(2, results.P_DR[y]);
        pstmt->setDouble(3, results.P_ee[y + 1]);
        pstmt->setDouble(4, results.P_DR[y + 1]);
        pstmt->setInt(5, scenario_and_cases_row_id);
        pstmt->setInt(6, y);
        pstmt->executeUpdate();
        //}
        delete res;
        delete pstmt;
        //Write ESS installed energy capacity
        qDebug() << this << "Query energy_capacity_output_es_cap_tables";
        pstmt = con->prepareStatement("DELETE FROM energy_capacity_output_es_cap_tables WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        //for (int y = 0; y < NY; y++) {
        for (int i = 0; i < NS; i++) {
            //INSERT
            delete pstmt;
            pstmt = con->prepareStatement("INSERT INTO energy_capacity_output_es_cap_tables(outener1,outener2,storage_type,scenario_and_cases_row_id,year_id) VALUES (?,?,?,?,?)");

            pstmt->setDouble(1, results.E_S[y][i]);
            pstmt->setDouble(2, results.E_S[y + 1][i]);
            pstmt->setString(3, stotype[i]);
            pstmt->setInt(4, scenario_and_cases_row_id);
            pstmt->setInt(5, y);
            pstmt->executeUpdate();
            qDebug() << "energy capacity year " << y << results.E_S[y][i];
        }
        //}
        delete res;
        delete pstmt;
        //Write hydro dam installed capacity
        qDebug() << this << "Query hydro_generation_output_installed_cap_tables";
        pstmt = con->prepareStatement("DELETE FROM hydro_generation_output_installed_cap_tables WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        //INSERT
        delete pstmt;
        // KAI: PH [y][]: y=0 means year 1 
        //for (int y = 0; y < NY; y++) {
        pstmt = con->prepareStatement("INSERT INTO hydro_generation_output_installed_cap_tables(outdam1,outdam2, scenario_and_cases_row_id,year_id) VALUES (?,?,?,?)");
        pstmt->setDouble(1, results.P_H[0][0]);
        pstmt->setDouble(2, results.P_H[1][0]);
        pstmt->setInt(3, scenario_and_cases_row_id);
        pstmt->setInt(4, y);
        pstmt->executeUpdate();
        //}
        delete res;
        delete pstmt;
        //Write Thermal installed capacity
        pstmt = con->prepareStatement("DELETE FROM thermal_generation_output_installed_cap_tables WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        // for (int y = 0; y < NY; y++) {
        for (int i = 0; i < NGen; i++) {
            //INSERT
            delete pstmt;
            //kai  pstmt = con->prepareStatement("INSERT INTO thermal_generation_output_installed_cap_tables(outthermgen1,fuel_type,scenario_and_cases_row_id,year_id) VALUES (?,?,?,?)");
            pstmt = con->prepareStatement
                    ("INSERT INTO thermal_generation_output_installed_cap_tables(outthermgen1 ,outthermgen2,fuel_type,scenario_and_cases_row_id,year_id) VALUES (?,?,?,?,?)");
            pstmt->setDouble(1, results.P_peak[0][i]); // KAI o -> year 1
            pstmt->setDouble(2, results.P_peak[1][i]); // 1 -> year 2
            pstmt->setString(3, thermtype[i]);
            pstmt->setInt(4, scenario_and_cases_row_id);
            pstmt->setInt(5, y);
            pstmt->executeUpdate();
        }
        //}
        delete res;
        delete pstmt;
        //Write renewable installed capacity
        qDebug() << this << "Query renewables_output_installed_cap_table";
        pstmt = con->prepareStatement("DELETE FROM renewables_output_installed_cap_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
        res = pstmt->executeQuery();
        delete pstmt;
        for (unsigned int y = 0; y < results.P_R.size(); y++) {
            qDebug() << y << ":" << results.P_R[y];
        }
        for (int y = 0; y < NY; y++) {
            //INSERT
            //pstmt = con->prepareStatement("INSERT INTO renewables_output_installed_cap_table(outwind1,outsolarpv1,scenario_and_cases_row_id,year_id) VALUES (?,?,?,?)");
            pstmt = con->prepareStatement
                    ("INSERT INTO renewables_output_installed_cap_table(outwind1,outsolarpv1,outwind2,outsolarpv2,scenario_and_cases_row_id,year_id) VALUES (?,?,?,?,?,?)");
            pstmt->setDouble(1, results.P_R[0][0]);
            pstmt->setDouble(2, results.P_R[0][1]);
            pstmt->setDouble(3, results.P_R[1][0]);
            pstmt->setDouble(4, results.P_R[1][1]);
            pstmt->setInt(5, scenario_and_cases_row_id);
            pstmt->setInt(6, y);
            pstmt->executeUpdate();
        }
        delete res;
        delete pstmt;

    } catch (sql::SQLException &e) {
        std::cout << "# ERR: SQLException in " << __FILE__;
        std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
        std::cout << "# ERR: " << e.what();
        std::cout << " (MySQL error code: " << e.getErrorCode();
        std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        std::string query2("UPDATE scenarios_and_cases SET alternative_analysis_calculation_status = 'ERROR_QUERY', alternative_analysis_calculation_date =CURRENT_TIMESTAMP()  WHERE row_id = ?;");
        pstmt = con->prepareStatement(query2);
        pstmt->setInt(1, scenario_and_cases_row_id);
        pstmt->execute();
        delete pstmt;
        delete con;

        return 0;
    }
    std::string query2("UPDATE scenarios_and_cases SET alternative_analysis_calculation_status = 'COMPLETE', alternative_analysis_calculation_date =CURRENT_TIMESTAMP()  WHERE row_id = ?;");
    pstmt = con->prepareStatement(query2);
    pstmt->setInt(1, scenario_and_cases_row_id);
    pstmt->execute();
    delete pstmt;
    delete con;

    return ret;
}

int AlternativeAnalysisMultiYearThread::ThreadSleep(int sleepTime) {
    qDebug() << this << " >> Reset locking";
    this->msleep(sleepTime);
    return 1;

}