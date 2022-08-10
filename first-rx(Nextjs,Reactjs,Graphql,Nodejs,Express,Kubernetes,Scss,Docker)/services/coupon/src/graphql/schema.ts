const { gql } = require('apollo-server-express');

module.exports = gql(`
       type PharmacyText{
           _text:String
       }         
       
        type GetPharmacy{
            name:PharmacyText
            streetAddress:PharmacyText
            city:PharmacyText
            state:PharmacyText
            zipCode:PharmacyText
            latitude:PharmacyText
            longitude:PharmacyText
            hoursOfOperation:PharmacyText
            phone:PharmacyText
            npi:PharmacyText
            chainCode:PharmacyText
            distance:PharmacyText


        }
        type GetDrug{
             ndcCode:PharmacyText
             brandGenericIndicator:PharmacyText
             gsn:PharmacyText
             drugRanking:PharmacyText
             quantity:PharmacyText
             quantityRanking:PharmacyText
        }
        type GetPricing{
            price:PharmacyText
            priceBasis:PharmacyText
            usualAndCustomaryPrice:PharmacyText
            macPrice:PharmacyText
            awpPrice:PharmacyText
        }
        type GetLocatedDrugForm{
            form:PharmacyText
            gsn:PharmacyText
            isSelected:PharmacyText
            ranking:PharmacyText
            awpPrice:PharmacyText

        }
        type LocatedDrugForm{
             locatedDrugForm:GetLocatedDrugForm
        }  

        type GetLocatedDrugName
        {
            drugName:PharmacyText
            brandGenericIndicator:PharmacyText
            isSelected:PharmacyText
        }
        type LocatedDrugName{
             locatedDrugName:GetLocatedDrugName
        }
        type GetLocatedDrugQty{
            quantity:PharmacyText
            quantityUomr:PharmacyText
            gsn:PharmacyText
            isSelected:PharmacyText
            ranking:PharmacyText

        }
        type LocatedDrugQty{
            locatedDrugQty:[GetLocatedDrugQty]
        }

        type GetLocatedDrugStrength{
            strength:PharmacyText
            gsn:PharmacyText
            isSelected:PharmacyText
            ranking:PharmacyText

        } 
        type LocatedDrugStrength{
            locatedDrugStrength:[GetLocatedDrugStrength]
        } 
        
        type GetLocatedDrug{
            pharmacy:GetPharmacy
            drug:GetDrug
            pricing:GetPricing
           
        }
        type LocatedDrug{
            locatedDrug:[GetLocatedDrug]
        }
        type GetPharmacyDrugPricingResponse{
            drugs:LocatedDrug
            forms:LocatedDrugForm
            names:LocatedDrugName
            quantities:LocatedDrugQty
            strengths:LocatedDrugStrength
        }
        type Drugs{
            drugs:LocatedDrug
           
        }       
        type GetCouponDetails{
            code:Int
            message:String
            coupons: GetPharmacyDrugPricingResponse
            error:String
        }
        type Query{            
            hello:String
        } 
        type Mutation{            
            coupon(prescription:String,latitude:String,longitude:String):GetCouponDetails
        } 
        schema{
            query:Query
            mutation:Mutation
        }

`);
