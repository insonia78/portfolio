

#ifndef OBJECT_DEFINITION_H
#define OBJECT_DEFINITION_H

#include <stdlib.h>
#include <vector>

struct common_inputs {
    int NGen;
    int NHyd;
    int NEE;
    int ND;
    int NR;
    int NS;
    int NGenE;
    std::vector<double> demand;
    double CarbonPrice;
    double SafetyFactor;
    std::vector<double> ReserveRequirements;
    std::vector<double> ReserveDuration;
    std::vector<double> Ai; //Investment cost for peaker plants
    std::vector<double> FOM; //FOM for thermal
    std::vector<double> FuelCost; //Fuel costs, with peaker fuel first and then existing fuels
    std::vector<double> Emissions; //Emission factor, with peaker emissions and then existing emissions
    std::vector<double> Heat_Rates; //Heat rates, with peaker heat rates and then existing heat rates
    std::vector<double> VOM; //VOM, with peaker VOM and existing VOM.
    std::vector<double> PResC; //Primary reserve cost for peaking and existing
    std::vector<double> SResC; //Secondary reserve cost for peaking and existing
    std::vector<double> TResC; //Tertiary reserve cost for peaking and existing
    std::vector<double> Aee; //Investment cost for Energy Efficiency (EE)
    std::vector<double> Fee; //Saving factor for EE investment
    std::vector<double> PeeM; //Maximum EE investment
    std::vector<double> PexEE; //Existing energy efficiency
    std::vector<double> Ad; //Investment cost for Demand Response (DR)
    std::vector<double> VCd; //Variable cost for DR
    std::vector<double> PexD; //Existing demand response
    std::vector<double> Ar; //Investment cost in capacity for renewable
    std::vector<double> FOMr; //FOM for renewables
    std::vector<double> VOMr; //VOM for renewables
    std::vector<double> ResourceR; //Available renewable resources
    std::vector<double> FPr; //Firm power credit for renewables
    std::vector<double> PexR; //Existing renewables
    std::vector<double> Ah; //Investment cost in capacity for hydro
    std::vector<double> ResourceH; //Available hydro resource
    std::vector<double> Ph; //Existing hydro capacity
    std::vector<double> FPh; //Firm power credit for hydro
    std::vector<double> FOMh; //FOM for hydro
    std::vector<double> VOMh; //VOM for hydro
    std::vector<double> PResCh; //Primary reserve cost for hydro
    std::vector<double> SResCh; //Secondary reserve cost for hydro
    std::vector<double> TResCh; //Tertiary reserve cost for hydro
    std::vector<double> As; //Power capacity investment cost
    std::vector<double> PexS; //Existing storage capacity
    std::vector<double> FOMs; //FOM for storage
    std::vector<double> MCD; //Marginal cost for distribution
    std::vector<double> EAT; //Energy arbitrage benefit term
    std::vector<double> RCs; //Reservoir investment cost storage
    std::vector<double> ETACs; //Charging efficiency
    std::vector<double> ETADs; //Discharging efficiency
    std::vector<double> VOMs; //VOM for storage
    std::vector<double> PResCs; //Primary reserve cost storage
    std::vector<double> SResCs; //Secondary reserve cost storage
    std::vector<double> TResCs; //Tertiary reserve cost storage
    std::vector<double> Duration; //Storage duration
    std::vector<double> FPs; //Firm power credit for storage
    std::vector<double> Pl; //Existing thermal capacity
    std::vector<double> Ri; //Ramping rates peaking
    std::vector<double> Rl; //Ramping rates existing
    std::vector<double> Rd; //Ramping rates demand response
    std::vector<double> Rs; //Ramping rates storage
    std::vector<double> Rh; //Ramping rates hydro
    double TDDeferralPrice; //Transmission & Distribution Deferral Price
    double BSPrice; //Black start service price
    double RSPrice; //Reactive support price
};

struct PC_inputs {
    common_inputs common_data;
    std::vector<double> SolPpeak;
    std::vector<double> SolPee;
    std::vector<double> SolPd;
    std::vector<double> SolPr;
    std::vector<double> SolPh;
    std::vector<double> SolPs;
    std::vector<double> SolEs;
};

