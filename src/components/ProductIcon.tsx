import React from 'react'
import { Glyph } from './Glyph'

function CalculatorIcon() {
  return (
    <div className="w-7 h-7 flex items-center justify-center rounded-[7px] bg-primary">
      <Glyph name="calculator" className="w-full h-full fill-white" />
    </div>
  )
}

export default CalculatorIcon
