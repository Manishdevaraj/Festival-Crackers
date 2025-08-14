// @ts-nocheck
import React from 'react'
import Shop from './Shop'
import { AddProductToShop, EditProduct, PrintPriceList } from '@/components/AdminProduct'

const ProductAdministration = () => {
  return (
    <>
     <div className="flex gap-3 items-center justify-center">

           <AddProductToShop/>
           <EditProduct/>
          </div>
          <div className='flex items-center justify-center'>

           <PrintPriceList/>
          </div>

    <Shop isStandardCrackers={true}/>
    </>
  )
}

export default ProductAdministration