struct AA_outputs {
    std::vector<double> P_peak;
    std::vector<double> P_ee;
    std::vector<double> P_DR;
    std::vector<double> P_R;
    std::vector<double> P_S;
    std::vector<double> E_S;
    std::vector<double> P_H;
    std::vector<double> G_peak;
    std::vector<double> G_exist;
    std::vector<double> DR_up;
    std::vector<double> DR_dn;
    std::vector<double> G_ren;
    std::vector<double> G_H;
    std::vector<double> G_CS;
    std::vector<double> G_DS;
    std::vector<double> E_ST;
    std::vector<double> RP_peak;
    std::vector<double> RP_exist;
    std::vector<double> RS_peak;
    std::vector<double> RS_exist;
    std::vector<double> RT_peak;
    std::vector<double> RT_exist;
    std::vector<double> RP_sto;
    std::vector<double> RS_sto;
    std::vector<double> RT_sto;
    std::vector<double> RP_hyd;
    std::vector<double> RS_hyd;
    std::vector<double> RT_hyd;
    std::vector<double> energyPrice;
    std::vector<double> RP_price;
    std::vector<double> RS_price;
    std::vector<double> RT_price;
    double CapacityPrice;
    double max_ES_cap;
};

struct PC_outputs {
    std::vector<double> G_peak;
    std::vector<double> G_exist;
    std::vector<double> DR_up;
    std::vector<double> DR_dn;
    std::vector<double> G_ren;
    std::vector<double> G_H;
    std::vector<double> G_CS;
    std::vector<double> G_DS;
    std::vector<double> E_ST;
    std::vector<double> RP_peak;
    std::vector<double> RS_peak;
    std::vector<double> RT_peak;
    std::vector<double> RP_sto;
    std::vector<double> RS_sto;
    std::vector<double> RT_sto;
    std::vector<double> RP_hyd;
    std::vector<double> RS_hyd;
    std::vector<double> RT_hyd;
    std::vector<double> LL;
    double* energyPrice;
    double* RP_price;
    double* RS_price;
    double* RT_price;
};

struct Metric_Table {
    double* fuel_cost;
    double* fuel_burn;
    double* emissions;
    double* vom_cost;
    double* fom_cost;
    double* generation_energy_revenue;
    double* generation_primary_reserve_revenue;
    double* generation_secondary_reserve_revenue;
    double* generation_tertiary_reserve_revenue;
    double* generation_primary_reserve_cost;
    double* generation_secondary_reserve_cost;
    double* generation_tertiary_reserve_cost;
    double* storage_energy_revenue;
    double* storage_primary_reserve_revenue;
    double* storage_secondary_reserve_revenue;
    double* storage_tertiary_reserve_revenue;
    double* storage_primary_reserve_cost;
    double* storage_secondary_reserve_cost;
    double* storage_tertiary_reserve_cost;
    double* voms_cost;
    double* foms_cost;
};



struct SB_inputs {
    PC_inputs PC_data;
    common_inputs common_data;
    PC_outputs PC_results;
};

struct SV_outputs {
    double FuelCostSavings;
    double VOMSavings;
    double PResSavings;
    double SResSavings;
    double TResSavings;
    double ReacSupp;
    double TDDeferr;
    double BlackStart;
    double RenewableCurt;
    double EnergyArb;
    double CapacityCost;
};

