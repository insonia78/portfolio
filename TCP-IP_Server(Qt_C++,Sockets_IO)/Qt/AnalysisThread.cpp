/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* 
 * File:   AlternativeAnalysisThread.cpp
 * Author: gonzales1609
 * 
 * Created on February 21, 2018, 8:46 PM
 */

#include "AlternativeAnalysisThread.h"

AlternativeAnalysisThread::AlternativeAnalysisThread(int row_id, DbConnector * database,QObject *parent):QThread(parent) {
    this->database = database;
    this->row_id = row_id;
    QObject::connect(this, SIGNAL(_tryLocking()), database, SLOT(__tryLocking()), Qt::QueuedConnection);
    QObject::connect(database, SIGNAL(__tryLockingResponse(int)), this, SLOT(TryLockingResponse(int)), Qt::UniqueConnection);
    QObject::connect(this, SIGNAL(_unLocking()),database, SLOT(unLocking()), Qt::QueuedConnection);

}
void AlternativeAnalysisThread::run()
{
    AlternativeAnalysis(int row_id);
    
}
int AlternativeAnalysisThread::AlternativeAnalysis(int scenario_and_cases_row_id)
{
    double peakdemand1,peakdemand2=0,energydemand1=0,energydemand2=0;
        std::vector<double> demandprofile1,demandprofile2;
        double windfirmpower,solarfirmpower,windinvcost1,windinvcost2,solarinvcost1,solarinvcost2,windfixedOM,solarfixedOM;
        std::vector<double> basewind,basesolar;
        double hydrocap1,hydrocap2,hydrores1,hydrores2,hydrores3,hydroinvcost1,hydroinvcost2;
        double hydroEng1_1,hydroEng1_2,hydroEng1_3,hydroEng1_4,hydroEng1_5,hydroEng1_6,hydroEng1_7,hydroEng1_8,hydroEng1_9,hydroEng1_10,hydroEng1_11,hydroEng1_12,hydroEng2_1,hydroEng2_2,hydroEng2_3,hydroEng2_4,hydroEng2_5,hydroEng2_6,hydroEng2_7,hydroEng2_8,hydroEng2_9,hydroEng2_10,hydroEng2_11,hydroEng2_12;
        double capplan1,lostload1,primaryres1,secondres1,tertiaryres1;
        double windcappol1,windcappol2,solarcappol1,solarcappol2;
        std::vector<double> chargeeff,dischargeeff,invcostpow1,invcostpow2,invcostener1,invcostener2,voms1,voms2,firmpow,fixedoms,eat1,eat2,mcd1,mcd2;
        std::vector<double> pconcap1,pconcap2,fuelprice1,fuelprice2,heatrate,vom,p_reserve,s_reserve,t_reserve,carbon_rate,invcost1,invcost2,fixedom,sumderate,winderate;
        std::string rowvalue;
        
        double demres1,demres2,demres3,demres4,demres5,demres6,demres7,demres8,demres9,demres10,demres11,enereff1,enereff2,enereff3,enereff4,enereff5,enereff6,enereff7,enereff8,enereff9,enereff10,enereff11;
        try {
            sql::Driver *driver;
            sql::Connection *con;
            sql::Statement *stmt;
            sql::ResultSet *res;
            sql::PreparedStatement *pstmt;
            sql::ResultSetMetaData *res_meta;

            // Create a connection 
            driver = get_driver_instance();
            con = driver->connect("127.0.0.1:3306", "acelerex", "@acelerex!123");
            // Connect to the MySQL database 
            con->setSchema("irena_storage_benefits_tool");
            // Select everything from table. 
            
            //Read demand table
            pstmt = con->prepareStatement("SELECT * FROM demand_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
            res = pstmt->executeQuery();
            res_meta =res->getMetaData();
            int col_count=res_meta->getColumnCount();
            
            std::vector<double> demandprofile1,demandprofile2;
            std::string temp,path;
            while(res->next()){
                for(int i=0;i<col_count;i++){
                    temp = res_meta->getColumnLabel(i + 1);
                    sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                    std::string type = a.asStdString();
                    if (type == "VARCHAR") {
                        path = res->getString("userdemandprofile1");
                        if(path!="NULL"){
                            std::ifstream ip(path);
                            if(!ip.is_open()) std::cout <<"ERROR: File did not open correctly" << std::endl;
                            while(ip.good()){
                                getline(ip,rowvalue,'\n');
                                demandprofile1.push_back(atof(rowvalue.c_str()));
                            }
                        }
                        else{
                            std::ifstream ip(res->getString("demandprofile1"));
                            if(!ip.is_open()) std::cout <<"ERROR: File did not open correctly" << std::endl;
                            while(ip.good()){
                                getline(ip,rowvalue,'\n');
                                demandprofile1.push_back(atof(rowvalue.c_str()));
                            }
                        }
                        path = res->getString("userdemandprofile2");
                        if(path!="NULL"){
                            std::ifstream ip(path);
                            if(!ip.is_open()) std::cout <<"ERROR: File did not open correctly" << std::endl;
                            while(ip.good()){
                                getline(ip,rowvalue,'\n');
                                demandprofile2.push_back(atof(rowvalue.c_str()));
                            }
                        }
                        else{
                            std::ifstream ip(res->getString("demandprofile2"));
                            if(!ip.is_open()) std::cout <<"ERROR: File did not open correctly" << std::endl;
                            while(ip.good()){
                                getline(ip,rowvalue,'\n');
                                demandprofile2.push_back(atof(rowvalue.c_str()));
                            }
                        }
                    }
                    peakdemand1=res->getDouble("peakdemand1");
                    peakdemand2=res->getDouble("peakdemand2");
                    energydemand1 = res->getDouble("energydemand1");
                    energydemand2 = res->getDouble("energydemand2");
                }
            }
            delete res;
            delete pstmt;
            //Read Renewables table
            pstmt = con->prepareStatement("SELECT * FROM generation_renewables_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
            res = pstmt->executeQuery();
            res_meta =res->getMetaData();
            col_count=res_meta->getColumnCount();
            //std::vector<double> enercap1,enercap2,powcap1,powcap2,chargeeff,dischargeeff,invcostpow1,invcostener1,invostpow2,invcostener2,vom1,vom2,firmpow,fixedom,EAT,MDC;
            while(res->next()){
                for(int i=0;i<col_count;i++){
                    temp = res_meta->getColumnLabel(i + 1);
                    sql::SQLString a = res_meta->getColumnTypeName(i + 1);
                    std::string type = a.asStdString();
                    if (type == "VARCHAR") {
                        path = res->getString("userbasewind");
                        if(path!="NULL"){
                            std::ifstream ip(path);
                            if(!ip.is_open()) std::cout <<"ERROR: File did not open correctly" << std::endl;
                            while(ip.good()){
                                getline(ip,rowvalue,'\n');
                                basewind.push_back(atof(rowvalue.c_str()));
                            }
                        }
                        else{
                            std::ifstream ip(res->getString("basewind"));
                            if(!ip.is_open()) std::cout <<"ERROR: File did not open correctly" << std::endl;
                            while(ip.good()){
                                getline(ip,rowvalue,'\n');
                                basewind.push_back(atof(rowvalue.c_str()));
                            }
                        }
                        path = res->getString("userbasesolar");
                        if(path!="NULL"){
                            std::ifstream ip(path);
                            if(!ip.is_open()) std::cout <<"ERROR: File did not open correctly" << std::endl;
                            while(ip.good()){
                                getline(ip,rowvalue,'\n');
                                basesolar.push_back(atof(rowvalue.c_str()));
                            }
                        }
                        else{
                            std::ifstream ip(res->getString("basesolar"));
                            if(!ip.is_open()) std::cout <<"ERROR: File did not open correctly" << std::endl;
                            while(ip.good()){
                                getline(ip,rowvalue,'\n');
                                basesolar.push_back(atof(rowvalue.c_str()));
                            }
                        }
                    }
                    windfirmpower=res->getDouble("windfirmpower");
                    solarfirmpower=res->getDouble("solarfirmpower");
                    windinvcost1=res->getDouble("windinvcost1");
                    windinvcost2=res->getDouble("windinvcost2");
                    solarinvcost1=res->getDouble("solarinvcost1");
                    solarinvcost2=res->getDouble("solarinvcost2");
                    windfixedOM=res->getDouble("windfixedOM");
                    solarfixedOM=res->getDouble("solarfixedOM");
                }
            }
            delete res;
            delete pstmt;
            //Read Hydro table
            pstmt = con->prepareStatement("SELECT * FROM generation_hydro_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
            res = pstmt->executeQuery();
            res_meta =res->getMetaData();
            col_count=res_meta->getColumnCount();
            while(res->next()){
                hydrocap1=res->getDouble("hydrocap1");
                hydrocap2=res->getDouble("hydrocap2");
                hydrores1=res->getDouble("hydrores1");
                hydrores2=res->getDouble("hydrores2");
                hydrores3=res->getDouble("hydrores3");
                hydroinvcost1=res->getDouble("hydroinvcost1");
                hydroinvcost2=res->getDouble("hydroinvcost2");
            }
            delete res;
            delete pstmt;
            //Read Hydro energy table
            pstmt = con->prepareStatement("SELECT * FROM hydro_monthly_energy_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
            res = pstmt->executeQuery();
            while(res->next()){
                hydroEng1_1=res->getDouble("hydroEng1_1");
                hydroEng1_2=res->getDouble("hydroEng1_2");
                hydroEng1_3=res->getDouble("hydroEng1_3");
                hydroEng1_4=res->getDouble("hydroEng1_4");
                hydroEng1_5=res->getDouble("hydroEng1_5");
                hydroEng1_6=res->getDouble("hydroEng1_6");
                hydroEng1_7=res->getDouble("hydroEng1_7");
                hydroEng1_8=res->getDouble("hydroEng1_8");
                hydroEng1_9=res->getDouble("hydroEng1_9");
                hydroEng1_10=res->getDouble("hydroEng1_10");
                hydroEng1_11=res->getDouble("hydroEng1_11");
                hydroEng1_12=res->getDouble("hydroEng1_12");
                hydroEng2_1=res->getDouble("hydroEng2_1");
                hydroEng2_2=res->getDouble("hydroEng2_2");
                hydroEng2_3=res->getDouble("hydroEng2_3");
                hydroEng2_4=res->getDouble("hydroEng2_4");
                hydroEng2_5=res->getDouble("hydroEng2_5");
                hydroEng2_6=res->getDouble("hydroEng2_6");
                hydroEng2_7=res->getDouble("hydroEng2_7");
                hydroEng2_8=res->getDouble("hydroEng2_8");
                hydroEng2_9=res->getDouble("hydroEng2_9");
                hydroEng2_10=res->getDouble("hydroEng2_10");
                hydroEng2_11=res->getDouble("hydroEng2_11");
                hydroEng2_12=res->getDouble("hydroEng2_12");
            }
            delete res;
            delete pstmt;
            //Read Planning criteria table
            pstmt = con->prepareStatement("SELECT * FROM programs_planning_criteria_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
            res = pstmt->executeQuery();
            res_meta =res->getMetaData();
            col_count=res_meta->getColumnCount();
            while(res->next()){
                capplan1=res->getDouble("capplan1");
                lostload1=res->getDouble("lostload1");
                primaryres1=res->getDouble("primaryres1");
                secondres1=res->getDouble("secondres1");
                tertiaryres1=res->getDouble("tertiaryres1");
            }
            delete res;
            delete pstmt;
            //Read Renewable programme table
            pstmt = con->prepareStatement("SELECT * FROM programs_renewables_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
            res = pstmt->executeQuery();
            res_meta =res->getMetaData();
            col_count=res_meta->getColumnCount();
            while(res->next()){
                windcappol1=res->getDouble("windcappol1");
                windcappol2=res->getDouble("windcappol2");
                solarcappol1=res->getDouble("solarcappol1");
                solarcappol2=res->getDouble("solarcappol2");
            }
            delete res;
            delete pstmt;
            //Read Demand side programme table
            pstmt = con->prepareStatement("SELECT * FROM programs_demand_side_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
            res = pstmt->executeQuery();
            res_meta =res->getMetaData();
            col_count=res_meta->getColumnCount();
            while(res->next()){
                enereff1=res->getDouble("enereff1");
                enereff2=res->getDouble("enereff2");
                enereff3=res->getDouble("enereff3");
                enereff4=res->getDouble("enereff4");
                enereff5=res->getDouble("enereff5");
                enereff6=res->getDouble("enereff6");
                enereff7=res->getDouble("enereff7");
                enereff8=res->getDouble("enereff8");
                enereff9=res->getDouble("enereff9");
                enereff10=res->getDouble("enereff10");
                enereff11=res->getDouble("enereff11");
                demres1=res->getDouble("demres1");
                demres2=res->getDouble("demres2");
                demres3=res->getDouble("demres3");
                demres4=res->getDouble("demres4");
                demres5=res->getDouble("demres5");
                demres6=res->getDouble("demres6");
                demres7=res->getDouble("demres7");
                demres8=res->getDouble("demres8");
                demres9=res->getDouble("demres9");
                demres10=res->getDouble("demres10");
                demres11=res->getDouble("demres11");
            }
            delete res;
            delete pstmt;
            //Read energy storage dynamic table
            pstmt = con->prepareStatement("SELECT * FROM energy_storage_dynamic_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
            res = pstmt->executeQuery();
            res_meta =res->getMetaData();
            col_count=res_meta->getColumnCount();
            while(res->next()){
                chargeeff.push_back(res->getDouble("chargeeff"));
                dischargeeff.push_back(res->getDouble("dischargeeff"));
                invcostpow1.push_back(res->getDouble("invcostpow1"));
                invcostpow2.push_back(res->getDouble("invcostpow2"));
                invcostener1.push_back(res->getDouble("invcostener1"));
                invcostener2.push_back(res->getDouble("invcostener2"));
                voms1.push_back(res->getDouble("vom1"));
                voms2.push_back(res->getDouble("vom2"));
                firmpow.push_back(res->getDouble("firmpow"));
                fixedoms.push_back(res->getDouble("fixedom"));
                //eat1.push_back(res->getDouble("eat1"));
                //eat2.push_back(res->getDouble("eat2"));
                //mcd1.push_back(res->getDouble("mcd1"));
                //mcd2.push_back(res->getDouble("mcd2"));
            }
            delete res;
            delete pstmt;
            //Read conventional generation dynamic table
            pstmt = con->prepareStatement("SELECT * FROM generation_conventional_table WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
            res = pstmt->executeQuery();
            res_meta =res->getMetaData();
            col_count=res_meta->getColumnCount();
            while(res->next()){
                pconcap1.push_back(res->getDouble("pconcap1"));
                pconcap2.push_back(res->getDouble("pconcap2"));
                fuelprice1.push_back(res->getDouble("fuelprice1"));
                fuelprice2.push_back(res->getDouble("fuelprice2"));
                fixedom.push_back(res->getDouble("fixedom"));
                heatrate.push_back(res->getDouble("heatrate"));
                vom.push_back(res->getDouble("vom"));
                p_reserve.push_back(res->getDouble("p_reserve"));
                s_reserve.push_back(res->getDouble("s_reserve"));
                t_reserve.push_back(res->getDouble("t_reserve"));
                carbon_rate.push_back(res->getDouble("carbon_rate"));
                invcost1.push_back(res->getDouble("invcost1"));
                invcost2.push_back(res->getDouble("invcost2"));
                sumderate.push_back(res->getDouble("sumderate"));
                winderate.push_back(res->getDouble("winderate"));
                //eat1.push_back(res->getDouble("eat1"));
                //eat2.push_back(res->getDouble("eat2"));
                //mcd1.push_back(res->getDouble("mcd1"));
                //mcd2.push_back(res->getDouble("mcd2"));
            }
        } 
        catch (sql::SQLException &e) {
            std::cout << "# ERR: SQLException in " << __FILE__;
            std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
            std::cout << "# ERR: " << e.what();
            std::cout << " (MySQL error code: " << e.getErrorCode();
            std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        }
        //Demand scaling
        double scalar1,scalar2;
        double energy1 = std::accumulate(demandprofile1.begin(), demandprofile1.end(), 0.0); 
        double energy2 = std::accumulate(demandprofile2.begin(), demandprofile2.end(), 0.0);
        double peak1 = *std::max_element(demandprofile1.begin(), demandprofile1.end());
        double peak2 = *std::max_element(demandprofile2.begin(), demandprofile2.end());
        scalar1 = (energydemand1-peakdemand1)/(energy1-peak1);
        scalar2 = (energydemand2-peakdemand2)/(energy2-peak2);
        for(int i=0;i<demandprofile1.size();i++){
            demandprofile1[i]=demandprofile1[i]*scalar1;
            demandprofile2[i]=demandprofile2[i]*scalar2;
        }
        //Input data conversion
        common_inputs input_data;
        input_data.NGen =invcost1.size();
        input_data.NGenE=0;
        input_data.NEE=1;
        input_data.ND=1;
        input_data.NR=2;
        input_data.NHyd=1;
        input_data.NS=4;
        input_data.demand.insert(input_data.demand.end(),demandprofile1.begin(),demandprofile1.end());
        input_data.demand.insert(input_data.demand.end(),demandprofile2.begin(),demandprofile2.end());
        std::cout<<input_data.demand.size()<<std::endl;
        input_data.Pl=pconcap1;
        input_data.Ph={hydrocap1};
        input_data.Ad = {demres5};
        input_data.Aee ={enereff5};
        input_data.Ah={hydroinvcost1};
        input_data.Ai=invcost1;
        input_data.Ar={windinvcost1,solarinvcost1};//windinvcost2,solarinvcost2
        input_data.As=invcostpow1;
        input_data.Duration={0.5,1,2,4};
        input_data.EAT={200000,300000,400000,500000};
        input_data.ETACs=chargeeff;
        input_data.ETADs=dischargeeff;
        input_data.Emissions=carbon_rate;
        input_data.FOMs=fixedoms;
        input_data.FPh={0.8};
        input_data.FPr={windfirmpower,solarfirmpower};
        input_data.FPs=firmpow;
        input_data.Fee={enereff7};
        input_data.FuelCost=fuelprice1;
        input_data.Heat_Rates=heatrate;
        input_data.MCD={150000,150000,150000,150000};
        input_data.PResC=p_reserve;
        input_data.PResCh={hydrores1};
        input_data.PResCs={0,0,0,0};
        input_data.PeeM={enereff11};
        input_data.RCs=invcostener1;
        input_data.ReserveDuration={0.25,0.5,1};
        input_data.ReserveRequirements={primaryres1,secondres1,tertiaryres1};
        input_data.ResourceH={hydroEng1_1,hydroEng1_2,hydroEng1_3,hydroEng1_4,hydroEng1_5,hydroEng1_6,hydroEng1_7,hydroEng1_8,hydroEng1_9,hydroEng1_10,hydroEng1_11,hydroEng1_12,hydroEng2_1,hydroEng2_2,hydroEng2_3,hydroEng2_4,hydroEng2_5,hydroEng2_6,hydroEng2_7,hydroEng2_8,hydroEng2_9,hydroEng2_10,hydroEng2_11,hydroEng2_12};
        input_data.ResourceR.insert(input_data.ResourceR.end(),basewind.begin(),basewind.end());
        input_data.ResourceR.insert(input_data.ResourceR.end(),basesolar.begin(),basesolar.end());
        input_data.SResC=s_reserve;
        input_data.SResCh={hydrores2};
        input_data.SResCs={0,0,0,0};
        input_data.SafetyFactor=capplan1;
        input_data.TResC=t_reserve;
        input_data.TResCh={0};
        input_data.TResCs={hydrores3};
        input_data.VCd={demres3};
        input_data.VOM=vom;
        input_data.VOMs=voms1;
        
	const int NGen = input_data.NGen;		//Number of peaking generators
	const int NH = 24;						//Number of hours
	const int NHyd = input_data.NHyd;		//Number of hydro generators
	const int NEE = input_data.NEE;			//Energy efficiency measures
	const int ND = input_data.ND;			//Demand response technologies
	const int NR = input_data.NR;			//Renewable Sources
	const int NS = input_data.NS;			//Storage Technologies
	const int NGenE = input_data.NGenE;		//Existing Thermal Generation
	const int DaysperMonth[12] = { 31,28,31,30,31,30,31,31,30,31,30,31 };
	std::vector<double>	HoursperMonth;
        HoursperMonth.reserve(12);
	int HoursLimits[13] = { 0,0,0,0,0,0,0,0,0,0,0,0,0 };
	for (int i = 0; i < 12; i++)
	{
		HoursperMonth[i] = 24 * DaysperMonth[i];
	}
	for (int i = 1; i < 13; i++)
	{
		for (int j = 0; j < i; j++)
		{
			HoursLimits[i] = HoursLimits[i] + HoursperMonth[j];
		}
	}
	std::vector<double> demand;demand.reserve(24);
	double max_demand = *std::max_element(input_data.demand.begin(), input_data.demand.end());
	//Obtaining and saving maximum and minimum demands for each month.
	double dem_min[12] = { max_demand,max_demand,max_demand,max_demand,max_demand,max_demand,max_demand,max_demand,max_demand,max_demand,max_demand,max_demand };
	double dem_max[12] = { 0,0,0,0,0,0,0,0,0,0,0,0 };
	for (int i = 0; i < 12; i++)
	{
		for (int t = HoursLimits[i]; t < HoursLimits[i + 1]; t++)
		{
			if (input_data.demand[t] <= dem_min[i])
			{
				dem_min[i] = input_data.demand[t];
			}
			if (input_data.demand[t] >= dem_max[i])
			{
				dem_max[i] = input_data.demand[t];
			}
		}
	}
	//Definition of demand curve
	for (int i = 0; i < 12; i++)
	{
		demand[2 * i] = dem_min[i];
		demand[2 * i + 1] = dem_max[i];
	}
	//Sum of existing plant capacity
	double Existing_Cap = std::accumulate(input_data.Pl.begin(), input_data.Pl.end(), 0.0) + std::accumulate(input_data.Ph.begin(), input_data.Ph.end(), 0.0);
	std::vector<double> Fix_Cap; Fix_Cap.reserve(2);		//Fixed capacity for short and mid-short storage (MW)
	Fix_Cap[0] = 0.25*0.25*input_data.ReserveRequirements[0]; Fix_Cap[1] = 0.25*0.75*input_data.ReserveRequirements[0];

	//Input data conversion
	std::vector<double> VCi; VCi.reserve(NGen + NGenE);//Variable costs of thermal generators ($/MWh);
	std::vector<double> EmissionFactor; EmissionFactor.reserve(NGen + NGenE);//Emissions Cost($/MWh)

	for (int i = 0; i < NGen + NGenE; i++)
	{
		VCi[i] = input_data.FuelCost[i] * input_data.Heat_Rates[i] + input_data.VOM[i];
		EmissionFactor[i] = input_data.Emissions[i] * input_data.Heat_Rates[i] * input_data.CarbonPrice;
	}
	std::vector<double> VCF;VCF.reserve(NH*(NGen+NGenE));
	for (int i = 0; i < (NGen + NGenE); i++)
	{
		for (int t = 0; t < NH; t++)
		{
			VCF[NH*i + t] = VCi[i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22));
		}
	}
	std::vector<double> PRCost, SRCost, TRCost;PRCost.reserve(NH*(NGen+NGenE));
        SRCost.reserve(NH*(NGen+NGen));TRCost.reserve(NH*(NGen+NGenE));
	for (int i = 0; i < (NGen + NGenE); i++)
	{
		for (int t = 0; t < NH; t++)
		{
			PRCost[NH*i + t] = input_data.PResC[i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22));
			SRCost[NH*i + t] = input_data.SResC[i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22));
			TRCost[NH*i + t] = input_data.TResC[i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22));
		}
	}
	std::vector<double> PlF;PlF.reserve(NGenE*NH);
	for (int i = 0; i < (NGenE); i++)
	{
		for (int t = 0; t < NH; t++)
		{
			PlF[NH*i + t] = input_data.Pl[i];
		}
	}
	std::vector<double> VCDF;VCDF.reserve(ND*NH);
	for (int i = 0; i < ND; i++)
	{
		for (int t = 0; t < NH; t++)
		{
			VCDF[NH*i + t] = input_data.VCd[i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22));
		}
	}
	std::vector<double> VCRF;VCRF.reserve(NR*NH);
	for (int i = 0; i < NR; i++)
	{
		for (int t = 0; t < NH; t++)
		{
			VCRF[NH*i + t] = 0;
		}
	}
	std::vector<double> VCHF;VCHF.reserve(NHyd*NH);
	for (int i = 0; i < NHyd; i++)
	{
		for (int t = 0; t < NH; t++)
		{
			VCHF[NH*i + t] = 0;
		}
	}
	std::vector<double> PRCostHyd, SRCostHyd, TRCostHyd;PRCostHyd.reserve(NHyd*NH);
        SRCostHyd.reserve(NHyd*NH);TRCostHyd.reserve(NHyd*NH);
	for (int i = 0; i < NHyd; i++)
	{
		for (int t = 0; t < NH; t++)
		{
			PRCostHyd[NH*i + t] = input_data.PResCh[i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22));
			SRCostHyd[NH*i + t] = input_data.SResCh[i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22));
			TRCostHyd[NH*i + t] = input_data.TResCh[i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22));
		}
	}
	std::vector<double> VCSF;VCSF.reserve(NS*NH);
	for (int i = 0; i < NS; i++)
	{
		for (int t = 0; t < NH; t++)
		{
			VCSF[NH*i + t] = input_data.VOMs[i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22));
		}
	}
	std::vector<double> PRCosts, SRCosts, TRCosts;PRCosts.reserve(NS*NH);
        SRCosts.reserve(NS*NH);TRCosts.reserve(NH*NS);
	for (int i = 0; i < NS; i++)
	{
		for (int t = 0; t < NH; t++)
		{
			PRCosts[NH*i + t] = input_data.PResCs[i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22));
			SRCosts[NH*i + t] = input_data.SResCs[i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22));
			TRCosts[NH*i + t] = input_data.TResCs[i] * (HoursperMonth[0] / 2 * (t < 2) + HoursperMonth[1] / 2 * (t < 4)*(t >= 2) + HoursperMonth[2] / 2 * (t < 6)*(t >= 4) + HoursperMonth[3] / 2 * (t < 8)*(t >= 6) + HoursperMonth[4] / 2 * (t < 10)*(t >= 8) + HoursperMonth[5] / 2 * (t < 12)*(t >= 10) + HoursperMonth[6] / 2 * (t < 14)*(t >= 12) + HoursperMonth[7] / 2 * (t < 16)*(t >= 14) + HoursperMonth[8] / 2 * (t < 18)*(t >= 16) + HoursperMonth[9] / 2 * (t < 20)*(t >= 18) + HoursperMonth[10] / 2 * (t < 22)*(t >= 20) + HoursperMonth[11] / 2 * (t >= 22));
		}
	}
	std::vector<double> VCSEF;VCSEF.reserve(NH*NS);
	for (int i = 0; i < NS; i++)
	{
		for (int t = 0; t < NH; t++)
		{
			VCSEF[NH*i + t] = 0;
		}
	}
	std::vector<double> As; As.reserve(NS);
	for (int i = 0; i < NS; i++)
	{
		As[i] = input_data.As[i] + input_data.FOMs[i] - input_data.MCD[i] - input_data.EAT[i];
	}

	//Problem formulation
	int NR_VARIABLES = NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + NGenE + 2 * ND + NR + NHyd + NS * 3 + (NGen + NGenE) * 3 + NHyd * 3 + NS * 3);
	glp_prob* lp = glp_create_prob();
	glp_set_prob_name(lp, "AlternativeAnalysis");
	glp_set_obj_dir(lp, GLP_MIN);
	glp_add_cols(lp, NR_VARIABLES);

	//Cost Vector definition
	std::vector<double> CostCoefficients; CostCoefficients.reserve(NR_VARIABLES);
	CostCoefficients.insert(CostCoefficients.end(), input_data.Ai.begin(), input_data.Ai.end());
	CostCoefficients.insert(CostCoefficients.end(), input_data.Aee.begin(), input_data.Aee.end());
	CostCoefficients.insert(CostCoefficients.end(), input_data.Ad.begin(), input_data.Ad.end());
	CostCoefficients.insert(CostCoefficients.end(), input_data.Ar.begin(), input_data.Ar.end());
	CostCoefficients.insert(CostCoefficients.end(), input_data.Ah.begin(), input_data.Ah.end());
	CostCoefficients.insert(CostCoefficients.end(), As.begin(), As.end());
	CostCoefficients.insert(CostCoefficients.end(), input_data.RCs.begin(), input_data.RCs.end());
	CostCoefficients.insert(CostCoefficients.end(), VCF.begin(), VCF.end());
	CostCoefficients.insert(CostCoefficients.end(), VCDF.begin(), VCDF.end());
	CostCoefficients.insert(CostCoefficients.end(), VCDF.begin(), VCDF.end());
	CostCoefficients.insert(CostCoefficients.end(), VCRF.begin(), VCRF.end());
	CostCoefficients.insert(CostCoefficients.end(), VCHF.begin(), VCHF.end());
	CostCoefficients.insert(CostCoefficients.end(), VCSF.begin(), VCSF.end());
	CostCoefficients.insert(CostCoefficients.end(), VCSF.begin(), VCSF.end());
	CostCoefficients.insert(CostCoefficients.end(), VCSEF.begin(), VCSEF.end());
	CostCoefficients.insert(CostCoefficients.end(), PRCost.begin(), PRCost.end());
	CostCoefficients.insert(CostCoefficients.end(), SRCost.begin(), SRCost.end());
	CostCoefficients.insert(CostCoefficients.end(), TRCost.begin(), TRCost.end());
	CostCoefficients.insert(CostCoefficients.end(), PRCostHyd.begin(), PRCostHyd.end());
	CostCoefficients.insert(CostCoefficients.end(), SRCostHyd.begin(), SRCostHyd.end());
	CostCoefficients.insert(CostCoefficients.end(), TRCostHyd.begin(), TRCostHyd.end());
	CostCoefficients.insert(CostCoefficients.end(), PRCosts.begin(), PRCosts.end());
	CostCoefficients.insert(CostCoefficients.end(), SRCosts.begin(), SRCosts.end());
	CostCoefficients.insert(CostCoefficients.end(), TRCosts.begin(), TRCosts.end());

	//Structural variables (Columns).
	/*	Peaking Capacity			NGen
	Energy Efficiency Investments	NEE
	Demand Response Capacity		ND
	Renewables Capacity				NR
	Hydro Capacity					NHyd
	Storage Power Capacity			NS
	Storage Energy Capacity			NS
	Peaking Generation				NH * NGen
	Existing Generation				NH * NGenE
	Demand Response Up Shifts		NH * ND
	Demand Response Down Shifts		NH * ND
	Renewable Generation			NH * NR
	Hydro generation				NH * NHyd
	Storage Charging				NH * NS
	Storage Discharging				NH * NS
	Stored energy					NH * NS
	Primary reserve peaking			NH * NGen
	Primary reserve existing		NH * NGenE
	Secondary reserve peaking		NH * NGen
	Secondary reserve existing		NH * NGenE
	Tertiary reserve peaking		NH * NGen
	Tertiary reserve existing		NH * NGenE
	Primary reserve hydro			NH * NHyd
	Secondary reserve hydrp			NH * NHyd
	Tertiary reserve hydro			NH * NHyd
	Primary reserve storage			NH * NS
	Secondary reserve storage		NH * NS
	Tertiary reserve storage		NH * NS
	NGen+NEE+ND+NR+NHyd+NS*2+NH*(NGen+NGenE+2*ND+NR+NHyd+NS*3+(NGen+NGenE)*3+NHyd*3+NS*3)
	/**/
        
	int counter = 0;
	for (int i = 0; i < NGen; ++i)
	{
		glp_set_col_bnds(lp, i + 1, GLP_LO, 0.0, 0.0);
		glp_set_obj_coef(lp, i + 1, CostCoefficients[i]);
	}
	counter += NGen;
	for (int i = 0; i < NEE; i++)
	{
		glp_set_col_bnds(lp, i + 1 + counter, GLP_DB, 0.0, input_data.PeeM[i]);
		glp_set_obj_coef(lp, i + 1 + counter, CostCoefficients[i + counter]);
	}
	counter += NEE;
	for (int i = 0; i < ND + NR; i++)
	{
		glp_set_col_bnds(lp, i + 1 + counter, GLP_LO, 0.0, 0.0);
		glp_set_obj_coef(lp, i + 1 + counter, CostCoefficients[i + counter]);
	}
	counter += ND + NR;
	for (int i = 0; i < NHyd; i++)
	{
		glp_set_col_bnds(lp, i + 1 + counter, GLP_LO, input_data.Ph[i], 0.0);
		glp_set_obj_coef(lp, i + 1 + counter, CostCoefficients[i + counter]);
	}
	counter += NHyd;
	for (int i = 0; i < 2; i++)
	{
		glp_set_col_bnds(lp, i + 1 + counter, GLP_FX, Fix_Cap[i], Fix_Cap[i]);
		glp_set_obj_coef(lp, i + 1 + counter, CostCoefficients[i + counter]);
	}
	counter += 2;
	for (int i = 0; i < NS + 2 + NGen * NH; i++)
	{
		glp_set_col_bnds(lp, i + 1 + counter, GLP_LO, 0.0, 0.0);
		glp_set_obj_coef(lp, i + 1 + counter, CostCoefficients[i + counter]);
	}
	counter += NS + 2 + NGen * NH;
	for (int i = 0; i < NGenE*NH; i++)
	{
		glp_set_col_bnds(lp, i + 1 + counter, GLP_DB, 0.0, PlF[i]);
		glp_set_obj_coef(lp, i + 1 + counter, CostCoefficients[i + counter]);
	}
	counter += NGenE * NH;
	for (int i = 0; i < ND * 2 * NH + NR * NH + NS * NH * 3 + (NGen + NGenE) * 3 * NH + NS * NH * 3; i++)
	{
		glp_set_col_bnds(lp, i + 1 + counter, GLP_LO, 0.0, 0.0);
		glp_set_obj_coef(lp, i + 1 + counter, CostCoefficients[i + counter]);
	}

	//Rows definitions
	/*	
        Sufficiency				1			(>=)
	Hourly Balance				NH			(=)
	Final Energy Storage			NS			(=)
	DR Neutrality				ND			(=)
	Storage Inventory			NH * NS			(=)
	Storage fixed sizes			NS			(=)
	Peaking Capacity			NH * NGen		(<=)
	Storage Charge/Discharge Capacity	2 * NH * NS		(<=)
	Storage Energy Capacity			NH * NS			(<=)
	Demand Response Up/Down Capacity	2 * NH * ND		(<=)
	Renewable Capacity			NH * NR			(<=)
	Hydro capacity				NH * NHyd		(<=)
	Hydro energy				12			(<=)
	Existing capacity			NH * NGenE		(<=)
	Sufficient energy for reserves		NH * NS			(<=)
	Maximum storage capacity		1			(<=)
	Hourly reserve provision		NH * 3			(>=)
	14+NH*4+NS*2+ND+NH*NS*5+NH*NGen+2*NH*ND+NH*NR+NH*NHyd+NH*NGenE
	*/
        
	int PROBLEM_SIZE = 14 + NS * 2 + ND + NH * (4 + NGen + 5 * NS + 2 * ND + NR + NGenE + NHyd);
	glp_add_rows(lp, PROBLEM_SIZE+1);

	std::vector<double> Lower_Bounds; Lower_Bounds.reserve(PROBLEM_SIZE);
	std::vector<double> Upper_Bounds; Upper_Bounds.reserve(PROBLEM_SIZE);
	Lower_Bounds[0] = max_demand * (1 + input_data.SafetyFactor) - Existing_Cap;
	Upper_Bounds[0] = 0.0;
	int rowv_counter = 1;
	for (int i = 0; i < NH; i++)
	{
		Lower_Bounds[i + rowv_counter] = demand[i];
		Upper_Bounds[i + rowv_counter] = demand[i];
	}
	rowv_counter += NH;
	for (int i = 0; i < NS * 2 + ND + NH * (NS * 4 + NGen + ND * 2 + NR + NHyd); i++)
	{
		Lower_Bounds[i + rowv_counter] = 0.0;
		Upper_Bounds[i + rowv_counter] = 0.0;
	}
	rowv_counter += NS * 2 + ND + NH * (NS * 4 + NGen + ND * 2 + NR + NHyd);
	for (int i = 0; i < 12; i++)
	{
		Lower_Bounds[i + rowv_counter] = 0.0;
		Upper_Bounds[i + rowv_counter] = input_data.ResourceH[i];
	}
	rowv_counter += 12;
	for (int i = 0; i < NGenE * NH; i++)
	{
		Lower_Bounds[i + rowv_counter] = 0.0;
		Upper_Bounds[i + rowv_counter] = PlF[i];
	}
	rowv_counter += NGenE * NH;
	for (int i = 0; i < NH * NS; i++)
	{
		Lower_Bounds[i + rowv_counter] = 0.0;
		Upper_Bounds[i + rowv_counter] = 0.0;
	}
	rowv_counter += NS * NH;
	Lower_Bounds[rowv_counter] = 0.0;
	Upper_Bounds[rowv_counter] = 0.1*max_demand*(1 + input_data.SafetyFactor);
	rowv_counter += 1;
	for (int i = 0; i < 3; i++)
	{
		for (int j = 0; j < NH; j++)
		{
			Lower_Bounds[rowv_counter + i * NH + j] = input_data.ReserveRequirements[i];
			Upper_Bounds[rowv_counter + i * NH + j] = 0.0;
		}
	}
        rowv_counter+=NH*3;
	int rowb_counter = 0;
	glp_set_row_bnds(lp, 1, GLP_LO, Lower_Bounds[0], Upper_Bounds[0]);
	rowb_counter += 1;
	for (int i = 0; i < NH + NS + ND + NH * NS + NS; i++)
	{
		glp_set_row_bnds(lp, rowb_counter + 1 + i, GLP_FX, Lower_Bounds[i + rowb_counter], Upper_Bounds[i + rowb_counter]);
	}
	rowb_counter += NH + NS + ND + NH * NS + NS;
	for (int i = 0; i < 13 + NH * (NGen + NS * 4 + ND * 2 + NR + NHyd + NGenE); i++)
	{
		glp_set_row_bnds(lp, rowb_counter + 1 + i, GLP_UP, Lower_Bounds[i + rowb_counter], Upper_Bounds[i + rowb_counter]);
	}
	rowb_counter += 13 + NH * (NGen + NS * 4 + ND * 2 + NR + NHyd + NGenE);
	for (int i = 0; i < NH * 3; i++)
	{
		glp_set_row_bnds(lp, rowb_counter + 1 + i, GLP_LO, Lower_Bounds[i + rowb_counter], Upper_Bounds[i + rowb_counter]);
	}
        
	//Matrix definition. Same order as rows and columns.
	//Rows
	/*					Non Zero Elements
	Sufficiency				NGen+NR+NS+NHyd				(>=)
	Hourly Balance				NH * (NGen+NGenE+NR+NS*2+ND*2+NEE+NHyd)	(=)
	Final Energy Storage			NS * 2					(=)
	DR Neutrality				ND * (NH*2)				(=)
	Storage Inventory			NS * NH * 4				(=)
	Storage fixed sizes			NS * 2					(=)
	Peaking Capacity			NH * NGen * 5				(<=)
	Storage Charge/Discharge Capacity	NH * NS * 2 * 5				(<=)
	Storage Energy Capacity			NH * NS * 2				(<=)
	Demand Response Up/Down Capacity	NH * ND * 2 * 2				(<=)
	Renewable Capacity			NH * NR * 2				(<=)
	Hydro capacity				NH * NHyd * 5				(<=)
	Hydro energy				12 * NHyd * 2				(<=)
	Existing capacity			NH * NGenE * 4				(<=)
	Sufficient energy for reserves		NH * NS * 5				(<=)
	Maximum storage capacity		NS					(<=)
	Hourly reserve provision		NH * 3	* (NGen+NGenE+NS+NHyd)		(>=)
	*/
        
	const int NonZeroElements = NGen + NR + NS + NHyd + NH * (NGen + NGenE + NR + NS * 2 + ND * 2 + NEE + NHyd) + NS * 5 + ND * NH * 2 + NS * NH * 19 + NH * NGen * 5 + NH * ND * 4 + NH * NR * 2 + NH * NHyd * 5 + 12 * NHyd * 2 + NH * NGenE * 4 + NH * NS * 5 + NS + 3 * (NH * (NGen + NGenE + NS + NHyd)); //Number of NZE of matrix
        std::cout<<"NZE: "<<NonZeroElements<<std::endl;
	int Row_Indexes[NonZeroElements + 1], Col_Indexes[NonZeroElements + 1];
	//std::array<int,NonZeroElements> Row_Indexes, Col_Indexes;
	double Mat_Elements[NonZeroElements + 1];
	//std::array<double,NonZeroElements> Mat_Elements;
	int NZEcounter = 0;
	int ROWcounter = 0;

        
	//System adequacy
	for (int i = 0; i < NGen + NR + NS + NHyd; i++)
	{
		Row_Indexes[i + 1] = 1;
		if (i<NGen)
		{
			Col_Indexes[i + 1] = i + 1;
			Mat_Elements[i + 1] = 1.0;
		}
		else if (i<NGen + NR)
		{
			Col_Indexes[i + 1] = i + 1 + NEE + ND;
			Mat_Elements[i + 1] = input_data.FPr[i - NGen + 1];
		}
		else if (i<NGen + NR + NHyd)
		{
			Col_Indexes[i + 1] = i + 1 + NEE + ND;
			Mat_Elements[i + 1] = input_data.FPh[i - NGen - NR];
		}
		else
		{
			Col_Indexes[i + 1] = i + 1 + NEE + ND;
			Mat_Elements[i + 1] = input_data.FPs[i + 1 - NGen - NR - NHyd];
		}
	}
	NZEcounter = NZEcounter + NGen + NR + NS + NHyd;
	ROWcounter = ROWcounter + 1;     
        
	//Hourly Balance
	for (int i = 0; i < NH; i++){
		for (int j = 0; j < NGen + NGenE + NR + NS * 2 + ND * 2 + NEE + NHyd; j++){
			Row_Indexes[j + 1 + NZEcounter] = ROWcounter + 1 + i;
			if (j < NEE)
			{
				Col_Indexes[j + 1 + NZEcounter] = j + NGen + 1;
				Mat_Elements[j + 1 + NZEcounter] = demand[i] * (input_data.Fee[j] / input_data.PeeM[j]);
			}
			else if (j < NEE + NGen + NGenE)
			{
				Col_Indexes[j + 1 + NZEcounter] = NGen + NEE + ND + NR + NHyd + NS * 2 + 1 + NH * (j - NEE) + (i);
				Mat_Elements[j + 1 + NZEcounter] = 1.0;
			}
			else if (j < NEE + NGen + NGenE + ND)
			{
				Col_Indexes[j + 1 + NZEcounter] = NGen + NEE + ND + NR + NHyd + NS * 2 + 1 + (NGen + NGenE)*NH + NH * (j - NEE - NGen - NGenE) + (i);
				Mat_Elements[j + 1 + NZEcounter] = -1.0;
			}
			else if (j < NEE + NGen + NGenE + ND * 2 + NR + NHyd)
			{
				Col_Indexes[j + 1 + NZEcounter] = NGen + NEE + ND + NR + NHyd + NS * 2 + 1 + (NGen + NGenE)*NH + ND * NH + NH * (j - NEE - NGen - NGenE - ND) + (i);
				Mat_Elements[j + 1 + NZEcounter] = 1.0;
			}
			else if (j < NEE + NGen + NGenE + ND * 2 + NR + NHyd + NS)
			{
				Col_Indexes[j + 1 + NZEcounter] = NGen + NEE + ND + NR + NHyd + NS * 2 + 1 + (NGen + NGenE)*NH + ND * NH * 2 + NR * NH + NHyd * NH + NH * (j - NEE - NGen - NGenE - ND * 2 - NR - NHyd) + (i);
				Mat_Elements[j + 1 + NZEcounter] = -1.0;
			}
			else
			{
				Col_Indexes[j + 1 + NZEcounter] = NGen + NEE + ND + NR + NHyd + NS * 2 + 1 + (NGen + NGenE)*NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH + NH * (j - NEE - NGen - NGenE - ND * 2 - NR - NHyd - NS) + (i);
				Mat_Elements[j + 1 + NZEcounter] = 1.0;
			}
                }
                NZEcounter += (NGen + NGenE + NR + NHyd + NS * 2 + ND * 2 + NEE);
	}
	ROWcounter = ROWcounter + NH;
        
	//Final Energy Storage
	for (int i = 0; i < NS; i++)
	{
		Row_Indexes[NZEcounter + 1] = ROWcounter + 1 + i;
		Row_Indexes[NZEcounter + 2] = ROWcounter + 1 + i;
		Col_Indexes[NZEcounter + 1] = NGen + NEE + ND + NR + NHyd + NS + i + 1;
		Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + NGenE + ND * 2 + NR + NHyd + NS * 2) + NH * (i + 1) - 1;
		Mat_Elements[NZEcounter + 1] = 0.5;
		Mat_Elements[NZEcounter + 2] = -1.0;
		NZEcounter = NZEcounter + 2;
	}
	ROWcounter = ROWcounter + NS;
        
	//DR Neutrality
	for (int i = 0; i < ND; i++)
	{
		for (int j = 0; j < NH * 2; j++)
		{
			Row_Indexes[NZEcounter + 1 + j] = ROWcounter + 1 + i;
			if (j < NH)
			{
				Col_Indexes[NZEcounter + 1 + j] = NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen + NGenE)*NH + NH * i + j + 1;
				Mat_Elements[NZEcounter + 1 + j] = 1.0;
			}
			else
			{
				Mat_Elements[NZEcounter + 1 + j] = -1.0;
				Col_Indexes[NZEcounter + 1 + j] = NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen + NGenE)*NH + NH * i + j + NH * (ND - 1) + 1;
			}
		}
		NZEcounter = NZEcounter + 2 * NH;
	}
	ROWcounter = ROWcounter + ND;
        
	//Storage Inventory
	for (int i = 0; i < NS; i++)
	{
		for (int j = 0; j < NH; j++)
		{
			for (int k = 0; k < 4; k++)
			{
				Row_Indexes[NZEcounter + 1 + k] = ROWcounter + 1;
			}
			if (j == 0)
			{
				Col_Indexes[NZEcounter + 1] = NGen + NEE + ND + NR + NHyd + NS + i + 1;
				Col_Indexes[NZEcounter + 2] = NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen + NGenE)*NH + ND * NH * 2 + NR * NH + NHyd * NH + NH * i + 1;
				Col_Indexes[NZEcounter + 3] = NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen + NGenE)*NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH + NH * i + 1;
				Col_Indexes[NZEcounter + 4] = NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen + NGenE)*NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH * 2 + NH * i + 1;
				Mat_Elements[NZEcounter + 1] = -0.5;
				Mat_Elements[NZEcounter + 2] = -input_data.ETACs[i];
				Mat_Elements[NZEcounter + 3] = 1 / input_data.ETADs[i];
				Mat_Elements[NZEcounter + 4] = 1.0;
			}
			else
			{
				Col_Indexes[NZEcounter + 1] = NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen + NGenE)*NH + ND * 2 * NH + NR * NH + NHyd * NH + (i)*NH + j + 1;
				Col_Indexes[NZEcounter + 2] = NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen + NGenE)*NH + ND * 2 * NH + NR * NH + NHyd * NH + (i)*NH + j + 1 + NS * NH;
				Col_Indexes[NZEcounter + 3] = NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen + NGenE)*NH + ND * 2 * NH + NR * NH + NHyd * NH + (i)*NH + j + 1 + NS * NH * 2;
				Col_Indexes[NZEcounter + 4] = NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen + NGenE)*NH + ND * 2 * NH + NR * NH + NHyd * NH + (i)*NH + j + 1 + NS * NH * 2 - 1;
				Mat_Elements[NZEcounter + 1] = -input_data.ETACs[i];
				Mat_Elements[NZEcounter + 2] = 1 / input_data.ETADs[i];
				Mat_Elements[NZEcounter + 3] = 1.0;
				Mat_Elements[NZEcounter + 4] = -1.0;
			}
			NZEcounter = NZEcounter + 4;
			ROWcounter = ROWcounter + 1;
		}
	}
        
	//Storage fixed sizes
	for (int i = 0; i < NS; i++)
	{
		Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
		Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
		Col_Indexes[NZEcounter + 1] = NGen + NEE + ND + NR + NHyd + i + 1;
		Col_Indexes[NZEcounter + 2] = NGen + NEE + ND + NR + NHyd + NS + i + 1;
		Mat_Elements[NZEcounter + 1] = 1.0;
		Mat_Elements[NZEcounter + 2] = -input_data.Duration[i];
		NZEcounter = NZEcounter + 2;
		ROWcounter = ROWcounter + 1;
	}
        
	//Peaking Capacity
	for (int i = 0; i < NGen; i++)
	{
		for (int j = 0; j < NH; j++)
		{
			Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
			Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
			Row_Indexes[NZEcounter + 3] = ROWcounter + 1;
			Row_Indexes[NZEcounter + 4] = ROWcounter + 1;
			Row_Indexes[NZEcounter + 5] = ROWcounter + 1;
			Col_Indexes[NZEcounter + 1] = i + 1;
			Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + i * NH + j;
			Col_Indexes[NZEcounter + 3] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + NGenE + ND * 2 + NR + NHyd + NS * 3) + i * NH + j;
			Col_Indexes[NZEcounter + 4] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + NGenE + ND * 2 + NR + NHyd + NS * 3) + NH * (NGen + NGenE) + i * NH + j;
			Col_Indexes[NZEcounter + 5] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + NGenE + ND * 2 + NR + NHyd + NS * 3) + NH * (NGen + NGenE) * 2 + i * NH + j;
			Mat_Elements[NZEcounter + 1] = -1.0;
			Mat_Elements[NZEcounter + 2] = 1.0;
			Mat_Elements[NZEcounter + 3] = 1.0;
			Mat_Elements[NZEcounter + 4] = 1.0;
			Mat_Elements[NZEcounter + 5] = 1.0;
			NZEcounter = NZEcounter + 5;
			ROWcounter = ROWcounter + 1;
		}
	}
        
	//Storage Charge / Discharge Capacity
	for (int i = 0; i < NS; i++)
	{
		for (int j = 0; j < NH; j++)
		{
			Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
			Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
			Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + NR + NHyd + i;
			Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen + NGenE) * NH + ND * NH * 2 + NR * NH + NHyd * NH + i * NH + j;
			Mat_Elements[NZEcounter + 1] = -1.0;
			Mat_Elements[NZEcounter + 2] = 1.0;
			NZEcounter = NZEcounter + 2;
			ROWcounter = ROWcounter + 1;
		}
	}
	for (int i = 0; i < NS; i++)
	{
		for (int j = 0; j < NH; j++)
		{
			Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
			Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
			Row_Indexes[NZEcounter + 3] = ROWcounter + 1;
			Row_Indexes[NZEcounter + 4] = ROWcounter + 1;
			Row_Indexes[NZEcounter + 5] = ROWcounter + 1;
			Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + NR + NHyd + i;
			Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen + NGenE) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH + i * NH + j;
			Col_Indexes[NZEcounter + 3] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen + NGenE) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH * 3 + NH * (NGen + NGenE) * 3 + NHyd * NH * 3 + i * NH + j;
			Col_Indexes[NZEcounter + 4] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen + NGenE) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH * 3 + NH * (NGen + NGenE) * 3 + NHyd * NH * 3 + NS * NH + i * NH + j;
			Col_Indexes[NZEcounter + 5] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen + NGenE) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH * 3 + NH * (NGen + NGenE) * 3 + NHyd * NH * 3 + NS * NH * 2 + i * NH + j;
			Mat_Elements[NZEcounter + 1] = -1.0;
			Mat_Elements[NZEcounter + 2] = 1.0;
			Mat_Elements[NZEcounter + 3] = 1.0;
			Mat_Elements[NZEcounter + 4] = 1.0;
			Mat_Elements[NZEcounter + 5] = 1.0;
			NZEcounter = NZEcounter + 5;
			ROWcounter = ROWcounter + 1;
		}
	}

	//Storage Energy Capacity
	for (int i = 0; i < NS; i++)
	{
		for (int j = 0; j < NH; j++)
		{
			Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
			Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
			Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + NR + NHyd + NS + i;
			Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen + NGenE) * NH + ND * NH * 2 + NR * NH + NHyd * NH + NS * NH * 2 + i * NH + j;
			Mat_Elements[NZEcounter + 1] = -1.0;
			Mat_Elements[NZEcounter + 2] = 1.0;
			NZEcounter = NZEcounter + 2;
			ROWcounter = ROWcounter + 1;
		}
	}

	//Demand Response Up / Down Capacity
	for (int i = 0; i < ND; i++)
	{
		for (int j = 0; j < NH; j++)
		{
			Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
			Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
			Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + i;
			Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen + NGenE) * NH + i * NH + j;
			Mat_Elements[NZEcounter + 1] = -1.0;
			Mat_Elements[NZEcounter + 2] = 1.0;
			NZEcounter = NZEcounter + 2;
			ROWcounter = ROWcounter + 1;
		}
	}
	for (int i = 0; i < ND; i++)
	{
		for (int j = 0; j < NH; j++)
		{
			Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
			Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
			Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + i;
			Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen + NGenE) * NH + ND * NH + i * NH + j;
			Mat_Elements[NZEcounter + 1] = -1.0;
			Mat_Elements[NZEcounter + 2] = 1.0;
			NZEcounter = NZEcounter + 2;
			ROWcounter = ROWcounter + 1;
		}
	}

	//Renewable Capacity
	for (int i = 0; i < NR; i++)
	{
		for (int j = 0; j < NH; j++)
		{
			Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
			Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
			Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + i;
			Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen + NGenE) * NH + ND * NH * 2 + i * NH + j;
			Mat_Elements[NZEcounter + 1] = -1.0 * input_data.ResourceR[i * NH + j];
			Mat_Elements[NZEcounter + 2] = 1.0;
			NZEcounter = NZEcounter + 2;
			ROWcounter = ROWcounter + 1;
		}
	}

	//Hydro capacity
	for (int i = 0; i < NHyd; i++)
	{
		for (int j = 0; j < NH; j++)
		{
			Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
			Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
			Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + NR + i;
			Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + (NGen + NGenE) * NH + ND * NH * 2 + NR * NH + i * NH + j;
			Mat_Elements[NZEcounter + 1] = -1.0;
			Mat_Elements[NZEcounter + 2] = 1.0;
			NZEcounter = NZEcounter + 2;
			ROWcounter = ROWcounter + 1;
		}
	}

	//Hydro energy
	for (int i = 0; i < 12; i++)
	{
		Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
		Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
		Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + NGenE + ND * 2 + NR) + i * 2 + 1;
		Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + NGenE + ND * 2 + NR) + i * 2 + 2;
		Mat_Elements[NZEcounter + 1] = 1.0;
		Mat_Elements[NZEcounter + 2] = 1.0;
		NZEcounter += 2;
		ROWcounter++;
	}

	//Existing capacity
	for (int i = 0; i < NGen; i++)
	{
		for (int j = 0; j < NH; j++)
		{
			Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
			Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
			Row_Indexes[NZEcounter + 3] = ROWcounter + 1;
			Row_Indexes[NZEcounter + 4] = ROWcounter + 1;
			Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NGen * NH + i * NH + j;
			Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + NGenE + ND * 2 + NR + NHyd + NS * 3) + NGen * NH + i * NH + j;
			Col_Indexes[NZEcounter + 3] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + NGenE + ND * 2 + NR + NHyd + NS * 3) + (NGen * 2 + NGenE) * NH + i * NH + j;
			Col_Indexes[NZEcounter + 4] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + NGenE + ND * 2 + NR + NHyd + NS * 3) + NH * (NGen + NGenE) * 2 + NGen * NH + i * NH + j;
			Mat_Elements[NZEcounter + 1] = 1.0;
			Mat_Elements[NZEcounter + 2] = 1.0;
			Mat_Elements[NZEcounter + 3] = 1.0;
			Mat_Elements[NZEcounter + 4] = 1.0;
			NZEcounter = NZEcounter + 4;
			ROWcounter = ROWcounter + 1;
		}
	}

	//Sufficient energy for reserves
	for (int i = 0; i < NS; i++)
	{
		for (int j = 0; j < NH; j++)
		{
			Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
			Row_Indexes[NZEcounter + 2] = ROWcounter + 1;
			Row_Indexes[NZEcounter + 3] = ROWcounter + 1;
			Row_Indexes[NZEcounter + 4] = ROWcounter + 1;
			Row_Indexes[NZEcounter + 5] = ROWcounter + 1;
			Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + NGenE + ND * 2 + NR + NHyd + NS) + NH * i + j;
			Col_Indexes[NZEcounter + 2] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + NGenE + ND * 2 + NR + NHyd + NS * 3 + (NGen + NGenE + NHyd) * 3) + NH * i + j;
			Col_Indexes[NZEcounter + 3] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + NGenE + ND * 2 + NR + NHyd + NS * 3 + (NGen + NGenE + NHyd) * 3 + NS) + NH * i + j;
			Col_Indexes[NZEcounter + 4] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + NGenE + ND * 2 + NR + NHyd + NS * 3 + (NGen + NGenE + NHyd) * 3 + NS * 2) + NH * i + j;
			Col_Indexes[NZEcounter + 5] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + NGenE + ND * 2 + NR + NHyd + NS * 2) + NH * i + j;
			Mat_Elements[NZEcounter + 1] = 1.0;
			Mat_Elements[NZEcounter + 2] = input_data.ReserveDuration[0];
			Mat_Elements[NZEcounter + 3] = input_data.ReserveDuration[1];
			Mat_Elements[NZEcounter + 4] = input_data.ReserveDuration[2];
			Mat_Elements[NZEcounter + 5] = -1.0;
			NZEcounter = NZEcounter + 5;
			ROWcounter = ROWcounter + 1;
		}
	}

	//Max Storage Capacity
	for (int i = 0; i < NS; i++)
	{
		Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
		Col_Indexes[NZEcounter + 1] = NGen + NEE + ND + NR + NHyd + i + 1;
		Mat_Elements[NZEcounter + 1] = 1.0;
		NZEcounter += 1;
	}
	ROWcounter++;

	//Hourly reserve provision
	for (int i = 0; i < 3; i++)
	{
		for (int t = 0; t < NH; t++)
		{
			for (int j = 0; j < NGen; j++)
			{
				Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
				Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + NGenE + ND * 2 + NR + NHyd + NS * 3 + (NGen + NGenE)*i) + j * NH + t;
				Mat_Elements[NZEcounter + 1] = 1.0;
				NZEcounter = NZEcounter + 1;
			}
			for (int j = 0; j < NGenE; j++)
			{
				Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
				Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + NGenE + ND * 2 + NR + NHyd + NS * 3 + NGen + (NGen + NGenE)*i) + j * NH + t;
				Mat_Elements[NZEcounter + 1] = 1.0;
				NZEcounter = NZEcounter + 1;
			}
			for (int j = 0; j < NHyd; j++)
			{
				Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
				Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + NGenE + ND * 2 + NR + NHyd + NS * 3 + (NGen + NGenE) * 3) + NH * NHyd * i + j * NH + t;
				Mat_Elements[NZEcounter + 1] = 1.0;
				NZEcounter = NZEcounter + 1;
			}
			for (int j = 0; j < NS; j++)
			{
				Row_Indexes[NZEcounter + 1] = ROWcounter + 1;
				Col_Indexes[NZEcounter + 1] = 1 + NGen + NEE + ND + NR + NHyd + NS * 2 + NH * (NGen + NGenE + ND * 2 + NR + NHyd + NS * 3 + (NGen + NGenE) * 3 + NHyd * 3 + NS * i) + j * NH + t;
				Mat_Elements[NZEcounter + 1] = 1.0;
				NZEcounter = NZEcounter + 1;
			}
			ROWcounter = ROWcounter + 1;
		}
	}
        
	const int * Row_Ind, *Col_Ind;
	const double *Mat_Ele;
	Row_Ind = &Row_Indexes[0];
	Col_Ind = &Col_Indexes[0];
	Mat_Ele = &Mat_Elements[0];

	glp_load_matrix(lp, NZEcounter, Row_Ind, Col_Ind, Mat_Ele);

	glp_smcp param;
	glp_init_smcp(&param);
	param.msg_lev = GLP_MSG_ERR;
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

	glp_simplex(lp, &param);

	std::vector<double> variables(NR_VARIABLES, 0);
	//Obtaining optimal values of variables
	for (int i = 0; i < NR_VARIABLES; ++i)
	{
		variables[i] = glp_get_col_prim(lp, i + 1);
	}
	int extract_counter = 0;
	AA_outputs results;
        results.P_peak.reserve(NGen);
	for (int i = 0; i < NGen; i++) //Peaking plants capacity
	{
		results.P_peak[i] = variables[i];
		extract_counter = extract_counter + 1;
	}
        results.P_ee.reserve(NEE);
	for (int i = 0; i < NEE; i++) //Energy efficiency capacity
	{
		results.P_ee[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NEE;
        results.P_DR.reserve(ND);
	for (int i = 0; i < ND; i++) //Demand response capacity
	{
		results.P_DR[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + ND;
        results.P_R.reserve(NR);
	for (int i = 0; i < NR; i++) //Renewables capacity
	{
		results.P_R[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NR;
        results.P_H.reserve(NHyd);
	for (int i = 0; i < NHyd; i++) //Hydro capacity
	{
		results.P_H[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NHyd;
        results.P_S.reserve(NS);
	for (int i = 0; i < NS; i++) //Storage capacity
	{
		results.P_S[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NS;
        results.E_S.reserve(NS);
	for (int i = 0; i < NS; i++) //Storage energy capacity
	{
		results.E_S[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NS;
        results.G_peak.reserve(NGen*NH);
	for (int i = 0; i < NGen * NH; i++) //Peaking plants generation
	{
		results.G_peak[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NGen * NH;
        results.G_exist.reserve(NGenE*NH);
	for (int i = 0; i < NGenE * NH; i++) //Existing plants generation
	{
		results.G_exist[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NGenE * NH;
        results.DR_up.reserve(ND*NH);
        results.DR_dn.reserve(ND*NH);
	for (int i = 0; i < ND * NH; i++) //Demand response up-shifts
	{
		results.DR_up[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + ND * NH;
	for (int i = 0; i < ND * NH; i++) //Demand response down-shifts
	{
		results.DR_dn[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + ND * NH;
        results.G_ren.reserve(NR*NH);
	for (int i = 0; i < NR * NH; i++) //Renewables generation
	{
		results.G_ren[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NR * NH;
        results.G_CS.reserve(NS*NH);
        results.G_DS.reserve(NS*NH);
        results.E_ST.reserve(NS*NH);
	for (int i = 0; i < NS * NH; i++) //Storage charging
	{
		results.G_CS[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NS * NH;
	for (int i = 0; i < NS * NH; i++) //Storage discharging
	{
		results.G_DS[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NS * NH;
	for (int i = 0; i < NS * NH; i++) //Stored energy
	{
		results.E_ST[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NS * NH;
        results.RP_peak.reserve(NGen*NH);
        results.RP_hyd.reserve(NHyd*NH);
        results.RP_exist.reserve(NGenE*NH);
        results.RP_sto.reserve(NS*NH);
	for (int i = 0; i < NGen * NH; i++) //Peaking plants primary reserve
	{
		results.RP_peak[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NGen * NH;
	for (int i = 0; i < NGenE * NH; i++) //Existing plants primary reserve
	{
		results.RP_exist[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NGenE * NH;
        results.RS_exist.reserve(NGenE*NH);
        results.RS_hyd.reserve(NHyd*NH);
        results.RS_peak.reserve(NGen*NH);
        results.RS_sto.reserve(NS*NH);
	for (int i = 0; i < NGen * NH; i++) //Peaking plants secondary reserve
	{
		results.RS_peak[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NGen * NH;
	for (int i = 0; i < NGenE * NH; i++) //Existing plants secondary reserve
	{
		results.RS_exist[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NGenE * NH;
        results.RT_exist.reserve(NGenE*NH);
        results.RT_hyd.reserve(NHyd*NH);
        results.RT_peak.reserve(NGen*NH);
        results.RT_sto.reserve(NS*NH);
	for (int i = 0; i < NGen * NH; i++) //Peaking plants tertiary reserve
	{
		results.RT_peak[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NGen * NH;
	for (int i = 0; i < NGenE * NH; i++) //Existing plants tertiary reserve
	{
		results.RT_exist[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NGenE * NH;
	for (int i = 0; i < NHyd * NH; i++) //Hydro plants primary reserve
	{
		results.RP_hyd[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NHyd * NH;
	for (int i = 0; i < NHyd * NH; i++) //Hydro plants secondary reserve
	{
		results.RS_hyd[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NHyd * NH;
	for (int i = 0; i < NHyd * NH; i++) //Hydro plants tertiary reserve
	{
		results.RT_hyd[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NS * NH;
	for (int i = 0; i < NS * NH; i++) //Storage plants primary reserve
	{
		results.RP_sto[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NS * NH;
	for (int i = 0; i < NS * NH; i++) //Storage plants secondary reserve
	{
		results.RS_sto[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NS * NH;
	for (int i = 0; i < NS * NH; i++) //Storage plants tertiary reserve
	{
		results.RT_sto[i] = variables[i + extract_counter];
	}
	extract_counter = extract_counter + NS * NH;

	//Obtaining dual variables
	results.CapacityPrice = glp_get_row_dual(lp, 1);
	results.max_ES_cap = glp_get_row_dual(lp, 1 + PROBLEM_SIZE - NH * 3 - 1);
        results.energyPrice.reserve(NH);
        results.RP_price.reserve(NH);
        results.RS_price.reserve(NH);
        results.RT_price.reserve(NH);
	for (int i = 0; i < NH; ++i)
	{
		results.energyPrice[i] = glp_get_row_dual(lp, i + 2);
		results.RP_price[i] = glp_get_row_dual(lp, 1 + PROBLEM_SIZE - NH * 3 + i);
		results.RS_price[i] = glp_get_row_dual(lp, 1 + PROBLEM_SIZE - NH * 2 + i);
		results.RT_price[i] = glp_get_row_dual(lp, 1 + PROBLEM_SIZE - NH * 1 + i);
	}
	glp_delete_prob(lp);
        int status=5001;
        
        try {
            sql::Driver *driver;
            sql::Connection *con;
            sql::Statement *stmt;
            sql::ResultSet *res;
            sql::PreparedStatement *pstmt;
            sql::ResultSetMetaData *res_meta;
            
            driver = get_driver_instance();
            con = driver->connect("127.0.0.1:3306", "acelerex", "@acelerex!123");
            // Connect to the MySQL database 
            con->setSchema("irena_storage_benefits_tool");
            //Write installed ESS power capacity
            pstmt = con->prepareStatement("SELECT * FROM installed_capacity_output_es_cap_tables WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
            res = pstmt->executeQuery();
            if (res->next()){
                //UPDATE
                for(int i=0;i<results.P_S.size();i++){
                    delete pstmt;
                    pstmt = con->prepareStatement("UPDATE installed_capacity_output_es_cap_tables SET outinst1=?,outinst2=? WHERE scenario_and_cases_row_id=?");
                    pstmt->setDouble(1, results.P_S[i]);
                    pstmt->setDouble(2,results.P_S[i]);
                    pstmt->setInt(3,scenario_and_cases_row_id);
                    pstmt->executeUpdate();
                }
            }
            else{
                //INSERT
                for(int i=0;i<results.P_S.size();i++){
                    delete pstmt;
                    pstmt = con->prepareStatement("INSERT INTO installed_capacity_output_es_cap_tables(outinst1,outinst2,scenario_and_cases_row_id) VALUES (?,?,?)");
                    pstmt->setDouble(1, results.P_S[i]);
                    pstmt->setDouble(2,results.P_S[i]);
                    pstmt->setInt(3,scenario_and_cases_row_id);
                    pstmt->executeUpdate();
                }
            }
            delete res;
            delete pstmt;
            //Write demand side installed capacity
            pstmt = con->prepareStatement("SELECT * FROM demand_side_output_installed_cap_tables WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
            res = pstmt->executeQuery();
            delete pstmt;
            if (res->next()){
                //UPDATE
                pstmt = con->prepareStatement("UPDATE demand_side_output_installed_cap_tables SET outeff1=?,outdem1=? WHERE scenario_and_cases_row_id=?");
                pstmt->setDouble(1, results.P_ee[0]);
                pstmt->setDouble(2, results.P_DR[0]);
                pstmt->setInt(3,scenario_and_cases_row_id);
                pstmt->executeUpdate();
            }
            else{
                //INSERT
                pstmt = con->prepareStatement("INSERT INTO demand_side_output_installed_cap_tables(outeff1,outdem2,scenario_and_cases_row_id) VALUES (?,?,?)");
                pstmt->setDouble(1,500);// results.P_ee[0]);
                pstmt->setDouble(2,500);//results.P_DR[0]);
                pstmt->setInt(3,scenario_and_cases_row_id);
                pstmt->executeUpdate();
            }
            delete res;
            delete pstmt;
            //Write ESS installed energy capacity
            pstmt = con->prepareStatement("SELECT * FROM energy_capacity_output_es_cap_tables WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
            res = pstmt->executeQuery();
            if (res->next()){
                //UPDATE
                for(int i=0;i<results.P_S.size();i++){
                    delete pstmt;
                    pstmt = con->prepareStatement("UPDATE energy_capacity_output_es_cap_tables SET outener1=?,outener2=? WHERE scenario_and_cases_row_id=?");
                    pstmt->setDouble(1, results.E_S[i]);
                    pstmt->setDouble(2,results.E_S[i]);
                    pstmt->setInt(3,scenario_and_cases_row_id);
                    pstmt->executeUpdate();
                }
            }
            else{
                //INSERT
                for(int i=0;i<results.P_S.size();i++){
                    delete pstmt;
                    pstmt = con->prepareStatement("INSERT INTO energy_capacity_output_es_cap_tables(outener1,outener2,scenario_and_cases_row_id) VALUES (?,?,?)");
                    pstmt->setDouble(1, results.E_S[i]);
                    pstmt->setDouble(2,results.E_S[i]);
                    pstmt->setInt(3,scenario_and_cases_row_id);
                    pstmt->executeUpdate();
                }
            }
            delete res;
            delete pstmt;
            //Write hydro dam installed capacity
            pstmt = con->prepareStatement("SELECT * FROM hydro_generation_output_installed_cap_tables WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
            res = pstmt->executeQuery();
            if (res->next()){
                //UPDATE
                delete pstmt;
                pstmt = con->prepareStatement("UPDATE hydro_generation_output_installed_cap_tables SET outdam1=?,outdam2=? WHERE scenario_and_cases_row_id=?");
                pstmt->setDouble(1, results.P_H[0]);
                pstmt->setDouble(2,results.P_H[0]);
                pstmt->setInt(3,scenario_and_cases_row_id);
                pstmt->executeUpdate();
            }
            else{
                //INSERT
                delete pstmt;
                pstmt = con->prepareStatement("INSERT INTO hydro_generation_output_installed_cap_tables(outdam1,outdam2,scenario_and_cases_row_id) VALUES (?,?,?)");
                pstmt->setDouble(1, results.P_H[0]);
                pstmt->setDouble(2,results.P_H[0]);
                pstmt->setInt(3,scenario_and_cases_row_id);
                pstmt->executeUpdate();
            }
            //Write Thermal installed capacity
            pstmt = con->prepareStatement("SELECT * FROM installed_capacity_output_es_cap_tables WHERE scenario_and_cases_row_id = " + std::to_string(scenario_and_cases_row_id));
            res = pstmt->executeQuery();
            if (res->next()){
                //UPDATE
                for(int i=0;i<results.P_peak.size();i++){
                    delete pstmt;
                    pstmt = con->prepareStatement("UPDATE installed_capacity_output_es_cap_tables SET outinst1=?,outinst2=? WHERE scenario_and_cases_row_id=?");
                    pstmt->setDouble(1, results.P_peak[i]);
                    pstmt->setDouble(2,results.P_peak[i]);
                    pstmt->setInt(3,scenario_and_cases_row_id);
                    pstmt->executeUpdate();
                }
            }
            else{
                //INSERT
                for(int i=0;i<results.P_S.size();i++){
                    delete pstmt;
                    pstmt = con->prepareStatement("INSERT INTO installed_capacity_output_es_cap_tables(outinst1,outinst2,scenario_and_cases_row_id) VALUES (?,?,?)");
                    pstmt->setDouble(1, results.P_peak[i]);
                    pstmt->setDouble(2,results.P_peak[i]);
                    pstmt->setInt(3,scenario_and_cases_row_id);
                    pstmt->executeUpdate();
                }
            }
            delete res;
            delete pstmt;
        }
        catch (sql::SQLException &e) {
            std::cout << "# ERR: SQLException in " << __FILE__;
            std::cout << "(" << __FUNCTION__ << ") on line " << __LINE__ << std::endl;
            std::cout << "# ERR: " << e.what();
            std::cout << " (MySQL error code: " << e.getErrorCode();
            std::cout << ", SQLState: " << e.getSQLState() << " )" << std::endl;
        }
	return status;
}

AlternativeAnalysisThread::~AlternativeAnalysisThread() {
}
void AlternativeAnalysisThread::TryLockingResponse(int value) {
    if (value) {
        tryLocking = &TRUE;
        qDebug() << ">> Db locked ";
    } else {
        qDebug() << this << " >> Waiting";
        emit _tryLocking();
    }
}
