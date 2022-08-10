<<<<<<< HEAD
//#include "csv.h"
#include <glpk.h>
#include <iostream>
#include <stdlib.h>
#include <stdio.h>
#include <array>
#include <vector>
#include <utility>
/*extern "C" {
#include "glpk.h"  
}*/


int main(void)
{
	int PROBLEM_SIZE = 3;
	int NR_VARIABLES = 3;
	int b[3] = { 100,600,300 };
	double data[3] = { -10,-6,-4 };
	glp_prob* lp = glp_create_prob();
	glp_set_prob_name(lp, "SBT_Test");
	glp_set_obj_dir(lp, GLP_MIN);
	// Number of constraints: PROBLE_SIZE (3)
	glp_add_rows(lp, PROBLEM_SIZE);

	for (int i = 0; i < PROBLEM_SIZE; ++i)
	{
		glp_set_row_bnds(lp, i + 1, GLP_UP, 0.0, b[i]);
	}

	// Number of variables: (3)
	glp_add_cols(lp, NR_VARIABLES);

	for (int i = 0; i < NR_VARIABLES; ++i)
	{
		glp_set_col_bnds(lp, i + 1, GLP_LO, 0.0, 0.0);
		glp_set_obj_coef(lp, i + 1, data[i]);
	}
	int ia[9] = { 1,1,1,2,2,2,3,3,3 };
	int ja[9] = { 1,2,3,1,2,3,1,2,3 };
	const double ar[9] = { 1,1,1,10,4,5,2,2,6.0 };
	int nonZeroSize = 9;

	glp_load_matrix(lp, nonZeroSize, ia, ja, ar);

	glp_smcp param;
	glp_init_smcp(&param);
	param.msg_lev = GLP_MSG_ERR;
	param.meth = GLP_DUAL;
	param.pricing = GLP_PT_PSE;
	param.r_test = GLP_RT_HAR;
	param.tol_bnd = 1e-7;
	param.tol_dj = 1e-7;
	param.tol_piv = 1e-10;
	param.obj_ll = -DBL_MAX;
	param.obj_ul = DBL_MAX;
	param.it_lim = INT_MAX;
	param.tm_lim = INT_MAX;
	param.out_frq = 500;
	param.out_dly = 0;
	param.presolve = GLP_OFF;
	param.excl = GLP_ON;
	param.shift = GLP_ON;
	param.aorn = GLP_USE_AT;

	glp_simplex(lp, &param);
	glp_print_sol(lp, "TEST_PROBLEM.txt");

	/*std::vector<double> variables(NR_VARIABLES, 0);

	for (int i = 0; i < NR_VARIABLES; ++i)
	{
		variables[i] = glp_get_col_prim(lp, i + 1);
	}

	int gap = 2 + 2 * HOURS_PER_DAY;

	for (int i = 0; i < HOURS_PER_DAY; ++i)
	{
		energyPrice[day * HOURS_PER_DAY + i] = glp_get_row_dual(lp, i + k + 1);
		priReservePrice[day * HOURS_PER_DAY + i] = glp_get_row_dual(lp, i + k + 1 + gap);
		secReservePrice[day * HOURS_PER_DAY + i] = glp_get_row_dual(lp, i + k + 1 + gap + HOURS_PER_DAY);
		terReservePrice[day * HOURS_PER_DAY + i] = glp_get_row_dual(lp, i + k + 1 + gap + HOURS_PER_DAY + HOURS_PER_DAY);
	}*/
	return 0;
=======
//#include "csv.h"
#include <glpk.h>
#include <iostream>
#include <stdlib.h>
#include <stdio.h>
#include <array>
#include <vector>
#include <utility>
/*extern "C" {
#include "glpk.h"  
}*/


int main(void)
{
	int PROBLEM_SIZE = 3;
	int NR_VARIABLES = 3;
	int b[3] = { 100,600,300 };
	double data[3] = { -10,-6,-4 };
	glp_prob* lp = glp_create_prob();
	glp_set_prob_name(lp, "SBT_Test");
	glp_set_obj_dir(lp, GLP_MIN);
	// Number of constraints: PROBLE_SIZE (3)
	glp_add_rows(lp, PROBLEM_SIZE);

	for (int i = 0; i < PROBLEM_SIZE; ++i)
	{
		glp_set_row_bnds(lp, i + 1, GLP_UP, 0.0, b[i]);
	}

	// Number of variables: (3)
	glp_add_cols(lp, NR_VARIABLES);

	for (int i = 0; i < NR_VARIABLES; ++i)
	{
		glp_set_col_bnds(lp, i + 1, GLP_LO, 0.0, 0.0);
		glp_set_obj_coef(lp, i + 1, data[i]);
	}
	int ia[9] = { 1,1,1,2,2,2,3,3,3 };
	int ja[9] = { 1,2,3,1,2,3,1,2,3 };
	const double ar[9] = { 1,1,1,10,4,5,2,2,6.0 };
	int nonZeroSize = 9;

	glp_load_matrix(lp, nonZeroSize, ia, ja, ar);

	glp_smcp param;
	glp_init_smcp(&param);
	param.msg_lev = GLP_MSG_ERR;
	param.meth = GLP_DUAL;
	param.pricing = GLP_PT_PSE;
	param.r_test = GLP_RT_HAR;
	param.tol_bnd = 1e-7;
	param.tol_dj = 1e-7;
	param.tol_piv = 1e-10;
	param.obj_ll = -DBL_MAX;
	param.obj_ul = DBL_MAX;
	param.it_lim = INT_MAX;
	param.tm_lim = INT_MAX;
	param.out_frq = 500;
	param.out_dly = 0;
	param.presolve = GLP_OFF;
	param.excl = GLP_ON;
	param.shift = GLP_ON;
	param.aorn = GLP_USE_AT;

	glp_simplex(lp, &param);
	glp_print_sol(lp, "TEST_PROBLEM.txt");

	/*std::vector<double> variables(NR_VARIABLES, 0);

	for (int i = 0; i < NR_VARIABLES; ++i)
	{
		variables[i] = glp_get_col_prim(lp, i + 1);
	}

	int gap = 2 + 2 * HOURS_PER_DAY;

	for (int i = 0; i < HOURS_PER_DAY; ++i)
	{
		energyPrice[day * HOURS_PER_DAY + i] = glp_get_row_dual(lp, i + k + 1);
		priReservePrice[day * HOURS_PER_DAY + i] = glp_get_row_dual(lp, i + k + 1 + gap);
		secReservePrice[day * HOURS_PER_DAY + i] = glp_get_row_dual(lp, i + k + 1 + gap + HOURS_PER_DAY);
		terReservePrice[day * HOURS_PER_DAY + i] = glp_get_row_dual(lp, i + k + 1 + gap + HOURS_PER_DAY + HOURS_PER_DAY);
	}*/
	return 0;
>>>>>>> 98ecc7b6bf4c940879d2c8835ea4945c8033a6c3
}