struct AAMY_inputs {
    int NGen;
    int NHyd;
    int NEE;
    int ND;
    int NR;
    int NS;
    std::vector<double> demand;
    double CarbonPrice;
    double SafetyFactor;
    double DiscRate;
    std::vector<double> ReserveRequirements;
    std::vector<double> ReserveDuration;
    std::vector<std::vector<double>> Ai; //Investment cost for peaker plants
    std::vector<std::vector<double>> FuelCost; //Fuel costs, with peaker fuel first and then existing fuels
    std::vector<double> Emissions; //Emission factor, with peaker emissions and then existing emissions
    std::vector<double> Heat_Rates; //Heat rates, with peaker heat rates and then existing heat rates
    std::vector<double> VOM; //VOM, with peaker VOM and existing VOM.
    std::vector<double> FOM; //FOM for thermal.
    std::vector<double> PResC; //Primary reserve cost for peaking and existing
    std::vector<double> SResC; //Secondary reserve cost for peaking and existing
    std::vector<double> TResC; //Tertiary reserve cost for peaking and existing
    std::vector<double> Aee; //Investment cost for Energy Efficiency (EE)
    std::vector<double> Fee; //Saving factor for EE investment
    std::vector<double> PeeM; //Maximum EE investment
    std::vector<double> PexEE; //Existing energy efficiency
    std::vector<double> Ad; //Investment cost for Demand Response (DR)
    std::vector<double> VCd; //Variable cost for DR
    std::vector<double> PexD; //Existing demand response
    std::vector<double> Ar; //Investment cost in capacity for renewable
    std::vector<double> FOMr; //FOM for renewables
    std::vector<double> ResourceR; //Available renewable resources
    std::vector<double> FPr; //Firm power credit for renewables
    std::vector<std::vector<double>> PexR; //Existing renewables
    std::vector<double> Ah; //Investment cost in capacity for hydro
    std::vector<double> FOMh; //FOM for hydro
    std::vector<double> ResourceH; //Available hydro resource
    std::vector<double> Ph; //Existing hydro capacity
    std::vector<double> FPh; //Firm power credit for hydro
    std::vector<double> PResCh; //Primary reserve cost for hydro
    std::vector<double> SResCh; //Secondary reserve cost for hydro
    std::vector<double> TResCh; //Tertiary reserve cost for hydro
    std::vector<std::vector<double>> As; //Power capacity investment cost
    std::vector<std::vector<double>> PexS; //Existing storage capacity
    std::vector<double> FOMs; //FOM for storage
    std::vector<std::vector<double>> MCD; //Marginal cost for distribution
    std::vector<std::vector<double>> EAT; //Energy arbitrage benefit term
    std::vector<std::vector<double>> RCs; //Reservoir investment cost storage
    std::vector<double> ETACs; //Charging efficiency
    std::vector<double> ETADs; //Discharging efficiency
    std::vector<std::vector<double>> VOMs; //VOM for storage
    std::vector<std::vector<double>> PResCs; //Primary reserve cost storage
    std::vector<std::vector<double>> SResCs; //Secondary reserve cost storage
    std::vector<std::vector<double>> TResCs; //Tertiary reserve cost storage
    std::vector<double> Duration; //Storage duration
    std::vector<double> FPs; //Firm power credit for storage
    std::vector<std::vector<double>> Pl; //Existing thermal capacity
    std::vector<double> Ri; //Ramping rates peaking
    std::vector<double> Rl; //Ramping rates existing
    std::vector<double> Rd; //Ramping rates demand response
    std::vector<double> Rs; //Ramping rates storage
    std::vector<double> Rh; //Ramping rates hydro
    double TDDeferralPrice; //Transmission & Distribution Deferral Price
    double BSPrice; //Black start service price
    double RSPrice;
};

struct AAMY_outputs {
    std::vector<std::vector<double>> P_peak;
    //Kai
    double objective_value;
    std::vector<double> P_ee;
    std::vector<double> P_DR;
    std::vector<std::vector<double>> P_R;
    std::vector<std::vector<double>> P_S;
    std::vector<std::vector<double>> E_S;
    std::vector<std::vector<double>> P_H;
    std::vector<double> G_peak;
    std::vector<double> G_exist;
    std::vector<double> DR_up;
    std::vector<double> DR_dn;
    std::vector<double> G_ren;
    std::vector<double> G_H;
    std::vector<double> G_CS;
    std::vector<double> G_DS;
    std::vector<double> E_ST;
    std::vector<double> RP_peak;
    std::vector<double> RP_exist;
    std::vector<double> RS_peak;
    std::vector<double> RS_exist;
    std::vector<double> RT_peak;
    std::vector<double> RT_exist;
    std::vector<double> RP_sto;
    std::vector<double> RS_sto;
    std::vector<double> RT_sto;
    std::vector<double> RP_hyd;
    std::vector<double> RS_hyd;
    std::vector<double> RT_hyd;
    std::vector<double> energyPrice;
    std::vector<double> RP_price;
    std::vector<double> RS_price;
    std::vector<double> RT_price;
    std::vector<double> CapacityPrice;
    std::vector<double> max_ES_cap;
};

#endif /* OBJECT_DEFINITION_H */
