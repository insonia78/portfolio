/*
 * Academic License - for use in teaching, academic research, and meeting
 * course requirements at degree granting institutions only.  Not for
 * government, commercial, or other organizational use.
 * File: esCalculator.c
 *
 * MATLAB Coder version            : 3.1
 * C/C++ source code generated on  : 10-Apr-2017 18:29:49
 */

/* Include Files */
#include "rt_nonfinite.h"
#include "esCalculator.h"

/* Function Definitions */

/*
 * Arguments    : double P_pk
 *                double Case_no
 *                double *P_cap_es_025C
 *                double *P_cap_es_050C
 *                double *P_cap_es_100C
 *                double *P_cap_es_200C
 *                double *E_cap_es_025C
 *                double *E_cap_es_050C
 *                double *E_cap_es_100C
 *                double *E_cap_es_200C
 * Return Type  : void
 */
void esCalculator(double P_pk, double Case_no, double *P_cap_es_025C, double
                  *P_cap_es_050C, double *P_cap_es_100C, double *P_cap_es_200C,
                  double *E_cap_es_025C, double *E_cap_es_050C, double
                  *E_cap_es_100C, double *E_cap_es_200C)
{
  double P_cap;

  /*  IRENA calculator  */
  /*  4/10/2017 */
  if (Case_no == 1.0) {
    /*  normal case */
    /*  MA peak load */
    /*  MA total ES power capacity */
    /*  0.25C power capacity */
    /*  0.5C power capacity */
    /*  1C power capacity */
    /*  2C power capacity */
    /*      E_ne = 130000; % ISO-NE energy load */
    /*      E_es = 2125; % ISO-NE total ES energy capacity */
    /*  %     E_es_025C = 765; % 0.25C energy capacity */
    /*  %     E_es_050C = 595; % 0.5C energy capacity */
    /*  %     E_es_100C = 255; % 1C energy capacity */
    /*  %     E_es_200C = 510; % 2C energy capacity */
    P_cap = P_pk / 12300.0 * 1766.0;
    *P_cap_es_025C = 0.10985277463193659 * P_cap;

    /*  0.25C power capacity */
    *P_cap_es_050C = 0.16987542468856173 * P_cap;

    /*  0.5C power capacity */
    *P_cap_es_100C = 0.13986409966024915 * P_cap;

    /*  1C power capacity */
    *P_cap_es_200C = 0.579841449603624 * P_cap;

    /*  2C power capacity */
    *E_cap_es_025C = *P_cap_es_025C * 4.0;
    *E_cap_es_050C = *P_cap_es_050C * 2.0;
    *E_cap_es_100C = *P_cap_es_100C;
    *E_cap_es_200C = *P_cap_es_200C * 0.5;

    /*      Benefits = P_cap* */
  } else {
    if (Case_no == 2.0) {
      /*  island case */
      /*  island peak load */
      /*  island total ES power capacity */
      /*  0.25C power capacity */
      /*  0.5C power capacity */
      /*  1C power capacity */
      /*  2C power capacity */
      /*      E_ne = 130000; % ISO-NE energy load */
      /*      E_es = 2125; % ISO-NE total ES energy capacity */
      /*  %     E_es_025C = 765; % 0.25C energy capacity */
      /*  %     E_es_050C = 595; % 0.5C energy capacity */
      /*  %     E_es_100C = 255; % 1C energy capacity */
      /*  %     E_es_200C = 510; % 2C energy capacity */
      P_cap = P_pk / 120.0 * 23.0;
      *P_cap_es_025C = 0.043478260869565216 * P_cap;

      /*  0.25C power capacity */
      *P_cap_es_050C = 0.17391304347826086 * P_cap;

      /*  0.5C power capacity */
      *P_cap_es_100C = 0.2608695652173913 * P_cap;

      /*  1C power capacity */
      *P_cap_es_200C = 0.47826086956521741 * P_cap;

      /*  2C power capacity */
      *E_cap_es_025C = *P_cap_es_025C * 4.0;
      *E_cap_es_050C = *P_cap_es_050C * 2.0;
      *E_cap_es_100C = *P_cap_es_100C;
      *E_cap_es_200C = *P_cap_es_200C * 0.5;
    }
  }
}

/*
 * File trailer for esCalculator.c
 *
 * [EOF]
 */
